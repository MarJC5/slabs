import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * File system adapter that abstracts Node.js file operations.
 * Provides a clean interface for file I/O operations used by the CLI.
 *
 * @example
 * ```typescript
 * const fileSystem = new FileSystemPort();
 * await fileSystem.writeFile('/path/to/file.txt', 'content');
 * const exists = await fileSystem.exists('/path/to/file.txt');
 * ```
 */
export class FileSystemPort {
  /**
   * Writes content to a file, creating parent directories if needed.
   *
   * @param filePath - Absolute path to the file
   * @param content - File content to write
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Reads content from a file.
   *
   * @param filePath - Absolute path to the file
   * @returns File content as string
   * @throws Error if file does not exist
   */
  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  /**
   * Checks if a file or directory exists.
   *
   * @param filePath - Path to check
   * @returns true if exists, false otherwise
   */
  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Creates a directory, including parent directories.
   *
   * @param dirPath - Directory path to create
   */
  async mkdir(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }

  /**
   * Lists files and directories in a directory.
   *
   * @param dirPath - Directory path to read
   * @returns Array of file/directory names
   * @throws Error if directory does not exist
   */
  async readdir(dirPath: string): Promise<string[]> {
    return await fs.readdir(dirPath);
  }

  /**
   * Copies a file to a destination, creating parent directories if needed.
   *
   * @param srcPath - Source file path
   * @param destPath - Destination file path
   */
  async copyFile(srcPath: string, destPath: string): Promise<void> {
    const destDir = path.dirname(destPath);
    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(srcPath, destPath);
  }
}
