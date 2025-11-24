import { describe, it, expect, beforeEach } from 'vitest';
import { TextField } from '../../../../src/domain/fields/TextField';
import type { FieldConfigData, ValidationResult } from '../../../../src/domain/types';

describe('TextField', () => {
  let textField: TextField;

  beforeEach(() => {
    textField = new TextField();
  });

  describe('render', () => {
    it('should render an input element', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = textField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('text');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'text' };
      const element = textField.render(config, 'John Doe') as HTMLInputElement;

      expect(element.value).toBe('John Doe');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'text',
        defaultValue: 'Default Text'
      };

      const element = textField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('Default Text');
    });

    it('should apply placeholder', () => {
      const config: FieldConfigData = {
        type: 'text',
        placeholder: 'Enter name...'
      };

      const element = textField.render(config, '');

      expect(element.getAttribute('placeholder')).toBe('Enter name...');
    });

    it('should apply maxLength attribute', () => {
      const config: FieldConfigData = {
        type: 'text',
        maxLength: 100
      };

      const element = textField.render(config, '');

      expect(element.getAttribute('maxlength')).toBe('100');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'text',
        required: true
      };

      const element = textField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'text',
        className: 'custom-input'
      };

      const element = textField.render(config, '');

      expect(element.classList.contains('custom-input')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract value from input', () => {
      const input = document.createElement('input');
      input.value = 'Test Value';

      const value = textField.extract(input);

      expect(value).toBe('Test Value');
    });

    it('should trim whitespace', () => {
      const input = document.createElement('input');
      input.value = '  Test  ';

      const value = textField.extract(input);

      expect(value).toBe('Test');
    });

    it('should return empty string for empty input', () => {
      const input = document.createElement('input');
      input.value = '';

      const value = textField.extract(input);

      expect(value).toBe('');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid value', () => {
      const config: FieldConfigData = {
        type: 'text',
        required: true
      };

      const result = textField.validate(config, 'Valid');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name',
        required: true
      };

      const result = textField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should validate minLength', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Username',
        minLength: 5
      };

      const result = textField.validate(config, 'abc');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('5');
    });

    it('should validate maxLength', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Title',
        maxLength: 5
      };

      const result = textField.validate(config, 'Too Long');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('5');
    });

    it('should validate pattern', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Code',
        pattern: /^[A-Z]+$/
      };

      const result = textField.validate(config, 'lowercase');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('format');
    });

    it('should pass when pattern matches', () => {
      const config: FieldConfigData = {
        type: 'text',
        pattern: /^[A-Z]+$/
      };

      const result = textField.validate(config, 'UPPERCASE');

      expect(result.valid).toBe(true);
    });

    it('should handle multiple validation errors', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Field',
        required: true,
        minLength: 5,
        maxLength: 10
      };

      const result = textField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should skip optional validations for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'text',
        required: false,
        minLength: 5
      };

      const result = textField.validate(config, '');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
