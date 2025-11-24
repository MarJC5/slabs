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
    const container = document.createElement('label');
    container.classList.add('slabs-field__checkbox-option');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('slabs-field__checkbox-input');

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

    // Apply custom className to container
    if (config.className) {
      container.classList.add(config.className);
    }

    container.appendChild(input);

    return container;
  }

  /**
   * Extract value from checkbox element
   */
  extract(element: HTMLElement): any {
    // If element is the label container, find the input inside
    let input: HTMLInputElement | null = null;

    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      input = element;
    } else {
      // Look for checkbox input inside the container
      input = element.querySelector('input[type="checkbox"]');
    }

    if (!input) {
      return false;
    }

    return input.checked;
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
