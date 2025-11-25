import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';

/**
 * ImageField - Image upload field type
 * Implements image upload with preview, supports URLs and base64
 */
export class ImageField implements FieldType {
  /**
   * Render image field with file input and preview
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('image-field');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Hidden input to store the image URL/base64
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('image-value');
    hiddenInput.value = value || '';

    // File input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.classList.add('image-input');

    // Apply accept attribute (default to common image types)
    const accept = config.accept || 'image/png,image/jpeg,image/gif,image/webp';
    fileInput.setAttribute('accept', accept);

    // Apply required
    if (config.required) {
      fileInput.required = true;
    }

    // Hide file input if there's an image already uploaded
    if (value) {
      fileInput.classList.add('image-input--hidden');
    }

    // Preview container
    const preview = document.createElement('div');
    preview.classList.add('image-preview');

    if (!value) {
      preview.classList.add('hidden');
    }

    // Preview image
    const img = document.createElement('img');
    img.classList.add('image-preview-img');
    if (value) {
      img.src = value;
    }

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('image-remove');
    removeBtn.textContent = 'Remove';

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // Read file as base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          hiddenInput.value = result;
          img.src = result;
          preview.classList.remove('hidden');
          // Hide file input after upload
          fileInput.classList.add('image-input--hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    // Handle remove
    removeBtn.addEventListener('click', () => {
      hiddenInput.value = '';
      img.src = '';
      preview.classList.add('hidden');
      fileInput.value = '';
      // Show file input again after removing image
      fileInput.classList.remove('image-input--hidden');
    });

    preview.appendChild(img);
    preview.appendChild(removeBtn);

    container.appendChild(hiddenInput);
    container.appendChild(fileInput);
    container.appendChild(preview);

    return container;
  }

  /**
   * Extract value from image field
   */
  extract(element: HTMLElement): any {
    const hiddenInput = element.querySelector('.image-value') as HTMLInputElement;
    if (!hiddenInput) {
      return '';
    }
    return hiddenInput.value || '';
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

    // Validate URL format (accept http, https, or data URLs)
    if (!isEmpty) {
      const isValidUrl =
        stringValue.startsWith('http://') ||
        stringValue.startsWith('https://') ||
        stringValue.startsWith('data:image/');

      if (!isValidUrl) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be a valid URL or data URL`,
          code: 'INVALID_URL'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
