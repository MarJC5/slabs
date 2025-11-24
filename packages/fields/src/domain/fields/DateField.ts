import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * DateField - Date input field type
 * Implements date input with min/max validation
 */
export class DateField implements FieldType {
  /**
   * Render date input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'date');

    // Set value
    const finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    input.value = finalValue;

    // Apply min
    if (config.min !== undefined) {
      input.setAttribute('min', String(config.min));
    }

    // Apply max
    if (config.max !== undefined) {
      input.setAttribute('max', String(config.max));
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
   * Extract value from date input element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement) || element.type !== 'date') {
      return '';
    }

    return element.value || '';
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

    // Validate date format (YYYY-MM-DD)
    if (!isEmpty) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;

      if (!datePattern.test(stringValue)) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be in YYYY-MM-DD format`,
          code: 'INVALID_FORMAT'
        });
        return {
          valid: false,
          errors
        };
      }

      // Parse date for min/max validation
      const dateValue = new Date(stringValue);

      // Check if date is valid
      if (isNaN(dateValue.getTime())) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} is not a valid date`,
          code: 'INVALID_DATE'
        });
        return {
          valid: false,
          errors
        };
      }

      // Min validation
      if (config.min !== undefined) {
        const minDate = new Date(String(config.min));
        if (dateValue < minDate) {
          errors.push({
            field: fieldLabel,
            message: `${fieldLabel} must be on or after ${config.min}`,
            code: 'MIN_DATE'
          });
        }
      }

      // Max validation
      if (config.max !== undefined) {
        const maxDate = new Date(String(config.max));
        if (dateValue > maxDate) {
          errors.push({
            field: fieldLabel,
            message: `${fieldLabel} must be on or before ${config.max}`,
            code: 'MAX_DATE'
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
