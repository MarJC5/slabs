import { describe, it, expect, beforeEach } from 'vitest';
import { BooleanField } from '../../../../src/domain/fields/BooleanField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('BooleanField', () => {
  let booleanField: BooleanField;

  beforeEach(() => {
    booleanField = new BooleanField();
  });

  describe('render - checkbox display', () => {
    it('should render a label container with checkbox input by default', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Enable Feature'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]');

      expect(element.tagName).toBe('LABEL');
      expect(element.classList.contains('slabs-field__boolean-checkbox')).toBe(true);
      expect(input).not.toBeNull();
    });

    it('should render checkbox when display is explicitly set to checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Enable Feature',
        display: 'checkbox'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]');

      expect(element.classList.contains('slabs-field__boolean-checkbox')).toBe(true);
      expect(input).not.toBeNull();
    });

    it('should set checked state from boolean true value for checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox'
      };

      const element = booleanField.render(config, true);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should set unchecked state for false value for checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
    });
  });

  describe('render - switch display', () => {
    it('should render a switch container when display is set to switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Enable Feature',
        display: 'switch'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]');
      const slider = element.querySelector('.slabs-field__boolean-slider');

      expect(element.tagName).toBe('LABEL');
      expect(element.classList.contains('slabs-field__boolean-switch')).toBe(true);
      expect(input).not.toBeNull();
      expect(slider).not.toBeNull();
    });

    it('should set checked state from boolean true value for switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch'
      };

      const element = booleanField.render(config, true);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should set unchecked state for false value for switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
    });
  });

  describe('render - default values', () => {
    it('should use defaultValue when value is undefined for checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox',
        defaultValue: true
      };

      const element = booleanField.render(config, undefined);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should use defaultValue when value is undefined for switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch',
        defaultValue: true
      };

      const element = booleanField.render(config, undefined);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should default to false when no value or defaultValue', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test'
      };

      const element = booleanField.render(config, undefined);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
    });
  });

  describe('render - attributes', () => {
    it('should apply required attribute for checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox',
        required: true
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.required).toBe(true);
    });

    it('should apply required attribute for switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch',
        required: true
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.required).toBe(true);
    });

    it('should apply custom className for checkbox', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox',
        className: 'custom-boolean'
      };

      const element = booleanField.render(config, false);

      expect(element.classList.contains('custom-boolean')).toBe(true);
    });

    it('should apply custom className for switch', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch',
        className: 'custom-boolean'
      };

      const element = booleanField.render(config, false);

      expect(element.classList.contains('custom-boolean')).toBe(true);
    });
  });

  describe('render - value coercion', () => {
    it('should handle truthy string values', () => {
      const config: FieldConfigData = { type: 'boolean', label: 'Test' };
      const element = booleanField.render(config, 'true');
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should handle number 1 as true', () => {
      const config: FieldConfigData = { type: 'boolean', label: 'Test' };
      const element = booleanField.render(config, 1);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
    });

    it('should handle number 0 as false', () => {
      const config: FieldConfigData = { type: 'boolean', label: 'Test' };
      const element = booleanField.render(config, 0);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
    });
  });

  describe('extract', () => {
    it('should extract true for checked checkbox display', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.checked = true;

      const value = booleanField.extract(element);

      expect(value).toBe(true);
    });

    it('should extract false for unchecked checkbox display', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'checkbox'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.checked = false;

      const value = booleanField.extract(element);

      expect(value).toBe(false);
    });

    it('should extract true for checked switch display', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.checked = true;

      const value = booleanField.extract(element);

      expect(value).toBe(true);
    });

    it('should extract false for unchecked switch display', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Test',
        display: 'switch'
      };

      const element = booleanField.render(config, false);
      const input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.checked = false;

      const value = booleanField.extract(element);

      expect(value).toBe(false);
    });

    it('should return false for non-checkbox element', () => {
      const input = document.createElement('input');
      input.type = 'text';

      const value = booleanField.extract(input);

      expect(value).toBe(false);
    });
  });

  describe('validate', () => {
    it('should pass validation for checked required boolean', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        required: true
      };

      const result = booleanField.validate(config, true);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for unchecked required boolean', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        label: 'Accept Terms',
        required: true
      };

      const result = booleanField.validate(config, false);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('must be checked');
    });

    it('should pass for unchecked non-required boolean', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        required: false
      };

      const result = booleanField.validate(config, false);

      expect(result.valid).toBe(true);
    });

    it('should pass for checked non-required boolean', () => {
      const config: FieldConfigData = {
        type: 'boolean',
        required: false
      };

      const result = booleanField.validate(config, true);

      expect(result.valid).toBe(true);
    });
  });
});
