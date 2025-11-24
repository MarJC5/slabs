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
      if (input instanceof HTMLInputElement) {
        fieldType = input.type === 'number' ? 'number' : 'text';
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
