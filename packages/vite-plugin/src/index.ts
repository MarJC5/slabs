/**
 * @slabs/vite-plugin
 *
 * Vite plugin for automatic block discovery and registration
 */

export { slabsPlugin } from './plugin/slabsPlugin';
export type {
  SlabsPluginOptions,
  ValidationOptions,
  AssetOptions,
  CacheOptions
} from './plugin/types';

// Export core domain components for advanced usage
export { BlockScanner } from './domain/scanner/BlockScanner';
export { BlockLoader } from './domain/loader/BlockLoader';
export { BlockValidator } from './domain/validator/BlockValidator';
export { RegistryGenerator } from './domain/generator/RegistryGenerator';

// Export types
export type {
  BlockDefinition,
  BlockMetadata,
  BlockFiles,
  ScanOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './domain/types';
