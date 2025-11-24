import { describe, it, expect, beforeEach } from 'vitest';
import { ColorField } from '../../../../src/domain/fields/ColorField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('ColorField', () => {
  let colorField: ColorField;

  beforeEach(() => {
    colorField = new ColorField();
  });

  describe('render', () => {
    it('should render an input element with type color', () => {
      const config: FieldConfigData = {
        type: 'color',
        label: 'Brand Color'
      };

      const element = colorField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('color');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'color' };
      const element = colorField.render(config, '#ff5733') as HTMLInputElement;

      expect(element.value).toBe('#ff5733');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'color',
        defaultValue: '#0066cc'
      };

      const element = colorField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('#0066cc');
    });

    it('should default to black when no value or defaultValue', () => {
      const config: FieldConfigData = { type: 'color' };
      const element = colorField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('#000000');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'color',
        required: true
      };

      const element = colorField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'color',
        className: 'custom-color'
      };

      const element = colorField.render(config, '');

      expect(element.classList.contains('custom-color')).toBe(true);
    });

    it('should normalize color to lowercase hex', () => {
      const config: FieldConfigData = { type: 'color' };
      const element = colorField.render(config, '#FF5733') as HTMLInputElement;

      expect(element.value).toBe('#ff5733');
    });

    it('should handle 3-digit hex colors', () => {
      const config: FieldConfigData = { type: 'color' };
      const element = colorField.render(config, '#f00') as HTMLInputElement;

      expect(element.value).toBe('#ff0000');
    });
  });

  describe('extract', () => {
    it('should extract color value from input', () => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = '#3498db';

      const value = colorField.extract(input);

      expect(value).toBe('#3498db');
    });

    it('should return default black for empty input', () => {
      const input = document.createElement('input');
      input.type = 'color';
      input.value = '';

      const value = colorField.extract(input);

      expect(value).toBe('#000000');
    });

    it('should return black for non-color input', () => {
      const input = document.createElement('input');
      input.type = 'text';

      const value = colorField.extract(input);

      expect(value).toBe('#000000');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid hex color', () => {
      const config: FieldConfigData = {
        type: 'color',
        required: true
      };

      const result = colorField.validate(config, '#ff5733');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for 3-digit hex color', () => {
      const config: FieldConfigData = {
        type: 'color'
      };

      const result = colorField.validate(config, '#f00');

      expect(result.valid).toBe(true);
    });

    it('should pass for 6-digit hex color', () => {
      const config: FieldConfigData = {
        type: 'color'
      };

      const result = colorField.validate(config, '#ff0000');

      expect(result.valid).toBe(true);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'color',
        label: 'Theme Color',
        required: true
      };

      const result = colorField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'color',
        required: false
      };

      const result = colorField.validate(config, '');

      expect(result.valid).toBe(true);
    });

    it('should fail for invalid hex format', () => {
      const config: FieldConfigData = {
        type: 'color',
        label: 'Color'
      };

      const result = colorField.validate(config, 'red');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid hex color');
    });

    it('should fail for hex without hash', () => {
      const config: FieldConfigData = {
        type: 'color',
        label: 'Color'
      };

      const result = colorField.validate(config, 'ff5733');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid hex color');
    });

    it('should fail for invalid hex length', () => {
      const config: FieldConfigData = {
        type: 'color',
        label: 'Color'
      };

      const result = colorField.validate(config, '#ff57');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid hex color');
    });

    it('should accept uppercase hex', () => {
      const config: FieldConfigData = {
        type: 'color'
      };

      const result = colorField.validate(config, '#FF5733');

      expect(result.valid).toBe(true);
    });
  });
});
