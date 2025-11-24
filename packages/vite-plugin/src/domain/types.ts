/**
 * Domain Types
 *
 * Core types used throughout the vite-plugin package.
 * Following DDD principles, these types represent the domain model.
 */

// ============================================================================
// Block Domain
// ============================================================================

/**
 * Complete block definition with all metadata and file paths
 */
export interface BlockDefinition {
  /** Block name (e.g., 'slabs/simple-text') */
  name: string;

  /** Absolute path to block directory */
  path: string;

  /** Block metadata from block.json */
  meta: BlockMetadata;

  /** File paths for all block files */
  files: BlockFiles;
}

/**
 * Block metadata from block.json
 */
export interface BlockMetadata {
  /** Unique block identifier */
  name: string;

  /** Display name in block picker */
  title: string;

  /** Block category */
  category?: BlockCategory;

  /** Block description */
  description?: string;

  /** Search keywords */
  keywords?: string[];

  /** Semantic version */
  version?: string;

  /** SVG icon string */
  icon?: string;

  /** Block attributes schema */
  attributes?: Record<string, AttributeSchema>;

  /** Block supports configuration */
  supports?: BlockSupports;

  /** Dependencies */
  dependencies?: Record<string, string>;

  /** Peer dependencies */
  peerDependencies?: Record<string, string>;
}

/**
 * Block file paths
 */
export interface BlockFiles {
  /** Path to edit.js (or .ts/.tsx) */
  editPath: string;

  /** Path to save.js (or .ts/.tsx) */
  savePath: string;

  /** Path to render.js (or .ts/.tsx) */
  renderPath: string;

  /** Path to preview image (optional) */
  previewPath?: string;

  /** Path to style.css (optional) */
  stylePath?: string;
}

/**
 * Block category
 */
export type BlockCategory =
  | 'text'
  | 'media'
  | 'design'
  | 'widgets'
  | 'theme'
  | 'embed';

/**
 * Attribute schema definition
 */
export interface AttributeSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  default?: unknown;
}

/**
 * Block supports configuration
 */
export interface BlockSupports {
  html?: boolean;
  anchor?: boolean;
  className?: boolean;
}

// ============================================================================
// Scanner Domain
// ============================================================================

/**
 * Options for block scanning
 */
export interface ScanOptions {
  /** Only scan specific block names (glob patterns) */
  include?: string[];

  /** Exclude specific block names (glob patterns) */
  exclude?: string[];

  /** Maximum depth to scan (default: 1) */
  maxDepth?: number;

  /** Follow symlinks (default: false) */
  followSymlinks?: boolean;

  /** Ignore patterns (glob) */
  ignore?: string[];
}

// ============================================================================
// Validator Domain
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Validation errors (blocking) */
  errors: ValidationError[];

  /** Validation warnings (non-blocking) */
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  file?: string;
  path?: string;
  details?: unknown;
}

/**
 * Validation error types
 */
export type ValidationErrorType =
  | 'MISSING_FILE'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'INVALID_STRUCTURE'
  | 'MISSING_EXPORT'
  | 'INVALID_EXPORT'
  | 'DEPENDENCY_MISSING';

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: ValidationWarningType;
  message: string;
  file?: string;
  suggestion?: string;
}

/**
 * Validation warning types
 */
export type ValidationWarningType =
  | 'MISSING_PREVIEW'
  | 'MISSING_STYLE'
  | 'DEPRECATED_FIELD'
  | 'LARGE_PREVIEW'
  | 'UNOPTIMIZED_IMAGE';
