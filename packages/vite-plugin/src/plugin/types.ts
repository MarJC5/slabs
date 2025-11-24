import type { ScanOptions, ValidationResult } from '../domain/types';

/**
 * Main plugin configuration options
 */
export interface SlabsPluginOptions {
  /**
   * Path to blocks directory (required)
   * @example './blocks' or 'src/blocks'
   */
  blocksDir: string;

  /**
   * Enable file watching in development mode
   * @default true in dev, false in production
   */
  watch?: boolean;

  /**
   * Block scanning options
   */
  scanOptions?: ScanOptions;

  /**
   * Validation options
   */
  validation?: ValidationOptions;

  /**
   * Asset optimization options
   */
  assets?: AssetOptions;

  /**
   * Caching options for performance
   */
  cache?: CacheOptions;

  /**
   * Auto-install block dependencies
   * @default false
   */
  autoInstallDeps?: boolean;

  /**
   * Namespace for monorepo support
   * @example 'web' or 'admin'
   */
  namespace?: string;

  /**
   * Custom validation handler
   */
  onValidation?: (results: ValidationResult[]) => void;
}

/**
 * Validation configuration
 */
export interface ValidationOptions {
  /**
   * Fail build on validation errors
   * @default false
   */
  strict?: boolean;

  /**
   * Show validation warnings
   * @default true
   */
  warnings?: boolean;

  /**
   * Require preview.png for all blocks
   * @default false
   */
  requirePreview?: boolean;
}

/**
 * Asset optimization configuration
 */
export interface AssetOptions {
  /**
   * Preview image optimization
   */
  preview?: {
    formats?: ('webp' | 'avif' | 'png' | 'jpg')[];
    sizes?: number[];
    quality?: number;
  };

  /**
   * Auto-optimize assets during build
   * @default false
   */
  autoOptimize?: boolean;
}

/**
 * Cache configuration
 */
export interface CacheOptions {
  /**
   * Enable caching
   * @default true
   */
  enabled?: boolean;

  /**
   * Cache file path
   * @default '.slabs-cache.json'
   */
  cacheFile?: string;
}
