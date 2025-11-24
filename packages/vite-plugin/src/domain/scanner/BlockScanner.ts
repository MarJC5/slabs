/**
 * BlockScanner
 *
 * Domain service responsible for discovering blocks from filesystem.
 * Follows DDD principles: focuses on block discovery business logic.
 */

import fg from 'fast-glob';
import { join, dirname } from 'path';
import { BlockLoader } from '../loader/BlockLoader';
import { BlockValidator } from '../validator/BlockValidator';
import type {
  BlockDefinition,
  BlockMetadata,
  ScanOptions,
  ValidationResult
} from '../types';

export class BlockScanner {
  private loader: BlockLoader;
  private validator: BlockValidator;

  constructor() {
    this.loader = new BlockLoader();
    this.validator = new BlockValidator();
  }

  /**
   * Scan directory for blocks
   *
   * @param directory - Directory to scan
   * @param options - Scan options (filters, depth, etc.)
   * @returns Array of valid block definitions
   */
  async scanBlocks(
    directory: string,
    options: ScanOptions = {}
  ): Promise<BlockDefinition[]> {
    const validBlocks: BlockDefinition[] = [];
    const allErrors: string[] = [];

    // Find all block.json files
    const blockJsonFiles = await this.findBlockJsonFiles(directory, options);

    // Process each block
    for (const blockJsonPath of blockJsonFiles) {
      const blockPath = dirname(blockJsonPath);

      // Validate block structure
      const validation = await this.validateBlock(blockPath);

      if (validation.valid) {
        try {
          // Load block definition
          const block = await this.loadBlockDefinition(blockPath);

          // Apply filters
          if (this.shouldIncludeBlock(block.name, blockPath, options)) {
            validBlocks.push(block);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          allErrors.push(`Failed to load block at ${blockPath}: ${message}`);
        }
      } else {
        // Log validation errors
        validation.errors.forEach(error => {
          allErrors.push(`${blockPath}: ${error.message}`);
        });
      }

      // Log warnings (non-blocking)
      validation.warnings.forEach(warning => {
        console.warn(`[Slabs Warning] ${blockPath}: ${warning.message}`);
        if (warning.suggestion) {
          console.warn(`  Suggestion: ${warning.suggestion}`);
        }
      });
    }

    // Log errors if any
    if (allErrors.length > 0) {
      console.error(`[Slabs] Found ${allErrors.length} errors during scanning:`);
      allErrors.forEach(error => console.error(`  - ${error}`));
    }

    return validBlocks;
  }

  /**
   * Validate block structure
   *
   * @param blockPath - Path to block directory
   * @returns Validation result
   */
  async validateBlock(blockPath: string): Promise<ValidationResult> {
    return this.validator.validate(blockPath);
  }

  /**
   * Get block metadata without full load
   *
   * @param blockPath - Path to block directory
   * @returns Block metadata
   */
  async getBlockMetadata(blockPath: string): Promise<BlockMetadata> {
    return this.loader.loadBlockJson(blockPath);
  }

  // =========================================================================
  // Private Methods
  // =========================================================================

  /**
   * Find all block.json files in directory
   */
  private async findBlockJsonFiles(
    directory: string,
    options: ScanOptions
  ): Promise<string[]> {
    const maxDepth = options.maxDepth ?? 1;
    const ignore = options.ignore ?? ['**/node_modules/**', '**/.git/**'];

    // Build glob pattern based on max depth
    const depthPattern = maxDepth === 1 ? '*' : `**`;
    const pattern = join(directory, depthPattern, 'block.json');

    return fg(pattern, {
      absolute: true,
      onlyFiles: true,
      followSymbolicLinks: options.followSymlinks ?? false,
      ignore
    });
  }

  /**
   * Load complete block definition
   */
  private async loadBlockDefinition(blockPath: string): Promise<BlockDefinition> {
    const [meta, files] = await Promise.all([
      this.loader.loadBlockJson(blockPath),
      this.loader.loadBlockFiles(blockPath)
    ]);

    return {
      name: meta.name,
      path: blockPath,
      meta,
      files
    };
  }

  /**
   * Check if block should be included based on filters
   */
  private shouldIncludeBlock(
    _blockName: string,
    blockPath: string,
    options: ScanOptions
  ): boolean {
    const folderName = blockPath.split('/').pop() ?? '';

    // Check include filter
    if (options.include && options.include.length > 0) {
      const included = options.include.some(pattern =>
        this.matchPattern(folderName, pattern)
      );
      if (!included) return false;
    }

    // Check exclude filter
    if (options.exclude && options.exclude.length > 0) {
      const excluded = options.exclude.some(pattern =>
        this.matchPattern(folderName, pattern)
      );
      if (excluded) return false;
    }

    return true;
  }

  /**
   * Simple glob pattern matching
   */
  private matchPattern(str: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    return new RegExp(`^${regexPattern}$`).test(str);
  }
}
