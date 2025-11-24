import { describe, it, expect, beforeEach } from 'vitest';
import { TabField } from '../../../../src/domain/fields/TabField';
import { FieldRegistry } from '../../../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('TabField', () => {
  let tabField: TabField;
  let registry: FieldRegistry;

  beforeEach(() => {
    // Create registry without tabs to avoid circular dependency
    registry = new FieldRegistry();
    // Manually register all field types except tabs
    const defaultRegistry = FieldRegistry.createDefault();
    defaultRegistry.getAllTypes().forEach(type => {
      if (type !== 'tabs') {
        registry.register(type, defaultRegistry.get(type));
      }
    });

    tabField = new TabField();
    registry.register('tabs', tabField);
    tabField.setRegistry(registry);
  });

  describe('render', () => {
    it('should render tabs container', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' }
            }
          }
        }
      };

      const element = tabField.render(config, {});

      expect(element.classList.contains('slabs-tabs')).toBe(true);
      expect(element.getAttribute('data-field-type')).toBe('tabs');
    });

    it('should render tab buttons for each tab', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' }
            }
          },
          advanced: {
            type: 'text',
            label: 'Advanced',
            fields: {
              apiKey: { type: 'text', label: 'API Key' }
            }
          }
        }
      };

      const element = tabField.render(config, {});
      const buttons = element.querySelectorAll('.slabs-tabs__button');

      expect(buttons.length).toBe(2);
      expect(buttons[0]?.textContent).toBe('General');
      expect(buttons[1]?.textContent).toBe('Advanced');
    });

    it('should render tab panels for each tab', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' }
            }
          },
          advanced: {
            type: 'text',
            label: 'Advanced',
            fields: {
              apiKey: { type: 'text', label: 'API Key' }
            }
          }
        }
      };

      const element = tabField.render(config, {});
      const panels = element.querySelectorAll('.slabs-tabs__panel');

      expect(panels.length).toBe(2);
      expect(panels[0]?.getAttribute('data-tab')).toBe('general');
      expect(panels[1]?.getAttribute('data-tab')).toBe('advanced');
    });

    it('should make first tab active by default', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {}
          },
          advanced: {
            type: 'text',
            label: 'Advanced',
            fields: {}
          }
        }
      };

      const element = tabField.render(config, {});
      const buttons = element.querySelectorAll('.slabs-tabs__button');
      const panels = element.querySelectorAll('.slabs-tabs__panel');

      expect(buttons[0]?.classList.contains('slabs-tabs__button--active')).toBe(true);
      expect(buttons[1]?.classList.contains('slabs-tabs__button--active')).toBe(false);
      expect(panels[0]?.classList.contains('slabs-tabs__panel--hidden')).toBe(false);
      expect(panels[1]?.classList.contains('slabs-tabs__panel--hidden')).toBe(true);
    });

    it('should render fields within each tab panel', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' },
              email: { type: 'email', label: 'Email' }
            }
          }
        }
      };

      const element = tabField.render(config, {});
      const panel = element.querySelector('.slabs-tabs__panel');
      const fields = panel?.querySelectorAll('.slabs-field');

      expect(fields?.length).toBe(2);
    });

    it('should apply custom className', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        className: 'custom-tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {}
          }
        }
      };

      const element = tabField.render(config, {});

      expect(element.classList.contains('custom-tabs')).toBe(true);
    });

    it('should handle empty fields configuration', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {}
      };

      const element = tabField.render(config, {});
      const buttons = element.querySelectorAll('.slabs-tabs__button');

      expect(buttons.length).toBe(0);
    });

    it('should pass values to nested fields', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' }
            }
          }
        }
      };

      const value = {
        general: {
          name: 'John Doe'
        }
      };

      const element = tabField.render(config, value);
      const input = element.querySelector('input[type="text"]') as HTMLInputElement;

      expect(input?.value).toBe('John Doe');
    });
  });

  describe('tab switching', () => {
    it('should switch tabs when clicking tab button', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          tab1: {
            type: 'text',
            label: 'Tab 1',
            fields: {}
          },
          tab2: {
            type: 'text',
            label: 'Tab 2',
            fields: {}
          }
        }
      };

      const element = tabField.render(config, {});
      const buttons = element.querySelectorAll('.slabs-tabs__button');
      const panels = element.querySelectorAll('.slabs-tabs__panel');

      // Click second tab
      (buttons[1] as HTMLButtonElement).click();

      expect(buttons[0]?.classList.contains('slabs-tabs__button--active')).toBe(false);
      expect(buttons[1]?.classList.contains('slabs-tabs__button--active')).toBe(true);
      expect(panels[0]?.classList.contains('slabs-tabs__panel--hidden')).toBe(true);
      expect(panels[1]?.classList.contains('slabs-tabs__panel--hidden')).toBe(false);
    });
  });

  describe('extract', () => {
    it('should extract values from all tabs', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name' }
            }
          },
          advanced: {
            type: 'text',
            label: 'Advanced',
            fields: {
              apiKey: { type: 'text', label: 'API Key' }
            }
          }
        }
      };

      const element = tabField.render(config, {
        general: { name: 'Test' },
        advanced: { apiKey: 'secret' }
      });

      const extracted = tabField.extract(element);

      expect(extracted).toEqual({
        general: { name: 'Test' },
        advanced: { apiKey: 'secret' }
      });
    });

    it('should extract values even from hidden tabs', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          tab1: {
            type: 'text',
            label: 'Tab 1',
            fields: {
              field1: { type: 'text', label: 'Field 1' }
            }
          },
          tab2: {
            type: 'text',
            label: 'Tab 2',
            fields: {
              field2: { type: 'text', label: 'Field 2' }
            }
          }
        }
      };

      const element = tabField.render(config, {
        tab1: { field1: 'value1' },
        tab2: { field2: 'value2' }
      });

      // Even though tab2 is hidden, its values should be extracted
      const extracted = tabField.extract(element);

      expect(extracted.tab1).toEqual({ field1: 'value1' });
      expect(extracted.tab2).toEqual({ field2: 'value2' });
    });
  });

  describe('validate', () => {
    it('should validate all fields in all tabs', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name', required: true }
            }
          }
        }
      };

      const result = tabField.validate(config, {
        general: { name: '' }
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should pass validation when all fields are valid', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name', required: true }
            }
          }
        }
      };

      const result = tabField.validate(config, {
        general: { name: 'John' }
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should prefix errors with tab name', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General Settings',
            fields: {
              name: { type: 'text', label: 'Name', required: true }
            }
          }
        }
      };

      const result = tabField.validate(config, {
        general: { name: '' }
      });

      expect(result.errors[0]?.field).toContain('General Settings >');
    });

    it('should validate fields across multiple tabs', () => {
      const config: FieldConfigData = {
        type: 'tabs',
        fields: {
          general: {
            type: 'text',
            label: 'General',
            fields: {
              name: { type: 'text', label: 'Name', required: true }
            }
          },
          advanced: {
            type: 'text',
            label: 'Advanced',
            fields: {
              apiKey: { type: 'text', label: 'API Key', required: true }
            }
          }
        }
      };

      const result = tabField.validate(config, {
        general: { name: '' },
        advanced: { apiKey: '' }
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });
});
