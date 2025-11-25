import { describe, it, expect } from 'vitest';
import {
  hasRows,
  getRowCount,
  getRows,
  getRow,
  getSubField,
  addRow,
  updateRow,
  deleteRow,
  addSubRow,
  updateSubField,
  deleteSubRow
} from '../../src/repeater';

describe('Repeater Helpers', () => {
  const mockData = {
    items: [
      { title: 'Item 1', description: 'Desc 1', priority: 1 },
      { title: 'Item 2', description: 'Desc 2', priority: 2 },
      { title: 'Item 3', description: 'Desc 3', priority: 3 }
    ]
  };

  describe('hasRows', () => {
    it('should return true if field has rows', () => {
      expect(hasRows(mockData, 'items')).toBe(true);
    });

    it('should return false for empty array', () => {
      const data = { items: [] };
      expect(hasRows(data, 'items')).toBe(false);
    });

    it('should return false for non-array field', () => {
      const data = { items: 'not an array' };
      expect(hasRows(data, 'items')).toBe(false);
    });

    it('should return false for non-existent field', () => {
      expect(hasRows({}, 'items')).toBe(false);
    });
  });

  describe('getRowCount', () => {
    it('should return correct row count', () => {
      expect(getRowCount(mockData, 'items')).toBe(3);
    });

    it('should return 0 for empty array', () => {
      const data = { items: [] };
      expect(getRowCount(data, 'items')).toBe(0);
    });

    it('should return 0 for non-array field', () => {
      const data = { items: 'not an array' };
      expect(getRowCount(data, 'items')).toBe(0);
    });
  });

  describe('getRows', () => {
    it('should return all rows', () => {
      const rows = getRows(mockData, 'items');
      expect(rows).toHaveLength(3);
      expect(rows[0]).toEqual({ title: 'Item 1', description: 'Desc 1', priority: 1 });
    });

    it('should return empty array for non-existent field', () => {
      const rows = getRows({}, 'items');
      expect(rows).toEqual([]);
    });

    it('should return empty array for non-array field', () => {
      const data = { items: 'not an array' };
      const rows = getRows(data, 'items');
      expect(rows).toEqual([]);
    });
  });

  describe('getRow', () => {
    it('should return specific row by index', () => {
      const row = getRow(mockData, 'items', 1);
      expect(row).toEqual({ title: 'Item 2', description: 'Desc 2', priority: 2 });
    });

    it('should return undefined for invalid index', () => {
      expect(getRow(mockData, 'items', 99)).toBeUndefined();
      expect(getRow(mockData, 'items', -1)).toBeUndefined();
    });

    it('should return undefined for non-existent field', () => {
      expect(getRow({}, 'items', 0)).toBeUndefined();
    });
  });

  describe('getSubField', () => {
    it('should return sub-field value from row', () => {
      const row = { title: 'Item 1', description: 'Desc 1' };
      expect(getSubField(row, 'title')).toBe('Item 1');
      expect(getSubField(row, 'description')).toBe('Desc 1');
    });

    it('should return undefined for non-existent sub-field', () => {
      const row = { title: 'Item 1' };
      expect(getSubField(row, 'missing')).toBeUndefined();
    });

    it('should handle null/undefined row data', () => {
      expect(getSubField(null, 'field')).toBeUndefined();
      expect(getSubField(undefined, 'field')).toBeUndefined();
    });

    it('should support dot notation for nested sub-fields', () => {
      const row = {
        meta: {
          author: 'John',
          date: '2024-01-01'
        }
      };
      expect(getSubField(row, 'meta.author')).toBe('John');
    });
  });

  describe('addRow', () => {
    it('should add new row to repeater', () => {
      const newData = addRow(mockData, 'items', {
        title: 'Item 4',
        description: 'Desc 4',
        priority: 4
      });

      expect(newData.items).toHaveLength(4);
      expect(newData.items[3]).toEqual({
        title: 'Item 4',
        description: 'Desc 4',
        priority: 4
      });
      expect(mockData.items).toHaveLength(3); // Original unchanged
    });

    it('should create array if field does not exist', () => {
      const data = {};
      const newData = addRow(data, 'items', { title: 'Item 1' });

      expect(newData.items).toEqual([{ title: 'Item 1' }]);
    });
  });

  describe('updateRow', () => {
    it('should update specific row', () => {
      const newData = updateRow(mockData, 'items', 1, {
        title: 'Updated Item 2'
      });

      expect(newData.items[1]).toEqual({
        title: 'Updated Item 2',
        description: 'Desc 2',
        priority: 2
      });
      expect(mockData.items[1].title).toBe('Item 2'); // Original unchanged
    });

    it('should merge with existing row data', () => {
      const newData = updateRow(mockData, 'items', 0, {
        priority: 999
      });

      expect(newData.items[0]).toEqual({
        title: 'Item 1',
        description: 'Desc 1',
        priority: 999
      });
    });

    it('should return unchanged data for invalid index', () => {
      const newData = updateRow(mockData, 'items', 99, { title: 'Nope' });
      expect(newData).toEqual(mockData);
    });
  });

  describe('deleteRow', () => {
    it('should delete specific row', () => {
      const newData = deleteRow(mockData, 'items', 1);

      expect(newData.items).toHaveLength(2);
      expect(newData.items[0].title).toBe('Item 1');
      expect(newData.items[1].title).toBe('Item 3');
      expect(mockData.items).toHaveLength(3); // Original unchanged
    });

    it('should return unchanged data for invalid index', () => {
      const newData = deleteRow(mockData, 'items', 99);
      expect(newData).toEqual(mockData);
    });
  });

  describe('addSubRow', () => {
    it('should add row to nested repeater', () => {
      const data = {
        sections: [
          {
            title: 'Section 1',
            items: [
              { name: 'Item 1' }
            ]
          }
        ]
      };

      const newData = addSubRow(data, 'sections', 0, 'items', {
        name: 'Item 2'
      });

      expect(newData.sections[0].items).toHaveLength(2);
      expect(newData.sections[0].items[1]).toEqual({ name: 'Item 2' });
      expect(data.sections[0].items).toHaveLength(1); // Original unchanged
    });

    it('should create sub-array if it does not exist', () => {
      const data = {
        sections: [
          { title: 'Section 1' }
        ]
      };

      const newData = addSubRow(data, 'sections', 0, 'items', {
        name: 'Item 1'
      });

      expect(newData.sections[0].items).toEqual([{ name: 'Item 1' }]);
    });

    it('should return unchanged data for invalid parent row index', () => {
      const data = { sections: [{ title: 'Section 1' }] };
      const newData = addSubRow(data, 'sections', 99, 'items', { name: 'Item' });
      expect(newData).toEqual(data);
    });
  });

  describe('updateSubField', () => {
    it('should update specific sub-field in row', () => {
      const newData = updateSubField(mockData, 'items', 1, 'title', 'New Title');

      expect(newData.items[1].title).toBe('New Title');
      expect(newData.items[1].description).toBe('Desc 2');
      expect(mockData.items[1].title).toBe('Item 2'); // Original unchanged
    });
  });

  describe('deleteSubRow', () => {
    it('should delete row from nested repeater', () => {
      const data = {
        sections: [
          {
            title: 'Section 1',
            items: [
              { name: 'Item 1' },
              { name: 'Item 2' },
              { name: 'Item 3' }
            ]
          }
        ]
      };

      const newData = deleteSubRow(data, 'sections', 0, 'items', 1);

      expect(newData.sections[0].items).toHaveLength(2);
      expect(newData.sections[0].items[0].name).toBe('Item 1');
      expect(newData.sections[0].items[1].name).toBe('Item 3');
      expect(data.sections[0].items).toHaveLength(3); // Original unchanged
    });

    it('should return unchanged data for invalid indices', () => {
      const data = {
        sections: [
          { title: 'Section 1', items: [{ name: 'Item 1' }] }
        ]
      };

      const newData = deleteSubRow(data, 'sections', 99, 'items', 0);
      expect(newData).toEqual(data);
    });
  });
});
