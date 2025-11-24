import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageField } from '../../../../src/domain/fields/ImageField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('ImageField', () => {
  let imageField: ImageField;

  beforeEach(() => {
    imageField = new ImageField();
  });

  describe('render', () => {
    it('should render a container with file input', () => {
      const config: FieldConfigData = {
        type: 'image',
        label: 'Featured Image'
      };

      const element = imageField.render(config, '');

      expect(element.classList.contains('image-field')).toBe(true);
      const input = element.querySelector('input[type="file"]');
      expect(input).toBeTruthy();
    });

    it('should apply accept attribute for images', () => {
      const config: FieldConfigData = {
        type: 'image',
        accept: 'image/*'
      };

      const element = imageField.render(config, '');
      const input = element.querySelector('input[type="file"]');

      expect(input?.getAttribute('accept')).toBe('image/*');
    });

    it('should default accept to image types', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const element = imageField.render(config, '');
      const input = element.querySelector('input[type="file"]');

      expect(input?.getAttribute('accept')).toBe('image/png,image/jpeg,image/gif,image/webp');
    });

    it('should show preview when value is provided', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const element = imageField.render(config, 'https://example.com/image.jpg');
      const preview = element.querySelector('.image-preview');

      expect(preview).toBeTruthy();
    });

    it('should display preview image with correct src', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const element = imageField.render(config, 'https://example.com/test.png');
      const img = element.querySelector('.image-preview img') as HTMLImageElement;

      expect(img?.src).toContain('test.png');
    });

    it('should show remove button when image is present', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const element = imageField.render(config, 'https://example.com/image.jpg');
      const removeBtn = element.querySelector('.image-remove');

      expect(removeBtn).toBeTruthy();
    });

    it('should hide preview when no value', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const element = imageField.render(config, '');
      const preview = element.querySelector('.image-preview');

      expect(preview?.classList.contains('hidden')).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'image',
        className: 'custom-image'
      };

      const element = imageField.render(config, '');

      expect(element.classList.contains('custom-image')).toBe(true);
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'image',
        required: true
      };

      const element = imageField.render(config, '');
      const input = element.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.required).toBe(true);
    });
  });

  describe('extract', () => {
    it('should extract URL from hidden input', () => {
      const container = document.createElement('div');
      container.classList.add('image-field');

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.classList.add('image-value');
      hiddenInput.value = 'https://example.com/image.jpg';

      container.appendChild(hiddenInput);

      const value = imageField.extract(container);

      expect(value).toBe('https://example.com/image.jpg');
    });

    it('should return empty string when no value', () => {
      const container = document.createElement('div');
      container.classList.add('image-field');

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.classList.add('image-value');
      hiddenInput.value = '';

      container.appendChild(hiddenInput);

      const value = imageField.extract(container);

      expect(value).toBe('');
    });

    it('should return empty string if hidden input not found', () => {
      const container = document.createElement('div');

      const value = imageField.extract(container);

      expect(value).toBe('');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid URL', () => {
      const config: FieldConfigData = {
        type: 'image',
        required: true
      };

      const result = imageField.validate(config, 'https://example.com/image.jpg');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'image',
        label: 'Profile Picture',
        required: true
      };

      const result = imageField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'image',
        required: false
      };

      const result = imageField.validate(config, '');

      expect(result.valid).toBe(true);
    });

    it('should validate URL format', () => {
      const config: FieldConfigData = {
        type: 'image',
        label: 'Image'
      };

      const result = imageField.validate(config, 'not-a-url');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid URL');
    });

    it('should accept base64 data URLs', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const result = imageField.validate(config, 'data:image/png;base64,iVBORw0KGgo=');

      expect(result.valid).toBe(true);
    });

    it('should accept https URLs', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const result = imageField.validate(config, 'https://example.com/image.png');

      expect(result.valid).toBe(true);
    });

    it('should accept http URLs', () => {
      const config: FieldConfigData = {
        type: 'image'
      };

      const result = imageField.validate(config, 'http://localhost/image.jpg');

      expect(result.valid).toBe(true);
    });
  });
});
