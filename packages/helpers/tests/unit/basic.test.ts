import { describe, it, expect } from 'vitest';
import {
  getField,
  getFieldOr,
  getFields,
  setField,
  setFields,
  deleteField,
  hasField
} from '../../src/basic';

describe('Basic Helpers', () => {
  describe('getField', () => {
    it('should get simple field value', () => {
      const data = { title: 'Hello', count: 5 };
      expect(getField(data, 'title')).toBe('Hello');
      expect(getField(data, 'count')).toBe(5);
    });

    it('should get nested field using dot notation', () => {
      const data = {
        settings: {
          backgroundColor: '#fff',
          textColor: '#000'
        }
      };
      expect(getField(data, 'settings.backgroundColor')).toBe('#fff');
      expect(getField(data, 'settings.textColor')).toBe('#000');
    });

    it('should get array item using numeric path', () => {
      const data = {
        items: [
          { title: 'Item 1' },
          { title: 'Item 2' },
          { title: 'Item 3' }
        ]
      };
      expect(getField(data, 'items.0.title')).toBe('Item 1');
      expect(getField(data, 'items.1.title')).toBe('Item 2');
    });

    it('should return undefined for non-existent field', () => {
      const data = { title: 'Hello' };
      expect(getField(data, 'missing')).toBeUndefined();
      expect(getField(data, 'deep.missing.path')).toBeUndefined();
    });

    it('should handle null/undefined data', () => {
      expect(getField(null, 'field')).toBeUndefined();
      expect(getField(undefined, 'field')).toBeUndefined();
    });
  });

  describe('getFieldOr', () => {
    it('should return field value if exists', () => {
      const data = { title: 'Hello', count: 0 };
      expect(getFieldOr(data, 'title', 'Default')).toBe('Hello');
      expect(getFieldOr(data, 'count', 10)).toBe(0);
    });

    it('should return default value if field does not exist', () => {
      const data = { title: 'Hello' };
      expect(getFieldOr(data, 'missing', 'Default')).toBe('Default');
      expect(getFieldOr(data, 'count', 10)).toBe(10);
    });

    it('should work with nested paths', () => {
      const data = { settings: { theme: 'dark' } };
      expect(getFieldOr(data, 'settings.theme', 'light')).toBe('dark');
      expect(getFieldOr(data, 'settings.missing', 'default')).toBe('default');
    });
  });

  describe('getFields', () => {
    it('should return shallow copy of all fields', () => {
      const data = { title: 'Hello', count: 5, active: true };
      const result = getFields(data);

      expect(result).toEqual(data);
      expect(result).not.toBe(data); // Different object
    });

    it('should return empty object for null/undefined', () => {
      expect(getFields(null)).toEqual({});
      expect(getFields(undefined)).toEqual({});
    });

    it('should return empty object for non-object types', () => {
      expect(getFields('string')).toEqual({});
      expect(getFields(123)).toEqual({});
    });
  });

  describe('setField', () => {
    it('should set simple field value immutably', () => {
      const data = { title: 'Hello', count: 5 };
      const result = setField(data, 'title', 'World');

      expect(result).toEqual({ title: 'World', count: 5 });
      expect(data.title).toBe('Hello'); // Original unchanged
    });

    it('should set nested field using dot notation', () => {
      const data = {
        settings: {
          backgroundColor: '#fff',
          textColor: '#000'
        }
      };
      const result = setField(data, 'settings.backgroundColor', '#f0f0f0');

      expect(result.settings.backgroundColor).toBe('#f0f0f0');
      expect(result.settings.textColor).toBe('#000');
      expect(data.settings.backgroundColor).toBe('#fff'); // Original unchanged
    });

    it('should set array item using numeric path', () => {
      const data = {
        items: [
          { title: 'Item 1' },
          { title: 'Item 2' }
        ]
      };
      const result = setField(data, 'items.0.title', 'Updated Item 1');

      expect(result.items[0].title).toBe('Updated Item 1');
      expect(data.items[0].title).toBe('Item 1'); // Original unchanged
    });

    it('should create nested structure if it does not exist', () => {
      const data = {};
      const result = setField(data, 'settings.backgroundColor', '#fff');

      expect(result.settings.backgroundColor).toBe('#fff');
    });
  });

  describe('setFields', () => {
    it('should set multiple fields at once', () => {
      const data = { title: 'Hello', count: 5 };
      const result = setFields(data, {
        title: 'World',
        count: 10,
        active: true
      });

      expect(result).toEqual({
        title: 'World',
        count: 10,
        active: true
      });
      expect(data).toEqual({ title: 'Hello', count: 5 }); // Original unchanged
    });

    it('should support dot notation in field names', () => {
      const data = {
        settings: {
          backgroundColor: '#fff',
          textColor: '#000'
        }
      };
      const result = setFields(data, {
        'settings.backgroundColor': '#f0f0f0',
        'settings.textColor': '#333'
      });

      expect(result.settings.backgroundColor).toBe('#f0f0f0');
      expect(result.settings.textColor).toBe('#333');
    });
  });

  describe('deleteField', () => {
    it('should delete simple field', () => {
      const data = { title: 'Hello', count: 5, active: true };
      const result = deleteField(data, 'count');

      expect(result).toEqual({ title: 'Hello', active: true });
      expect(data.count).toBe(5); // Original unchanged
    });

    it('should delete nested field using dot notation', () => {
      const data = {
        settings: {
          backgroundColor: '#fff',
          textColor: '#000',
          padding: 20
        }
      };
      const result = deleteField(data, 'settings.padding');

      expect(result.settings).toEqual({
        backgroundColor: '#fff',
        textColor: '#000'
      });
      expect(data.settings.padding).toBe(20); // Original unchanged
    });

    it('should handle deleting non-existent field', () => {
      const data = { title: 'Hello' };
      const result = deleteField(data, 'missing');

      expect(result).toEqual({ title: 'Hello' });
    });
  });

  describe('hasField', () => {
    it('should return true for existing fields', () => {
      const data = { title: 'Hello', count: 0, active: false };
      expect(hasField(data, 'title')).toBe(true);
      expect(hasField(data, 'count')).toBe(true);
      expect(hasField(data, 'active')).toBe(true);
    });

    it('should return false for undefined/null fields', () => {
      const data = { title: 'Hello', missing: undefined, empty: null };
      expect(hasField(data, 'missing')).toBe(false);
      expect(hasField(data, 'empty')).toBe(false);
      expect(hasField(data, 'nonexistent')).toBe(false);
    });

    it('should work with dot notation', () => {
      const data = {
        settings: {
          backgroundColor: '#fff'
        }
      };
      expect(hasField(data, 'settings.backgroundColor')).toBe(true);
      expect(hasField(data, 'settings.missing')).toBe(false);
    });
  });
});
