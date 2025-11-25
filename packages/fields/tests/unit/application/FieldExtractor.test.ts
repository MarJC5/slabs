import { describe, it, expect, beforeEach } from 'vitest';
import { FieldExtractor } from '../../../src/application/FieldExtractor';
import { FieldRenderer } from '../../../src/application/FieldRenderer';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../src/domain/types';

describe('FieldExtractor', () => {
  let extractor: FieldExtractor;
  let renderer: FieldRenderer;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    extractor = new FieldExtractor(registry);
    renderer = new FieldRenderer(registry);
  });

  describe('extractField', () => {
    it('should extract value from text field', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = renderer.renderField('name', config, 'John Doe');
      const value = extractor.extractField(element);

      expect(value).toBe('John Doe');
    });

    it('should extract value from number field', () => {
      const config: FieldConfigData = {
        type: 'number',
        label: 'Age'
      };

      const element = renderer.renderField('age', config, 42);
      const value = extractor.extractField(element);

      expect(value).toBe(42);
    });

    it('should extract value from select field', () => {
      const config: FieldConfigData = {
        type: 'select',
        label: 'Country',
        options: [
          { value: 'us', label: 'US' },
          { value: 'uk', label: 'UK' }
        ]
      };

      const element = renderer.renderField('country', config, 'us');
      const value = extractor.extractField(element);

      expect(value).toBe('us');
    });

    it('should extract modified value from input', () => {
      const config: FieldConfigData = {
        type: 'text',
        label: 'Name'
      };

      const element = renderer.renderField('name', config, 'John');
      const input = element.querySelector('.slabs-field__input') as HTMLInputElement;
      input.value = 'Jane Doe';

      const value = extractor.extractField(element);

      expect(value).toBe('Jane Doe');
    });

    it('should return null if input element not found', () => {
      const div = document.createElement('div');
      div.classList.add('slabs-field');

      const value = extractor.extractField(div);

      expect(value).toBeNull();
    });
  });

  describe('extract', () => {
    it('should extract data from multiple fields', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name'
        },
        email: {
          type: 'text',
          label: 'Email'
        },
        age: {
          type: 'number',
          label: 'Age'
        }
      };

      const initialData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const container = renderer.render(fields, initialData);
      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      });
    });

    it('should extract modified values', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name'
        },
        age: {
          type: 'number',
          label: 'Age'
        }
      };

      const container = renderer.render(fields, { name: 'John', age: 30 });

      // Modify values
      const nameInput = container.querySelector('[data-field-name="name"] input') as HTMLInputElement;
      const ageInput = container.querySelector('[data-field-name="age"] input') as HTMLInputElement;
      nameInput.value = 'Jane Doe';
      ageInput.value = '25';

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({
        name: 'Jane Doe',
        age: 25
      });
    });

    it('should handle empty container', () => {
      const container = document.createElement('div');
      container.classList.add('slabs-fields');

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({});
    });

    it('should skip fields without data-field-name', () => {
      const container = document.createElement('div');
      const field = document.createElement('div');
      field.classList.add('slabs-field');
      const input = document.createElement('input');
      input.value = 'test';
      field.appendChild(input);
      container.appendChild(field);

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({});
    });

    it('should extract select field with multiple selections', () => {
      const fields: Record<string, FieldConfigData> = {
        tags: {
          type: 'select',
          label: 'Tags',
          multiple: true,
          options: [
            { value: 'js', label: 'JavaScript' },
            { value: 'ts', label: 'TypeScript' },
            { value: 'py', label: 'Python' }
          ]
        }
      };

      const container = renderer.render(fields, { tags: ['js', 'ts'] });
      const extractedData = extractor.extract(container);

      expect(extractedData.tags).toEqual(['js', 'ts']);
    });

    it('should handle fields with no input element', () => {
      const container = document.createElement('div');
      const field = document.createElement('div');
      field.classList.add('slabs-field');
      field.setAttribute('data-field-name', 'test');
      container.appendChild(field);

      const extractedData = extractor.extract(container);

      expect(extractedData).toEqual({ test: null });
    });
  });

  describe('conditional field extraction', () => {
    it('should set conditionally hidden field to null', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced'
        },
        advancedSettings: {
          type: 'text',
          label: 'Advanced Settings',
          conditional: {
            field: 'showAdvanced',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        showAdvanced: false,
        advancedSettings: 'some value'
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      // Hidden field should be set to null
      expect(extractedData.showAdvanced).toBe(false);
      expect(extractedData.advancedSettings).toBeNull();
    });

    it('should extract conditionally visible field normally', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced'
        },
        advancedSettings: {
          type: 'text',
          label: 'Advanced Settings',
          conditional: {
            field: 'showAdvanced',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        showAdvanced: true,
        advancedSettings: 'my settings'
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      // Visible field should be extracted normally
      expect(extractedData.showAdvanced).toBe(true);
      expect(extractedData.advancedSettings).toBe('my settings');
    });

    it('should handle multiple conditional fields', () => {
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
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'grid'
          }
        },
        itemsPerRow: {
          type: 'number',
          label: 'Items Per Row',
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'grid'
          }
        }
      };

      const data = {
        layoutType: 'list',
        columns: 3,
        itemsPerRow: 4
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      // Both hidden fields should be null
      expect(extractedData.layoutType).toBe('list');
      expect(extractedData.columns).toBeNull();
      expect(extractedData.itemsPerRow).toBeNull();
    });

    it('should extract mixed visible and hidden conditional fields', () => {
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
          conditional: {
            field: 'enableFeatureA',
            operator: '==',
            value: true
          }
        },
        featureBConfig: {
          type: 'text',
          label: 'Feature B Config',
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
        featureAConfig: 'config A',
        featureBConfig: 'config B'
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      expect(extractedData.enableFeatureA).toBe(true);
      expect(extractedData.enableFeatureB).toBe(false);
      expect(extractedData.featureAConfig).toBe('config A'); // Visible
      expect(extractedData.featureBConfig).toBeNull(); // Hidden
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
          conditional: {
            field: 'customizationType',
            operator: '==',
            value: 'color'
          }
        }
      };

      const data = {
        enableCustomization: false,
        customizationType: 'color',
        backgroundColor: '#ff0000'
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      expect(extractedData.enableCustomization).toBe(false);
      expect(extractedData.customizationType).toBeNull(); // Hidden
      expect(extractedData.backgroundColor).toBeNull(); // Double hidden
    });

    it('should handle comparison operators', () => {
      const fields: Record<string, FieldConfigData> = {
        quantity: {
          type: 'number',
          label: 'Quantity'
        },
        bulkDiscount: {
          type: 'number',
          label: 'Bulk Discount',
          conditional: {
            field: 'quantity',
            operator: '>',
            value: 10
          }
        }
      };

      const dataHidden = {
        quantity: 5,
        bulkDiscount: 15
      };

      const containerHidden = renderer.render(fields, dataHidden);
      const extractedHidden = extractor.extract(containerHidden, fields);

      expect(extractedHidden.quantity).toBe(5);
      expect(extractedHidden.bulkDiscount).toBeNull(); // Hidden (5 <= 10)

      const dataVisible = {
        quantity: 15,
        bulkDiscount: 20
      };

      const containerVisible = renderer.render(fields, dataVisible);
      const extractedVisible = extractor.extract(containerVisible, fields);

      expect(extractedVisible.quantity).toBe(15);
      expect(extractedVisible.bulkDiscount).toBe(20); // Visible (15 > 10)
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
        titleStyle: 'bold'
      };

      const containerEmpty = renderer.render(fields, dataEmpty);
      const extractedEmpty = extractor.extract(containerEmpty, fields);

      expect(extractedEmpty.customTitle).toBe('');
      expect(extractedEmpty.titleStyle).toBeNull(); // Hidden

      const dataNotEmpty = {
        customTitle: 'My Title',
        titleStyle: 'italic'
      };

      const containerNotEmpty = renderer.render(fields, dataNotEmpty);
      const extractedNotEmpty = extractor.extract(containerNotEmpty, fields);

      expect(extractedNotEmpty.customTitle).toBe('My Title');
      expect(extractedNotEmpty.titleStyle).toBe('italic'); // Visible
    });

    it('should extract fields without conditionals normally', () => {
      const fields: Record<string, FieldConfigData> = {
        normalField: {
          type: 'text',
          label: 'Normal Field'
        },
        conditionalField: {
          type: 'text',
          label: 'Conditional Field',
          conditional: {
            field: 'trigger',
            operator: '==',
            value: true
          }
        }
      };

      const data = {
        normalField: 'always visible',
        trigger: false,
        conditionalField: 'hidden value'
      };

      const container = renderer.render(fields, data);
      const extractedData = extractor.extract(container, fields);

      expect(extractedData.normalField).toBe('always visible');
      expect(extractedData.conditionalField).toBeNull();
    });

    it('should work without fields parameter (backward compatibility)', () => {
      const fields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name'
        },
        age: {
          type: 'number',
          label: 'Age'
        }
      };

      const data = {
        name: 'John Doe',
        age: 30
      };

      const container = renderer.render(fields, data);
      // Call without fields parameter
      const extractedData = extractor.extract(container);

      expect(extractedData.name).toBe('John Doe');
      expect(extractedData.age).toBe(30);
    });
  });
});
