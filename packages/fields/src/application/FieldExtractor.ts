import type { FieldRegistry } from '../domain/FieldRegistry';

/**
 * FieldExtractor - Application service for extracting data from rendered fields
 * Handles the orchestration of data extraction from DOM elements
 */
export class FieldExtractor {
  constructor(private registry: FieldRegistry) {}

  /**
   * Extract value from a single field element
   */
  extractField(element: HTMLElement): any {
    // Find the input element
    const input = element.querySelector('.slabs-field__input');
    if (!input) {
      return null;
    }

    // Get the field type from the input element
    // Check for data-field-type attribute first (used by custom fields like wysiwyg)
    let fieldType: string | null = (input as HTMLElement).dataset.fieldType || null;

    // If no data-field-type, determine from element type
    if (!fieldType) {
      // Check for composite/complex field types first
      if (input.classList.contains('slabs-field-link')) {
        fieldType = 'link';
      }
      else if (input.classList.contains('image-field')) {
        fieldType = 'image';
      }
      else if (input.classList.contains('repeater-field')) {
        fieldType = 'repeater';
      }
      // Check for radio group (container with multiple radio inputs)
      else if (input.classList.contains('slabs-field__radio-group')) {
        fieldType = 'radio';
      }
      // Check for checkbox (label container with checkbox input)
      else if (input.classList.contains('slabs-field__checkbox-option')) {
        fieldType = 'checkbox';
      }
      // Check for boolean field (checkbox or switch display)
      else if (input.classList.contains('slabs-field__boolean-checkbox') || input.classList.contains('slabs-field__boolean-switch')) {
        fieldType = 'boolean';
      }
      // Check for number wrapper (container with prefix/suffix)
      else if (input.classList.contains('slabs-field__number-wrapper')) {
        fieldType = 'number';
      }
      // Standard input types
      else if (input instanceof HTMLInputElement) {
        fieldType = input.type;
      } else if (input instanceof HTMLSelectElement) {
        fieldType = 'select';
      } else if (input instanceof HTMLTextAreaElement) {
        fieldType = 'textarea';
      } else {
        // Default to text if we can't determine
        fieldType = 'text';
      }
    }

    // Get the field type handler
    if (!this.registry.has(fieldType)) {
      return null;
    }

    const handler = this.registry.get(fieldType);
    return handler.extract(input as HTMLElement);
  }

  /**
   * Extract data from all fields in a container
   */
  extract(container: HTMLElement): Record<string, any> {
    const data: Record<string, any> = {};

    // Find all field elements
    const fields = container.querySelectorAll('.slabs-field[data-field-name]');

    for (const field of Array.from(fields)) {
      const fieldName = field.getAttribute('data-field-name');
      if (!fieldName) continue;

      const value = this.extractField(field as HTMLElement);
      data[fieldName] = value;
    }

    return data;
  }
}
