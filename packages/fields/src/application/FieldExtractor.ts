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
      // Check if the input element itself is an OEmbed container
      if (input.classList.contains('slabs-field-oembed')) {
        fieldType = 'oembed';
      }
      else if (input.classList.contains('slabs-field-file')) {
        fieldType = 'file';
      }
      else if (input.classList.contains('slabs-field-link')) {
        fieldType = 'link';
      }
      else if (input.classList.contains('image-field')) {
        fieldType = 'image';
      }
      else if (input.classList.contains('repeater-field')) {
        fieldType = 'repeater';
      }
      else if (input.classList.contains('flexible-field')) {
        fieldType = 'flexible';
      }
      else if (input.classList.contains('group-field')) {
        fieldType = 'group';
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

    // For OEmbed and File fields, pass the container (input IS the container in this case)
    if (fieldType === 'oembed' || fieldType === 'file') {
      return handler.extract(input as HTMLElement);
    }

    return handler.extract(input as HTMLElement);
  }

  /**
   * Extract data from all fields in a container
   */
  extract(container: HTMLElement): Record<string, any> {
    const data: Record<string, any> = {};

    // Find all field elements that are DIRECT children (not nested in repeater/group/flexible)
    // We need to exclude fields that are inside repeater rows, group fields, or flexible layouts
    const fields = container.querySelectorAll('.slabs-field[data-field-name]');

    for (const field of Array.from(fields)) {
      const fieldName = field.getAttribute('data-field-name');
      if (!fieldName) continue;

      // Skip fields that are nested inside repeater rows (they have data-row-id)
      if (field.hasAttribute('data-row-id')) continue;

      // Skip fields that are nested inside flexible layouts (they have data-layout-id)
      if (field.hasAttribute('data-layout-id')) continue;

      const value = this.extractField(field as HTMLElement);
      data[fieldName] = value;
    }

    return data;
  }
}
