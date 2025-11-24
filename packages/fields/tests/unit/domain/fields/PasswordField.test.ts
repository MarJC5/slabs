import { describe, it, expect, beforeEach } from 'vitest';
import { PasswordField } from '../../../../src/domain/fields/PasswordField';
import type { FieldConfigData, ValidationResult } from '../../../../src/domain/types';

describe('PasswordField', () => {
  let passwordField: PasswordField;

  beforeEach(() => {
    passwordField = new PasswordField();
  });

  describe('render', () => {
    it('should render an input element with type password', () => {
      const config: FieldConfigData = {
        type: 'password',
        label: 'Password'
      };

      const element = passwordField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('password');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'password' };
      const element = passwordField.render(config, 'secret123') as HTMLInputElement;

      expect(element.value).toBe('secret123');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'password',
        defaultValue: 'defaultpass'
      };

      const element = passwordField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('defaultpass');
    });

    it('should apply placeholder', () => {
      const config: FieldConfigData = {
        type: 'password',
        placeholder: 'Enter password...'
      };

      const element = passwordField.render(config, '');

      expect(element.getAttribute('placeholder')).toBe('Enter password...');
    });

    it('should apply maxLength attribute', () => {
      const config: FieldConfigData = {
        type: 'password',
        maxLength: 50
      };

      const element = passwordField.render(config, '');

      expect(element.getAttribute('maxlength')).toBe('50');
    });

    it('should apply minLength attribute', () => {
      const config: FieldConfigData = {
        type: 'password',
        minLength: 8
      };

      const element = passwordField.render(config, '');

      expect(element.getAttribute('minlength')).toBe('8');
    });

    it('should mark field as required', () => {
      const config: FieldConfigData = {
        type: 'password',
        required: true
      };

      const element = passwordField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'password',
        className: 'custom-password'
      };

      const element = passwordField.render(config, '');

      expect(element.classList.contains('custom-password')).toBe(true);
    });

    it('should apply autocomplete attribute', () => {
      const config: FieldConfigData = {
        type: 'password',
        autocomplete: 'current-password'
      };

      const element = passwordField.render(config, '');

      expect(element.getAttribute('autocomplete')).toBe('current-password');
    });
  });

  describe('extract', () => {
    it('should extract value from input element', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.value = 'mypassword';

      const value = passwordField.extract(input);

      expect(value).toBe('mypassword');
    });

    it('should return empty string for non-input elements', () => {
      const div = document.createElement('div');

      const value = passwordField.extract(div);

      expect(value).toBe('');
    });

    it('should preserve password value without trimming', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.value = ' pass word ';

      const value = passwordField.extract(input);

      expect(value).toBe(' pass word ');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid password', () => {
      const config: FieldConfigData = {
        type: 'password',
        required: true
      };

      const result: ValidationResult = passwordField.validate(config, 'validPassword123');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when required field is empty', () => {
      const config: FieldConfigData = {
        type: 'password',
        label: 'Password',
        required: true
      };

      const result: ValidationResult = passwordField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REQUIRED');
      expect(result.errors[0].message).toBe('Password is required');
    });

    it('should pass validation when optional field is empty', () => {
      const config: FieldConfigData = {
        type: 'password',
        required: false
      };

      const result: ValidationResult = passwordField.validate(config, '');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when password is too short', () => {
      const config: FieldConfigData = {
        type: 'password',
        label: 'Password',
        minLength: 8
      };

      const result: ValidationResult = passwordField.validate(config, 'short');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MIN_LENGTH');
      expect(result.errors[0].message).toBe('Password must be at least 8 characters');
    });

    it('should pass validation when password meets minLength', () => {
      const config: FieldConfigData = {
        type: 'password',
        minLength: 8
      };

      const result: ValidationResult = passwordField.validate(config, 'password123');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation when password is too long', () => {
      const config: FieldConfigData = {
        type: 'password',
        label: 'Password',
        maxLength: 20
      };

      const longPassword = 'a'.repeat(25);
      const result: ValidationResult = passwordField.validate(config, longPassword);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MAX_LENGTH');
      expect(result.errors[0].message).toBe('Password cannot exceed 20 characters');
    });

    it('should pass validation when password is within maxLength', () => {
      const config: FieldConfigData = {
        type: 'password',
        maxLength: 20
      };

      const result: ValidationResult = passwordField.validate(config, 'validpass');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle null and undefined values', () => {
      const config: FieldConfigData = {
        type: 'password',
        required: false
      };

      const resultNull: ValidationResult = passwordField.validate(config, null);
      const resultUndefined: ValidationResult = passwordField.validate(config, undefined);

      expect(resultNull.valid).toBe(true);
      expect(resultUndefined.valid).toBe(true);
    });

    it('should accumulate multiple validation errors', () => {
      const config: FieldConfigData = {
        type: 'password',
        label: 'Password',
        required: true,
        minLength: 8
      };

      const result: ValidationResult = passwordField.validate(config, 'abc');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('MIN_LENGTH');
    });

    it('should use "Field" as default label', () => {
      const config: FieldConfigData = {
        type: 'password',
        required: true
      };

      const result: ValidationResult = passwordField.validate(config, '');

      expect(result.errors[0].message).toBe('Field is required');
    });
  });
});
