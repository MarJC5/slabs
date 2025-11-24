import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * NumberField - Number input field type
 * Implements numeric input with min/max/step validation
 */
export class NumberField implements FieldType {
  /**
   * Render number input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'number');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    input.value = finalValue;

    // Apply placeholder
    if (config.placeholder) {
      input.setAttribute('placeholder', config.placeholder);
    }

    // Apply min
    if (config.min !== undefined) {
      input.setAttribute('min', String(config.min));
    }

    // Apply max
    if (config.max !== undefined) {
      input.setAttribute('max', String(config.max));
    }

    // Apply step
    if (config.step !== undefined) {
      input.setAttribute('step', String(config.step));
    }

    // Apply required
    if (config.required) {
      input.required = true;
    }

    // Apply custom className
    if (config.className) {
      input.classList.add(config.className);
    }

    return input;
  }

  /**
   * Extract value from input element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement)) {
      return null;
    }

    // Return null for empty input
    if (element.value === '') {
      return null;
    }

    // Parse as number
    const numValue = parseFloat(element.value);

    // Return null if not a valid number
    if (isNaN(numValue)) {
      return null;
    }

    return numValue;
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Check if value is empty/null
    const isEmpty = value === null || value === undefined || value === '';

    // Required validation
    if (config.required && isEmpty) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} is required`,
        code: 'REQUIRED'
      });
    }

    // Skip other validations if field is empty and not required
    if (isEmpty && !config.required) {
      return {
        valid: true,
        errors: []
      };
    }

    // Convert to number for validation
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));

    // Validate it's a valid number
    if (!isEmpty && isNaN(numValue)) {
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

    // Min validation
    if (!isEmpty && config.min !== undefined && numValue < config.min) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be at least ${config.min}`,
        code: 'MIN_VALUE'
      });
    }

    // Max validation
    if (!isEmpty && config.max !== undefined && numValue > config.max) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must not exceed ${config.max}`,
        code: 'MAX_VALUE'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
