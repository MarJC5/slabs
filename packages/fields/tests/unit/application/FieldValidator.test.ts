import { describe, it, expect, beforeEach } from 'vitest';
import { FieldValidator } from '../../../src/application/FieldValidator';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../src/domain/types';

describe('FieldValidator', () => {
  let validator: FieldValidator;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    validator = new FieldValidator(registry);
  });

  describe('validateField', () => {
    it('should validate a single text field', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name',
        required: true
      };

      const result = validator.validateField(config, 'John Doe');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid field', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name',
        required: true
      };

      const result = validator.validateField(config, '');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]?.message).toContain('required');
    });

    it('should validate number field', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age',
        min: 18,
        max: 100
      };

      const result = validator.validateField(config, 25);

      expect(result.valid).toBe(true);
    });

    it('should fail number field validation for out of range', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age',
        min: 18,
        max: 100
      };

      const result = validator.validateField(config, 15);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('18');
    });

    it('should validate select field', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'US' },
          { value: 'uk', label: 'UK' }
        ]
      };

      const result = validator.validateField(config, 'us');

      expect(result.valid).toBe(true);
    });

    it('should fail select field validation for invalid option', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'US' },
          { value: 'uk', label: 'UK' }
        ]
      };

      const result = validator.validateField(config, 'invalid');

      expect(result.valid).toBe(false);
    });

    it('should throw error for unregistered field type', () => {
      const config: FieldConfigData = {
        type: 'unknown',
        label: 'Test'
      };

      expect(() => {
        validator.validateField(config, 'test');
      }).toThrow('not registered');
    });
  });

  describe('validate', () => {
    it('should validate multiple fields', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name',
          required: true
        },
        email: {
          type: 'text',
          label: 'Email',
          required: true
        },
        age: {
          type: 'number',
          label: 'Age',
          min: 18
        }
      };

      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect errors from multiple fields', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name',
          required: true
        },
        email: {
          type: 'text',
          label: 'Email',
          required: true
        },
        age: {
          type: 'number',
          label: 'Age',
          min: 18,
          max: 100
        }
      };

      const data = {
        name: '',
        email: '',
        age: 15
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
    });

    it('should handle empty fields object', () => {
      const result = validator.validate({}, {});

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing data values', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name',
          required: false
        },
        email: {
          type: 'text',
          label: 'Email',
          required: false
        }
      };

      const result = validator.validate(fields, {});

      expect(result.valid).toBe(true);
    });

    it('should validate all fields even if some fail', () => {
      const fields: Record<string, FieldConfigData> = {
        field1: {
          type: 'text',
          label: 'Field 1',
          required: true
        },
        field2: {
          type: 'text',
          label: 'Field 2',
          required: true
        },
        field3: {
          type: 'text',
          label: 'Field 3',
          required: true
        }
      };

      const data = {
        field1: '',
        field2: 'valid',
        field3: ''
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
      expect(result.errors.some(e => e.field === 'Field 1')).toBe(true);
      expect(result.errors.some(e => e.field === 'Field 3')).toBe(true);
    });

    it('should return fieldErrors map with errors grouped by field', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name',
          required: true,
          minLength: 5
        },
        age: {
          type: 'number',
          label: 'Age',
          min: 18
        }
      };

      const data = {
        name: 'ab',
        age: 15
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(false);
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.name).toBeDefined();
      expect(result.fieldErrors?.age).toBeDefined();
    });
  });
});
