import { describe, it, expect, beforeEach } from 'vitest';
import { SelectField } from '../../../../src/domain/fields/SelectField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('SelectField', () => {
  let selectField: SelectField;

  beforeEach(() => {
    selectField = new SelectField();
  });

  describe('render', () => {
    it('should render a select element', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' }
        ]
      };

      const element = selectField.render(config, '');

      expect(element.tagName).toBe('SELECT');
    });

    it('should render options from config', () => {
      const config: FieldConfigData = {
        type: 'select',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' }
        ]
      };

      const element = selectField.render(config, '') as HTMLSelectElement;

      expect(element.options.length).toBe(3);
      expect(element.options[0]?.value).toBe('red');
      expect(element.options[0]?.textContent).toBe('Red');
      expect(element.options[1]?.value).toBe('green');
      expect(element.options[2]?.value).toBe('blue');
    });

    it('should set selected value from data', () => {
      const config: FieldConfigData = {
        type: 'select',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ]
      };

      const element = selectField.render(config, 'medium') as HTMLSelectElement;

      expect(element.value).toBe('medium');
    });

    it('should use defaultValue when value is empty', () => {
      const config: FieldConfigData = {
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ]
      };

      const element = selectField.render(config, '') as HTMLSelectElement;

      expect(element.value).toBe('medium');
    });

    it('should apply required attribute', () => {
      const config: FieldConfigData = {
        type: 'select',
        required: true,
        options: [{ value: 'test', label: 'Test' }]
      };

      const element = selectField.render(config, '') as HTMLSelectElement;

      expect(element.required).toBe(true);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'select',
        className: 'custom-select',
        options: [{ value: 'test', label: 'Test' }]
      };

      const element = selectField.render(config, '');

      expect(element.classList.contains('custom-select')).toBe(true);
    });

    it('should support multiple selection', () => {
      const config: FieldConfigData = {
        type: 'select',
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const element = selectField.render(config, '') as HTMLSelectElement;

      expect(element.multiple).toBe(true);
    });

    it('should set multiple selected values', () => {
      const config: FieldConfigData = {
        type: 'select',
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ]
      };

      const element = selectField.render(config, ['a', 'c']) as HTMLSelectElement;

      expect(element.options[0]?.selected).toBe(true);
      expect(element.options[1]?.selected).toBe(false);
      expect(element.options[2]?.selected).toBe(true);
    });

    it('should handle numeric option values', () => {
      const config: FieldConfigData = {
        type: 'select',
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' }
        ]
      };

      const element = selectField.render(config, 2) as HTMLSelectElement;

      expect(element.options.length).toBe(2);
      expect(element.value).toBe('2');
    });
  });

  describe('extract', () => {
    it('should extract selected value', () => {
      const select = document.createElement('select');
      const option1 = document.createElement('option');
      option1.value = 'red';
      const option2 = document.createElement('option');
      option2.value = 'blue';
      option2.selected = true;
      select.appendChild(option1);
      select.appendChild(option2);

      const value = selectField.extract(select);

      expect(value).toBe('blue');
    });

    it('should extract multiple selected values', () => {
      const select = document.createElement('select');
      select.multiple = true;

      const option1 = document.createElement('option');
      option1.value = 'red';
      option1.selected = true;

      const option2 = document.createElement('option');
      option2.value = 'blue';

      const option3 = document.createElement('option');
      option3.value = 'green';
      option3.selected = true;

      select.appendChild(option1);
      select.appendChild(option2);
      select.appendChild(option3);

      const value = selectField.extract(select);

      expect(value).toEqual(['red', 'green']);
    });

    it('should return empty string for single select with no selection', () => {
      const select = document.createElement('select');
      const option = document.createElement('option');
      option.value = '';
      select.appendChild(option);

      const value = selectField.extract(select);

      expect(value).toBe('');
    });

    it('should return empty array for multiple select with no selection', () => {
      const select = document.createElement('select');
      select.multiple = true;
      const option = document.createElement('option');
      option.value = 'test';
      select.appendChild(option);

      const value = selectField.extract(select);

      expect(value).toEqual([]);
    });
  });

  describe('validate', () => {
    it('should pass validation for valid selection', () => {
      const config: FieldConfigData = {
        type: 'select',
        required: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const result = selectField.validate(config, 'a');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty required field', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        required: true,
        options: [{ value: 'us', label: 'US' }]
      };

      const result = selectField.validate(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should pass for empty non-required field', () => {
      const config: FieldConfigData = {
        type: 'select',
        required: false,
        options: [{ value: 'test', label: 'Test' }]
      };

      const result = selectField.validate(config, '');

      expect(result.valid).toBe(true);
    });

    it('should validate value exists in options', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Color',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' }
        ]
      };

      const result = selectField.validate(config, 'green');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid option');
    });

    it('should pass when value is in options', () => {
      const config: FieldConfigData = {
        type: 'select',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' }
        ]
      };

      const result = selectField.validate(config, 'blue');

      expect(result.valid).toBe(true);
    });

    it('should validate multiple selections', () => {
      const config: FieldConfigData = {
        type: 'select',
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const result = selectField.validate(config, ['a', 'b']);

      expect(result.valid).toBe(true);
    });

    it('should fail when multiple selection has invalid value', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Items',
        multiple: true,
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' }
        ]
      };

      const result = selectField.validate(config, ['a', 'c']);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('valid option');
    });

    it('should require options to be defined', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Test'
      };

      const result = selectField.validate(config, 'test');

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('options');
    });
  });
});
