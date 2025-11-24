/**
 * BlockLoader
 *
 * Domain service responsible for loading block files from filesystem.
 * Follows DDD principles: focuses on file loading business logic.
 */

import { readFile, access } from 'fs/promises';
import { join } from 'path';
import type { BlockMetadata, BlockFiles } from '../types';

export class BlockLoader {
  /**
   * Load and parse block.json
   *
   * @param blockPath - Path to block directory
   * @returns Parsed block metadata
   */
  async loadBlockJson(blockPath: string): Promise<BlockMetadata> {
    const blockJsonPath = join(blockPath, 'block.json');

    try {
      const content = await readFile(blockJsonPath, 'utf-8');
      const parsed = JSON.parse(content) as BlockMetadata;

      // Validate required fields
      if (!parsed.name) {
        throw new Error('block.json must have a "name" field');
      }
      if (!parsed.title) {
        throw new Error('block.json must have a "title" field');
      }

      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load block.json: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Load all block files and return their paths
   *
   * @param blockPath - Path to block directory
   * @returns Object with paths to all block files
   */
  async loadBlockFiles(blockPath: string): Promise<BlockFiles> {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

    // Find edit file
    const editPath = await this.findFile(blockPath, 'edit', extensions);
    if (!editPath) {
      throw new Error('edit.js, edit.ts, edit.vue, or edit.svelte not found');
    }

    // Find save file
    const savePath = await this.findFile(blockPath, 'save', extensions);
    if (!savePath) {
      throw new Error('save.js, save.ts, save.vue, or save.svelte not found');
    }

    // Find render file
    const renderPath = await this.findFile(blockPath, 'render', extensions);
    if (!renderPath) {
      throw new Error('render.js, render.ts, render.vue, or render.svelte not found');
    }

    // Optional: Find preview image
    const previewPath = await this.findFile(
      blockPath,
      'preview',
      ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    );

    // Optional: Find style file
    const stylePath = await this.findFile(
      blockPath,
      'style',
      ['.css', '.scss', '.sass', '.less']
    );

    return {
      editPath,
      savePath,
      renderPath,
      previewPath,
      stylePath
    };
  }

  /**
   * Load preview image as data URL or file path
   *
   * @param imagePath - Path to preview image
   * @returns Image path or data URL
   */
  async loadPreviewImage(imagePath: string): Promise<string> {
    // For now, just return the path
    // In the future, could convert to data URL or optimize
    return imagePath;
  }

  // =========================================================================
  // Private Methods
  // =========================================================================

  /**
   * Find file with given name and possible extensions
   */
  private async findFile(
    blockPath: string,
    name: string,
    extensions: string[]
  ): Promise<string | undefined> {
    for (const ext of extensions) {
      const filePath = join(blockPath, `${name}${ext}`);
      if (await this.fileExists(filePath)) {
        return filePath;
      }
    }
    return undefined;
  }

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
}
