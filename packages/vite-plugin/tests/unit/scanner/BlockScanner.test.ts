/**
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { BlockScanner } from '../../../src/domain/scanner/BlockScanner';
import type { ScanOptions } from '../../../src/domain/types';

describe('BlockScanner', () => {
  const testDir = join(__dirname, '../../fixtures/test-blocks');
  let scanner: BlockScanner;

  beforeEach(async () => {
    scanner = new BlockScanner();

    // Create test directory
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  describe('scanBlocks', () => {
    it('should find valid blocks in directory', async () => {
      // Arrange: Create a valid block
      const blockPath = join(testDir, 'simple-text');
      await mkdir(blockPath, { recursive: true });
      await writeFile(
        join(blockPath, 'block.json'),
        JSON.stringify({
          name: 'slabs/simple-text',
          title: 'Simple Text'
        })
      );
      await writeFile(join(blockPath, 'edit.js'), 'export function render() {}');
      await writeFile(join(blockPath, 'save.js'), 'export function save() {}');
      await writeFile(join(blockPath, 'render.js'), 'export function render() {}');

      // Act
      const blocks = await scanner.scanBlocks(testDir);

      // Assert
      expect(blocks).toHaveLength(1);
      expect(blocks[0]?.name).toBe('slabs/simple-text');
      expect(blocks[0]?.meta.title).toBe('Simple Text');
    });

    it('should return empty array when no blocks found', async () => {
      // Act
      const blocks = await scanner.scanBlocks(testDir);

      // Assert
      expect(blocks).toHaveLength(0);
    });

    it('should skip blocks missing required files', async () => {
      // Arrange: Create incomplete block (missing render.js)
      const blockPath = join(testDir, 'incomplete-block');
      await mkdir(blockPath, { recursive: true });
      await writeFile(
        join(blockPath, 'block.json'),
        JSON.stringify({
          name: 'slabs/incomplete',
          title: 'Incomplete'
        })
      );
      await writeFile(join(blockPath, 'edit.js'), 'export function render() {}');
      await writeFile(join(blockPath, 'save.js'), 'export function save() {}');
      // Missing render.js

      // Act
      const blocks = await scanner.scanBlocks(testDir);

      // Assert
      expect(blocks).toHaveLength(0);
    });

    it('should find multiple blocks', async () => {
      // Arrange: Create two valid blocks
      for (const name of ['block-1', 'block-2']) {
        const blockPath = join(testDir, name);
        await mkdir(blockPath, { recursive: true });
        await writeFile(
          join(blockPath, 'block.json'),
          JSON.stringify({
            name: `slabs/${name}`,
            title: name
          })
        );
        await writeFile(join(blockPath, 'edit.js'), 'export function render() {}');
        await writeFile(join(blockPath, 'save.js'), 'export function save() {}');
        await writeFile(join(blockPath, 'render.js'), 'export function render() {}');
      }

      // Act
      const blocks = await scanner.scanBlocks(testDir);

      // Assert
      expect(blocks).toHaveLength(2);
    });

    it('should respect include filter', async () => {
      // Arrange: Create multiple blocks
      for (const name of ['hero-section', 'simple-text', 'quote']) {
        const blockPath = join(testDir, name);
        await mkdir(blockPath, { recursive: true });
        await writeFile(
          join(blockPath, 'block.json'),
          JSON.stringify({
            name: `slabs/${name}`,
            title: name
          })
        );
        await writeFile(join(blockPath, 'edit.js'), '');
        await writeFile(join(blockPath, 'save.js'), '');
        await writeFile(join(blockPath, 'render.js'), '');
      }

      // Act
      const options: ScanOptions = {
        include: ['hero-*', 'simple-*']
      };
      const blocks = await scanner.scanBlocks(testDir, options);

      // Assert
      expect(blocks).toHaveLength(2);
      const names = blocks.map(b => b.name);
      expect(names).toContain('slabs/hero-section');
      expect(names).toContain('slabs/simple-text');
      expect(names).not.toContain('slabs/quote');
    });

    it('should respect exclude filter', async () => {
      // Arrange: Create multiple blocks
      for (const name of ['block-1', 'block-2', 'draft-block']) {
        const blockPath = join(testDir, name);
        await mkdir(blockPath, { recursive: true });
        await writeFile(
          join(blockPath, 'block.json'),
          JSON.stringify({
            name: `slabs/${name}`,
            title: name
          })
        );
        await writeFile(join(blockPath, 'edit.js'), '');
        await writeFile(join(blockPath, 'save.js'), '');
        await writeFile(join(blockPath, 'render.js'), '');
      }

      // Act
      const options: ScanOptions = {
        exclude: ['draft-*']
      };
      const blocks = await scanner.scanBlocks(testDir, options);

      // Assert
      expect(blocks).toHaveLength(2);
      const names = blocks.map(b => b.name);
      expect(names).not.toContain('slabs/draft-block');
    });
  });

  describe('validateBlock', () => {
    it('should validate a complete block', async () => {
      // Arrange
      const blockPath = join(testDir, 'valid-block');
      await mkdir(blockPath, { recursive: true });
      await writeFile(
        join(blockPath, 'block.json'),
        JSON.stringify({
          name: 'slabs/valid-block',
          title: 'Valid Block'
        })
      );
      await writeFile(join(blockPath, 'edit.js'), 'export function render() {}');
      await writeFile(join(blockPath, 'save.js'), 'export function save() {}');
      await writeFile(join(blockPath, 'render.js'), 'export function render() {}');

      // Act
      const result = await scanner.validateBlock(blockPath);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error when block.json is missing', async () => {
      // Arrange
      const blockPath = join(testDir, 'no-json');
      await mkdir(blockPath, { recursive: true });

      // Act
      const result = await scanner.validateBlock(blockPath);

      // Assert
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('MISSING_FILE');
    });

    it('should return warning when preview.png is missing', async () => {
      // Arrange
      const blockPath = join(testDir, 'no-preview');
      await mkdir(blockPath, { recursive: true });
      await writeFile(
        join(blockPath, 'block.json'),
        JSON.stringify({
          name: 'slabs/no-preview',
          title: 'No Preview'
        })
      );
      await writeFile(join(blockPath, 'edit.js'), '');
      await writeFile(join(blockPath, 'save.js'), '');
      await writeFile(join(blockPath, 'render.js'), '');

      // Act
      const result = await scanner.validateBlock(blockPath);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]?.type).toBe('MISSING_PREVIEW');
    });
  });
});
