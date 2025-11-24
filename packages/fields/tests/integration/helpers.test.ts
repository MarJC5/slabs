import { describe, it, expect } from 'vitest';
import {
  renderFields,
  extractFieldData,
  validateFields,
  getDefaultRegistry
} from '../../src/helpers';
import type { FieldConfigData } from '../../src/domain/types';

describe('Helper Functions Integration', () => {
  it('should render, extract, and validate fields end-to-end', () => {
    // Define fields
    const fields: Record<string, FieldConfigData> = {
      name: {
        type: 'text',
        label: 'Name',
        required: true,
        minLength: 3,
        maxLength: 50
      },
      email: {
        type: 'text',
        label: 'Email',
        required: true
      },
      age: {
        type: 'number',
        label: 'Age',
        min: 18,
        max: 120
      },
      country: {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' }
        ]
      }
    };

    // Initial data
    const initialData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      country: 'us'
    };

    // Step 1: Render fields
    const container = renderFields(fields, initialData);
    expect(container).toBeTruthy();
    expect(container.querySelectorAll('.slabs-field').length).toBe(4);

    // Step 2: Extract data (should match initial data)
    const extractedData = extractFieldData(container);
    expect(extractedData).toEqual(initialData);

    // Step 3: Validate data
    const validationResult = validateFields(fields, extractedData);
    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors).toHaveLength(0);
  });

  it('should handle validation errors', () => {
    const fields: Record<string, FieldConfigData> = {
      name: {
        type: 'text',
        label: 'Name',
        required: true,
        minLength: 5
      },
      age: {
        type: 'number',
        label: 'Age',
        min: 18
      }
    };

    const invalidData = {
      name: 'Jo',  // Too short
      age: 15      // Too young
    };

    const result = validateFields(fields, invalidData);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.fieldErrors).toBeDefined();
    expect(result.fieldErrors?.name).toBeDefined();
    expect(result.fieldErrors?.age).toBeDefined();
  });

  it('should modify and re-extract field values', () => {
    const fields: Record<string, FieldConfigData> = {
      title: {
        type: 'text',
        label: 'Title'
      },
      rating: {
        type: 'number',
        label: 'Rating'
      }
    };

    // Render with initial data
    const container = renderFields(fields, {
      title: 'Initial Title',
      rating: 3
    });

    // Modify the values
    const titleInput = container.querySelector('[data-field-name="title"] input') as HTMLInputElement;
    const ratingInput = container.querySelector('[data-field-name="rating"] input') as HTMLInputElement;

    titleInput.value = 'Modified Title';
    ratingInput.value = '5';

    // Extract modified data
    const extractedData = extractFieldData(container);

    expect(extractedData.title).toBe('Modified Title');
    expect(extractedData.rating).toBe(5);
  });

  it('should get default registry and allow custom field registration', () => {
    const registry = getDefaultRegistry();

    expect(registry.has('text')).toBe(true);
    expect(registry.has('number')).toBe(true);
    expect(registry.has('select')).toBe(true);

    const types = registry.getAllTypes();
    expect(types).toContain('text');
    expect(types).toContain('number');
    expect(types).toContain('select');
  });

  it('should handle custom container class', () => {
    const fields: Record<string, FieldConfigData> = {
      name: {
        type: 'text',
        label: 'Name'
      }
    };

    const container = renderFields(fields, {}, { containerClass: 'my-custom-fields' });

    expect(container.classList.contains('my-custom-fields')).toBe(true);
  });

  it('should work with select multiple', () => {
    const fields: Record<string, FieldConfigData> = {
      tags: {
        type: 'select',
        label: 'Tags',
        multiple: true,
        options: [
          { value: 'js', label: 'JavaScript' },
          { value: 'ts', label: 'TypeScript' },
          { value: 'py', label: 'Python' }
        ]
      }
    };

    const container = renderFields(fields, { tags: ['js', 'ts'] });
    const extractedData = extractFieldData(container);

    expect(extractedData.tags).toEqual(['js', 'ts']);

    const validationResult = validateFields(fields, extractedData);
    expect(validationResult.valid).toBe(true);
  });
});
