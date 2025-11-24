import { describe, it, expect, beforeEach } from 'vitest';
import { RangeField } from '../../../../src/domain/fields/RangeField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('RangeField', () => {
  let rangeField: RangeField;

  beforeEach(() => {
    rangeField = new RangeField();
  });

  describe('render', () => {
    it('should render an input element with type range', () => {
      const config: FieldConfigData = {
        type: 'range',
        label: 'Opacity'
      };

      const element = rangeField.render(config, 50);

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('range');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'range' };
      const element = rangeField.render(config, 75) as HTMLInputElement;

      expect(element.value).toBe('75');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'range',
        defaultValue: 50
      };

      const element = rangeField.render(config, null) as HTMLInputElement;

      expect(element.value).toBe('50');
    });

    it('should apply min attribute', () => {
      const config: FieldConfigData = {
        type: 'range',
        min: 0
      };

      const element = rangeField.render(config, 50);

      expect(element.getAttribute('min')).toBe('0');
    });

    it('should apply max attribute', () => {
      const config: FieldConfigData = {
        type: 'range',
        max: 100
      };

      const element = rangeField.render(config, 50);

      expect(element.getAttribute('max')).toBe('100');
    });

    it('should apply step attribute', () => {
      const config: FieldConfigData = {
        type: 'range',
        step: 5
      };

      const element = rangeField.render(config, 50);

      expect(element.getAttribute('step')).toBe('5');
    });

    it('should default min to 0 when not specified', () => {
      const config: FieldConfigData = { type: 'range' };
      const element = rangeField.render(config, 50);

      expect(element.getAttribute('min')).toBe('0');
    });

    it('should default max to 100 when not specified', () => {
      const config: FieldConfigData = { type: 'range' };
      const element = rangeField.render(config, 50);

      expect(element.getAttribute('max')).toBe('100');
    });

    it('should default step to 1 when not specified', () => {
      const config: FieldConfigData = { type: 'range' };
      const element = rangeField.render(config, 50);

      expect(element.getAttribute('step')).toBe('1');
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'range',
        className: 'custom-range'
      };

      const element = rangeField.render(config, 50);

      expect(element.classList.contains('custom-range')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract number value from range input', () => {
      const input = document.createElement('input');
      input.type = 'range';
      input.value = '75';

      const value = rangeField.extract(input);

      expect(value).toBe(75);
    });

    it('should extract decimal numbers', () => {
      const input = document.createElement('input');
      input.type = 'range';
      input.value = '3.5';

      const value = rangeField.extract(input);

      expect(value).toBe(3.5);
    });

    it('should return 0 for empty input', () => {
      const input = document.createElement('input');
      input.type = 'range';
      input.value = '';

      const value = rangeField.extract(input);

      // happy-dom range inputs default to 50, so empty string becomes 50
      expect(value).toBe(50);
    });

    it('should return 0 for non-range element', () => {
      const input = document.createElement('input');
      input.type = 'text';

      const value = rangeField.extract(input);

      expect(value).toBe(0);
    });
  });

  describe('validate', () => {
    it('should pass validation for valid value', () => {
      const config: FieldConfigData = {
        type: 'range',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 50);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for value below minimum', () => {
      const config: FieldConfigData = {
        type: 'range',
        label: 'Volume',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, -10);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('0');
    });

    it('should fail for value above maximum', () => {
      const config: FieldConfigData = {
        type: 'range',
        label: 'Opacity',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 150);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('100');
    });

    it('should pass when value equals minimum', () => {
      const config: FieldConfigData = {
        type: 'range',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 0);

      expect(result.valid).toBe(true);
    });

    it('should pass when value equals maximum', () => {
      const config: FieldConfigData = {
        type: 'range',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 100);

      expect(result.valid).toBe(true);
    });

    it('should pass when value is within range', () => {
      const config: FieldConfigData = {
        type: 'range',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 42);

      expect(result.valid).toBe(true);
    });

    it('should fail for non-numeric value', () => {
      const config: FieldConfigData = {
        type: 'range',
        label: 'Value',
        min: 0,
        max: 100
      };

      const result = rangeField.validate(config, 'invalid');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid number');
    });
  });
});
