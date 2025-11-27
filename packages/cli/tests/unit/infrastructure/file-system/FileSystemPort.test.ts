import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileSystemPort } from '../../../../src/infrastructure/file-system/FileSystemPort';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

describe('FileSystemPort', () => {
  let fileSystem: FileSystemPort;
  const testDir = path.join(process.cwd(), 'test-output');

  beforeEach(() => {
    fileSystem = new FileSystemPort();
  });

  afterEach(async () => {
    // Cleanup test directory
    if (existsSync(testDir)) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  describe('writeFile', () => {
    it('should write file with content', async () => {
      const filePath = path.join(testDir, 'test.txt');
      await fileSystem.writeFile(filePath, 'Hello World');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Hello World');
    });

    it('should create parent directories if they do not exist', async () => {
      const filePath = path.join(testDir, 'nested', 'dir', 'test.txt');
      await fileSystem.writeFile(filePath, 'Nested content');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Nested content');
    });

    it('should overwrite existing file', async () => {
      const filePath = path.join(testDir, 'overwrite.txt');
      await fileSystem.writeFile(filePath, 'First');
      await fileSystem.writeFile(filePath, 'Second');

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Second');
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const filePath = path.join(testDir, 'read.txt');
      await fs.mkdir(testDir, { recursive: true });
      await fs.writeFile(filePath, 'Test content');

      const content = await fileSystem.readFile(filePath);
      expect(content).toBe('Test content');
    });

    it('should throw error if file does not exist', async () => {
      const filePath = path.join(testDir, 'nonexistent.txt');

      await expect(fileSystem.readFile(filePath)).rejects.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(testDir, 'exists.txt');
      await fs.mkdir(testDir, { recursive: true });
      await fs.writeFile(filePath, 'content');

      const exists = await fileSystem.exists(filePath);
      expect(exists).toBe(true);
    });

    it('should return true for existing directory', async () => {
      await fs.mkdir(testDir, { recursive: true });

      const exists = await fileSystem.exists(testDir);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent path', async () => {
      const filePath = path.join(testDir, 'nonexistent.txt');

      const exists = await fileSystem.exists(filePath);
      expect(exists).toBe(false);
    });
  });

  describe('mkdir', () => {
    it('should create directory', async () => {
      const dirPath = path.join(testDir, 'new-dir');
      await fileSystem.mkdir(dirPath);

      const exists = existsSync(dirPath);
      expect(exists).toBe(true);
    });

    it('should create nested directories', async () => {
      const dirPath = path.join(testDir, 'level1', 'level2', 'level3');
      await fileSystem.mkdir(dirPath);

      const exists = existsSync(dirPath);
      expect(exists).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const dirPath = path.join(testDir, 'existing');
      await fileSystem.mkdir(dirPath);
      await fileSystem.mkdir(dirPath); // Second call should not throw

      const exists = existsSync(dirPath);
      expect(exists).toBe(true);
    });
  });

  describe('readdir', () => {
    it('should list files in directory', async () => {
      await fs.mkdir(testDir, { recursive: true });
      await fs.writeFile(path.join(testDir, 'file1.txt'), '');
      await fs.writeFile(path.join(testDir, 'file2.txt'), '');
      await fs.mkdir(path.join(testDir, 'subdir'));

      const files = await fileSystem.readdir(testDir);

      expect(files).toContain('file1.txt');
      expect(files).toContain('file2.txt');
      expect(files).toContain('subdir');
      expect(files).toHaveLength(3);
    });

    it('should return empty array for empty directory', async () => {
      await fs.mkdir(testDir, { recursive: true });

      const files = await fileSystem.readdir(testDir);
      expect(files).toEqual([]);
    });

    it('should throw error if directory does not exist', async () => {
      await expect(fileSystem.readdir(testDir)).rejects.toThrow();
    });
  });

  describe('copyFile', () => {
    it('should copy file to destination', async () => {
      await fs.mkdir(testDir, { recursive: true });
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'dest.txt');
      await fs.writeFile(srcPath, 'Copy me');

      await fileSystem.copyFile(srcPath, destPath);

      const content = await fs.readFile(destPath, 'utf-8');
      expect(content).toBe('Copy me');
    });

    it('should create destination parent directories', async () => {
      await fs.mkdir(testDir, { recursive: true });
      const srcPath = path.join(testDir, 'source.txt');
      const destPath = path.join(testDir, 'nested', 'dest.txt');
      await fs.writeFile(srcPath, 'Copy me');

      await fileSystem.copyFile(srcPath, destPath);

      const content = await fs.readFile(destPath, 'utf-8');
      expect(content).toBe('Copy me');
    });
  });
});
