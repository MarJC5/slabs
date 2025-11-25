import { describe, it, expect, beforeEach } from 'vitest';
import { FileField } from '../../../../src/domain/fields/FileField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('FileField', () => {
  let fileField: FileField;

  beforeEach(() => {
    fileField = new FileField();
  });

  describe('render', () => {
    it('should render file field with file input', () => {
      const config: FieldConfigData = { type: 'file' };
      const element = fileField.render(config, null);

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.classList.contains('slabs-field-file')).toBe(true);

      const fileInput = element.querySelector('input[type="file"]');
      expect(fileInput).toBeInstanceOf(HTMLInputElement);
    });

    it('should apply accept attribute', () => {
      const config: FieldConfigData = {
        type: 'file',
        accept: '.pdf,.doc,.docx'
      };
      const element = fileField.render(config, null);

      const fileInput = element.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput.getAttribute('accept')).toBe('.pdf,.doc,.docx');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'file',
        required: true
      };
      const element = fileField.render(config, null);

      const fileInput = element.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput.required).toBe(true);
    });

    it('should render with empty value', () => {
      const config: FieldConfigData = { type: 'file' };
      const element = fileField.render(config, null);

      const fileInfo = element.querySelector('.slabs-field__file-info');
      expect(fileInfo?.classList.contains('slabs-field__file-info--hidden')).toBe(true);
    });

    it('should render with existing file value', () => {
      const config: FieldConfigData = { type: 'file' };
      const value = {
        name: 'document.pdf',
        url: 'https://example.com/document.pdf',
        size: 1024
      };
      const element = fileField.render(config, value);

      const fileName = element.querySelector('.slabs-field__file-name');
      expect(fileName?.textContent).toBe('document.pdf');

      const fileInfo = element.querySelector('.slabs-field__file-info');
      expect(fileInfo?.classList.contains('slabs-field__file-info--hidden')).toBe(false);
    });

    it('should render file size in human-readable format', () => {
      const config: FieldConfigData = { type: 'file' };
      const value = {
        name: 'large.pdf',
        url: 'data:application/pdf;base64,abc',
        size: 1048576 // 1 MB
      };
      const element = fileField.render(config, value);

      const fileSize = element.querySelector('.slabs-field__file-size');
      expect(fileSize?.textContent).toContain('MB');
    });

    it('should render remove button', () => {
      const config: FieldConfigData = { type: 'file' };
      const value = {
        name: 'file.pdf',
        url: 'https://example.com/file.pdf'
      };
      const element = fileField.render(config, value);

      const removeButton = element.querySelector('.slabs-field__file-remove');
      expect(removeButton).toBeInstanceOf(HTMLElement);
    });

    it('should render download link', () => {
      const config: FieldConfigData = { type: 'file' };
      const value = {
        name: 'file.pdf',
        url: 'https://example.com/file.pdf'
      };
      const element = fileField.render(config, value);

      const downloadLink = element.querySelector('.slabs-field__file-download');
      expect(downloadLink).toBeInstanceOf(HTMLAnchorElement);
      expect((downloadLink as HTMLAnchorElement).href).toBe('https://example.com/file.pdf');
    });
  });

  describe('extract', () => {
    it('should extract null when no file', () => {
      const config: FieldConfigData = { type: 'file' };
      const element = fileField.render(config, null);

      const value = fileField.extract(element);
      expect(value).toBeNull();
    });

    it('should extract file object with name, url, and size', () => {
      const config: FieldConfigData = { type: 'file' };
      const inputValue = {
        name: 'document.pdf',
        url: 'https://example.com/document.pdf',
        size: 2048
      };
      const element = fileField.render(config, inputValue);

      const value = fileField.extract(element);
      expect(value).toEqual(inputValue);
    });

    it('should extract data URL for uploaded files', () => {
      const config: FieldConfigData = { type: 'file' };
      const inputValue = {
        name: 'file.pdf',
        url: 'data:application/pdf;base64,JVBERi0xLjQK',
        size: 1024
      };
      const element = fileField.render(config, inputValue);

      const value = fileField.extract(element);
      expect(value.url).toContain('data:');
    });
  });

  describe('validate', () => {
    it('should validate required field', () => {
      const config: FieldConfigData = {
        type: 'file',
        required: true,
        label: 'Document'
      };

      const result = fileField.validate(config, null);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REQUIRED');
      expect(result.errors[0].message).toContain('Document is required');
    });

    it('should pass validation for non-required empty field', () => {
      const config: FieldConfigData = {
        type: 'file',
        required: false
      };

      const result = fileField.validate(config, null);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate maxSize', () => {
      const config: FieldConfigData = {
        type: 'file',
        maxSize: 1024, // 1 KB
        label: 'Document'
      };

      const value = {
        name: 'large.pdf',
        url: 'data:...',
        size: 2048 // 2 KB
      };

      const result = fileField.validate(config, value);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('FILE_TOO_LARGE');
    });

    it('should validate valid file', () => {
      const config: FieldConfigData = {
        type: 'file',
        required: true,
        maxSize: 5242880 // 5 MB
      };

      const value = {
        name: 'document.pdf',
        url: 'https://example.com/document.pdf',
        size: 1048576 // 1 MB
      };

      const result = fileField.validate(config, value);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});