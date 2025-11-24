import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * TextareaField - Multi-line text input field type
 * Implements textarea with validation for longer text content
 */
export class TextareaField implements FieldType {
  /**
   * Render textarea element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const textarea = document.createElement('textarea');

    // Set value - prioritize provided value over defaultValue
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    textarea.value = finalValue;

    // Apply placeholder
    if (config.placeholder) {
      textarea.setAttribute('placeholder', config.placeholder);
    }

    // Apply rows (default to 3)
    textarea.rows = config.rows !== undefined ? config.rows : 3;

    // Apply maxLength
    if (config.maxLength !== undefined) {
      textarea.setAttribute('maxlength', String(config.maxLength));
    }

    // Apply required
    if (config.required) {
      textarea.required = true;
    }

    // Apply custom className
    if (config.className) {
      textarea.classList.add(config.className);
    }

    return textarea;
  }

  /**
   * Extract value from textarea element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLTextAreaElement)) {
      return '';
    }

    // Trim whitespace but preserve line breaks
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

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
