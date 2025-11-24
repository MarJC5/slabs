import { describe, it, expect, beforeEach } from 'vitest';
import { RadioField } from '../../../../src/domain/fields/RadioField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('RadioField', () => {
  let radioField: RadioField;

  beforeEach(() => {
    radioField = new RadioField();
  });

  describe('render', () => {
    it('should render a container with radio inputs', () => {
      const config: FieldConfigData = {
        type: 'radio',
        label: 'Layout',
        options: [
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' }
        ]
      };

      const element = radioField.render(config, '');

      expect(element.tagName).toBe('DIV');
      const inputs = element.querySelectorAll('input[type="radio"]');
      expect(inputs.length).toBe(2);
    });

    it('should render labels for each option', () => {
      const config: FieldConfigData = {
        type: 'radio',
        options: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' }
        ]
      };

      const element = radioField.render(config, '');
      const labels = element.querySelectorAll('label');

      expect(labels.length).toBe(2);
      expect(labels[0]?.textContent).toContain('Option A');
      expect(labels[1]?.textContent).toContain('Option B');
    });

    it('should set selected value', () => {
      const config: FieldConfigData = {
        type: 'radio',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' }
        ]
      };

      const element = radioField.render(config, 'blue');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[0]?.checked).toBe(false);
      expect(inputs[1]?.checked).toBe(true);
      expect(inputs[2]?.checked).toBe(false);
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'radio',
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ]
      };

      const element = radioField.render(config, '');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[1]?.checked).toBe(true);
    });

    it('should apply same name to all radio inputs', () => {
      const config: FieldConfigData = {
        type: 'radio',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const element = radioField.render(config, '');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      const firstName = inputs[0]?.name;
      expect(firstName).toBeTruthy();
      expect(inputs[1]?.name).toBe(firstName);
    });

    it('should apply required attribute to all inputs', () => {
      const config: FieldConfigData = {
        type: 'radio',
        required: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const element = radioField.render(config, '');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[0]?.required).toBe(true);
      expect(inputs[1]?.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'radio',
        className: 'custom-radio',
        options: [{ value: 'a', label: 'A' }]
      };

      const element = radioField.render(config, '');

      expect(element.classList.contains('custom-radio')).toBe(true);
    });

    it('should handle numeric option values', () => {
      const config: FieldConfigData = {
        type: 'radio',
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' }
        ]
      };

      const element = radioField.render(config, 2);
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[1]?.checked).toBe(true);
    });

    it('should auto-select first option when required and no value/default provided', () => {
      const config: FieldConfigData = {
        type: 'radio',
        required: true,
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' }
        ]
      };

      const element = radioField.render(config, '');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[0]?.checked).toBe(true);
      expect(inputs[1]?.checked).toBe(false);
      expect(inputs[2]?.checked).toBe(false);
    });

    it('should not auto-select when not required', () => {
      const config: FieldConfigData = {
        type: 'radio',
        required: false,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const element = radioField.render(config, '');
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      expect(inputs[0]?.checked).toBe(false);
      expect(inputs[1]?.checked).toBe(false);
    });
  });

  describe('extract', () => {
    it('should extract selected value', () => {
      const container = document.createElement('div');

      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.value = 'red';
      radio1.name = 'color';

      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.value = 'blue';
      radio2.name = 'color';
      radio2.checked = true;

      container.appendChild(radio1);
      container.appendChild(radio2);

      const value = radioField.extract(container);

      expect(value).toBe('blue');
    });

    it('should return empty string when no selection', () => {
      const container = document.createElement('div');

      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.value = 'a';
      radio1.name = 'test';

      container.appendChild(radio1);

      const value = radioField.extract(container);

      expect(value).toBe('');
    });

    it('should return empty string when container has no radio inputs', () => {
      const container = document.createElement('div');

      const value = radioField.extract(container);

      expect(value).toBe('');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid selection', () => {
      const config: FieldConfigData = {
        type: 'radio',
        required: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const result = radioField.validate(config, 'a');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'radio',
        label: 'Color',
        required: true,
        options: [{ value: 'red', label: 'Red' }]
      };

      const result = radioField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'radio',
        required: false,
        options: [{ value: 'test', label: 'Test' }]
      };

      const result = radioField.validate(config, '');

      expect(result.valid).toBe(true);
    });

    it('should validate value exists in options', () => {
      const config: FieldConfigData = {
        type: 'radio',
        label: 'Size',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'large', label: 'Large' }
        ]
      };

      const result = radioField.validate(config, 'medium');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid option');
    });

    it('should pass when value is in options', () => {
      const config: FieldConfigData = {
        type: 'radio',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' }
        ]
      };

      const result = radioField.validate(config, 'blue');

      expect(result.valid).toBe(true);
    });

    it('should require options to be defined', () => {
      const config: FieldConfigData = {
        type: 'radio',
        label: 'Test'
      };

      const result = radioField.validate(config, 'test');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('options');
    });
  });
});
