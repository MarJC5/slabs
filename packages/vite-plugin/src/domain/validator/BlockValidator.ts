/**
 * BlockValidator
 *
 * Domain service responsible for validating block structure.
 * Follows DDD principles: focuses on validation business logic.
 */

import { access } from 'fs/promises';
import { join } from 'path';
import { readFile } from 'fs/promises';
import type { ValidationResult, ValidationError, ValidationWarning } from '../types';

export class BlockValidator {
  /**
   * Validate complete block structure
   *
   * @param blockPath - Path to block directory
   * @returns Validation result with errors and warnings
   */
  async validate(blockPath: string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate block.json exists
    const blockJsonPath = join(blockPath, 'block.json');
    if (!(await this.fileExists(blockJsonPath))) {
      errors.push({
        type: 'MISSING_FILE',
        message: 'block.json is required',
        file: 'block.json',
        path: blockPath
      });
      // Can't continue without block.json
      return { valid: false, errors, warnings };
    }

    // Validate block.json content
    try {
      const content = await readFile(blockJsonPath, 'utf-8');
      const parsed = JSON.parse(content);

      if (!parsed.name) {
        errors.push({
          type: 'INVALID_SCHEMA',
          message: 'block.json must have a "name" field',
          file: 'block.json',
          path: blockPath
        });
      } else {
        // Validate name format
        if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(parsed.name)) {
          errors.push({
            type: 'INVALID_SCHEMA',
            message: 'block.json name must match format: namespace/block-name',
            file: 'block.json',
            path: blockPath,
            details: { name: parsed.name }
          });
        }
      }

      if (!parsed.title) {
        errors.push({
          type: 'INVALID_SCHEMA',
          message: 'block.json must have a "title" field',
          file: 'block.json',
          path: blockPath
        });
      }
    } catch (error) {
      errors.push({
        type: 'INVALID_JSON',
        message: 'block.json is not valid JSON',
        file: 'block.json',
        path: blockPath,
        details: error
      });
    }

    // Validate required files
    const requiredFiles = ['edit', 'save', 'render'];
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

    for (const fileName of requiredFiles) {
      const found = await this.findFileWithExtensions(
        blockPath,
        fileName,
        extensions
      );

      if (!found) {
        errors.push({
          type: 'MISSING_FILE',
          message: `${fileName}.js, ${fileName}.ts, ${fileName}.vue, or ${fileName}.svelte is required`,
          file: `${fileName}.{js,ts,vue,svelte}`,
          path: blockPath
        });
      }
    }

    // Validate optional files (warnings only)
    const previewFound = await this.findFileWithExtensions(
      blockPath,
      'preview',
      ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    );

    if (!previewFound) {
      warnings.push({
        type: 'MISSING_PREVIEW',
        message: 'preview.png is recommended for better UX',
        file: 'preview.png',
        suggestion: 'Add a 300x200px preview image to show in the block picker'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate block.json schema
   */
  async validateSchema(blockJson: unknown): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic validation
    if (typeof blockJson !== 'object' || blockJson === null) {
      errors.push({
        type: 'INVALID_SCHEMA',
        message: 'block.json must be an object'
      });
      return { valid: false, errors, warnings };
    }

    // In future, use Zod schema here
    return { valid: errors.length === 0, errors, warnings };
  }

  // =========================================================================
  // Private Methods
  // =========================================================================

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find file with given name and possible extensions
   */
  private async findFileWithExtensions(
    blockPath: string,
    name: string,
    extensions: string[]
  ): Promise<boolean> {
    for (const ext of extensions) {
      const filePath = join(blockPath, `${name}${ext}`);
      if (await this.fileExists(filePath)) {
        return true;
      }
    }
    return false;
  }
}
