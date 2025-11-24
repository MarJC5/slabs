/**
 * Type declarations for virtual:slabs-registry module
 *
 * This module is generated at build time by @slabs/vite-plugin
 * and provides access to all scanned blocks.
 */
declare module 'virtual:slabs-registry' {
  /**
   * Context passed to edit function
   */
  export interface EditContext {
    /** The Editor.js API instance */
    api: any;
    /** Block configuration from Editor.js */
    config: any;
    /** Initial block data */
    data: any;
    /** Whether this is a read-only block */
    readOnly: boolean;
  }

  /**
   * Context passed to render function
   */
  export interface RenderContext {
    /** Additional CSS classes */
    className?: string;
    /** Custom attributes to add to rendered element */
    attributes?: Record<string, string>;
    /** Render mode (e.g., 'preview', 'public') */
    mode?: string;
  }

  /**
   * Attribute schema definition
   */
  export interface AttributeSchema {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    default?: any;
  }

  /**
   * Block support flags
   */
  export interface BlockSupports {
    /** Support HTML editing */
    html?: boolean;
    /** Support anchor links */
    anchor?: boolean;
    /** Support custom class names */
    className?: boolean;
  }

  /**
   * Block metadata from block.json
   */
  export interface BlockMetadata {
    /** Block name in format: namespace/block-name */
    name: string;
    /** Human-readable block title */
    title: string;
    /** Block category */
    category?: 'text' | 'media' | 'design' | 'widgets' | 'theme' | 'embed';
    /** Block description */
    description?: string;
    /** Keywords for search */
    keywords?: string[];
    /** Semantic version */
    version?: string;
    /** Icon (emoji or path) */
    icon?: string;
    /** Block attributes schema */
    attributes?: Record<string, AttributeSchema>;
    /** ACF-like fields configuration */
    fields?: Record<string, any>;
    /** Block support flags */
    supports?: BlockSupports;
    /** Whether the block is collapsible and its initial state (true = expanded, false = collapsed) */
    collapsible?: boolean;
    /** NPM dependencies */
    dependencies?: Record<string, string>;
    /** NPM peer dependencies */
    peerDependencies?: Record<string, string>;
  }

  /**
   * Complete block definition
   */
  export interface BlockDefinition {
    /**
     * Render editable block UI (for Editor.js)
     * @param context - Edit context with Editor.js API
     * @returns The editable DOM element
     */
    edit: (context: EditContext) => HTMLElement;

    /**
     * Extract data from editable element
     * @param element - The editable DOM element
     * @returns Serialized block data
     */
    save: (element: HTMLElement) => any;

    /**
     * Render static block UI (for public pages)
     * @param data - Saved block data
     * @param context - Optional render context
     * @returns The rendered DOM element
     */
    render: (data: any, context?: RenderContext) => HTMLElement;

    /**
     * Preview image URL (optional)
     */
    preview?: string;

    /**
     * Block metadata
     */
    meta: BlockMetadata;
  }

  /**
   * Registry of all blocks, keyed by block name
   */
  export const blocks: Record<string, BlockDefinition>;

  /**
   * Registry metadata
   */
  export const metadata: {
    /** Registry version */
    version: string;
    /** Total number of blocks */
    totalBlocks: number;
    /** ISO timestamp when registry was generated */
    generatedAt: string;
  };
}
