import { describe, it, expect, beforeEach } from 'vitest';
import { DateField } from '../../../../src/domain/fields/DateField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('DateField', () => {
  let dateField: DateField;

  beforeEach(() => {
    dateField = new DateField();
  });

  describe('render', () => {
    it('should render an input element with type date', () => {
      const config: FieldConfigData = {
        type: 'date',
        label: 'Event Date'
      };

      const element = dateField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('date');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'date' };
      const element = dateField.render(config, '2024-12-25') as HTMLInputElement;

      expect(element.value).toBe('2024-12-25');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'date',
        defaultValue: '2024-01-01'
      };

      const element = dateField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('2024-01-01');
    });

    it('should apply min attribute', () => {
      const config: FieldConfigData = {
        type: 'date',
        min: '2024-01-01'
      };

      const element = dateField.render(config, '');

      expect(element.getAttribute('min')).toBe('2024-01-01');
    });

    it('should apply max attribute', () => {
      const config: FieldConfigData = {
        type: 'date',
        max: '2024-12-31'
      };

      const element = dateField.render(config, '');

      expect(element.getAttribute('max')).toBe('2024-12-31');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'date',
        required: true
      };

      const element = dateField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'date',
        className: 'custom-date'
      };

      const element = dateField.render(config, '');

      expect(element.classList.contains('custom-date')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract date value from input', () => {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = '2024-06-15';

      const value = dateField.extract(input);

      expect(value).toBe('2024-06-15');
    });

    it('should return empty string for empty input', () => {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = '';

      const value = dateField.extract(input);

      expect(value).toBe('');
    });

    it('should return empty string for non-date input', () => {
      const input = document.createElement('input');
      input.type = 'text';

      const value = dateField.extract(input);

      expect(value).toBe('');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid date', () => {
      const config: FieldConfigData = {
        type: 'date',
        required: true
      };

      const result = dateField.validate(config, '2024-12-25');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'date',
        label: 'Birth Date',
        required: true
      };

      const result = dateField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'date',
        required: false
      };

      const result = dateField.validate(config, '');

      expect(result.valid).toBe(true);
    });

    it('should validate date format (YYYY-MM-DD)', () => {
      const config: FieldConfigData = {
        type: 'date',
        label: 'Date'
      };

      const result = dateField.validate(config, '12/25/2024');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('YYYY-MM-DD');
    });

    it('should pass for valid YYYY-MM-DD format', () => {
      const config: FieldConfigData = {
        type: 'date'
      };

      const result = dateField.validate(config, '2024-12-25');

      expect(result.valid).toBe(true);
    });

    it('should validate min date', () => {
      const config: FieldConfigData = {
        type: 'date',
        label: 'Event Date',
        min: '2024-06-01'
      };

      const result = dateField.validate(config, '2024-05-31');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('2024-06-01');
    });

    it('should validate max date', () => {
      const config: FieldConfigData = {
        type: 'date',
        label: 'Event Date',
        max: '2024-12-31'
      };

      const result = dateField.validate(config, '2025-01-01');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('2024-12-31');
    });

    it('should pass when date is within range', () => {
      const config: FieldConfigData = {
        type: 'date',
        min: '2024-01-01',
        max: '2024-12-31'
      };

      const result = dateField.validate(config, '2024-06-15');

      expect(result.valid).toBe(true);
    });

    it('should accept date at min boundary', () => {
      const config: FieldConfigData = {
        type: 'date',
        min: '2024-01-01'
      };

      const result = dateField.validate(config, '2024-01-01');

      expect(result.valid).toBe(true);
    });

    it('should accept date at max boundary', () => {
      const config: FieldConfigData = {
        type: 'date',
        max: '2024-12-31'
      };

      const result = dateField.validate(config, '2024-12-31');

      expect(result.valid).toBe(true);
    });
  });
});
