import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * RangeField - Range slider field type
 * Implements range slider with min/max/step validation
 */
export class RangeField implements FieldType {
  /**
   * Render range input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'range');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== null && value !== undefined && value !== ''
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '0');

    input.value = finalValue;

    // Apply min (default to 0)
    input.setAttribute('min', String(config.min !== undefined ? config.min : 0));

    // Apply max (default to 100)
    input.setAttribute('max', String(config.max !== undefined ? config.max : 100));

    // Apply step (default to 1)
    input.setAttribute('step', String(config.step !== undefined ? config.step : 1));

    // Apply custom className
    if (config.className) {
      input.classList.add(config.className);
    }

    return input;
  }

  /**
   * Extract value from range input element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement) || element.type !== 'range') {
      return 0;
    }

    // Return null for empty input
    if (element.value === '') {
      return 0;
    }

    // Parse as number
    const numValue = parseFloat(element.value);

    // Return 0 if not a valid number
    if (isNaN(numValue)) {
      return 0;
    }

    return numValue;
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Convert to number for validation
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));

    // Validate it's a valid number
    if (isNaN(numValue)) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be a valid number`,
        code: 'INVALID_NUMBER'
      });
      return {
        valid: false,
        errors
      };
    }

    // Get min/max from config with defaults
    const min = config.min !== undefined ? config.min : 0;
    const max = config.max !== undefined ? config.max : 100;

    // Min validation
    if (numValue < min) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be at least ${min}`,
        code: 'MIN_VALUE'
      });
    }

    // Max validation
    if (numValue > max) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must not exceed ${max}`,
        code: 'MAX_VALUE'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
