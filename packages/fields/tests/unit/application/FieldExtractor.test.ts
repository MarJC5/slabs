import { describe, it, expect, beforeEach } from 'vitest';
import { FieldExtractor } from '../../../src/application/FieldExtractor';
import { FieldRenderer } from '../../../src/application/FieldRenderer';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../src/domain/types';

describe('FieldExtractor', () => {
  let extractor: FieldExtractor;
  let renderer: FieldRenderer;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    extractor = new FieldExtractor(registry);
    renderer = new FieldRenderer(registry);
  });

  describe('extractField', () => {
    it('should extract value from text field', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = renderer.renderField('name', config, 'John Doe');
      const value = extractor.extractField(element);

      expect(value).toBe('John Doe');
    });

    it('should extract value from number field', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age'
      };

      const element = renderer.renderField('age', config, 42);
      const value = extractor.extractField(element);

      expect(value).toBe(42);
    });

    it('should extract value from select field', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'US' },
          { value: 'uk', label: 'UK' }
        ]
      };

      const element = renderer.renderField('country', config, 'us');
      const value = extractor.extractField(element);

      expect(value).toBe('us');
    });

    it('should extract modified value from input', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = renderer.renderField('name', config, 'John');
      const input = element.querySelector('.slabs-field__input') as HTMLInputElement;
      input.value = 'Jane Doe';

      const value = extractor.extractField(element);

      expect(value).toBe('Jane Doe');
    });

    it('should return null if input element not found', () => {
      const div = document.createElement('div');
      div.classList.add('slabs-field');

      const value = extractor.extractField(div);

      expect(value).toBeNull();
    });
  });

  describe('extract', () => {
    it('should extract data from multiple fields', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name'
        },
        email: {
          type: 'text',
          label: 'Email'
        },
        age: {
          type: 'number',
          label: 'Age'
        }
      };

      const initialData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const container = renderer.render(fields, initialData);
      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
    });

    it('should extract modified values', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name'
        },
        age: {
          type: 'number',
          label: 'Age'
        }
      };

      const container = renderer.render(fields, { name: 'John', age: 30 });

      // Modify values
      const nameInput = container.querySelector('[data-field-name="name"] input') as HTMLInputElement;
      const ageInput = container.querySelector('[data-field-name="age"] input') as HTMLInputElement;
      nameInput.value = 'Jane Doe';
      ageInput.value = '25';

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({
        name: 'Jane Doe',
        age: 25
      });
    });

    it('should handle empty container', () => {
      const container = document.createElement('div');
      container.classList.add('slabs-fields');

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({});
    });

    it('should skip fields without data-field-name', () => {
      const container = document.createElement('div');
      const field = document.createElement('div');
      field.classList.add('slabs-field');
      const input = document.createElement('input');
      input.value = 'test';
      field.appendChild(input);
      container.appendChild(field);

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({});
    });

    it('should extract select field with multiple selections', () => {
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

      const container = renderer.render(fields, { tags: ['js', 'ts'] });
      const extractedData = extractor.extract(container);

      expect(extractedData.tags).toEqual(['js', 'ts']);
    });

    it('should handle fields with no input element', () => {
      const container = document.createElement('div');
      const field = document.createElement('div');
      field.classList.add('slabs-field');
      field.setAttribute('data-field-name', 'test');
      container.appendChild(field);

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({ test: null });
    });
  });
});
