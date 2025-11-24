import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * CheckboxField - Checkbox input field type
 * Implements boolean checkbox with validation
 */
export class CheckboxField implements FieldType {
  /**
   * Render checkbox element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');

    // Determine checked state
    let isChecked = false;

    if (value !== undefined && value !== null) {
      // Convert value to boolean
      if (typeof value === 'boolean') {
        isChecked = value;
      } else if (typeof value === 'string') {
        isChecked = value === 'true' || value === '1';
      } else if (typeof value === 'number') {
        isChecked = value === 1;
      }
    } else if (config.defaultValue !== undefined) {
      // Use defaultValue if value is undefined/null
      isChecked = Boolean(config.defaultValue);
    }

    input.checked = isChecked;

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
   * Extract value from checkbox element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLInputElement) || element.type !== 'checkbox') {
      return false;
    }

    return element.checked;
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Convert to boolean
    const boolValue = Boolean(value);

    // Required validation (checkbox must be checked)
    if (config.required && !boolValue) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be checked`,
        code: 'REQUIRED'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
