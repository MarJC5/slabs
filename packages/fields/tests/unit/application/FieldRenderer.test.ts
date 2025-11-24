import { describe, it, expect, beforeEach } from 'vitest';
import { FieldRenderer } from '../../../src/application/FieldRenderer';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../src/domain/types';

describe('FieldRenderer', () => {
  let renderer: FieldRenderer;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    renderer = new FieldRenderer(registry);
  });

  describe('renderField', () => {
    it('should render a single text field with label', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = renderer.renderField('name', config, '');

      expect(element.classList.contains('slabs-field')).toBe(true);
      const label = element.querySelector('.slabs-field__label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Name');
      const input = element.querySelector('.slabs-field__input');
      expect(input).toBeTruthy();
      expect(input?.tagName).toBe('INPUT');
    });

    it('should render field without label when not provided', () => {
      const config: FieldConfigData = {
        type: 'text'
      };

      const element = renderer.renderField('name', config, '');

      const label = element.querySelector('.slabs-field__label');
      expect(label).toBeNull();
    });

    it('should set data-field-name attribute', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Email'
      };

      const element = renderer.renderField('email', config, 'test@example.com');

      expect(element.getAttribute('data-field-name')).toBe('email');
    });

    it('should render description when provided', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Username',
        description: 'Choose a unique username'
      };

      const element = renderer.renderField('username', config, '');

      const description = element.querySelector('.slabs-field__description');
      expect(description).toBeTruthy();
      expect(description?.textContent).toBe('Choose a unique username');
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name',
        className: 'custom-field'
      };

      const element = renderer.renderField('name', config, '');

      expect(element.classList.contains('custom-field')).toBe(true);
    });

    it('should render number field', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age',
        min: 0,
        max: 120
      };

      const element = renderer.renderField('age', config, 25);

      const input = element.querySelector('.slabs-field__input') as HTMLInputElement;
      expect(input?.type).toBe('number');
      expect(input?.value).toBe('25');
    });

    it('should render select field', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' }
        ]
      };

      const element = renderer.renderField('country', config, 'us');

      const select = element.querySelector('.slabs-field__input') as HTMLSelectElement;
      expect(select?.tagName).toBe('SELECT');
      expect(select?.value).toBe('us');
      expect(select?.options.length).toBe(2);
    });

    it('should throw error for unregistered field type', () => {
      const config: FieldConfigData = {
        type: 'unknown',
        label: 'Test'
      };

      expect(() => {
        renderer.renderField('test', config, '');
      }).toThrow('not registered');
    });
  });

  describe('render', () => {
    it('should render multiple fields', () => {
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

      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const container = renderer.render(fields, data);

      expect(container.classList.contains('slabs-fields')).toBe(true);
      const fieldElements = container.querySelectorAll('.slabs-field');
      expect(fieldElements.length).toBe(3);
    });

    it('should render fields in order', () => {
      const fields: Record<string, FieldConfigData> = {
        first: { type: 'text', label: 'First' },
        second: { type: 'text', label: 'Second' },
        third: { type: 'text', label: 'Third' }
      };

      const container = renderer.render(fields, {});

      const fieldElements = container.querySelectorAll('.slabs-field');
      expect(fieldElements[0]?.getAttribute('data-field-name')).toBe('first');
      expect(fieldElements[1]?.getAttribute('data-field-name')).toBe('second');
      expect(fieldElements[2]?.getAttribute('data-field-name')).toBe('third');
    });

    it('should handle empty fields object', () => {
      const container = renderer.render({}, {});

      expect(container.classList.contains('slabs-fields')).toBe(true);
      expect(container.children.length).toBe(0);
    });

    it('should handle missing data values', () => {
      const fields: Record<string, FieldConfigData> = {
        name: { type: 'text', label: 'Name' },
        email: { type: 'text', label: 'Email' }
      };

      const container = renderer.render(fields, { name: 'John' });

      expect(container.querySelectorAll('.slabs-field').length).toBe(2);
    });

    it('should apply custom container className', () => {
      const fields: Record<string, FieldConfigData> = {
        name: { type: 'text', label: 'Name' }
      };

      const container = renderer.render(fields, {}, { containerClass: 'custom-container' });

      expect(container.classList.contains('custom-container')).toBe(true);
    });
  });
});
