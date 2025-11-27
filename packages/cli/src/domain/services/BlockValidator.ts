import { Block } from '../entities/Block';

/**
 * Validation result containing success status and error messages.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Domain service responsible for validating Block business rules.
 *
 * Validation rules:
 * - Block must have at least one field and a non-empty title
 * - Field names must be unique within the block
 * - Select fields must have options with valid choices
 *
 * @example
 * ```typescript
 * const validator = new BlockValidator();
 * const result = validator.validate(block);
 *
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export class BlockValidator {
  /**
   * Validates a block according to domain business rules.
   *
   * @param block - The block to validate
   * @returns Validation result with status and any error messages
   */
  validate(block: Block): ValidationResult {
    const errors: string[] = [];

    // Rule 1: Block must have at least one field and a title
    if (!block.validate()) {
      errors.push('Block must have at least one field and a title');
    }

    // Rule 2: Field names must be unique
    const fieldNames = new Set<string>();
    const duplicates = new Set<string>();

    for (const field of block.getFields()) {
      if (fieldNames.has(field.name)) {
        duplicates.add(field.name);
      } else {
        fieldNames.add(field.name);
      }
    }

    for (const duplicate of duplicates) {
      errors.push(`Duplicate field name: ${duplicate}`);
    }

    // Rule 3: Select fields must have options with valid choices
    for (const field of block.getFields()) {
      if (field.type.requiresOptions()) {
        if (!field.options) {
          errors.push(`Field "${field.name}" of type "${field.type.value}" requires options`);
        } else if (!field.options.choices) {
          errors.push(`Field "${field.name}" of type "${field.type.value}" requires options.choices`);
        } else if (!Array.isArray(field.options.choices) || field.options.choices.length === 0) {
          errors.push(`Field "${field.name}" of type "${field.type.value}" must have at least one choice`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
