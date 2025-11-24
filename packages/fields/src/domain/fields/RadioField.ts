import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * RadioField - Radio button group field type
 * Implements radio button group with single selection
 */
export class RadioField implements FieldType {
  /**
   * Render radio button group
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('slabs-field__radio-group');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Generate unique name for this radio group
    const groupName = `radio-${Math.random().toString(36).substr(2, 9)}`;

    // Determine selected value
    let selectedValue = value !== '' && value !== null && value !== undefined
      ? String(value)
      : (config.defaultValue !== undefined ? String(config.defaultValue) : '');

    // If required and no value/default is set, use the first option
    if (config.required && selectedValue === '' && config.options && config.options.length > 0) {
      const firstOption = config.options[0];
      if (firstOption) {
        selectedValue = String(firstOption.value);
      }
    }

    // Render each option
    if (config.options) {
      for (const option of config.options) {
        const label = document.createElement('label');
        label.classList.add('slabs-field__radio-option');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = groupName;
        input.value = String(option.value);
        input.classList.add('slabs-field__radio-input');

        // Set checked state
        if (String(option.value) === selectedValue) {
          input.checked = true;
        }

        // Apply required
        if (config.required) {
          input.required = true;
        }

        const labelSpan = document.createElement('span');
        labelSpan.classList.add('slabs-field__radio-label');
        labelSpan.textContent = option.label;

        label.appendChild(input);
        label.appendChild(labelSpan);
        container.appendChild(label);
      }
    }

    return container;
  }

  /**
   * Extract value from radio button group
   */
  extract(element: HTMLElement): any {
    // Find all radio inputs in the container
    const radios = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

    // Find the checked radio
    for (const radio of Array.from(radios)) {
      if (radio.checked) {
        return radio.value;
      }
    }

    return '';
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

    // Handle empty value
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
