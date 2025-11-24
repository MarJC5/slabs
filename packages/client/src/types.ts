/**
 * Type definitions for @slabs/client
 */

/**
 * Block metadata from block.json
 */
export interface BlockMetadata {
  name: string;
  title: string;
  category?: 'text' | 'media' | 'design' | 'widgets' | 'theme' | 'embed';
  description?: string;
  keywords?: string[];
  version?: string;
  icon?: string;
  attributes?: Record<string, any>;
  supports?: Record<string, any>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Complete block definition from virtual module
 */
export interface BlockDefinition {
  edit: (context: any) => HTMLElement;
  save: (element: HTMLElement) => any;
  render: (data: any, context?: any) => HTMLElement;
  preview?: string;
  meta: BlockMetadata;
}

/**
 * Options for Slabs class constructor
 */
export interface SlabsOptions {
  /**
   * Optional: Filter which blocks to load
   */
  include?: string[];

  /**
   * Optional: Exclude specific blocks
   */
  exclude?: string[];

  /**
   * Optional: Custom toolbox configuration
   */
  toolboxConfig?: (block: BlockDefinition) => ToolboxConfig;
}

/**
 * Editor.js toolbox configuration
 */
export interface ToolboxConfig {
  /**
   * Tool title shown in toolbox
   */
  title: string;

  /**
   * Tool icon (HTML string or emoji)
   */
  icon: string;
}

/**
 * Editor.js Tool class interface
 */
export interface EditorJSTool {
  new (options: ToolConstructorOptions): EditorJSToolInstance;
  toolbox?: ToolboxConfig;
  pasteConfig?: any;
  sanitize?: any;
  conversionConfig?: any;
}

/**
 * Constructor options passed to Tool by Editor.js
 */
export interface ToolConstructorOptions {
  /**
   * Saved block data
   */
  data: any;

  /**
   * Editor.js API
   */
  api: any;

  /**
   * Tool config from Editor.js initialization
   */
  config: any;

  /**
   * Read-only mode flag
   */
  readOnly: boolean;

  /**
   * Block API
   */
  block: any;
}

/**
 * Instance of an Editor.js Tool
 */
export interface EditorJSToolInstance {
  /**
   * Render the block UI
   */
  render(): HTMLElement;

  /**
   * Extract data from block UI
   */
  save(blockContent: HTMLElement): any;

  /**
   * Validate saved data (optional)
   */
  validate?(data: any): boolean;

  /**
   * Handle paste event (optional)
   */
  onPaste?(event: any): void;

  /**
   * Render block settings (optional)
   */
  renderSettings?(): HTMLElement;

  /**
   * Destroy method (optional)
   */
  destroyed?(): void;
}
