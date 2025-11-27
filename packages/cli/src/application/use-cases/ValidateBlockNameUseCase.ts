import { BlockName } from '../../domain/value-objects/BlockName';

/**
 * Validation result for block name validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Use case for validating block names.
 * Checks if a given string is a valid block name according to domain rules.
 *
 * @example
 * ```typescript
 * const useCase = new ValidateBlockNameUseCase();
 * const result = await useCase.execute('my-block');
 *
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export class ValidateBlockNameUseCase {
  /**
   * Validates a block name string.
   *
   * @param name - The block name to validate
   * @returns Validation result with status and errors
   */
  async execute(name: string): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      // Attempt to create a BlockName value object
      // If it throws, the name is invalid
      new BlockName(name);
    } catch (error) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push('Invalid block name');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
