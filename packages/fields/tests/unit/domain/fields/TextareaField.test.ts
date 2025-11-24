import { describe, it, expect, beforeEach } from 'vitest';
import { TextareaField } from '../../../../src/domain/fields/TextareaField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('TextareaField', () => {
  let textareaField: TextareaField;

  beforeEach(() => {
    textareaField = new TextareaField();
  });

  describe('render', () => {
    it('should render a textarea element', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        label: 'Description'
      };

      const element = textareaField.render(config, '');

      expect(element.tagName).toBe('TEXTAREA');
    });

    it('should set value from data', () => {
      const config: FieldConfigData = { type: 'textarea' };
      const element = textareaField.render(config, 'Sample text') as HTMLTextAreaElement;

      expect(element.value).toBe('Sample text');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        defaultValue: 'Default content'
      };

      const element = textareaField.render(config, '') as HTMLTextAreaElement;

      expect(element.value).toBe('Default content');
    });

    it('should apply placeholder', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        placeholder: 'Enter description...'
      };

      const element = textareaField.render(config, '');

      expect(element.getAttribute('placeholder')).toBe('Enter description...');
    });

    it('should apply rows attribute', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        rows: 5
      };

      const element = textareaField.render(config, '') as HTMLTextAreaElement;

      // happy-dom returns rows as string
      expect(element.rows).toBe('5');
    });

    it('should apply maxLength attribute', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        maxLength: 500
      };

      const element = textareaField.render(config, '');

      expect(element.getAttribute('maxlength')).toBe('500');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        required: true
      };

      const element = textareaField.render(config, '') as HTMLTextAreaElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        className: 'custom-textarea'
      };

      const element = textareaField.render(config, '');

      expect(element.classList.contains('custom-textarea')).toBe(true);
    });

    it('should default to 3 rows when not specified', () => {
      const config: FieldConfigData = { type: 'textarea' };
      const element = textareaField.render(config, '') as HTMLTextAreaElement;

      // happy-dom returns rows as string
      expect(element.rows).toBe('3');
    });
  });

  describe('extract', () => {
    it('should extract value from textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'Multi-line\ntext content';

      const value = textareaField.extract(textarea);

      expect(value).toBe('Multi-line\ntext content');
    });

    it('should trim whitespace', () => {
      const textarea = document.createElement('textarea');
      textarea.value = '  Content with spaces  ';

      const value = textareaField.extract(textarea);

      expect(value).toBe('Content with spaces');
    });

    it('should return empty string for empty textarea', () => {
      const textarea = document.createElement('textarea');
      textarea.value = '';

      const value = textareaField.extract(textarea);

      expect(value).toBe('');
    });

    it('should preserve line breaks', () => {
      const textarea = document.createElement('textarea');
      textarea.value = 'Line 1\nLine 2\nLine 3';

      const value = textareaField.extract(textarea);

      expect(value).toBe('Line 1\nLine 2\nLine 3');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid value', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        required: true
      };

      const result = textareaField.validate(config, 'Valid content');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        label: 'Description',
        required: true
      };

      const result = textareaField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should validate minLength', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        label: 'Bio',
        minLength: 50
      };

      const result = textareaField.validate(config, 'Too short');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('50');
    });

    it('should validate maxLength', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        label: 'Summary',
        maxLength: 10
      };

      const result = textareaField.validate(config, 'This is way too long for the limit');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('10');
    });

    it('should pass when value is within length range', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        minLength: 5,
        maxLength: 100
      };

      const result = textareaField.validate(config, 'This is a valid length');

      expect(result.valid).toBe(true);
    });

    it('should skip optional validations for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'textarea',
        required: false,
        minLength: 10
      };

      const result = textareaField.validate(config, '');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
