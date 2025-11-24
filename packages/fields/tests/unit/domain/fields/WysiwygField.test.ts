import { describe, it, expect, beforeEach } from 'vitest';
import { WysiwygField } from '../../../../src/domain/fields/WysiwygField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('WysiwygField', () => {
  let wysiwygField: WysiwygField;

  beforeEach(() => {
    wysiwygField = new WysiwygField();
  });

  describe('render', () => {
    it('should render editor container with wysiwyg class', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Content'
      };

      const element = wysiwygField.render(config, '');

      expect(element.tagName).toBe('DIV');
      expect(element.classList.contains('slabs-wysiwyg')).toBe(true);
    });

    it('should have data-field-type attribute', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Article Content'
      };

      const element = wysiwygField.render(config, '');

      expect(element.dataset.fieldType).toBe('wysiwyg');
    });

    it('should render contentEditable editor', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg'
      };

      const element = wysiwygField.render(config, '');
      const editor = element.querySelector('.slabs-wysiwyg__editor') as HTMLElement;

      expect(editor).toBeTruthy();
      expect(editor.contentEditable).toBe('true');
    });

    it('should set value as HTML content', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg'
      };

      const element = wysiwygField.render(config, '<b>Bold text</b>');
      const editor = element.querySelector('.slabs-wysiwyg__editor') as HTMLElement;

      expect(editor.innerHTML).toBe('<b>Bold text</b>');
    });

    it('should set placeholder as data attribute', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        placeholder: 'Enter content...'
      };

      const element = wysiwygField.render(config, '');
      const editor = element.querySelector('.slabs-wysiwyg__editor') as HTMLElement;

      expect(editor.dataset.placeholder).toBe('Enter content...');
    });

    it('should render minimal toolbar by default', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg'
      };

      const element = wysiwygField.render(config, '');
      const toolbar = element.querySelector('.slabs-wysiwyg__toolbar');
      const tools = toolbar?.querySelectorAll('.slabs-wysiwyg__tool');

      expect(toolbar).toBeTruthy();
      // Minimal: Bold, Italic, Link
      expect(tools?.length).toBe(3);
    });

    it('should render full toolbar when mode is full', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        mode: 'full'
      };

      const element = wysiwygField.render(config, '');
      const toolbar = element.querySelector('.slabs-wysiwyg__toolbar');
      const tools = toolbar?.querySelectorAll('.slabs-wysiwyg__tool');

      expect(toolbar).toBeTruthy();
      // Full: Bold, Italic, Underline, Strikethrough, Link, H1, H2, H3, UL, OL
      expect(tools?.length).toBe(10);
    });

    it('should show toolbar always', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg'
      };

      const element = wysiwygField.render(config, '');
      const toolbar = element.querySelector('.slabs-wysiwyg__toolbar') as HTMLElement;

      expect(toolbar).toBeTruthy();
      // Toolbar should be visible by default (display: flex in CSS)
    });
  });

  describe('extract', () => {
    it('should extract HTML content from editor', () => {
      const wrapper = document.createElement('div');
      const editor = document.createElement('div');
      editor.className = 'slabs-wysiwyg__editor';
      editor.innerHTML = '<b>Bold text</b> and <i>italic</i>';
      wrapper.appendChild(editor);

      const value = wysiwygField.extract(wrapper);

      expect(value).toBe('<b>Bold text</b> and <i>italic</i>');
    });

    it('should return empty string when editor not found', () => {
      const wrapper = document.createElement('div');

      const value = wysiwygField.extract(wrapper);

      expect(value).toBe('');
    });

    it('should return empty string when content matches placeholder', () => {
      const wrapper = document.createElement('div');
      const editor = document.createElement('div');
      editor.className = 'slabs-wysiwyg__editor';
      editor.setAttribute('data-placeholder', 'Enter text...');
      editor.innerHTML = 'Enter text...';
      wrapper.appendChild(editor);

      const value = wysiwygField.extract(wrapper);

      expect(value).toBe('');
    });

    it('should return empty string when content is empty', () => {
      const wrapper = document.createElement('div');
      const editor = document.createElement('div');
      editor.className = 'slabs-wysiwyg__editor';
      editor.textContent = '   ';
      wrapper.appendChild(editor);

      const value = wysiwygField.extract(wrapper);

      expect(value).toBe('');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid HTML content', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        required: true
      };

      const result = wysiwygField.validate(config, '<b>Valid content</b>');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Content',
        required: true
      };

      const result = wysiwygField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should fail for HTML with only whitespace when required', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Content',
        required: true
      };

      const result = wysiwygField.validate(config, '<p>   </p>');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should validate minLength on text content (not HTML)', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Article',
        minLength: 10
      };

      const result = wysiwygField.validate(config, '<b>Short</b>');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('10');
    });

    it('should validate maxLength on text content (not HTML)', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Summary',
        maxLength: 5
      };

      const result = wysiwygField.validate(config, '<b>This is too long</b>');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('5');
    });

    it('should pass minLength validation with valid content', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        minLength: 5
      };

      const result = wysiwygField.validate(config, '<b>Valid content here</b>');

      expect(result.valid).toBe(true);
    });

    it('should pass maxLength validation with valid content', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        maxLength: 100
      };

      const result = wysiwygField.validate(config, '<b>Short</b>');

      expect(result.valid).toBe(true);
    });

    it('should strip HTML tags for length validation', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        minLength: 10
      };

      // HTML: 25 chars, Text: 11 chars
      const result = wysiwygField.validate(config, '<b>Hello World</b>');

      expect(result.valid).toBe(true);
    });

    it('should skip optional validations for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        required: false,
        minLength: 10
      };

      const result = wysiwygField.validate(config, '');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle multiple validation errors', () => {
      const config: FieldConfigData = {
        type: 'wysiwyg',
        label: 'Content',
        required: true,
        minLength: 10
      };

      const result = wysiwygField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
