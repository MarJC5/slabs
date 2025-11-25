import { describe, it, expect, beforeEach } from 'vitest';
import { GroupField } from '../../../../src/domain/fields/GroupField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('GroupField', () => {
  let groupField: GroupField;

  beforeEach(() => {
    groupField = new GroupField();
  });

  describe('Rendering', () => {
    it('should render a group container with data-field-type attribute', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          firstName: { type: 'text', label: 'First Name' }
        }
      };

      const element = groupField.render(config, {});

      expect(element.classList.contains('group-field')).toBe(true);
      expect(element.dataset.fieldType).toBe('group');
    });

    it('should render with custom className', () => {
      const config: FieldConfigData = {
        type: 'group',
        className: 'custom-group',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = groupField.render(config, {});

      expect(element.classList.contains('custom-group')).toBe(true);
    });

    it('should render group title in header when collapsible', () => {
      const config: FieldConfigData = {
        type: 'group',
        label: 'User Information',
        collapsible: true,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = groupField.render(config, {});
      const title = element.querySelector('.group-field__title');

      expect(title).not.toBeNull();
      expect(title?.textContent).toBe('User Information');
    });

    it('should not render header if not collapsible', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const element = groupField.render(config, {});
      const header = element.querySelector('.group-field__header');

      expect(header).toBeNull();
    });

    it('should render hint text if provided', () => {
      const config: FieldConfigData = {
        type: 'group',
        label: 'Address',
        hint: 'Enter your full mailing address',
        collapsible: true,
        fields: {
          street: { type: 'text', label: 'Street' }
        }
      };

      const element = groupField.render(config, {});
      const title = element.querySelector('.group-field__title');

      expect(title).not.toBeNull();
      expect(title?.textContent).toBe('Address - Enter your full mailing address');
    });

    it('should render all sub-fields', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          firstName: { type: 'text', label: 'First Name' },
          lastName: { type: 'text', label: 'Last Name' },
          email: { type: 'email', label: 'Email' }
        }
      };

      const element = groupField.render(config, {});
      const fields = element.querySelectorAll('.slabs-field');

      expect(fields.length).toBe(3);
    });

    it('should pass values to sub-fields', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          name: { type: 'text', label: 'Name' },
          age: { type: 'number', label: 'Age' }
        }
      };

      const value = {
        name: 'John Doe',
        age: 30
      };

      const element = groupField.render(config, value);
      const nameInput = element.querySelector('input[type="text"]') as HTMLInputElement;
      const ageInput = element.querySelector('input[type="number"]') as HTMLInputElement;

      expect(nameInput?.value).toBe('John Doe');
      expect(ageInput?.value).toBe('30');
    });

    it('should support collapsible groups', () => {
      const config: FieldConfigData = {
        type: 'group',
        label: 'Advanced Settings',
        collapsible: true,
        fields: {
          option1: { type: 'text', label: 'Option 1' }
        }
      };

      const element = groupField.render(config, {});
      const header = element.querySelector('.group-field__header');
      const toggle = element.querySelector('.group-field__toggle');

      expect(header).not.toBeNull();
      expect(toggle).not.toBeNull();
    });

    it('should render collapsed by default if collapsed option is true', () => {
      const config: FieldConfigData = {
        type: 'group',
        label: 'Settings',
        collapsible: true,
        collapsed: true,
        fields: {
          option: { type: 'text', label: 'Option' }
        }
      };

      const element = groupField.render(config, {});

      expect(element.classList.contains('group-field--collapsed')).toBe(true);
    });

    it('should support layout option (vertical or horizontal)', () => {
      const config: FieldConfigData = {
        type: 'group',
        layout: 'horizontal',
        fields: {
          first: { type: 'text', label: 'First' },
          last: { type: 'text', label: 'Last' }
        }
      };

      const element = groupField.render(config, {});
      const fieldsContainer = element.querySelector('.group-field__fields');

      expect(fieldsContainer?.classList.contains('group-field__fields--horizontal')).toBe(true);
    });
  });

  describe('Extraction', () => {
    it('should extract values from all sub-fields', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          firstName: { type: 'text', label: 'First Name' },
          lastName: { type: 'text', label: 'Last Name' }
        }
      };

      const element = groupField.render(config, {});
      const firstNameInput = element.querySelector('input[type="text"]') as HTMLInputElement;
      const inputs = element.querySelectorAll('input[type="text"]');
      const lastNameInput = inputs[1] as HTMLInputElement;

      firstNameInput.value = 'John';
      lastNameInput.value = 'Doe';

      const extracted = groupField.extract(element);

      expect(extracted).toEqual({
        firstName: 'John',
        lastName: 'Doe'
      });
    });

    it('should return empty object for empty group', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {}
      };

      const element = groupField.render(config, {});
      const extracted = groupField.extract(element);

      expect(extracted).toEqual({});
    });

    it('should handle nested groups', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          name: { type: 'text', label: 'Name' },
          address: {
            type: 'group',
            fields: {
              street: { type: 'text', label: 'Street' },
              city: { type: 'text', label: 'City' }
            }
          }
        }
      };

      const element = groupField.render(config, {});
      const inputs = element.querySelectorAll('input[type="text"]');

      (inputs[0] as HTMLInputElement).value = 'John';
      (inputs[1] as HTMLInputElement).value = '123 Main St';
      (inputs[2] as HTMLInputElement).value = 'Springfield';

      const extracted = groupField.extract(element);

      expect(extracted).toEqual({
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'Springfield'
        }
      });
    });
  });

  describe('Validation', () => {
    it('should validate required group fields', () => {
      const config: FieldConfigData = {
        type: 'group',
        required: true,
        fields: {
          name: { type: 'text', label: 'Name' }
        }
      };

      const result1 = groupField.validate(config, null);
      expect(result1.valid).toBe(false);

      const result2 = groupField.validate(config, {});
      expect(result2.valid).toBe(false);

      const result3 = groupField.validate(config, { name: 'John' });
      expect(result3.valid).toBe(true);
    });

    it('should validate sub-field requirements', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          name: { type: 'text', label: 'Name', required: true },
          age: { type: 'number', label: 'Age' }
        }
      };

      const result1 = groupField.validate(config, { age: 25 });
      expect(result1.valid).toBe(false);
      expect(result1.errors[0].message).toContain('Name');

      const result2 = groupField.validate(config, { name: 'John', age: 25 });
      expect(result2.valid).toBe(true);
    });

    it('should validate nested groups', () => {
      const config: FieldConfigData = {
        type: 'group',
        fields: {
          user: {
            type: 'group',
            fields: {
              email: { type: 'email', label: 'Email', required: true }
            }
          }
        }
      };

      const result1 = groupField.validate(config, {});
      expect(result1.valid).toBe(false);

      const result2 = groupField.validate(config, { user: { email: 'john@example.com' } });
      expect(result2.valid).toBe(true);
    });

    it('should allow empty non-required groups', () => {
      const config: FieldConfigData = {
        type: 'group',
        required: false,
        fields: {
          optional: { type: 'text', label: 'Optional' }
        }
      };

      const result = groupField.validate(config, null);
      expect(result.valid).toBe(true);
    });
  });

  describe('Collapsible Behavior', () => {
    it('should toggle collapsed state when header is clicked', () => {
      const config: FieldConfigData = {
        type: 'group',
        label: 'Settings',
        collapsible: true,
        fields: {
          option: { type: 'text', label: 'Option' }
        }
      };

      const element = groupField.render(config, {});
      const header = element.querySelector('.group-field__header') as HTMLElement;

      expect(element.classList.contains('group-field--collapsed')).toBe(false);

      header.click();
      expect(element.classList.contains('group-field--collapsed')).toBe(true);

      header.click();
      expect(element.classList.contains('group-field--collapsed')).toBe(false);
    });
  });
});