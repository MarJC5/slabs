import { describe, it, expect } from 'vitest';
import { FieldType } from '../../../../src/domain/value-objects/FieldType';

describe('FieldType', () => {
  describe('constructor', () => {
    it('should create valid field type from allowed value', () => {
      const fieldType = new FieldType('text');
      expect(fieldType.value).toBe('text');
    });

    it('should accept "text" field type', () => {
      const fieldType = new FieldType('text');
      expect(fieldType.value).toBe('text');
    });

    it('should accept "wysiwyg" field type', () => {
      const fieldType = new FieldType('wysiwyg');
      expect(fieldType.value).toBe('wysiwyg');
    });

    it('should accept "select" field type', () => {
      const fieldType = new FieldType('select');
      expect(fieldType.value).toBe('select');
    });

    it('should accept "checkbox" field type', () => {
      const fieldType = new FieldType('checkbox');
      expect(fieldType.value).toBe('checkbox');
    });

    it('should accept "number" field type', () => {
      const fieldType = new FieldType('number');
      expect(fieldType.value).toBe('number');
    });

    it('should accept "color" field type', () => {
      const fieldType = new FieldType('color');
      expect(fieldType.value).toBe('color');
    });

    it('should accept "image" field type', () => {
      const fieldType = new FieldType('image');
      expect(fieldType.value).toBe('image');
    });

    it('should accept "repeater" field type', () => {
      const fieldType = new FieldType('repeater');
      expect(fieldType.value).toBe('repeater');
    });

    it('should throw error for invalid field type', () => {
      expect(() => new FieldType('invalid')).toThrow(
        'Invalid field type: invalid. Must be one of: text, wysiwyg, select, checkbox, number, color, image, repeater'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => new FieldType('')).toThrow('Invalid field type');
    });

    it('should throw error for uppercase', () => {
      expect(() => new FieldType('Text')).toThrow('Invalid field type');
    });

    it('should throw error for mixed case', () => {
      expect(() => new FieldType('SELECT')).toThrow('Invalid field type');
    });

    it('should be case-sensitive', () => {
      expect(() => new FieldType('Number')).toThrow('Invalid field type');
    });
  });

  describe('all()', () => {
    it('should return all valid field types', () => {
      const fieldTypes = FieldType.all();
      expect(fieldTypes).toEqual([
        'text',
        'wysiwyg',
        'select',
        'checkbox',
        'number',
        'color',
        'image',
        'repeater'
      ]);
    });

    it('should return a new array each time', () => {
      const types1 = FieldType.all();
      const types2 = FieldType.all();
      expect(types1).not.toBe(types2);
      expect(types1).toEqual(types2);
    });
  });

  describe('equals', () => {
    it('should return true for equal field types', () => {
      const type1 = new FieldType('text');
      const type2 = new FieldType('text');
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different field types', () => {
      const type1 = new FieldType('text');
      const type2 = new FieldType('number');
      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      const fieldType = new FieldType('text');
      expect(fieldType.toString()).toBe('text');
    });
  });

  describe('isValid', () => {
    it('should validate text field type', () => {
      expect(FieldType.isValid('text')).toBe(true);
    });

    it('should validate wysiwyg field type', () => {
      expect(FieldType.isValid('wysiwyg')).toBe(true);
    });

    it('should validate repeater field type', () => {
      expect(FieldType.isValid('repeater')).toBe(true);
    });

    it('should reject invalid field type', () => {
      expect(FieldType.isValid('invalid')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(FieldType.isValid('')).toBe(false);
    });

    it('should reject uppercase', () => {
      expect(FieldType.isValid('Text')).toBe(false);
    });
  });

  describe('requiresOptions', () => {
    it('should return true for select field type', () => {
      const fieldType = new FieldType('select');
      expect(fieldType.requiresOptions()).toBe(true);
    });

    it('should return false for text field type', () => {
      const fieldType = new FieldType('text');
      expect(fieldType.requiresOptions()).toBe(false);
    });

    it('should return false for number field type', () => {
      const fieldType = new FieldType('number');
      expect(fieldType.requiresOptions()).toBe(false);
    });
  });
});
