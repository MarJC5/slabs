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

  describe('conditional field validation', () => {
    it('should skip validation for conditionally hidden field', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced'
        },
        advancedSettings: {
          type: 'text',
          label: 'Advanced Settings',
          required: true,
          conditional: {
            field: 'showAdvanced',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        showAdvanced: false,
        advancedSettings: '' // Empty but hidden
      };

      const result = validator.validate(fields, data);

      // Should be valid because advancedSettings is hidden
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate conditionally visible field', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced'
        },
        advancedSettings: {
          type: 'text',
          label: 'Advanced Settings',
          required: true,
          conditional: {
            field: 'showAdvanced',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        showAdvanced: true,
        advancedSettings: '' // Empty and visible
      };

      const result = validator.validate(fields, data);

      // Should be invalid because advancedSettings is visible and required
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]?.field).toBe('Advanced Settings');
    });

    it('should handle multiple conditional fields correctly', () => {
      const fields: Record<string, FieldConfigData> = {
        layoutType: {
          type: 'select',
          label: 'Layout',
          options: [
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' }
          ]
        },
        columns: {
          type: 'number',
          label: 'Columns',
          required: true,
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'grid'
          }
        },
        itemsPerRow: {
          type: 'number',
          label: 'Items Per Row',
          required: true,
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'grid'
          }
        }
      };

      const data = {
        layoutType: 'list',
        columns: undefined, // Missing but hidden
        itemsPerRow: undefined // Missing but hidden
      };

      const result = validator.validate(fields, data);

      // Should be valid because both conditional fields are hidden
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate only visible conditional fields in mixed scenario', () => {
      const fields: Record<string, FieldConfigData> = {
        enableFeatureA: {
          type: 'boolean',
          label: 'Enable Feature A'
        },
        enableFeatureB: {
          type: 'boolean',
          label: 'Enable Feature B'
        },
        featureAConfig: {
          type: 'text',
          label: 'Feature A Config',
          required: true,
          conditional: {
            field: 'enableFeatureA',
            operator: '==',
            value: true
          }
        },
        featureBConfig: {
          type: 'text',
          label: 'Feature B Config',
          required: true,
          conditional: {
            field: 'enableFeatureB',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        enableFeatureA: true,
        enableFeatureB: false,
        featureAConfig: '', // Empty and visible - should fail
        featureBConfig: '' // Empty but hidden - should pass
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.field).toBe('Feature A Config');
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.featureAConfig).toBeDefined();
      expect(result.fieldErrors?.featureBConfig).toBeUndefined();
    });

    it('should handle chained conditionals', () => {
      const fields: Record<string, FieldConfigData> = {
        enableCustomization: {
          type: 'boolean',
          label: 'Enable Customization'
        },
        customizationType: {
          type: 'select',
          label: 'Customization Type',
          options: [
            { value: 'color', label: 'Color' },
            { value: 'layout', label: 'Layout' }
          ],
          conditional: {
            field: 'enableCustomization',
            operator: '==',
            value: true
          }
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          required: true,
          conditional: {
            field: 'customizationType',
            operator: '==',
            value: 'color'
          }
        }
      };

      const data = {
        enableCustomization: false,
        customizationType: undefined,
        backgroundColor: '' // Missing but double-hidden
      };

      const result = validator.validate(fields, data);

      // backgroundColor should be skipped because customizationType is hidden
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle missing watched field gracefully', () => {
      const fields: Record<string, FieldConfigData> = {
        conditionalField: {
          type: 'text',
          label: 'Conditional Field',
          required: true,
          conditional: {
            field: 'nonExistentField',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        conditionalField: ''
      };

      // Should skip validation because watched field doesn't exist
      const result = validator.validate(fields, data);
      expect(result.valid).toBe(true);
    });

    it('should handle comparison operators for conditionals', () => {
      const fields: Record<string, FieldConfigData> = {
        quantity: {
          type: 'number',
          label: 'Quantity'
        },
        bulkDiscount: {
          type: 'number',
          label: 'Bulk Discount',
          required: true,
          conditional: {
            field: 'quantity',
            operator: '>',
            value: 10
          }
        }
      };

      const dataHidden = {
        quantity: 5,
        bulkDiscount: undefined
      };

      const resultHidden = validator.validate(fields, dataHidden);
      expect(resultHidden.valid).toBe(true);

      const dataVisible = {
        quantity: 15,
        bulkDiscount: undefined
      };

      const resultVisible = validator.validate(fields, dataVisible);
      expect(resultVisible.valid).toBe(false);
    });

    it('should handle empty/not_empty operators', () => {
      const fields: Record<string, FieldConfigData> = {
        customTitle: {
          type: 'text',
          label: 'Custom Title'
        },
        titleStyle: {
          type: 'select',
          label: 'Title Style',
          required: true,
          options: [
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' }
          ],
          conditional: {
            field: 'customTitle',
            operator: 'not_empty',
            value: null
          }
        }
      };

      const dataEmpty = {
        customTitle: '',
        titleStyle: undefined
      };

      const resultEmpty = validator.validate(fields, dataEmpty);
      expect(resultEmpty.valid).toBe(true);

      const dataNotEmpty = {
        customTitle: 'My Title',
        titleStyle: undefined
      };

      const resultNotEmpty = validator.validate(fields, dataNotEmpty);
      expect(resultNotEmpty.valid).toBe(false);
    });

    it('should validate fields without conditionals normally', () => {
      const fields: Record<string, FieldConfigData> = {
        normalField: {
          type: 'text',
          label: 'Normal Field',
          required: true
        },
        conditionalField: {
          type: 'text',
          label: 'Conditional Field',
          required: true,
          conditional: {
            field: 'trigger',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        normalField: '', // Should fail
        trigger: false,
        conditionalField: '' // Should pass (hidden)
      };

      const result = validator.validate(fields, data);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.field).toBe('Normal Field');
    });
  });
});
