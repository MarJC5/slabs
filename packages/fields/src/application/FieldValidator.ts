import type { FieldConfigData, ValidationResult, ValidationError } from '../domain/types';
import type { FieldRegistry } from '../domain/FieldRegistry';
import { ConditionalEvaluator } from '../domain/ConditionalEvaluator';

/**
 * FieldValidator - Application service for validating field data
 * Orchestrates validation across multiple fields and aggregates results
 */
export class FieldValidator {
  private conditionalEvaluator: ConditionalEvaluator;

  constructor(private registry: FieldRegistry) {
    this.conditionalEvaluator = new ConditionalEvaluator();
  }

  /**
   * Validate a single field
   */
  validateField(config: FieldConfigData, value: any): ValidationResult {
    const fieldType = this.registry.get(config.type);
    return fieldType.validate(config, value);
  }

  /**
   * Validate multiple fields
   * Returns aggregated validation result with all errors
   * Skips validation for fields that are conditionally hidden
   */
  validate(
    fields: Record<string, FieldConfigData>,
    data: Record<string, any> = {}
  ): ValidationResult {
    const allErrors: ValidationError[] = [];
    const fieldErrors: Record<string, ValidationError[]> = {};

    // Validate each field
    for (const [name, config] of Object.entries(fields)) {
      // Skip validation if field is conditionally hidden
      if (config.conditional) {
        const watchedFieldName = config.conditional.field;
        const watchedFieldValue = data[watchedFieldName];

        // If watched field doesn't exist, skip validation (field is hidden)
        if (!(watchedFieldName in fields)) {
          continue;
        }

        // Evaluate conditional - if false, field is hidden, skip validation
        const isVisible = this.conditionalEvaluator.evaluate(
          config.conditional,
          watchedFieldValue
        );

        if (!isVisible) {
          continue;
        }
      }

      const value = data[name];
      const result = this.validateField(config, value);

      if (!result.valid && result.errors.length > 0) {
        allErrors.push(...result.errors);
        fieldErrors[name] = result.errors;
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
    };
  }
}
