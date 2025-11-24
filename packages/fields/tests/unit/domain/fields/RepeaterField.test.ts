import { describe, it, expect, beforeEach } from 'vitest';
import { RepeaterField } from '../../../../src/domain/fields/RepeaterField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('RepeaterField', () => {
  let repeaterField: RepeaterField;

  beforeEach(() => {
    repeaterField = new RepeaterField();
  });

  describe('render', () => {
    it('should render a repeater container with data-field-type attribute', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, []);

      expect(element.classList.contains('repeater-field')).toBe(true);
      expect(element.dataset.fieldType).toBe('repeater');
    });

    it('should render empty repeater with add button', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, []);

      const rows = element.querySelectorAll('.repeater-row');
      const addButton = element.querySelector('.repeater-add');

      expect(rows.length).toBe(0);
      expect(addButton).toBeTruthy();
      expect(addButton?.textContent).toContain('Add Row');
    });

    it('should use custom buttonLabel if provided', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        buttonLabel: 'Add Team Member',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, []);
      const addButton = element.querySelector('.repeater-add');

      expect(addButton?.textContent).toBe('Add Team Member');
    });

    it('should render existing rows from data', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' },
          email: { type: 'text', label: 'Email' }
        }
      };

      const data = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ];

      const element = repeaterField.render(config, data);
      const rows = element.querySelectorAll('.repeater-row');

      expect(rows.length).toBe(2);
    });

    it('should render sub-fields within each row', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' },
          role: { type: 'text', label: 'Role' }
        }
      };

      const data = [{ name: 'John', role: 'CEO' }];

      const element = repeaterField.render(config, data);
      const fields = element.querySelectorAll('.slabs-field');

      // Should have 2 fields (name + role)
      expect(fields.length).toBe(2);
    });

    it('should set values for sub-fields from data', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [{ name: 'John Doe' }];

      const element = repeaterField.render(config, data);
      const input = element.querySelector('input[type="text"]') as HTMLInputElement;

      expect(input?.value).toBe('John Doe');
    });

    it('should add data-row-id attribute to each row', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [{ name: 'Row 1' }, { name: 'Row 2' }];

      const element = repeaterField.render(config, data);
      const rows = element.querySelectorAll('.repeater-row');

      expect(rows[0]?.getAttribute('data-row-id')).toBe('0');
      expect(rows[1]?.getAttribute('data-row-id')).toBe('1');
    });

    it('should add remove button to each row', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [{ name: 'Row 1' }];

      const element = repeaterField.render(config, data);
      const removeButton = element.querySelector('.repeater-remove');

      expect(removeButton).toBeTruthy();
      expect(removeButton?.textContent).toContain('Remove');
    });

    it('should disable add button when max rows reached', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        max: 2,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [{ name: 'Row 1' }, { name: 'Row 2' }];

      const element = repeaterField.render(config, data);
      const addButton = element.querySelector('.repeater-add') as HTMLButtonElement;

      expect(addButton?.disabled).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        className: 'custom-repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, []);

      expect(element.classList.contains('custom-repeater')).toBe(true);
    });

    it('should handle empty fields configuration gracefully', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {}
      };

      const element = repeaterField.render(config, []);

      expect(element.classList.contains('repeater-field')).toBe(true);
    });

    it('should render defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        defaultValue: [{ name: 'Default Name' }],
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, null);
      const rows = element.querySelectorAll('.repeater-row');

      expect(rows.length).toBe(1);
    });
  });

  describe('extract', () => {
    it('should extract empty array from empty repeater', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, []);
      const value = repeaterField.extract(element);

      expect(value).toEqual([]);
    });

    it('should extract data from single row', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [{ name: 'John Doe' }];
      const element = repeaterField.render(config, data);

      const value = repeaterField.extract(element);

      expect(value).toEqual([{ name: 'John Doe' }]);
    });

    it('should extract data from multiple rows', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' },
          email: { type: 'text', label: 'Email' }
        }
      };

      const data = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ];

      const element = repeaterField.render(config, data);
      const value = repeaterField.extract(element);

      expect(value).toEqual(data);
    });

    it('should extract data in correct row order', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const data = [
        { name: 'First' },
        { name: 'Second' },
        { name: 'Third' }
      ];

      const element = repeaterField.render(config, data);
      const value = repeaterField.extract(element);

      expect(value[0]).toEqual({ name: 'First' });
      expect(value[1]).toEqual({ name: 'Second' });
      expect(value[2]).toEqual({ name: 'Third' });
    });

    it('should handle modified field values', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = repeaterField.render(config, [{ name: 'Original' }]);

      // Modify the input value
      const input = element.querySelector('input[type="text"]') as HTMLInputElement;
      input.value = 'Modified';

      const value = repeaterField.extract(element);

      expect(value).toEqual([{ name: 'Modified' }]);
    });

    it('should return empty array for non-repeater element', () => {
      const div = document.createElement('div');
      const value = repeaterField.extract(div);

      expect(value).toEqual([]);
    });
  });

  describe('validate', () => {
    it('should pass validation for valid data', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name', required: true }
        }
      };

      const value = [{ name: 'John Doe' }];
      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when required and empty array', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        label: 'Team Members',
        required: true,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const result = repeaterField.validate(config, []);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass when not required and empty array', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        required: false,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const result = repeaterField.validate(config, []);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate minimum rows', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        label: 'Items',
        min: 2,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const result = repeaterField.validate(config, [{ name: 'One' }]);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('at least 2');
    });

    it('should validate maximum rows', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        label: 'Items',
        max: 2,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const value = [
        { name: 'One' },
        { name: 'Two' },
        { name: 'Three' }
      ];

      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('exceed 2');
    });

    it('should validate sub-field requirements', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name', required: true },
          email: { type: 'text', label: 'Email', required: true }
        }
      };

      const value = [
        { name: 'John', email: '' }  // Missing required email
      ];

      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should pass when all sub-fields are valid', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name', required: true, minLength: 3 },
          email: { type: 'text', label: 'Email', required: true }
        }
      };

      const value = [
        { name: 'John Doe', email: 'john@example.com' }
      ];

      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle non-array values gracefully', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const result = repeaterField.validate(config, 'not an array');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.code).toBe('INVALID_TYPE');
    });

    it('should validate multiple rows with errors', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {
          name: { type: 'text', label: 'Name', required: true }
        }
      };

      const value = [
        { name: 'John' },
        { name: '' },  // Invalid
        { name: 'Jane' }
      ];

      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should provide row index in error messages', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        label: 'Team',
        fields: {
          name: { type: 'text', label: 'Name', required: true }
        }
      };

      const value = [
        { name: 'John' },
        { name: '' }  // Row 1 (index 1) is invalid
      ];

      const result = repeaterField.validate(config, value);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('Row 2');
    });

    it('should handle empty fields configuration', () => {
      const config: FieldConfigData = {
        type: 'repeater',
        fields: {}
      };

      const result = repeaterField.validate(config, [{}]);

      expect(result.valid).toBe(true);
    });
  });
});
