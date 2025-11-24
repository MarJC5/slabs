import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * BooleanField - Boolean input field type with checkbox or switch display
 * Implements true/false input with optional display modes
 */
export class BooleanField implements FieldType {
  /**
   * Render boolean input element as checkbox or switch
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    // Determine display mode (default to checkbox)
    const displayMode = config.display || 'checkbox';

    // Convert value to boolean
    const finalValue = this.coerceToBoolean(value, config.defaultValue);

    if (displayMode === 'switch') {
      return this.renderSwitch(config, finalValue);
    } else {
      return this.renderCheckbox(config, finalValue);
    }
  }

  /**
   * Render as checkbox (similar to CheckboxField but for boolean type)
   */
  private renderCheckbox(config: FieldConfigData, checked: boolean): HTMLElement {
    const container = document.createElement('label');
    container.classList.add('slabs-field__boolean-checkbox');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('slabs-field__boolean-input');
    input.checked = checked;

    // Apply required
    if (config.required) {
      input.required = true;
    }

    container.appendChild(input);

    return container;
  }

  /**
   * Render as toggle switch
   */
  private renderSwitch(config: FieldConfigData, checked: boolean): HTMLElement {
    const container = document.createElement('label');
    container.classList.add('slabs-field__boolean-switch');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('slabs-field__boolean-input');
    input.checked = checked;

    // Apply required
    if (config.required) {
      input.required = true;
    }

    // Create switch slider
    const slider = document.createElement('span');
    slider.classList.add('slabs-field__boolean-slider');

    container.appendChild(input);
    container.appendChild(slider);

    return container;
  }

  /**
   * Coerce value to boolean
   */
  private coerceToBoolean(value: any, defaultValue?: any): boolean {
    // Use provided value if it's defined
    if (value !== undefined && value !== null) {
      // Handle boolean
      if (typeof value === 'boolean') {
        return value;
      }
      // Handle string 'true'/'false'
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
      }
      // Handle number (1 = true, 0 = false, anything else = truthy)
      if (typeof value === 'number') {
        return value !== 0;
      }
      // Fallback to truthy check
      return Boolean(value);
    }

    // Use defaultValue if provided
    if (defaultValue !== undefined && defaultValue !== null) {
      return Boolean(defaultValue);
    }

    // Default to false
    return false;
  }

  /**
   * Extract value from input element
   */
  extract(element: HTMLElement): any {
    let input: HTMLInputElement | null = null;

    // Check if element is the input directly
    if (element instanceof HTMLInputElement && element.type === 'checkbox') {
      input = element;
    } else {
      // Look for input inside container (checkbox or switch)
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

    // Required validation - must be checked (true)
    if (config.required && value !== true) {
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
