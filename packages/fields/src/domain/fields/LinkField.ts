import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * Link value type
 */
export interface LinkValue {
  url: string;
  title: string;
  target: '_self' | '_blank';
}

/**
 * LinkField - Link input field type
 * Implements a composite field with url, title, and target
 */
export class LinkField implements FieldType {
  /**
   * URL validation regex - only allows http and https protocols
   */
  private readonly URL_REGEX = /^https?:\/\/.+/;

  /**
   * Valid target values
   */
  private readonly VALID_TARGETS = ['_self', '_blank'];

  /**
   * Render link input elements in a container
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('slabs-field-link');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Parse value
    const linkValue = this.parseValue(value, config.defaultValue);

    // Create URL input
    const urlInput = document.createElement('input');
    urlInput.classList.add('slabs-field__input');
    urlInput.setAttribute('type', 'url');
    urlInput.setAttribute('name', 'url');
    urlInput.setAttribute('placeholder', 'https://example.com');
    urlInput.value = linkValue.url;
    if (config.required) {
      urlInput.required = true;
    }

    // Create title input
    const titleInput = document.createElement('input');
    titleInput.classList.add('slabs-field__input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.setAttribute('placeholder', 'Link text');
    titleInput.value = linkValue.title;
    if (config.required) {
      titleInput.required = true;
    }

    // Create target select
    const targetSelect = document.createElement('select');
    targetSelect.classList.add('slabs-field__input');
    targetSelect.setAttribute('name', 'target');

    const selfOption = document.createElement('option');
    selfOption.value = '_self';
    selfOption.textContent = 'Same window';
    targetSelect.appendChild(selfOption);

    const blankOption = document.createElement('option');
    blankOption.value = '_blank';
    blankOption.textContent = 'New window';
    targetSelect.appendChild(blankOption);

    targetSelect.value = linkValue.target;

    // Create labels and append to container
    const urlLabel = document.createElement('label');
    urlLabel.classList.add('slabs-field__label');
    urlLabel.textContent = 'URL';
    urlLabel.appendChild(urlInput);

    const titleLabel = document.createElement('label');
    titleLabel.classList.add('slabs-field__label');
    titleLabel.textContent = 'Title';
    titleLabel.appendChild(titleInput);

    const targetLabel = document.createElement('label');
    targetLabel.classList.add('slabs-field__label');
    targetLabel.textContent = 'Target';
    targetLabel.appendChild(targetSelect);

    container.appendChild(urlLabel);
    container.appendChild(titleLabel);
    container.appendChild(targetLabel);

    return container;
  }

  /**
   * Extract link value from container element
   */
  extract(element: HTMLElement): LinkValue {
    const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
    const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;
    const targetSelect = element.querySelector('select[name="target"]') as HTMLSelectElement;

    return {
      url: urlInput ? urlInput.value.trim() : '',
      title: titleInput ? titleInput.value.trim() : '',
      target: (targetSelect?.value as '_self' | '_blank') || '_self'
    };
  }

  /**
   * Validate link field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Link';

    // Parse value
    const linkValue = this.parseValue(value, null);

    // Check if field is empty
    const isEmpty = linkValue.url.trim() === '' && linkValue.title.trim() === '';

    // Skip validation if empty and not required
    if (isEmpty && !config.required) {
      return {
        valid: true,
        errors: []
      };
    }

    // Required validation for URL
    if (config.required && linkValue.url.trim() === '') {
      errors.push({
        field: fieldLabel,
        message: `URL is required`,
        code: 'REQUIRED'
      });
    }

    // Required validation for title
    if (config.required && linkValue.title.trim() === '') {
      errors.push({
        field: fieldLabel,
        message: `Title is required`,
        code: 'REQUIRED'
      });
    }

    // URL format validation
    if (linkValue.url.trim() !== '' && !this.URL_REGEX.test(linkValue.url.trim())) {
      errors.push({
        field: fieldLabel,
        message: `URL must be a valid http or https URL`,
        code: 'INVALID_URL'
      });
    }

    // Target validation
    if (!this.VALID_TARGETS.includes(linkValue.target)) {
      errors.push({
        field: fieldLabel,
        message: `Target must be either _self or _blank`,
        code: 'INVALID_TARGET'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Parse value into LinkValue object
   */
  private parseValue(value: any, defaultValue: any): LinkValue {
    // If value is provided and valid, use it
    if (value && typeof value === 'object') {
      return {
        url: value.url || '',
        title: value.title || '',
        target: value.target || '_self'
      };
    }

    // If defaultValue is provided and valid, use it
    if (defaultValue && typeof defaultValue === 'object') {
      return {
        url: defaultValue.url || '',
        title: defaultValue.title || '',
        target: defaultValue.target || '_self'
      };
    }

    // Return empty values
    return {
      url: '',
      title: '',
      target: '_self'
    };
  }
}
