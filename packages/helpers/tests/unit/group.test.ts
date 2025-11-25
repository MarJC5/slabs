import { describe, it, expect } from 'vitest';
import {
  getGroup,
  getGroupField,
  getGroupFields,
  setGroupField,
  setGroupFields,
  hasGroup
} from '../../src/group';

describe('Group Helpers', () => {
  const mockData = {
    settings: {
      backgroundColor: '#fff',
      textColor: '#000',
      padding: 20,
      margin: 10
    },
    content: {
      title: 'Hello',
      subtitle: 'World'
    }
  };

  describe('getGroup', () => {
    it('should return entire group object', () => {
      const group = getGroup(mockData, 'settings');
      expect(group).toEqual({
        backgroundColor: '#fff',
        textColor: '#000',
        padding: 20,
        margin: 10
      });
    });

    it('should return undefined for non-existent group', () => {
      expect(getGroup(mockData, 'missing')).toBeUndefined();
    });

    it('should return undefined for non-object group', () => {
      const data = { settings: 'not an object' };
      expect(getGroup(data, 'settings')).toBeUndefined();
    });

    it('should return undefined for array value', () => {
      const data = { settings: ['array', 'values'] };
      expect(getGroup(data, 'settings')).toBeUndefined();
    });
  });

  describe('getGroupField', () => {
    it('should return specific field from group', () => {
      expect(getGroupField(mockData, 'settings', 'backgroundColor')).toBe('#fff');
      expect(getGroupField(mockData, 'settings', 'padding')).toBe(20);
    });

    it('should return undefined for non-existent field', () => {
      expect(getGroupField(mockData, 'settings', 'missing')).toBeUndefined();
    });

    it('should return undefined for non-existent group', () => {
      expect(getGroupField(mockData, 'missing', 'field')).toBeUndefined();
    });

    it('should support dot notation for nested fields', () => {
      const data = {
        settings: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d'
          }
        }
      };
      expect(getGroupField(data, 'settings', 'colors.primary')).toBe('#007bff');
    });
  });

  describe('getGroupFields', () => {
    it('should return shallow copy of all group fields', () => {
      const fields = getGroupFields(mockData, 'settings');

      expect(fields).toEqual({
        backgroundColor: '#fff',
        textColor: '#000',
        padding: 20,
        margin: 10
      });
      expect(fields).not.toBe(mockData.settings); // Different object
    });

    it('should return empty object for non-existent group', () => {
      const fields = getGroupFields(mockData, 'missing');
      expect(fields).toEqual({});
    });
  });

  describe('setGroupField', () => {
    it('should set specific field in group', () => {
      const newData = setGroupField(mockData, 'settings', 'backgroundColor', '#f0f0f0');

      expect(newData.settings.backgroundColor).toBe('#f0f0f0');
      expect(newData.settings.textColor).toBe('#000');
      expect(mockData.settings.backgroundColor).toBe('#fff'); // Original unchanged
    });

    it('should create group if it does not exist', () => {
      const data = {};
      const newData = setGroupField(data, 'settings', 'backgroundColor', '#fff');

      expect(newData.settings.backgroundColor).toBe('#fff');
    });

    it('should support dot notation for nested fields', () => {
      const data = {
        settings: {
          colors: {
            primary: '#007bff'
          }
        }
      };

      const newData = setGroupField(data, 'settings', 'colors.secondary', '#6c757d');

      expect(newData.settings.colors.secondary).toBe('#6c757d');
      expect(newData.settings.colors.primary).toBe('#007bff');
    });
  });

  describe('setGroupFields', () => {
    it('should set multiple fields in group', () => {
      const newData = setGroupFields(mockData, 'settings', {
        backgroundColor: '#000',
        textColor: '#fff',
        padding: 30
      });

      expect(newData.settings).toEqual({
        backgroundColor: '#000',
        textColor: '#fff',
        padding: 30,
        margin: 10
      });
      expect(mockData.settings.backgroundColor).toBe('#fff'); // Original unchanged
    });

    it('should create group if it does not exist', () => {
      const data = {};
      const newData = setGroupFields(data, 'settings', {
        backgroundColor: '#fff',
        padding: 20
      });

      expect(newData.settings).toEqual({
        backgroundColor: '#fff',
        padding: 20
      });
    });
  });

  describe('hasGroup', () => {
    it('should return true for existing groups with fields', () => {
      expect(hasGroup(mockData, 'settings')).toBe(true);
      expect(hasGroup(mockData, 'content')).toBe(true);
    });

    it('should return false for non-existent groups', () => {
      expect(hasGroup(mockData, 'missing')).toBe(false);
    });

    it('should return false for empty groups', () => {
      const data = { settings: {} };
      expect(hasGroup(data, 'settings')).toBe(false);
    });

    it('should return false for non-object values', () => {
      const data = { settings: 'not an object' };
      expect(hasGroup(data, 'settings')).toBe(false);
    });
  });
});
