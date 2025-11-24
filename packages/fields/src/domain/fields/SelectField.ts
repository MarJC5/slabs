import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * SelectField - Dropdown select field type
 * Implements single and multiple selection with option validation
 */
export class SelectField implements FieldType {
  /**
   * Render select element
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const select = document.createElement('select');

    // Apply multiple attribute
    if (config.multiple) {
      select.multiple = true;
    }

    // Apply required
    if (config.required) {
      select.required = true;
    }

    // Apply custom className
    if (config.className) {
      select.classList.add(config.className);
    }

    // Render options
    if (config.options) {
      for (const opt of config.options) {
        const option = document.createElement('option');
        option.value = String(opt.value);
        option.textContent = opt.label;
        select.appendChild(option);
      }
    }

    // Set selected value(s)
    const finalValue = value !== '' && value !== null && value !== undefined
      ? value
      : config.defaultValue;

    if (finalValue !== undefined && finalValue !== null && finalValue !== '') {
      if (config.multiple && Array.isArray(finalValue)) {
        // Set multiple selections
        const valueSet = new Set(finalValue.map(String));
        for (let i = 0; i < select.options.length; i++) {
          const option = select.options[i];
          if (option && valueSet.has(option.value)) {
            option.selected = true;
          }
        }
      } else {
        // Set single selection
        select.value = String(finalValue);
      }
    }

    return select;
  }

  /**
   * Extract value from select element
   */
  extract(element: HTMLElement): any {
    if (!(element instanceof HTMLSelectElement)) {
      return '';
    }

    // Handle multiple selection
    if (element.multiple) {
      const selected: string[] = [];
      for (let i = 0; i < element.options.length; i++) {
        const option = element.options[i];
        if (option && option.selected) {
          selected.push(option.value);
        }
      }
      return selected;
    }

    // Handle single selection
    return element.value;
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Check if options are defined
    if (!config.options || config.options.length === 0) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} has no options defined`,
        code: 'NO_OPTIONS'
      });
      return {
        valid: false,
        errors
      };
    }

    // Get valid option values
    const validValues = new Set(config.options.map(opt => String(opt.value)));

    // Handle multiple selection
    if (config.multiple && Array.isArray(value)) {
      // Check if required and empty
      if (config.required && value.length === 0) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} is required`,
          code: 'REQUIRED'
        });
      }

      // Validate each selected value
      for (const val of value) {
        if (!validValues.has(String(val))) {
          errors.push({
            field: fieldLabel,
            message: `${fieldLabel} contains an invalid selection: ${val} is not a valid option`,
            code: 'INVALID_OPTION'
          });
          break;
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    }

    // Handle single selection
    const isEmpty = value === '' || value === null || value === undefined;

    // Required validation
    if (config.required && isEmpty) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} is required`,
        code: 'REQUIRED'
      });
    }

    // Skip validation if empty and not required
    if (isEmpty && !config.required) {
      return {
        valid: true,
        errors: []
      };
    }

    // Validate value is in options
    if (!isEmpty && !validValues.has(String(value))) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel}: ${value} is not a valid option`,
        code: 'INVALID_OPTION'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
