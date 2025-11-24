/**
 * Type definitions for @slabs/renderer
 */

/**
 * Editor.js saved data structure
 */
export interface EditorJSData {
  time?: number;
  blocks: EditorJSBlock[];
  version?: string;
}

/**
 * Single Editor.js block
 */
export interface EditorJSBlock {
  id?: string;
  type: string;
  data: any;
}

/**
 * Rendering context passed to block render functions
 * Extends the base RenderContext from virtual module
 */
export interface RenderContext {
  /** Additional CSS classes */
  className?: string;

  /** Custom attributes to add to rendered element */
  attributes?: Record<string, string>;

  /** Render mode (e.g., 'preview', 'public') */
  mode?: string;

  /** Theme (light/dark mode) - Extended property */
  theme?: 'light' | 'dark' | string;

  /** Locale for i18n - Extended property */
  locale?: string;

  /** Base URL for assets (CDN) - Extended property */
  baseUrl?: string;

  /** User preferences - Extended property */
  userPreferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    reducedMotion?: boolean;
  };

  /** Custom properties */
  [key: string]: any;
}

/**
 * Block render function signature
 */
export type RenderFunction = (data: any, context?: RenderContext) => HTMLElement;

/**
 * Options for SlabsRenderer constructor
 */
export interface RendererOptions {
  /** Optional: Filter which blocks to render */
  include?: string[];

  /** Optional: Exclude specific blocks */
  exclude?: string[];

  /** Optional: Custom error handler */
  onError?: (block: EditorJSBlock, error: Error) => HTMLElement;

  /** Optional: Custom fallback for unknown blocks */
  onUnknownBlock?: (block: EditorJSBlock) => HTMLElement;

  /** Optional: Class name for container */
  containerClass?: string;
}
