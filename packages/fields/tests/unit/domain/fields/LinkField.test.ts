import { describe, it, expect, beforeEach } from 'vitest';
import { LinkField } from '../../../../src/domain/fields/LinkField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('LinkField', () => {
  let linkField: LinkField;

  beforeEach(() => {
    linkField = new LinkField();
  });

  describe('render', () => {
    it('should render a container with url, title, and target inputs', () => {
      const config: FieldConfigData = {
        type: 'link',
        label: 'Link'
      };

      const element = linkField.render(config, null);

      expect(element.tagName).toBe('DIV');
      expect(element.classList.contains('slabs-field-link')).toBe(true);

      const inputs = element.querySelectorAll('input');
      expect(inputs.length).toBe(2); // url and title

      const select = element.querySelector('select');
      expect(select).not.toBeNull();
    });

    it('should render url input with type="url"', () => {
      const config: FieldConfigData = { type: 'link' };
      const element = linkField.render(config, null);

      const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
      expect(urlInput).not.toBeNull();
      expect(urlInput.type).toBe('url');
      expect(urlInput.placeholder).toBe('https://example.com');
    });

    it('should render title input with type="text"', () => {
      const config: FieldConfigData = { type: 'link' };
      const element = linkField.render(config, null);

      const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;
      expect(titleInput).not.toBeNull();
      expect(titleInput.type).toBe('text');
      expect(titleInput.placeholder).toBe('Link text');
    });

    it('should render target select with _self as default', () => {
      const config: FieldConfigData = { type: 'link' };
      const element = linkField.render(config, null);

      const targetSelect = element.querySelector('select[name="target"]') as HTMLSelectElement;
      expect(targetSelect).not.toBeNull();
      expect(targetSelect.value).toBe('_self');

      const options = targetSelect.querySelectorAll('option');
      expect(options.length).toBe(2);
      expect(options[0].value).toBe('_self');
      expect(options[1].value).toBe('_blank');
    });

    it('should populate fields with provided value', () => {
      const config: FieldConfigData = { type: 'link' };
      const value = {
        url: 'https://example.com',
        title: 'Example Link',
        target: '_blank'
      };

      const element = linkField.render(config, value);

      const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
      const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;
      const targetSelect = element.querySelector('select[name="target"]') as HTMLSelectElement;

      expect(urlInput.value).toBe('https://example.com');
      expect(titleInput.value).toBe('Example Link');
      expect(targetSelect.value).toBe('_blank');
    });

    it('should use default values when value is null', () => {
      const config: FieldConfigData = {
        type: 'link',
        defaultValue: {
          url: 'https://default.com',
          title: 'Default Title',
          target: '_self'
        }
      };

      const element = linkField.render(config, null);

      const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
      const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;
      const targetSelect = element.querySelector('select[name="target"]') as HTMLSelectElement;

      expect(urlInput.value).toBe('https://default.com');
      expect(titleInput.value).toBe('Default Title');
      expect(targetSelect.value).toBe('_self');
    });

    it('should apply className to container if provided', () => {
      const config: FieldConfigData = {
        type: 'link',
        className: 'custom-link-field'
      };

      const element = linkField.render(config, null);
      expect(element.classList.contains('custom-link-field')).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract url, title, and target from container', () => {
      const config: FieldConfigData = { type: 'link' };
      const element = linkField.render(config, null);

      const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
      const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;
      const targetSelect = element.querySelector('select[name="target"]') as HTMLSelectElement;

      urlInput.value = 'https://example.com';
      titleInput.value = 'Example Link';
      targetSelect.value = '_blank';

      const value = linkField.extract(element);

      expect(value).toEqual({
        url: 'https://example.com',
        title: 'Example Link',
        target: '_blank'
      });
    });

    it('should trim whitespace from url and title', () => {
      const config: FieldConfigData = { type: 'link' };
      const element = linkField.render(config, null);

      const urlInput = element.querySelector('input[name="url"]') as HTMLInputElement;
      const titleInput = element.querySelector('input[name="title"]') as HTMLInputElement;

      urlInput.value = '  https://example.com  ';
      titleInput.value = '  Example Link  ';

      const value = linkField.extract(element);

      expect(value.url).toBe('https://example.com');
      expect(value.title).toBe('Example Link');
    });

    it('should default target to _self if not found', () => {
      const container = document.createElement('div');
      const value = linkField.extract(container);

      expect(value.target).toBe('_self');
    });
  });

  describe('validate', () => {
    it('should validate required url field', () => {
      const config: FieldConfigData = {
        type: 'link',
        required: true,
        label: 'Link'
      };

      const result = linkField.validate(config, { url: '', title: 'Test Title', target: '_self' });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REQUIRED');
      expect(result.errors[0].message).toContain('URL is required');
    });

    it('should validate required title field', () => {
      const config: FieldConfigData = {
        type: 'link',
        required: true,
        label: 'Link'
      };

      const result = linkField.validate(config, { url: 'https://example.com', title: '', target: '_self' });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REQUIRED');
      expect(result.errors[0].message).toContain('Title is required');
    });

    it('should validate url format', () => {
      const config: FieldConfigData = { type: 'link' };
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com', // only http/https allowed
        'javascript:alert(1)', // dangerous protocol
        '//example.com' // protocol-relative
      ];

      invalidUrls.forEach(url => {
        const result = linkField.validate(config, { url, title: 'Test', target: '_self' });
        expect(result.valid).toBe(false);
        expect(result.errors[0].code).toBe('INVALID_URL');
      });
    });

    it('should accept valid http and https urls', () => {
      const config: FieldConfigData = { type: 'link' };
      const validUrls = [
        'http://example.com',
        'https://example.com',
        'https://subdomain.example.com',
        'https://example.com/path',
        'https://example.com/path?query=value',
        'https://example.com/path#anchor'
      ];

      validUrls.forEach(url => {
        const result = linkField.validate(config, { url, title: 'Test', target: '_self' });
        expect(result.valid).toBe(true);
      });
    });

    it('should validate target is either _self or _blank', () => {
      const config: FieldConfigData = { type: 'link' };

      const resultInvalid = linkField.validate(config, {
        url: 'https://example.com',
        title: 'Test',
        target: '_parent' // invalid target
      });

      expect(resultInvalid.valid).toBe(false);
      expect(resultInvalid.errors[0].code).toBe('INVALID_TARGET');
    });

    it('should accept _self and _blank as valid targets', () => {
      const config: FieldConfigData = { type: 'link' };

      const resultSelf = linkField.validate(config, {
        url: 'https://example.com',
        title: 'Test',
        target: '_self'
      });

      const resultBlank = linkField.validate(config, {
        url: 'https://example.com',
        title: 'Test',
        target: '_blank'
      });

      expect(resultSelf.valid).toBe(true);
      expect(resultBlank.valid).toBe(true);
    });

    it('should skip validation for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'link',
        required: false
      };

      const result = linkField.validate(config, { url: '', title: '', target: '_self' });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return all validation errors when multiple fields are invalid', () => {
      const config: FieldConfigData = {
        type: 'link',
        required: true
      };

      const result = linkField.validate(config, {
        url: 'invalid-url',
        title: '',
        target: '_invalid'
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});