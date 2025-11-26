/**
 * Slabs - Main Client Class
 *
 * Browser runtime for converting Slabs blocks into Editor.js tools
 */

import { blocks, metadata } from 'virtual:slabs-registry';
import { createEditorJSTool } from './ToolFactory';
import { PreviewTooltip } from './PreviewTooltip';
import type { SlabsOptions, EditorJSTool, BlockMetadata } from './types';

/**
 * Slabs class
 *
 * Provides API for working with Slabs blocks in the browser
 */
export class Slabs {
  private tools: Record<string, EditorJSTool> = {};
  private options: SlabsOptions;
  private previewTooltip: PreviewTooltip;

  /**
   * Create a new Slabs instance
   */
  constructor(options: SlabsOptions = {}) {
    this.options = options;
    this.tools = this.createTools();
    this.previewTooltip = new PreviewTooltip();

    // Register preview images for blocks that have them
    this.registerPreviews();

    // Initialize preview tooltips
    this.previewTooltip.init();

    // Log initialization in development
    if (import.meta.env.DEV) {
      console.log(
        `[Slabs] Initialized with ${this.getBlockCount()} block(s)`,
        this.getMetadata()
      );
    }
  }

  /**
   * Get all tools for Editor.js
   *
   * @returns Object with block names as keys and Tool classes as values
   *
   * @example
   * ```javascript
   * const slabs = new Slabs();
   * const editor = new EditorJS({
   *   holder: 'editorjs',
   *   tools: slabs.getTools()
   * });
   * ```
   */
  getTools(): Record<string, EditorJSTool> {
    return this.tools;
  }

  /**
   * Get a specific tool by name
   *
   * @param name - Block name (e.g., 'slabs/simple-text')
   * @returns Tool class or undefined if not found
   *
   * @example
   * ```javascript
   * const slabs = new Slabs();
   * const textTool = slabs.getTool('slabs/simple-text');
   * ```
   */
  getTool(name: string): EditorJSTool | undefined {
    return this.tools[name];
  }

  /**
   * Get metadata for all loaded blocks
   *
   * @returns Array of block metadata objects
   *
   * @example
   * ```javascript
   * const slabs = new Slabs();
   * const metadata = slabs.getMetadata();
   * metadata.forEach(meta => {
   *   console.log(`${meta.name}: ${meta.title}`);
   * });
   * ```
   */
  getMetadata(): BlockMetadata[] {
    return Object.values(blocks)
      .filter(block => this.shouldIncludeBlock(block.meta.name))
      .map(block => block.meta);
  }

  /**
   * Get total number of loaded blocks
   *
   * @returns Number of blocks
   *
   * @example
   * ```javascript
   * const slabs = new Slabs();
   * console.log(`Loaded ${slabs.getBlockCount()} blocks`);
   * ```
   */
  getBlockCount(): number {
    return Object.keys(this.tools).length;
  }

  /**
   * Get registry metadata (version, timestamp, etc.)
   *
   * @returns Registry metadata from virtual module
   *
   * @example
   * ```javascript
   * const slabs = new Slabs();
   * const info = slabs.getRegistryMetadata();
   * console.log(`Registry v${info.version}, ${info.totalBlocks} total blocks`);
   * ```
   */
  getRegistryMetadata() {
    return metadata;
  }

  /**
   * Create Editor.js tools from blocks
   */
  private createTools(): Record<string, EditorJSTool> {
    const tools: Record<string, EditorJSTool> = {};

    for (const [name, block] of Object.entries(blocks)) {
      // Apply include/exclude filters
      if (!this.shouldIncludeBlock(name)) {
        continue;
      }

      // Convert block to Editor.js Tool
      tools[name] = createEditorJSTool(block, this.options.toolboxConfig);
    }

    return tools;
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
   * Register preview images for blocks that have them
   */
  private registerPreviews(): void {
    for (const [name, block] of Object.entries(blocks)) {
      if (block.preview && this.shouldIncludeBlock(name)) {
        this.previewTooltip.registerPreview(name, block.preview);
      }
    }
  }
}
