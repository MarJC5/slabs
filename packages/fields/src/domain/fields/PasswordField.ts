import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * PasswordField - Password input field type
 * Implements secure password input with validation
 */
export class PasswordField implements FieldType {
  /**
   * Render password input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'password');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    input.value = finalValue;

    // Apply placeholder
    if (config.placeholder) {
      input.setAttribute('placeholder', config.placeholder);
    }

    // Apply minLength
    if (config.minLength !== undefined) {
      input.setAttribute('minlength', String(config.minLength));
    }

    // Apply maxLength
    if (config.maxLength !== undefined) {
      input.setAttribute('maxlength', String(config.maxLength));
    }

    // Apply required
    if (config.required) {
      input.required = true;
    }

    // Apply autocomplete
    if (config.autocomplete) {
      input.setAttribute('autocomplete', config.autocomplete);
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

    // Return password as-is without trimming (whitespace might be intentional)
    return element.value;
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
    const isEmpty = stringValue === '';

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
    if (config.minLength !== undefined && stringValue.length < config.minLength) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be at least ${config.minLength} characters`,
        code: 'MIN_LENGTH'
      });
    }

    // MaxLength validation
    if (config.maxLength !== undefined && stringValue.length > config.maxLength) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} cannot exceed ${config.maxLength} characters`,
        code: 'MAX_LENGTH'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
