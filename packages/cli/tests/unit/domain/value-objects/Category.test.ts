import { describe, it, expect } from 'vitest';
import { Category } from '../../../../src/domain/value-objects/Category';

describe('Category', () => {
  describe('constructor', () => {
    it('should create valid category from allowed value', () => {
      const category = new Category('content');
      expect(category.value).toBe('content');
    });

    it('should accept "content" category', () => {
      const category = new Category('content');
      expect(category.value).toBe('content');
    });

    it('should accept "media" category', () => {
      const category = new Category('media');
      expect(category.value).toBe('media');
    });

    it('should accept "design" category', () => {
      const category = new Category('design');
      expect(category.value).toBe('design');
    });

    it('should accept "widgets" category', () => {
      const category = new Category('widgets');
      expect(category.value).toBe('widgets');
    });

    it('should accept "theme" category', () => {
      const category = new Category('theme');
      expect(category.value).toBe('theme');
    });

    it('should accept "embed" category', () => {
      const category = new Category('embed');
      expect(category.value).toBe('embed');
    });

    it('should throw error for invalid category', () => {
      expect(() => new Category('invalid')).toThrow(
        'Invalid category: invalid. Must be one of: content, media, design, widgets, theme, embed'
      );
    });

    it('should throw error for empty string', () => {
      expect(() => new Category('')).toThrow('Invalid category');
    });

    it('should throw error for uppercase', () => {
      expect(() => new Category('Content')).toThrow('Invalid category');
    });

    it('should throw error for mixed case', () => {
      expect(() => new Category('MEDIA')).toThrow('Invalid category');
    });

    it('should be case-sensitive', () => {
      expect(() => new Category('Design')).toThrow('Invalid category');
    });
  });

  describe('all()', () => {
    it('should return all valid categories', () => {
      const categories = Category.all();
      expect(categories).toEqual([
        'content',
        'media',
        'design',
        'widgets',
        'theme',
        'embed'
      ]);
    });

    it('should return a new array each time', () => {
      const categories1 = Category.all();
      const categories2 = Category.all();
      expect(categories1).not.toBe(categories2);
      expect(categories1).toEqual(categories2);
    });
  });

  describe('equals', () => {
    it('should return true for equal categories', () => {
      const cat1 = new Category('content');
      const cat2 = new Category('content');
      expect(cat1.equals(cat2)).toBe(true);
    });

    it('should return false for different categories', () => {
      const cat1 = new Category('content');
      const cat2 = new Category('media');
      expect(cat1.equals(cat2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      const category = new Category('content');
      expect(category.toString()).toBe('content');
    });
  });

  describe('isValid', () => {
    it('should validate content category', () => {
      expect(Category.isValid('content')).toBe(true);
    });

    it('should validate media category', () => {
      expect(Category.isValid('media')).toBe(true);
    });

    it('should reject invalid category', () => {
      expect(Category.isValid('invalid')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(Category.isValid('')).toBe(false);
    });

    it('should reject uppercase', () => {
      expect(Category.isValid('Content')).toBe(false);
    });
  });
});
