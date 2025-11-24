import { describe, it, expect, beforeEach } from 'vitest';
import { NumberField } from '../../../../src/domain/fields/NumberField';
import type { FieldConfigData, ValidationResult } from '../../../../src/domain/types';

describe('NumberField', () => {
  let numberField: NumberField;

  beforeEach(() => {
    numberField = new NumberField();
  });

  describe('render', () => {
    it('should render an input element with type number', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age'
      };

      const element = numberField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('number');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'number' };
      const element = numberField.render(config, 42) as HTMLInputElement;

      expect(element.value).toBe('42');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'number',
        defaultValue: 10
      };

      const element = numberField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('10');
    });

    it('should apply placeholder', () => {
      const config: FieldConfigData = {
        type: 'number',
        placeholder: 'Enter age...'
      };

      const element = numberField.render(config, '');

      expect(element.getAttribute('placeholder')).toBe('Enter age...');
    });

    it('should apply min attribute', () => {
      const config: FieldConfigData = {
        type: 'number',
        min: 0
      };

      const element = numberField.render(config, '');

      expect(element.getAttribute('min')).toBe('0');
    });

    it('should apply max attribute', () => {
      const config: FieldConfigData = {
        type: 'number',
        max: 100
      };

      const element = numberField.render(config, '');

      expect(element.getAttribute('max')).toBe('100');
    });

    it('should apply step attribute', () => {
      const config: FieldConfigData = {
        type: 'number',
        step: 0.1
      };

      const element = numberField.render(config, '');

      expect(element.getAttribute('step')).toBe('0.1');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'number',
        required: true
      };

      const element = numberField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'number',
        className: 'custom-number'
      };

      const element = numberField.render(config, '');

      expect(element.classList.contains('custom-number')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract number value from input', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '42';

      const value = numberField.extract(input);

      expect(value).toBe(42);
    });

    it('should extract decimal numbers', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '3.14';

      const value = numberField.extract(input);

      expect(value).toBe(3.14);
    });

    it('should return null for empty input', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = '';

      const value = numberField.extract(input);

      expect(value).toBeNull();
    });

    it('should return null for invalid number', () => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = 'not a number';

      const value = numberField.extract(input);

      expect(value).toBeNull();
    });
  });

  describe('validate', () => {
    it('should pass validation for valid number', () => {
      const config: FieldConfigData = {
        type: 'number',
        required: true
      };

      const result = numberField.validate(config, 42);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age',
        required: true
      };

      const result = numberField.validate(config, null);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should validate minimum value', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age',
        min: 18
      };

      const result = numberField.validate(config, 15);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('18');
    });

    it('should validate maximum value', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Score',
        max: 100
      };

      const result = numberField.validate(config, 150);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('100');
    });

    it('should pass when value is within range', () => {
      const config: FieldConfigData = {
        type: 'number',
        min: 0,
        max: 100
      };

      const result = numberField.validate(config, 50);

      expect(result.valid).toBe(true);
    });

    it('should handle multiple validation errors', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Value',
        required: true,
        min: 10,
        max: 20
      };

      const result = numberField.validate(config, null);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should skip optional validations for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'number',
        required: false,
        min: 5
      };

      const result = numberField.validate(config, null);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept zero as a valid value', () => {
      const config: FieldConfigData = {
        type: 'number',
        required: true
      };

      const result = numberField.validate(config, 0);

      expect(result.valid).toBe(true);
    });
  });
});
