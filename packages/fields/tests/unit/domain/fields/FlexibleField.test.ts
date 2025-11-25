import { describe, it, expect, beforeEach } from 'vitest';
import { FlexibleField } from '../../../../src/domain/fields/FlexibleField';
import type { FieldConfigData } from '../../../../src/domain/types';

describe('FlexibleField', () => {
  let flexibleField: FlexibleField;

  beforeEach(() => {
    flexibleField = new FlexibleField();
  });

  describe('render', () => {
    it('should render a flexible container with data-field-type attribute', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);

      expect(element.classList.contains('flexible-field')).toBe(true);
      expect(element.dataset.fieldType).toBe('flexible');
    });

    it('should render empty flexible field with add button', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);

      const rows = element.querySelectorAll('.flexible-row');
      const addButton = element.querySelector('.flexible-add');

      expect(rows.length).toBe(0);
      expect(addButton).toBeTruthy();
      expect(addButton?.textContent).toContain('Add Block');
    });

    it('should use custom buttonLabel if provided', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        buttonLabel: 'Add Content Block',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);
      const addButton = element.querySelector('.flexible-add');

      expect(addButton?.textContent).toBe('Add Content Block');
    });

    it('should render existing blocks from data', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          },
          image: {
            label: 'Image Block',
            fields: {
              image: { type: 'image', label: 'Image' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Hello World' } },
        { layout: 'image', fields: { image: 'image.jpg' } }
      ];

      const element = flexibleField.render(config, data);
      const rows = element.querySelectorAll('.flexible-row');

      expect(rows.length).toBe(2);
    });

    it('should render sub-fields based on layout type', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Hello' } }
      ];

      const element = flexibleField.render(config, data);
      const fields = element.querySelectorAll('.slabs-field');

      // Should have 1 field (content)
      expect(fields.length).toBe(1);
    });

    it('should set values for sub-fields from data', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test Content' } }
      ];

      const element = flexibleField.render(config, data);
      const input = element.querySelector('input[type="text"]') as HTMLInputElement;

      expect(input?.value).toBe('Test Content');
    });

    it('should display layout label in row header', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test' } }
      ];

      const element = flexibleField.render(config, data);
      const header = element.querySelector('.flexible-row__header');

      expect(header?.textContent).toContain('Text Block');
    });

    it('should render remove button for each row', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test' } }
      ];

      const element = flexibleField.render(config, data);
      const removeButton = element.querySelector('.flexible-remove');

      expect(removeButton).toBeTruthy();
      expect(removeButton?.textContent).toContain('Remove');
    });

    it('should render move up/down buttons', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test 1' } },
        { layout: 'text', fields: { content: 'Test 2' } }
      ];

      const element = flexibleField.render(config, data);
      const moveUpButton = element.querySelector('.flexible-row__move-up');
      const moveDownButton = element.querySelector('.flexible-row__move-down');

      expect(moveUpButton).toBeTruthy();
      expect(moveDownButton).toBeTruthy();
    });

    it('should support collapsible rows', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test' } }
      ];

      const element = flexibleField.render(config, data);
      const toggle = element.querySelector('.flexible-row__toggle');
      const content = element.querySelector('.flexible-row__content');

      expect(toggle).toBeTruthy();
      expect(content).toBeTruthy();
    });

    it('should render layout selector dropdown', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          },
          image: {
            label: 'Image Block',
            fields: {
              image: { type: 'image', label: 'Image' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);
      const selector = element.querySelector('.flexible-layout-selector');

      expect(selector).toBeTruthy();
    });

    it('should list all available layouts in selector', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          },
          image: {
            label: 'Image Block',
            fields: {
              image: { type: 'image', label: 'Image' }
            }
          },
          quote: {
            label: 'Quote Block',
            fields: {
              quote: { type: 'textarea', label: 'Quote' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);
      const options = element.querySelectorAll('.flexible-layout-option');

      expect(options.length).toBe(3);
    });

    it('should render different layout types correctly', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          },
          image: {
            label: 'Image Block',
            fields: {
              url: { type: 'text', label: 'Image URL' },
              caption: { type: 'text', label: 'Caption' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Text' } },
        { layout: 'image', fields: { url: 'img.jpg', caption: 'Caption' } }
      ];

      const element = flexibleField.render(config, data);
      const rows = element.querySelectorAll('.flexible-row');

      expect(rows.length).toBe(2);

      // First row should have 1 field (text)
      const firstRowFields = rows[0].querySelectorAll('.slabs-field');
      expect(firstRowFields.length).toBe(1);

      // Second row should have 2 fields (url + caption)
      const secondRowFields = rows[1].querySelectorAll('.slabs-field');
      expect(secondRowFields.length).toBe(2);
    });

    it('should respect min constraint', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        min: 2,
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test 1' } },
        { layout: 'text', fields: { content: 'Test 2' } }
      ];

      const element = flexibleField.render(config, data);
      const removeButtons = element.querySelectorAll('.flexible-remove');

      // Both remove buttons should be disabled when at min
      removeButtons.forEach(btn => {
        expect((btn as HTMLButtonElement).disabled).toBe(true);
      });
    });

    it('should respect max constraint', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        max: 2,
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test 1' } },
        { layout: 'text', fields: { content: 'Test 2' } }
      ];

      const element = flexibleField.render(config, data);
      const addButton = element.querySelector('.flexible-add') as HTMLButtonElement;

      expect(addButton.disabled).toBe(true);
    });

    it('should store layout type in hidden input', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test' } }
      ];

      const element = flexibleField.render(config, data);
      const layoutInput = element.querySelector('.flexible-layout-type') as HTMLInputElement;

      expect(layoutInput).toBeTruthy();
      expect(layoutInput?.value).toBe('text');
    });
  });

  describe('extract', () => {
    it('should extract empty array from empty flexible field', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const element = flexibleField.render(config, []);
      const extracted = flexibleField.extract(element);

      expect(Array.isArray(extracted)).toBe(true);
      expect(extracted.length).toBe(0);
    });

    it('should extract layout type and fields from each row', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test Content' } }
      ];

      const element = flexibleField.render(config, data);
      const extracted = flexibleField.extract(element);

      expect(extracted).toEqual([
        { layout: 'text', fields: { content: 'Test Content' } }
      ]);
    });

    it('should extract multiple blocks with different layouts', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          },
          image: {
            label: 'Image Block',
            fields: {
              url: { type: 'text', label: 'URL' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Hello' } },
        { layout: 'image', fields: { url: 'test.jpg' } }
      ];

      const element = flexibleField.render(config, data);
      const extracted = flexibleField.extract(element);

      expect(extracted).toEqual([
        { layout: 'text', fields: { content: 'Hello' } },
        { layout: 'image', fields: { url: 'test.jpg' } }
      ]);
    });
  });

  describe('validate', () => {
    it('should validate required flexible field', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        required: true,
        label: 'Content Blocks',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const result = flexibleField.validate(config, []);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('REQUIRED');
    });

    it('should validate min constraint', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        min: 2,
        label: 'Content Blocks',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test' } }
      ];

      const result = flexibleField.validate(config, data);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('MIN_BLOCKS');
    });

    it('should validate max constraint', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        max: 2,
        label: 'Content Blocks',
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Test 1' } },
        { layout: 'text', fields: { content: 'Test 2' } },
        { layout: 'text', fields: { content: 'Test 3' } }
      ];

      const result = flexibleField.validate(config, data);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('MAX_BLOCKS');
    });

    it('should pass validation for valid data', () => {
      const config: FieldConfigData = {
        type: 'flexible',
        required: true,
        min: 1,
        max: 5,
        layouts: {
          text: {
            label: 'Text Block',
            fields: {
              content: { type: 'text', label: 'Content' }
            }
          }
        }
      };

      const data = [
        { layout: 'text', fields: { content: 'Valid content' } }
      ];

      const result = flexibleField.validate(config, data);

      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
});