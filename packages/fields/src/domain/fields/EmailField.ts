import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * EmailField - Email input field type
 * Implements email input with validation
 */
export class EmailField implements FieldType {
  /**
   * Email validation regex
   * Based on HTML5 email validation pattern with stricter requirements:
   * - Requires at least one dot in domain
   * - Disallows consecutive dots
   */
  private readonly EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  /**
   * Render email input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'email');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    input.value = finalValue;

    // Apply placeholder
    if (config.placeholder) {
      input.setAttribute('placeholder', config.placeholder);
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
   * Converts to lowercase and trims whitespace
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement)) {
      return '';
    }

    // Trim whitespace and convert to lowercase
    return element.value.trim().toLowerCase();
  }

  /**
   * Validate email field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Email';

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

    // Email format validation
    if (!isEmpty) {
      // Check for consecutive dots (invalid in both local and domain parts)
      if (stringValue.includes('..')) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be a valid email address`,
          code: 'INVALID_EMAIL'
        });
      } else if (!this.EMAIL_REGEX.test(stringValue)) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be a valid email address`,
          code: 'INVALID_EMAIL'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
