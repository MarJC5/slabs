/**
 * SlabsRenderer - Lightweight renderer for public pages
 *
 * Renders saved Editor.js content using block render functions
 * WITHOUT loading Editor.js (~97% smaller bundle)
 */

import { blocks } from 'virtual:slabs-registry';
import type {
  RendererOptions,
  RenderContext,
  EditorJSData,
  EditorJSBlock,
  RenderFunction
} from './types';

/**
 * SlabsRenderer class
 *
 * Renders Editor.js content to HTML for display on public pages
 */
export class SlabsRenderer {
  private renderers: Record<string, RenderFunction> = {};
  private options: RendererOptions;

  /**
   * Create a new SlabsRenderer instance
   */
  constructor(options: RendererOptions = {}) {
    this.options = options;
    this.renderers = this.extractRenderers();

    // Log initialization in development
    if (import.meta.env.DEV) {
      console.log(
        `[Slabs Renderer] Initialized with ${Object.keys(this.renderers).length} renderer(s)`
      );
    }
  }

  /**
   * Render entire Editor.js output to HTMLElement
   *
   * @param editorData - Editor.js saved data (JSON)
   * @param context - Optional rendering context (theme, locale, etc.)
   * @returns Promise resolving to HTMLElement containing all rendered blocks
   *
   * @example
   * ```javascript
   * const renderer = new SlabsRenderer();
   * const data = await fetch('/api/articles/123').then(r => r.json());
   * const html = await renderer.render(data);
   * document.getElementById('content').appendChild(html);
   * ```
   */
  async render(
    editorData: EditorJSData,
    context?: RenderContext
  ): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = this.options.containerClass || 'slabs-content';

    if (!editorData.blocks || editorData.blocks.length === 0) {
      return container;
    }

    for (const block of editorData.blocks) {
      try {
        const rendered = await this.renderBlock(block, context);
        container.appendChild(rendered);
      } catch (error) {
        console.error(`[Slabs Renderer] Error rendering block:`, error);

        // Append error block if onError handler provided
        if (this.options.onError && error instanceof Error) {
          const errorElement = this.options.onError(block, error);
          container.appendChild(errorElement);
        }
      }
    }

    return container;
  }

  /**
   * Render single block to HTMLElement
   *
   * @param block - Single Editor.js block
   * @param context - Optional rendering context
   * @returns Promise resolving to HTMLElement
   *
   * @example
   * ```javascript
   * const renderer = new SlabsRenderer();
   * const block = {
   *   type: 'slabs/simple-text',
   *   data: { content: 'Hello World' }
   * };
   * const html = await renderer.renderBlock(block, { theme: 'dark' });
   * document.body.appendChild(html);
   * ```
   */
  async renderBlock(
    block: EditorJSBlock,
    context?: RenderContext
  ): Promise<HTMLElement> {
    const renderer = this.renderers[block.type];

    // Handle unknown block types
    if (!renderer) {
      if (this.options.onUnknownBlock) {
        return this.options.onUnknownBlock(block);
      }
      return this.renderFallback(block);
    }

    try {
      return renderer(block.data, context);
    } catch (error) {
      console.error(`[Slabs Renderer] Error rendering block "${block.type}":`, error);

      if (this.options.onError && error instanceof Error) {
        return this.options.onError(block, error);
      }

      return this.renderError(block);
    }
  }

  /**
   * Render to HTML string (for SSR)
   *
   * @param editorData - Editor.js saved data
   * @param context - Optional rendering context
   * @returns Promise resolving to HTML string
   *
   * @example
   * ```javascript
   * const renderer = new SlabsRenderer();
   * const data = await loadArticle('123');
   * const htmlString = await renderer.renderToString(data);
   * res.send(`<article>${htmlString}</article>`);
   * ```
   */
  async renderToString(
    editorData: EditorJSData,
    context?: RenderContext
  ): Promise<string> {
    const element = await this.render(editorData, context);
    return element.outerHTML;
  }

  /**
   * Extract render functions from blocks
   */
  private extractRenderers(): Record<string, RenderFunction> {
    const renderers: Record<string, RenderFunction> = {};

    for (const [name, block] of Object.entries(blocks)) {
      // Apply include/exclude filters
      if (!this.shouldIncludeBlock(name)) {
        continue;
      }

      // Extract render function
      if (block.render && typeof block.render === 'function') {
        renderers[name] = block.render;
      }
    }

    return renderers;
  }

  /**
   * Check if a block should be included based on options
   */
  private shouldIncludeBlock(blockName: string): boolean {
    const { include, exclude } = this.options;

    // Check exclude filter first
    if (exclude && exclude.length > 0) {
      if (exclude.includes(blockName)) {
        return false;
      }
    }

    // Check include filter
    if (include && include.length > 0) {
      return include.includes(blockName);
    }

    // Include by default
    return true;
  }

  /**
   * Render fallback for unknown block types
   */
  private renderFallback(block: EditorJSBlock): HTMLElement {
    const div = document.createElement('div');
    div.className = 'slabs-unknown-block';
    div.style.padding = '16px';
    div.style.background = '#f5f5f5';
    div.style.border = '1px dashed #ccc';
    div.style.borderRadius = '4px';
    div.style.color = '#666';

    const message = document.createElement('p');
    message.textContent = `Unknown block type: ${block.type}`;
    message.style.margin = '0';
    message.style.fontSize = '14px';

    div.appendChild(message);

    // Add debug info in development
    if (import.meta.env.DEV) {
      const details = document.createElement('details');
      details.style.marginTop = '8px';
      details.style.fontSize = '12px';

      const summary = document.createElement('summary');
      summary.textContent = 'Debug info';
      summary.style.cursor = 'pointer';

      const pre = document.createElement('pre');
      pre.textContent = JSON.stringify(block, null, 2);
      pre.style.margin = '8px 0 0 0';
      pre.style.padding = '8px';
      pre.style.background = '#fff';
      pre.style.border = '1px solid #ddd';
      pre.style.borderRadius = '4px';
      pre.style.overflow = 'auto';

      details.appendChild(summary);
      details.appendChild(pre);
      div.appendChild(details);
    }

    return div;
  }

  /**
   * Render error placeholder
   */
  private renderError(block: EditorJSBlock): HTMLElement {
    const div = document.createElement('div');
    div.className = 'slabs-error-block';
    div.style.padding = '16px';
    div.style.background = '#fee';
    div.style.border = '1px solid #fcc';
    div.style.borderRadius = '4px';
    div.style.color = '#c00';

    const message = document.createElement('p');
    message.textContent = `Error rendering block: ${block.type}`;
    message.style.margin = '0';
    message.style.fontWeight = '600';

    div.appendChild(message);

    return div;
  }
}
