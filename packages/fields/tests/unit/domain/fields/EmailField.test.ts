import { describe, it, expect, beforeEach } from 'vitest';
import { EmailField } from '../../../../src/domain/fields/EmailField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('EmailField', () => {
  let emailField: EmailField;

  beforeEach(() => {
    emailField = new EmailField();
  });

  describe('render', () => {
    it('should render an input element with type email', () => {
      const config: FieldConfigData = {
        type: 'email',
        label: 'Email Address'
      };

      const element = emailField.render(config, '');

      expect(element.tagName).toBe('INPUT');
      expect(element.getAttribute('type')).toBe('email');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'email' };
      const element = emailField.render(config, 'user@example.com') as HTMLInputElement;

      expect(element.value).toBe('user@example.com');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'email',
        defaultValue: 'default@example.com'
      };

      const element = emailField.render(config, '') as HTMLInputElement;

      expect(element.value).toBe('default@example.com');
    });

    it('should apply placeholder', () => {
      const config: FieldConfigData = {
        type: 'email',
        placeholder: 'Enter your email...'
      };

      const element = emailField.render(config, '');

      expect(element.getAttribute('placeholder')).toBe('Enter your email...');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'email',
        required: true
      };

      const element = emailField.render(config, '') as HTMLInputElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'email',
        className: 'custom-email'
      };

      const element = emailField.render(config, '');

      expect(element.classList.contains('custom-email')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract value from input', () => {
      const input = document.createElement('input');
      input.value = 'test@example.com';

      const value = emailField.extract(input);

      expect(value).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const input = document.createElement('input');
      input.value = '  user@example.com  ';

      const value = emailField.extract(input);

      expect(value).toBe('user@example.com');
    });

    it('should return empty string for empty input', () => {
      const input = document.createElement('input');
      input.value = '';

      const value = emailField.extract(input);

      expect(value).toBe('');
    });

    it('should convert to lowercase', () => {
      const input = document.createElement('input');
      input.value = 'USER@EXAMPLE.COM';

      const value = emailField.extract(input);

      expect(value).toBe('user@example.com');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid email', () => {
      const config: FieldConfigData = {
        type: 'email',
        required: true
      };

      const result = emailField.validate(config, 'user@example.com');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'email',
        label: 'Email',
        required: true
      };

      const result = emailField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should fail for invalid email format', () => {
      const config: FieldConfigData = {
        type: 'email',
        label: 'Email'
      };

      const result = emailField.validate(config, 'invalid-email');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid email');
    });

    it('should accept valid email formats', () => {
      const config: FieldConfigData = { type: 'email' };
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'user_name@example-domain.com'
      ];

      validEmails.forEach(email => {
        const result = emailField.validate(config, email);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const config: FieldConfigData = { type: 'email' };
      const invalidEmails = [
        'plaintext',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        'user..name@example.com'
      ];

      invalidEmails.forEach(email => {
        const result = emailField.validate(config, email);
        expect(result.valid).toBe(false);
      });
    });

    it('should skip validation for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'email',
        required: false
      };

      const result = emailField.validate(config, '');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});