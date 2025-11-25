import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';
import * as CodexIcons from '@codexteam/icons';

/**
 * File value interface
 */
export interface FileValue {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

/**
 * FileField - Generic file upload field type
 * Supports any file type with preview info, file size display, and download link
 */
export class FileField implements FieldType {
  /**
   * Render file field with file input and info display
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('slabs-field-file');

    // Parse value
    const fileValue = this.parseValue(value);

    // Hidden input to store the file data (JSON string)
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.classList.add('file-value');
    hiddenInput.value = fileValue ? JSON.stringify(fileValue) : '';

    // File input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.classList.add('slabs-field__input', 'slabs-field__file-input');

    // Apply accept attribute
    if (config.accept) {
      fileInput.setAttribute('accept', config.accept);
    }

    // Apply required
    if (config.required) {
      fileInput.required = true;
    }

    // Hide file input if there's a file already uploaded
    if (fileValue) {
      fileInput.classList.add('slabs-field__file-input--hidden');
    }

    // File info container
    const fileInfo = document.createElement('div');
    fileInfo.classList.add('slabs-field__file-info');
    if (!fileValue) {
      fileInfo.classList.add('slabs-field__file-info--hidden');
    }

    // File icon - use Codex icon
    const fileIcon = document.createElement('div');
    fileIcon.classList.add('slabs-field__file-icon');
    fileIcon.innerHTML = this.getFileIcon();

    // File details container
    const fileDetails = document.createElement('div');
    fileDetails.classList.add('slabs-field__file-details');

    // File name
    const fileName = document.createElement('div');
    fileName.classList.add('slabs-field__file-name');
    fileName.textContent = fileValue?.name || '';

    // File size
    const fileSize = document.createElement('div');
    fileSize.classList.add('slabs-field__file-size');
    if (fileValue?.size) {
      fileSize.textContent = this.formatFileSize(fileValue.size);
    }

    fileDetails.appendChild(fileName);
    fileDetails.appendChild(fileSize);

    // File actions
    const fileActions = document.createElement('div');
    fileActions.classList.add('slabs-field__file-actions');

    // Download link
    const downloadLink = document.createElement('a');
    downloadLink.classList.add('slabs-field__file-download');
    downloadLink.textContent = 'Download';
    downloadLink.download = fileValue?.name || 'file';
    if (fileValue?.url) {
      downloadLink.href = fileValue.url;
    }

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.classList.add('slabs-field__file-remove');
    removeBtn.textContent = 'Remove';

    fileActions.appendChild(downloadLink);
    fileActions.appendChild(removeBtn);

    fileInfo.appendChild(fileIcon);
    fileInfo.appendChild(fileDetails);
    fileInfo.appendChild(fileActions);

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        // Read file as base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const newFileValue: FileValue = {
            name: file.name,
            url: result,
            size: file.size,
            type: file.type
          };

          hiddenInput.value = JSON.stringify(newFileValue);
          fileName.textContent = file.name;
          fileSize.textContent = this.formatFileSize(file.size);
          downloadLink.href = result;
          downloadLink.download = file.name;
          fileInfo.classList.remove('slabs-field__file-info--hidden');
          // Hide file input after upload
          fileInput.classList.add('slabs-field__file-input--hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    // Handle remove
    removeBtn.addEventListener('click', () => {
      hiddenInput.value = '';
      fileName.textContent = '';
      fileSize.textContent = '';
      downloadLink.href = '';
      fileInfo.classList.add('slabs-field__file-info--hidden');
      fileInput.value = '';
      // Show file input again after removing file
      fileInput.classList.remove('slabs-field__file-input--hidden');
    });

    container.appendChild(hiddenInput);
    container.appendChild(fileInput);
    container.appendChild(fileInfo);

    return container;
  }

  /**
   * Extract value from file field
   */
  extract(element: HTMLElement): FileValue | null {
    const hiddenInput = element.querySelector('.file-value') as HTMLInputElement;
    if (!hiddenInput || !hiddenInput.value) {
      return null;
    }

    try {
      return JSON.parse(hiddenInput.value);
    } catch {
      return null;
    }
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'File';

    const fileValue = this.parseValue(value);
    const isEmpty = !fileValue || !fileValue.url;

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

    // Validate file size
    if (config.maxSize && fileValue?.size && fileValue.size > config.maxSize) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must be smaller than ${this.formatFileSize(config.maxSize)}`,
        code: 'FILE_TOO_LARGE'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Parse value into FileValue object
   */
  private parseValue(value: any): FileValue | null {
    if (!value) return null;

    // If it's already a FileValue object
    if (typeof value === 'object' && value.url) {
      return {
        name: value.name || 'file',
        url: value.url,
        size: value.size,
        type: value.type
      };
    }

    return null;
  }

  /**
   * Get file icon SVG from Codex Icons
   */
  private getFileIcon(): string {
    // Try to get the file icon from Codex Icons, fallback to emoji
    return (CodexIcons as any).IconFile || '📄';
  }

  /**
   * Format file size in human-readable format
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}