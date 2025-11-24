import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * ColorField - Color picker field type
 * Implements color input with hex validation
 */
export class ColorField implements FieldType {
  /**
   * Normalize 3-digit hex to 6-digit hex
   */
  private normalizeHex(hex: string): string {
    // Remove # if present
    const cleaned = hex.replace('#', '');

    // If 3 digits, expand to 6
    if (cleaned.length === 3) {
      return '#' + cleaned.split('').map(c => c + c).join('');
    }

    // If 6 digits, add # if missing
    if (cleaned.length === 6) {
      return '#' + cleaned;
    }

    return hex;
  }

  /**
   * Render color input element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'color');

    // Normalize and set value
    let finalValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '#000000');

    // Normalize hex format
    finalValue = this.normalizeHex(finalValue).toLowerCase();

    input.value = finalValue;

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
   * Extract value from color input element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement) || element.type !== 'color') {
      return '#000000';
    }

    // Return value or default black
    return element.value || '#000000';
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

    // Validate hex color format (#RGB or #RRGGBB)
    if (!isEmpty) {
      const hexPattern = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;

      if (!hexPattern.test(stringValue)) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be a valid hex color (e.g., #ff5733 or #f00)`,
          code: 'INVALID_COLOR'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
