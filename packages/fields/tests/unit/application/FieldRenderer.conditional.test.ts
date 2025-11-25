/**
 * FieldRenderer Conditional Logic Integration Tests
 * Tests the application layer integration of conditional field visibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FieldRenderer } from '../../../src/application/FieldRenderer';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../src/domain/types';

describe('FieldRenderer - Conditional Logic', () => {
  let renderer: FieldRenderer;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    renderer = new FieldRenderer(registry);
  });

  describe('initial visibility', () => {
    it('should hide field initially when condition is not met', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced Options'
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

      const data = { showAdvanced: false };
      const container = renderer.render(fields, data);

      const advancedField = container.querySelector('[data-field-name="advancedSettings"]') as HTMLElement;

      expect(advancedField).toBeTruthy();
      expect(advancedField.style.display).toBe('none');
      expect(advancedField.dataset.conditionalHidden).toBe('true');
    });

    it('should show field initially when condition is met', () => {
      const fields: Record<string, FieldConfigData> = {
        showAdvanced: {
          type: 'boolean',
          label: 'Show Advanced Options'
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

      const data = { showAdvanced: true };
      const container = renderer.render(fields, data);

      const advancedField = container.querySelector('[data-field-name="advancedSettings"]') as HTMLElement;

      expect(advancedField).toBeTruthy();
      expect(advancedField.style.display).not.toBe('none');
      expect(advancedField.dataset.conditionalHidden).toBeUndefined();
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

      const data = { layoutType: 'list' };
      const container = renderer.render(fields, data);

      const columnsField = container.querySelector('[data-field-name="columns"]') as HTMLElement;
      const itemsField = container.querySelector('[data-field-name="itemsPerRow"]') as HTMLElement;

      expect(columnsField.dataset.conditionalHidden).toBe('true');
      expect(itemsField.dataset.conditionalHidden).toBe('true');
    });

    it('should add data-field-name attribute to all fields', () => {
      const fields: Record<string, FieldConfigData> = {
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' }
      };

      const container = renderer.render(fields, {});

      const titleField = container.querySelector('[data-field-name="title"]');
      const descField = container.querySelector('[data-field-name="description"]');

      expect(titleField).toBeTruthy();
      expect(descField).toBeTruthy();
    });
  });

  describe('dynamic visibility toggling', () => {
    it('should show field when select value changes to match condition', async () => {
      const fields: Record<string, FieldConfigData> = {
        contentType: {
          type: 'select',
          label: 'Content Type',
          options: [
            { value: 'text', label: 'Text' },
            { value: 'image', label: 'Image' }
          ]
        },
        imageUrl: {
          type: 'text',
          label: 'Image URL',
          conditional: {
            field: 'contentType',
            operator: '==',
            value: 'image'
          }
        }
      };

      const data = { contentType: 'text' };
      const container = renderer.render(fields, data);

      // Initially hidden
      const imageField = container.querySelector('[data-field-name="imageUrl"]') as HTMLElement;
      expect(imageField.dataset.conditionalHidden).toBe('true');

      // Change select value
      const select = container.querySelector('select') as HTMLSelectElement;
      select.value = 'image';

      // Dispatch both change and input events
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));

      // Wait for any animations
      await new Promise(resolve => setTimeout(resolve, 250));

      // Should be visible now
      expect(imageField.style.display).not.toBe('none');
      expect(imageField.dataset.conditionalHidden).toBeUndefined();
    });

    it('should hide field when condition no longer matches', async () => {
      const fields: Record<string, FieldConfigData> = {
        enableFeature: {
          type: 'boolean',
          label: 'Enable Feature'
        },
        featureConfig: {
          type: 'text',
          label: 'Feature Configuration',
          conditional: {
            field: 'enableFeature',
            operator: '==',
            value: true
          }
        }
      };

      const data = { enableFeature: true };
      const container = renderer.render(fields, data);

      const configField = container.querySelector('[data-field-name="featureConfig"]') as HTMLElement;
      expect(configField.style.display).not.toBe('none');

      // Uncheck checkbox
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(configField.style.display).toBe('none');
      expect(configField.dataset.conditionalHidden).toBe('true');
    });

    it('should handle number field conditions with comparison operators', async () => {
      const fields: Record<string, FieldConfigData> = {
        quantity: {
          type: 'number',
          label: 'Quantity',
          min: 0,
          max: 100
        },
        bulkDiscount: {
          type: 'number',
          label: 'Bulk Discount %',
          conditional: {
            field: 'quantity',
            operator: '>',
            value: 10
          }
        }
      };

      const data = { quantity: 5 };
      const container = renderer.render(fields, data);

      const discountField = container.querySelector('[data-field-name="bulkDiscount"]') as HTMLElement;
      expect(discountField.dataset.conditionalHidden).toBe('true');

      // Change quantity to trigger condition
      const numberInput = container.querySelector('input[type="number"]') as HTMLInputElement;
      numberInput.value = '15';
      numberInput.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(discountField.style.display).not.toBe('none');
    });

    it('should handle empty/not_empty conditions', async () => {
      const fields: Record<string, FieldConfigData> = {
        customTitle: {
          type: 'text',
          label: 'Custom Title (optional)',
          placeholder: 'Leave empty for default'
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

      const data = { customTitle: '' };
      const container = renderer.render(fields, data);

      const styleField = container.querySelector('[data-field-name="titleStyle"]') as HTMLElement;
      expect(styleField.dataset.conditionalHidden).toBe('true');

      // Enter text
      const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
      textInput.value = 'My Title';
      textInput.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 250));

      expect(styleField.style.display).not.toBe('none');
    });
  });

  describe('chained conditionals', () => {
    it('should handle field depending on another conditional field', async () => {
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

      const data = { enableCustomization: false };
      const container = renderer.render(fields, data);

      const typeField = container.querySelector('[data-field-name="customizationType"]') as HTMLElement;
      const colorField = container.querySelector('[data-field-name="backgroundColor"]') as HTMLElement;

      // Both should be hidden initially
      expect(typeField.dataset.conditionalHidden).toBe('true');
      expect(colorField.dataset.conditionalHidden).toBe('true');

      // Enable customization
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 250));

      // Type field should show, color field still hidden
      expect(typeField.style.display).not.toBe('none');
      expect(colorField.dataset.conditionalHidden).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('should handle missing watched field gracefully', () => {
      const fields: Record<string, FieldConfigData> = {
        visibleField: {
          type: 'text',
          label: 'Visible Field',
          conditional: {
            field: 'nonExistentField',
            operator: '==',
            value: true
          }
        }
      };

      const data = {};

      // Should not throw
      expect(() => {
        const container = renderer.render(fields, data);
        const field = container.querySelector('[data-field-name="visibleField"]') as HTMLElement;
        // Should be hidden when watched field is undefined
        expect(field.dataset.conditionalHidden).toBe('true');
      }).not.toThrow();
    });

    it('should handle fields without conditionals normally', () => {
      const fields: Record<string, FieldConfigData> = {
        normalField: {
          type: 'text',
          label: 'Normal Field'
        },
        conditionalField: {
          type: 'text',
          label: 'Conditional Field',
          conditional: {
            field: 'normalField',
            operator: 'not_empty',
            value: null
          }
        }
      };

      const data = { normalField: 'value' };
      const container = renderer.render(fields, data);

      const normalField = container.querySelector('[data-field-name="normalField"]') as HTMLElement;
      const condField = container.querySelector('[data-field-name="conditionalField"]') as HTMLElement;

      expect(normalField.style.display).not.toBe('none');
      expect(condField.style.display).not.toBe('none');
    });
  });
});
