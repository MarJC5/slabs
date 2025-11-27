import { describe, it, expect } from 'vitest';
import { Field } from '../../../../src/domain/entities/Field';
import { FieldType } from '../../../../src/domain/value-objects/FieldType';

describe('Field', () => {
  describe('constructor', () => {
    it('should create valid field with required properties', () => {
      const fieldType = new FieldType('text');
      const field = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });

      expect(field.name).toBe('firstName');
      expect(field.type).toBe(fieldType);
      expect(field.label).toBe('First Name');
      expect(field.required).toBe(false); // default
    });

    it('should create field with all properties', () => {
      const fieldType = new FieldType('text');
      const field = new Field({
        name: 'email',
        type: fieldType,
        label: 'Email Address',
        required: true,
        placeholder: 'Enter your email',
        defaultValue: 'user@example.com',
        options: { minLength: 5, maxLength: 100 }
      });

      expect(field.name).toBe('email');
      expect(field.type).toBe(fieldType);
      expect(field.label).toBe('Email Address');
      expect(field.required).toBe(true);
      expect(field.placeholder).toBe('Enter your email');
      expect(field.defaultValue).toBe('user@example.com');
      expect(field.options).toEqual({ minLength: 5, maxLength: 100 });
    });

    it('should throw error for invalid field name (not camelCase)', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: 'First-Name',
        type: fieldType,
        label: 'First Name'
      })).toThrow('Field name must be camelCase');
    });

    it('should throw error for field name starting with uppercase', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: 'FirstName',
        type: fieldType,
        label: 'First Name'
      })).toThrow('Field name must be camelCase');
    });

    it('should throw error for field name with spaces', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: 'first name',
        type: fieldType,
        label: 'First Name'
      })).toThrow('Field name must be camelCase');
    });

    it('should throw error for field name with special characters', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: 'first_name',
        type: fieldType,
        label: 'First Name'
      })).toThrow('Field name must be camelCase');
    });

    it('should throw error for empty field name', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: '',
        type: fieldType,
        label: 'First Name'
      })).toThrow('Field name must be camelCase');
    });

    it('should allow valid camelCase names', () => {
      const fieldType = new FieldType('text');

      const validNames = [
        'firstName',
        'lastName',
        'phoneNumber',
        'address1',
        'myField123',
        'field',
        'a',
        'camelCaseFieldName'
      ];

      validNames.forEach(name => {
        expect(() => new Field({
          name,
          type: fieldType,
          label: 'Label'
        })).not.toThrow();
      });
    });

    it('should throw error for field name with only numbers', () => {
      const fieldType = new FieldType('text');

      expect(() => new Field({
        name: '123',
        type: fieldType,
        label: 'Label'
      })).toThrow('Field name must be camelCase');
    });

    it('should allow field name starting with lowercase letter followed by numbers', () => {
      const fieldType = new FieldType('text');

      const field = new Field({
        name: 'address123',
        type: fieldType,
        label: 'Address'
      });

      expect(field.name).toBe('address123');
    });
  });

  describe('toJSON', () => {
    it('should convert field to JSON with minimal properties', () => {
      const fieldType = new FieldType('text');
      const field = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });

      const json = field.toJSON();

      expect(json).toEqual({
        type: 'text',
        label: 'First Name',
        required: false
      });
    });

    it('should convert field to JSON with all properties', () => {
      const fieldType = new FieldType('text');
      const field = new Field({
        name: 'email',
        type: fieldType,
        label: 'Email Address',
        required: true,
        placeholder: 'Enter your email',
        defaultValue: 'user@example.com',
        options: { minLength: 5, maxLength: 100 }
      });

      const json = field.toJSON();

      expect(json).toEqual({
        type: 'text',
        label: 'Email Address',
        required: true,
        placeholder: 'Enter your email',
        default: 'user@example.com',
        minLength: 5,
        maxLength: 100
      });
    });

    it('should omit undefined properties from JSON', () => {
      const fieldType = new FieldType('checkbox');
      const field = new Field({
        name: 'agreeToTerms',
        type: fieldType,
        label: 'Agree to Terms',
        required: true
      });

      const json = field.toJSON();

      expect(json).toEqual({
        type: 'checkbox',
        label: 'Agree to Terms',
        required: true
      });
      expect(json).not.toHaveProperty('placeholder');
      expect(json).not.toHaveProperty('default');
    });

    it('should spread options into JSON', () => {
      const fieldType = new FieldType('select');
      const field = new Field({
        name: 'country',
        type: fieldType,
        label: 'Country',
        options: {
          choices: ['USA', 'Canada', 'Mexico'],
          multiple: false
        }
      });

      const json = field.toJSON();

      expect(json).toEqual({
        type: 'select',
        label: 'Country',
        required: false,
        choices: ['USA', 'Canada', 'Mexico'],
        multiple: false
      });
    });
  });

  describe('equals', () => {
    it('should return true for fields with same name', () => {
      const fieldType = new FieldType('text');
      const field1 = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });
      const field2 = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });

      expect(field1.equals(field2)).toBe(true);
    });

    it('should return false for fields with different names', () => {
      const fieldType = new FieldType('text');
      const field1 = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });
      const field2 = new Field({
        name: 'lastName',
        type: fieldType,
        label: 'Last Name'
      });

      expect(field1.equals(field2)).toBe(false);
    });

    it('should return true for fields with same name but different properties', () => {
      const fieldType = new FieldType('text');
      const field1 = new Field({
        name: 'email',
        type: fieldType,
        label: 'Email'
      });
      const field2 = new Field({
        name: 'email',
        type: new FieldType('text'),
        label: 'Email Address',
        required: true
      });

      expect(field1.equals(field2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return field name as string', () => {
      const fieldType = new FieldType('text');
      const field = new Field({
        name: 'firstName',
        type: fieldType,
        label: 'First Name'
      });

      expect(field.toString()).toBe('firstName');
    });

    it('should return field name for complex field', () => {
      const fieldType = new FieldType('wysiwyg');
      const field = new Field({
        name: 'description',
        type: fieldType,
        label: 'Description',
        required: true,
        options: { mode: 'full' }
      });

      expect(field.toString()).toBe('description');
    });
  });

  describe('validation rules', () => {
    it('should enforce camelCase pattern', () => {
      const fieldType = new FieldType('text');

      const invalidNames = [
        'First-Name',      // kebab-case
        'first_name',      // snake_case
        'FirstName',       // PascalCase
        'FIRSTNAME',       // UPPERCASE
        'first name',      // spaces
        'first.name',      // dots
        'first@name',      // special chars
        '123field',        // starts with number
        'field-name',      // contains hyphen
        'field_name',      // contains underscore
        'field Name',      // contains space
      ];

      invalidNames.forEach(name => {
        expect(() => new Field({
          name,
          type: fieldType,
          label: 'Label'
        })).toThrow('Field name must be camelCase');
      });
    });

    it('should accept valid camelCase patterns', () => {
      const fieldType = new FieldType('text');

      const validNames = [
        'field',
        'fieldName',
        'myField',
        'field1',
        'field123',
        'myField123',
        'camelCaseFieldName',
        'a',
        'aB',
      ];

      validNames.forEach(name => {
        const field = new Field({
          name,
          type: fieldType,
          label: 'Label'
        });
        expect(field.name).toBe(name);
      });
    });
  });

  describe('field type integration', () => {
    it('should work with text field type', () => {
      const field = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      expect(field.type.value).toBe('text');
    });

    it('should work with wysiwyg field type', () => {
      const field = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content'
      });

      expect(field.type.value).toBe('wysiwyg');
    });

    it('should work with select field type', () => {
      const field = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: {
          choices: ['Option 1', 'Option 2']
        }
      });

      expect(field.type.value).toBe('select');
    });

    it('should work with all valid field types', () => {
      const validTypes = FieldType.all();

      validTypes.forEach(type => {
        const field = new Field({
          name: 'testField',
          type: new FieldType(type),
          label: 'Test Field'
        });

        expect(field.type.value).toBe(type);
      });
    });
  });
});
