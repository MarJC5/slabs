/**
 * ToolFactory
 *
 * Converts Slabs block definitions into Editor.js Tool classes
 */

import type { BlockDefinition } from 'virtual:slabs-registry';
import type {
  EditorJSTool,
  EditorJSToolInstance,
  ToolConstructorOptions,
  ToolboxConfig
} from './types';
import * as CodexIcons from '@codexteam/icons';

/**
 * Convert icon name to SVG element for Editor.js toolbox
 * Supports @codexteam/icons or emoji fallback
 */
function getIconSVG(iconName?: string): string {
  if (!iconName) return '📦';

  // If it's an emoji (single character or emoji), return as-is
  if (iconName.length <= 2 || /\p{Emoji}/u.test(iconName)) {
    return iconName;
  }

  // Try to get icon from @codexteam/icons
  // Icons are accessed as: icons.IconName (all icons start with "Icon" prefix)
  // User can provide "Quote" or "IconQuote" - both work
  let iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);

  // Add "Icon" prefix if not already present
  if (!iconKey.startsWith('Icon')) {
    iconKey = 'Icon' + iconKey;
  }

  const icon = (CodexIcons as any)[iconKey];

  if (icon) {
    return icon;
  }

  // Fallback to emoji or default
  return iconName;
}

/**
 * Create an Editor.js Tool class from a Slabs block definition
 */
export function createEditorJSTool(
  block: BlockDefinition,
  toolboxConfig?: (block: BlockDefinition) => ToolboxConfig
): EditorJSTool {
  /**
   * Editor.js Tool class
   */
  class SlabsTool implements EditorJSToolInstance {
    private data: any;
    private api: any;
    private config: any;
    private readOnly: boolean;
    private blockApi: any;
    private wrapper: HTMLElement | null = null;

    /**
     * Static getter for toolbox configuration
     */
    static get toolbox(): ToolboxConfig {
      if (toolboxConfig) {
        return toolboxConfig(block);
      }

      // Default toolbox configuration
      return {
        title: block.meta.title,
        icon: getIconSVG(block.meta.icon) || block.preview || '📦'
      };
    }

    /**
     * Constructor called by Editor.js
     */
    constructor({ data, api, config, readOnly, block: blockApi }: ToolConstructorOptions) {
      this.data = data;
      this.api = api;
      this.config = config;
      this.readOnly = readOnly;
      this.blockApi = blockApi;
    }

    /**
     * Render the editable block UI
     */
    render(): HTMLElement {
      try {
        // Call the block's edit function
        // Merge block metadata into config for easy access (DRY principle)
        this.wrapper = block.edit({
          data: this.data,
          api: this.api,
          config: {
            ...this.config,
            // Pass all block.json metadata to avoid duplication
            title: block.meta.title,
            icon: block.meta.icon,
            description: block.meta.description,
            fields: block.meta.fields,
            collapsible: block.meta.collapsible
          },
          readOnly: this.readOnly
        });

        return this.wrapper;
      } catch (error) {
        console.error(`[Slabs] Error rendering block "${block.meta.name}":`, error);

        // Return error placeholder
        const errorDiv = document.createElement('div');
        errorDiv.style.padding = '16px';
        errorDiv.style.background = '#fee';
        errorDiv.style.border = '1px solid #c00';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.color = '#c00';
        errorDiv.innerHTML = `
          <strong>Error rendering block: ${block.meta.title}</strong><br>
          <small>${error instanceof Error ? error.message : 'Unknown error'}</small>
        `;
        return errorDiv;
      }
    }

    /**
     * Extract data from the editable block UI
     */
    save(blockContent: HTMLElement): any {
      try {
        // Call the block's save function
        return block.save(blockContent);
      } catch (error) {
        console.error(`[Slabs] Error saving block "${block.meta.name}":`, error);

        // Return empty data on error
        return {};
      }
    }

    /**
     * Validate saved data (optional)
     */
    validate?(data: any): boolean {
      // Basic validation: ensure data is an object
      return typeof data === 'object' && data !== null;
    }

    /**
     * Cleanup when block is destroyed (optional)
     */
    destroyed?(): void {
      this.wrapper = null;
    }
  }

  return SlabsTool as unknown as EditorJSTool;
}
