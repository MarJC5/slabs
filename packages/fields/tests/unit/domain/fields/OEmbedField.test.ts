import { describe, it, expect, beforeEach } from 'vitest';
import { OEmbedField } from '../../../../src/domain/fields/OEmbedField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('OEmbedField', () => {
  let oembedField: OEmbedField;

  beforeEach(() => {
    oembedField = new OEmbedField();
  });

  describe('render', () => {
    it('should render an input with type="url"', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input.type).toBe('url');
      expect(input.classList.contains('slabs-field__input')).toBe(true);
    });

    it('should render with placeholder text', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).toBe('Paste YouTube, Vimeo, or Twitter URL...');
    });

    it('should populate input with provided URL', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const value = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        service: 'youtube'
      };

      const element = oembedField.render(config, value);
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('should show preview when value is provided', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const value = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        service: 'youtube'
      };

      const element = oembedField.render(config, value);
      const preview = element.querySelector('.slabs-field__oembed-preview');
      expect(preview).not.toBeNull();
    });

    it('should apply required attribute if configured', () => {
      const config: FieldConfigData = {
        type: 'oembed',
        required: true
      };

      const element = oembedField.render(config, null);
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.required).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract URL from input', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

      const value = oembedField.extract(element);
      expect(value.url).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    it('should detect YouTube service', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

      const value = oembedField.extract(element);
      expect(value.service).toBe('youtube');
    });

    it('should detect Vimeo service', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = 'https://vimeo.com/123456789';

      const value = oembedField.extract(element);
      expect(value.service).toBe('vimeo');
    });

    it('should detect Twitter service', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = 'https://twitter.com/user/status/123456789';

      const value = oembedField.extract(element);
      expect(value.service).toBe('twitter');
    });

    it('should return unknown service for unsupported URLs', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = 'https://example.com/video';

      const value = oembedField.extract(element);
      expect(value.service).toBe('unknown');
    });

    it('should trim whitespace from URL', () => {
      const config: FieldConfigData = { type: 'oembed' };
      const element = oembedField.render(config, null);

      const input = element.querySelector('input') as HTMLInputElement;
      input.value = '  https://www.youtube.com/watch?v=test  ';

      const value = oembedField.extract(element);
      expect(value.url).toBe('https://www.youtube.com/watch?v=test');
    });
  });

  describe('validate', () => {
    it('should validate required field', () => {
      const config: FieldConfigData = {
        type: 'oembed',
        required: true,
        label: 'Video'
      };

      const result = oembedField.validate(config, { url: '', service: 'unknown' });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('REQUIRED');
      expect(result.errors[0].message).toContain('Video is required');
    });

    it('should validate URL format', () => {
      const config: FieldConfigData = { type: 'oembed' };

      const result = oembedField.validate(config, { url: 'not-a-url', service: 'unknown' });

      expect(result.valid).toBe(false);
      expect(result.errors[0].code).toBe('INVALID_URL');
    });

    it('should accept valid HTTP URLs', () => {
      const config: FieldConfigData = { type: 'oembed' };

      const result = oembedField.validate(config, {
        url: 'http://www.youtube.com/watch?v=test',
        service: 'youtube'
      });

      expect(result.valid).toBe(true);
    });

    it('should accept valid HTTPS URLs', () => {
      const config: FieldConfigData = { type: 'oembed' };

      const result = oembedField.validate(config, {
        url: 'https://www.youtube.com/watch?v=test',
        service: 'youtube'
      });

      expect(result.valid).toBe(true);
    });

    it('should skip validation for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'oembed',
        required: false
      };

      const result = oembedField.validate(config, { url: '', service: 'unknown' });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn about unsupported service', () => {
      const config: FieldConfigData = { type: 'oembed' };

      const result = oembedField.validate(config, {
        url: 'https://example.com/video',
        service: 'unknown'
      });

      expect(result.valid).toBe(true); // Valid URL, just warning
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('UNSUPPORTED_SERVICE');
    });
  });
});