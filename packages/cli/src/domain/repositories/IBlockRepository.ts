import { Block } from '../entities/Block';
import { BlockName } from '../value-objects/BlockName';

/**
 * Repository interface (port) for Block persistence operations.
 * This is part of the domain layer and defines the contract for
 * how blocks should be stored and retrieved.
 *
 * Implementations (adapters) will be in the infrastructure layer.
 *
 * @example
 * ```typescript
 * class FileSystemBlockRepository implements IBlockRepository {
 *   async save(block: Block, targetPath: string): Promise<void> {
 *     // Implementation
 *   }
 *   // ... other methods
 * }
 * ```
 */
export interface IBlockRepository {
  /**
   * Saves a block to the specified target path.
   * Creates all necessary files (block.json, edit.ts, save.ts, render.ts, etc.)
   *
   * @param block - The block to save
   * @param targetPath - The directory where the block should be saved
   * @throws {Error} If the block directory already exists or save fails
   */
  save(block: Block, targetPath: string): Promise<void>;

  /**
   * Checks if a block with the given name exists in the target path.
   *
   * @param name - The block name to check
   * @param targetPath - The directory to search in
   * @returns true if a block directory with that name exists
   */
  exists(name: BlockName, targetPath: string): Promise<boolean>;

  /**
   * Finds and loads a block by name from the target path.
   *
   * @param name - The block name to find
   * @param targetPath - The directory to search in
   * @returns The block if found, null otherwise
   */
  findByName(name: BlockName, targetPath: string): Promise<Block | null>;
}
