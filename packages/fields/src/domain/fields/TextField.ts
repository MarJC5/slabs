import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * TextField - Text input field type
 * Implements single-line text input with validation
 */
export class TextField implements FieldType {
  /**
   * Render text input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    input.value = finalValue;

    // Apply placeholder
    if (config.placeholder) {
      input.setAttribute('placeholder', config.placeholder);
    }

    // Apply maxLength
    if (config.maxLength !== undefined) {
      input.setAttribute('maxlength', String(config.maxLength));
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
      return '';
    }

    // Trim whitespace and return
    return element.value.trim();
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Convert value to string for validation
    const stringValue = value === null || value === undefined ? '' : String(value);

    // Check if field is empty
    const isEmpty = stringValue.trim() === '';

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

    // MinLength validation
    if (!isEmpty && config.minLength !== undefined && stringValue.length < config.minLength) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be at least ${config.minLength} characters`,
        code: 'MIN_LENGTH'
      });
    }

    // MaxLength validation
    if (!isEmpty && config.maxLength !== undefined && stringValue.length > config.maxLength) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must not exceed ${config.maxLength} characters`,
        code: 'MAX_LENGTH'
      });
    }

    // Pattern validation
    if (!isEmpty && config.pattern) {
      const regex = config.pattern instanceof RegExp ? config.pattern : new RegExp(config.pattern);
      if (!regex.test(stringValue)) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} format is invalid`,
          code: 'PATTERN'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
