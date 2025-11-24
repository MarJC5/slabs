import { describe, it, expect, beforeEach } from 'vitest';
import { CheckboxField } from '../../../../src/domain/fields/CheckboxField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('CheckboxField', () => {
  let checkboxField: CheckboxField;

  beforeEach(() => {
    checkboxField = new CheckboxField();
  });

  describe('render', () => {
    it('should render an input element with type checkbox', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        label: 'Featured'
      };

      const element = checkboxField.render(config, false);

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('checkbox');
    });

    it('should set checked state from boolean value', () => {
      const config: FieldConfigData = { type: 'checkbox' };
      const element = checkboxField.render(config, true) as HTMLInputElement;

      expect(element.checked).toBe(true);
    });

    it('should set unchecked state for false value', () => {
      const config: FieldConfigData = { type: 'checkbox' };
      const element = checkboxField.render(config, false) as HTMLInputElement;

      expect(element.checked).toBe(false);
    });

    it('should use defaultValue when value is undefined', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        defaultValue: true
      };

      const element = checkboxField.render(config, undefined) as HTMLInputElement;

      expect(element.checked).toBe(true);
    });

    it('should default to unchecked when no value or defaultValue', () => {
      const config: FieldConfigData = { type: 'checkbox' };
      const element = checkboxField.render(config, undefined) as HTMLInputElement;

      expect(element.checked).toBe(false);
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        required: true
      };

      const element = checkboxField.render(config, false) as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        className: 'custom-checkbox'
      };

      const element = checkboxField.render(config, false);

      expect(element.classList.contains('custom-checkbox')).toBe(true);
    });

    it('should handle truthy string values', () => {
      const config: FieldConfigData = { type: 'checkbox' };
      const element = checkboxField.render(config, 'true') as HTMLInputElement;

      expect(element.checked).toBe(true);
    });

    it('should handle number 1 as true', () => {
      const config: FieldConfigData = { type: 'checkbox' };
      const element = checkboxField.render(config, 1) as HTMLInputElement;

      expect(element.checked).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract true for checked checkbox', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;

      const value = checkboxField.extract(input);

      expect(value).toBe(true);
    });

    it('should extract false for unchecked checkbox', () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = false;

      const value = checkboxField.extract(input);

      expect(value).toBe(false);
    });

    it('should return false for non-checkbox element', () => {
      const input = document.createElement('input');
      input.type = 'text';

      const value = checkboxField.extract(input);

      expect(value).toBe(false);
    });
  });

  describe('validate', () => {
    it('should pass validation for checked required checkbox', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        required: true
      };

      const result = checkboxField.validate(config, true);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for unchecked required checkbox', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        label: 'Accept Terms',
        required: true
      };

      const result = checkboxField.validate(config, false);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('must be checked');
    });

    it('should pass for unchecked non-required checkbox', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        required: false
      };

      const result = checkboxField.validate(config, false);

      expect(result.valid).toBe(true);
    });

    it('should pass for checked non-required checkbox', () => {
      const config: FieldConfigData = {
        type: 'checkbox',
        required: false
      };

      const result = checkboxField.validate(config, true);

      expect(result.valid).toBe(true);
    });
  });
});
