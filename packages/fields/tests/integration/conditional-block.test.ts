import { describe, it, expect, beforeEach } from 'vitest';
import { FieldRenderer } from '../../src/application/FieldRenderer';
import { FieldExtractor } from '../../src/application/FieldExtractor';
import { FieldValidator } from '../../src/application/FieldValidator';
import { FieldRegistry } from '../../src/domain/FieldRegistry';
import type { FieldConfigData } from '../../src/domain/types';

/**
 * Integration tests for conditional fields in real-world block scenarios
 * These tests simulate how conditional fields would be used in actual Slabs blocks
 */
describe('Conditional Fields - Block Integration', () => {
  let renderer: FieldRenderer;
  let extractor: FieldExtractor;
  let validator: FieldValidator;
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = FieldRegistry.createDefault();
    renderer = new FieldRenderer(registry);
    extractor = new FieldExtractor(registry);
    validator = new FieldValidator(registry);
  });

  describe('Hero Block with conditional fields', () => {
    it('should handle complete hero block workflow with conditionals', () => {
      // Define a Hero block with conditional fields
      const heroFields: Record<string, FieldConfigData> = {
        title: {
          type: 'text',
          label: 'Hero Title',
          required: true
        },
        subtitle: {
          type: 'text',
          label: 'Subtitle',
          required: false
        },
        layoutType: {
          type: 'select',
          label: 'Layout Type',
          options: [
            { value: 'full-width', label: 'Full Width' },
            { value: 'centered', label: 'Centered' },
            { value: 'split', label: 'Split Layout' }
          ],
          required: true
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          conditional: {
            field: 'layoutType',
            operator: '!=',
            value: 'split'
          }
        },
        leftContent: {
          type: 'wysiwyg',
          label: 'Left Content',
          required: true,
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'split'
          }
        },
        rightContent: {
          type: 'wysiwyg',
          label: 'Right Content',
          required: true,
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'split'
          }
        },
        showCTA: {
          type: 'boolean',
          label: 'Show Call to Action'
        },
        ctaText: {
          type: 'text',
          label: 'CTA Text',
          required: true,
          conditional: {
            field: 'showCTA',
            operator: '==',
            value: true
          }
        },
        ctaUrl: {
          type: 'text',
          label: 'CTA URL',
          required: true,
          conditional: {
            field: 'showCTA',
            operator: '==',
            value: true
          }
        }
      };

      // Initial data - full width layout with CTA disabled
      const initialData = {
        title: 'Welcome to Our Site',
        subtitle: 'Building amazing experiences',
        layoutType: 'full-width',
        backgroundColor: '#f0f0f0',
        leftContent: '',
        rightContent: '',
        showCTA: false,
        ctaText: '',
        ctaUrl: ''
      };

      // Render the block
      const container = renderer.render(heroFields, initialData);
      expect(container).toBeTruthy();

      // Verify hidden fields are actually hidden in DOM
      const bgColorField = container.querySelector('[data-field-name="backgroundColor"]') as HTMLElement;
      const leftContentField = container.querySelector('[data-field-name="leftContent"]') as HTMLElement;
      const ctaTextField = container.querySelector('[data-field-name="ctaText"]') as HTMLElement;

      expect(bgColorField?.style.display).not.toBe('none'); // Should be visible (layoutType != 'split')
      expect(leftContentField?.style.display).toBe('none'); // Should be hidden (layoutType != 'split')
      expect(ctaTextField?.style.display).toBe('none'); // Should be hidden (showCTA = false)

      // Validate - should pass because hidden fields are skipped
      const validationResult = validator.validate(heroFields, initialData);
      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toHaveLength(0);

      // Extract data - hidden fields should be null
      const extractedData = extractor.extract(container, heroFields);
      expect(extractedData.title).toBe('Welcome to Our Site');
      expect(extractedData.layoutType).toBe('full-width');
      expect(extractedData.backgroundColor).toBe('#f0f0f0'); // Visible
      expect(extractedData.leftContent).toBeNull(); // Hidden
      expect(extractedData.rightContent).toBeNull(); // Hidden
      expect(extractedData.ctaText).toBeNull(); // Hidden
      expect(extractedData.ctaUrl).toBeNull(); // Hidden
    });

    it('should extract and validate data correctly based on layout changes', () => {
      const heroFields: Record<string, FieldConfigData> = {
        layoutType: {
          type: 'select',
          label: 'Layout Type',
          options: [
            { value: 'full-width', label: 'Full Width' },
            { value: 'split', label: 'Split Layout' }
          ]
        },
        backgroundColor: {
          type: 'color',
          label: 'Background Color',
          conditional: {
            field: 'layoutType',
            operator: '!=',
            value: 'split'
          }
        },
        leftContent: {
          type: 'wysiwyg',
          label: 'Left Content',
          required: true,
          conditional: {
            field: 'layoutType',
            operator: '==',
            value: 'split'
          }
        }
      };

      // Test with full-width layout
      const fullWidthData = {
        layoutType: 'full-width',
        backgroundColor: '#ffffff',
        leftContent: ''
      };

      const container1 = renderer.render(heroFields, fullWidthData);
      const extracted1 = extractor.extract(container1, heroFields);
      const validation1 = validator.validate(heroFields, extracted1);

      expect(extracted1.layoutType).toBe('full-width');
      expect(extracted1.backgroundColor).toBe('#ffffff'); // Visible
      expect(extracted1.leftContent).toBeNull(); // Hidden
      expect(validation1.valid).toBe(true); // leftContent is hidden, so not required

      // Test with split layout
      const splitData = {
        layoutType: 'split',
        backgroundColor: '#ffffff',
        leftContent: '<p>Left side content</p>'
      };

      const container2 = renderer.render(heroFields, splitData);
      const extracted2 = extractor.extract(container2, heroFields);
      const validation2 = validator.validate(heroFields, extracted2);

      expect(extracted2.layoutType).toBe('split');
      expect(extracted2.backgroundColor).toBeNull(); // Hidden
      expect(extracted2.leftContent).toBe('<p>Left side content</p>'); // Visible
      expect(validation2.valid).toBe(true);

      // Test split layout with empty content (should fail validation)
      const splitEmptyData = {
        layoutType: 'split',
        backgroundColor: '#ffffff',
        leftContent: ''
      };

      const container3 = renderer.render(heroFields, splitEmptyData);
      const extracted3 = extractor.extract(container3, heroFields);
      const validation3 = validator.validate(heroFields, extracted3);

      expect(validation3.valid).toBe(false); // leftContent is visible and required but empty
      expect(validation3.errors.length).toBeGreaterThan(0);
    });

    it('should handle chained conditionals when enabling CTA', () => {
      const heroFields: Record<string, FieldConfigData> = {
        showCTA: {
          type: 'boolean',
          label: 'Show CTA'
        },
        ctaText: {
          type: 'text',
          label: 'CTA Text',
          required: true,
          conditional: {
            field: 'showCTA',
            operator: '==',
            value: true
          }
        },
        ctaStyle: {
          type: 'select',
          label: 'CTA Style',
          options: [
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'custom', label: 'Custom' }
          ],
          conditional: {
            field: 'showCTA',
            operator: '==',
            value: true
          }
        },
        customColor: {
          type: 'color',
          label: 'Custom Button Color',
          required: true,
          conditional: {
            field: 'ctaStyle',
            operator: '==',
            value: 'custom'
          }
        }
      };

      // Start with CTA disabled
      const initialData = {
        showCTA: false,
        ctaText: '',
        ctaStyle: 'custom',
        customColor: '#ff0000'
      };

      const container = renderer.render(heroFields, initialData);

      // All CTA fields should be hidden
      expect(validator.validate(heroFields, initialData).valid).toBe(true);

      const extracted1 = extractor.extract(container, heroFields);
      expect(extracted1.ctaText).toBeNull();
      expect(extracted1.ctaStyle).toBeNull();
      expect(extracted1.customColor).toBeNull(); // Double-hidden (chain)

      // Enable CTA
      const showCTACheckbox = container.querySelector('[data-field-name="showCTA"] input[type="checkbox"]') as HTMLInputElement;
      showCTACheckbox.checked = true;
      showCTACheckbox.dispatchEvent(new Event('change', { bubbles: true }));

      // Now ctaText and ctaStyle should be visible, but customColor still hidden (ctaStyle needs to be 'custom')
      const ctaTextField = container.querySelector('[data-field-name="ctaText"]') as HTMLElement;
      const ctaStyleField = container.querySelector('[data-field-name="ctaStyle"]') as HTMLElement;
      const customColorField = container.querySelector('[data-field-name="customColor"]') as HTMLElement;

      expect(ctaTextField?.style.display).not.toBe('none');
      expect(ctaStyleField?.style.display).not.toBe('none');
      expect(customColorField?.style.display).not.toBe('none'); // Should be visible (ctaStyle is 'custom')

      // Validation should fail now (ctaText is required and empty)
      const validation2 = validator.validate(heroFields, {
        showCTA: true,
        ctaText: '',
        ctaStyle: 'custom',
        customColor: ''
      });
      expect(validation2.valid).toBe(false);
      expect(validation2.errors.length).toBeGreaterThan(0);

      // Fill in required fields
      const ctaTextInput = container.querySelector('[data-field-name="ctaText"] input') as HTMLInputElement;
      const customColorInput = container.querySelector('[data-field-name="customColor"] input') as HTMLInputElement;
      ctaTextInput.value = 'Get Started';
      customColorInput.value = '#ff0000';

      // Now validation should pass
      const extracted2 = extractor.extract(container, heroFields);
      const validation3 = validator.validate(heroFields, extracted2);
      expect(validation3.valid).toBe(true);
      expect(extracted2.ctaText).toBe('Get Started');
      expect(extracted2.customColor).toBe('#ff0000');
    });
  });

  describe('Pricing Block with quantity-based conditionals', () => {
    it('should show bulk discount fields when quantity exceeds threshold', () => {
      const pricingFields: Record<string, FieldConfigData> = {
        productName: {
          type: 'text',
          label: 'Product Name',
          required: true
        },
        basePrice: {
          type: 'number',
          label: 'Base Price',
          required: true,
          min: 0
        },
        quantity: {
          type: 'number',
          label: 'Quantity',
          required: true,
          min: 1
        },
        bulkDiscountPercent: {
          type: 'number',
          label: 'Bulk Discount %',
          required: true,
          min: 0,
          max: 100,
          conditional: {
            field: 'quantity',
            operator: '>',
            value: 10
          }
        },
        wholesalePrice: {
          type: 'number',
          label: 'Wholesale Price',
          required: true,
          conditional: {
            field: 'quantity',
            operator: '>=',
            value: 50
          }
        }
      };

      // Small quantity
      const smallOrder = {
        productName: 'Widget',
        basePrice: 99.99,
        quantity: 5,
        bulkDiscountPercent: 0,
        wholesalePrice: 0
      };

      const container1 = renderer.render(pricingFields, smallOrder);
      const validation1 = validator.validate(pricingFields, smallOrder);
      expect(validation1.valid).toBe(true); // Discount fields hidden, not required

      const extracted1 = extractor.extract(container1, pricingFields);
      expect(extracted1.quantity).toBe(5);
      expect(extracted1.bulkDiscountPercent).toBeNull(); // Hidden (5 <= 10)
      expect(extracted1.wholesalePrice).toBeNull(); // Hidden (5 < 50)

      // Medium quantity - bulk discount appears
      const mediumOrder = {
        productName: 'Widget',
        basePrice: 99.99,
        quantity: 25,
        bulkDiscountPercent: 15,
        wholesalePrice: 0
      };

      const container2 = renderer.render(pricingFields, mediumOrder);
      const validation2 = validator.validate(pricingFields, mediumOrder);
      expect(validation2.valid).toBe(true);

      const extracted2 = extractor.extract(container2, pricingFields);
      expect(extracted2.quantity).toBe(25);
      expect(extracted2.bulkDiscountPercent).toBe(15); // Visible (25 > 10)
      expect(extracted2.wholesalePrice).toBeNull(); // Still hidden (25 < 50)

      // Large quantity - both discount fields appear
      const largeOrder = {
        productName: 'Widget',
        basePrice: 99.99,
        quantity: 100,
        bulkDiscountPercent: 20,
        wholesalePrice: 75.00
      };

      const container3 = renderer.render(pricingFields, largeOrder);
      const validation3 = validator.validate(pricingFields, largeOrder);
      expect(validation3.valid).toBe(true);

      const extracted3 = extractor.extract(container3, pricingFields);
      expect(extracted3.quantity).toBe(100);
      expect(extracted3.bulkDiscountPercent).toBe(20); // Visible (100 > 10)
      expect(extracted3.wholesalePrice).toBe(75); // Visible (100 >= 50)
    });
  });

  describe('Feature Toggle Block with contains operator', () => {
    it('should show features based on selected plan', () => {
      const featureFields: Record<string, FieldConfigData> = {
        plan: {
          type: 'select',
          label: 'Plan',
          options: [
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' }
          ],
          required: true
        },
        apiKey: {
          type: 'text',
          label: 'API Key',
          required: true,
          conditional: {
            field: 'plan',
            operator: 'in',
            value: ['pro', 'enterprise']
          }
        },
        maxApiCalls: {
          type: 'number',
          label: 'Max API Calls per Month',
          required: true,
          conditional: {
            field: 'plan',
            operator: 'in',
            value: ['pro', 'enterprise']
          }
        },
        dedicatedSupport: {
          type: 'boolean',
          label: 'Dedicated Support',
          conditional: {
            field: 'plan',
            operator: '==',
            value: 'enterprise'
          }
        },
        supportEmail: {
          type: 'email',
          label: 'Support Contact Email',
          required: true,
          conditional: {
            field: 'dedicatedSupport',
            operator: '==',
            value: true
          }
        }
      };

      // Basic plan
      const basicData = {
        plan: 'basic',
        apiKey: '',
        maxApiCalls: 0,
        dedicatedSupport: false,
        supportEmail: ''
      };

      const container1 = renderer.render(featureFields, basicData);
      const validation1 = validator.validate(featureFields, basicData);
      expect(validation1.valid).toBe(true); // All advanced features hidden

      const extracted1 = extractor.extract(container1, featureFields);
      expect(extracted1.plan).toBe('basic');
      expect(extracted1.apiKey).toBeNull();
      expect(extracted1.maxApiCalls).toBeNull();
      expect(extracted1.dedicatedSupport).toBeNull();
      expect(extracted1.supportEmail).toBeNull();

      // Pro plan
      const proData = {
        plan: 'pro',
        apiKey: 'sk_test_123',
        maxApiCalls: 10000,
        dedicatedSupport: false,
        supportEmail: ''
      };

      const container2 = renderer.render(featureFields, proData);
      const validation2 = validator.validate(featureFields, proData);
      expect(validation2.valid).toBe(true);

      const extracted2 = extractor.extract(container2, featureFields);
      expect(extracted2.plan).toBe('pro');
      expect(extracted2.apiKey).toBe('sk_test_123'); // Visible
      expect(extracted2.maxApiCalls).toBe(10000); // Visible
      expect(extracted2.dedicatedSupport).toBeNull(); // Hidden (not enterprise)
      expect(extracted2.supportEmail).toBeNull(); // Hidden (double-hidden)

      // Enterprise plan with dedicated support
      const enterpriseData = {
        plan: 'enterprise',
        apiKey: 'sk_live_456',
        maxApiCalls: 1000000,
        dedicatedSupport: true,
        supportEmail: 'support@company.com'
      };

      const container3 = renderer.render(featureFields, enterpriseData);
      const validation3 = validator.validate(featureFields, enterpriseData);
      expect(validation3.valid).toBe(true);

      const extracted3 = extractor.extract(container3, featureFields);
      expect(extracted3.plan).toBe('enterprise');
      expect(extracted3.apiKey).toBe('sk_live_456'); // Visible
      expect(extracted3.maxApiCalls).toBe(1000000); // Visible
      expect(extracted3.dedicatedSupport).toBe(true); // Visible
      expect(extracted3.supportEmail).toBe('support@company.com'); // Visible (chained)
    });
  });

  describe('Form Block with empty/not_empty operators', () => {
    it('should show additional fields when custom message is provided', () => {
      const formFields: Record<string, FieldConfigData> = {
        name: {
          type: 'text',
          label: 'Name',
          required: true
        },
        email: {
          type: 'email',
          label: 'Email',
          required: true
        },
        customMessage: {
          type: 'textarea',
          label: 'Custom Message',
          placeholder: 'Leave blank for default message'
        },
        messageStyle: {
          type: 'select',
          label: 'Message Style',
          options: [
            { value: 'bold', label: 'Bold' },
            { value: 'italic', label: 'Italic' },
            { value: 'highlight', label: 'Highlighted' }
          ],
          conditional: {
            field: 'customMessage',
            operator: 'not_empty',
            value: null
          }
        },
        messageColor: {
          type: 'color',
          label: 'Message Color',
          conditional: {
            field: 'customMessage',
            operator: 'not_empty',
            value: null
          }
        }
      };

      // No custom message
      const data1 = {
        name: 'John Doe',
        email: 'john@example.com',
        customMessage: '',
        messageStyle: '',
        messageColor: ''
      };

      const container1 = renderer.render(formFields, data1);
      const validation1 = validator.validate(formFields, data1);
      expect(validation1.valid).toBe(true);

      const extracted1 = extractor.extract(container1, formFields);
      expect(extracted1.customMessage).toBe('');
      expect(extracted1.messageStyle).toBeNull(); // Hidden (empty message)
      expect(extracted1.messageColor).toBeNull(); // Hidden (empty message)

      // With custom message
      const data2 = {
        name: 'John Doe',
        email: 'john@example.com',
        customMessage: 'Thank you for your interest!',
        messageStyle: 'bold',
        messageColor: '#0066cc'
      };

      const container2 = renderer.render(formFields, data2);
      const validation2 = validator.validate(formFields, data2);
      expect(validation2.valid).toBe(true);

      const extracted2 = extractor.extract(container2, formFields);
      expect(extracted2.customMessage).toBe('Thank you for your interest!');
      expect(extracted2.messageStyle).toBe('bold'); // Visible (not empty)
      expect(extracted2.messageColor).toBe('#0066cc'); // Visible (not empty)

      // Verify fields are visible/hidden in DOM
      const styleField = container2.querySelector('[data-field-name="messageStyle"]') as HTMLElement;
      const colorField = container2.querySelector('[data-field-name="messageColor"]') as HTMLElement;

      expect(styleField?.style.display).not.toBe('none');
      expect(colorField?.style.display).not.toBe('none');
    });
  });

  describe('Settings Block - complex multi-level conditionals', () => {
    it('should handle deeply nested conditional dependencies', () => {
      const settingsFields: Record<string, FieldConfigData> = {
        enableCache: {
          type: 'boolean',
          label: 'Enable Cache'
        },
        cacheType: {
          type: 'select',
          label: 'Cache Type',
          options: [
            { value: 'memory', label: 'Memory' },
            { value: 'redis', label: 'Redis' },
            { value: 'file', label: 'File System' }
          ],
          conditional: {
            field: 'enableCache',
            operator: '==',
            value: true
          }
        },
        redisHost: {
          type: 'text',
          label: 'Redis Host',
          required: true,
          conditional: {
            field: 'cacheType',
            operator: '==',
            value: 'redis'
          }
        },
        redisPort: {
          type: 'number',
          label: 'Redis Port',
          required: true,
          conditional: {
            field: 'cacheType',
            operator: '==',
            value: 'redis'
          }
        },
        enableAuth: {
          type: 'boolean',
          label: 'Enable Redis Authentication',
          conditional: {
            field: 'cacheType',
            operator: '==',
            value: 'redis'
          }
        },
        redisPassword: {
          type: 'password',
          label: 'Redis Password',
          required: true,
          conditional: {
            field: 'enableAuth',
            operator: '==',
            value: true
          }
        },
        filePath: {
          type: 'text',
          label: 'Cache Directory',
          required: true,
          conditional: {
            field: 'cacheType',
            operator: '==',
            value: 'file'
          }
        }
      };

      // Cache disabled - everything hidden
      const data1 = {
        enableCache: false,
        cacheType: 'redis',
        redisHost: 'localhost',
        redisPort: 6379,
        enableAuth: true,
        redisPassword: 'secret',
        filePath: '/tmp/cache'
      };

      const validation1 = validator.validate(settingsFields, data1);
      expect(validation1.valid).toBe(true); // All conditional fields hidden

      const container1 = renderer.render(settingsFields, data1);
      const extracted1 = extractor.extract(container1, settingsFields);

      expect(extracted1.enableCache).toBe(false);
      expect(extracted1.cacheType).toBeNull();
      expect(extracted1.redisHost).toBeNull();
      expect(extracted1.redisPort).toBeNull();
      expect(extracted1.enableAuth).toBeNull();
      expect(extracted1.redisPassword).toBeNull();
      expect(extracted1.filePath).toBeNull();

      // Cache enabled, Redis with auth
      const data2 = {
        enableCache: true,
        cacheType: 'redis',
        redisHost: 'localhost',
        redisPort: 6379,
        enableAuth: true,
        redisPassword: 'secret123',
        filePath: ''
      };

      const validation2 = validator.validate(settingsFields, data2);
      expect(validation2.valid).toBe(true);

      const container2 = renderer.render(settingsFields, data2);
      const extracted2 = extractor.extract(container2, settingsFields);

      expect(extracted2.enableCache).toBe(true);
      expect(extracted2.cacheType).toBe('redis');
      expect(extracted2.redisHost).toBe('localhost');
      expect(extracted2.redisPort).toBe(6379);
      expect(extracted2.enableAuth).toBe(true);
      expect(extracted2.redisPassword).toBe('secret123'); // 3 levels deep!
      expect(extracted2.filePath).toBeNull(); // Hidden (different cache type)

      // Cache enabled, File system
      const data3 = {
        enableCache: true,
        cacheType: 'file',
        redisHost: '',
        redisPort: 0,
        enableAuth: false,
        redisPassword: '',
        filePath: '/var/cache/app'
      };

      const validation3 = validator.validate(settingsFields, data3);
      expect(validation3.valid).toBe(true);

      const container3 = renderer.render(settingsFields, data3);
      const extracted3 = extractor.extract(container3, settingsFields);

      expect(extracted3.enableCache).toBe(true);
      expect(extracted3.cacheType).toBe('file');
      expect(extracted3.redisHost).toBeNull(); // Hidden
      expect(extracted3.redisPort).toBeNull(); // Hidden
      expect(extracted3.enableAuth).toBeNull(); // Hidden
      expect(extracted3.redisPassword).toBeNull(); // Hidden
      expect(extracted3.filePath).toBe('/var/cache/app'); // Visible
    });
  });

  describe('Real-world validation scenarios', () => {
    it('should prevent form submission when required conditional fields are empty', () => {
      const fields: Record<string, FieldConfigData> = {
        shippingMethod: {
          type: 'select',
          label: 'Shipping Method',
          options: [
            { value: 'pickup', label: 'Store Pickup' },
            { value: 'delivery', label: 'Home Delivery' }
          ],
          required: true
        },
        deliveryAddress: {
          type: 'textarea',
          label: 'Delivery Address',
          required: true,
          conditional: {
            field: 'shippingMethod',
            operator: '==',
            value: 'delivery'
          }
        },
        deliveryInstructions: {
          type: 'textarea',
          label: 'Delivery Instructions',
          conditional: {
            field: 'shippingMethod',
            operator: '==',
            value: 'delivery'
          }
        }
      };

      // Delivery selected but address empty - should fail
      const invalidData = {
        shippingMethod: 'delivery',
        deliveryAddress: '',
        deliveryInstructions: ''
      };

      const validation1 = validator.validate(fields, invalidData);
      expect(validation1.valid).toBe(false);
      expect(validation1.errors.length).toBeGreaterThan(0);
      expect(validation1.errors[0]?.field).toBe('Delivery Address');

      // Delivery selected with address - should pass
      const validData = {
        shippingMethod: 'delivery',
        deliveryAddress: '123 Main St, City, State 12345',
        deliveryInstructions: 'Leave at front door'
      };

      const validation2 = validator.validate(fields, validData);
      expect(validation2.valid).toBe(true);

      // Pickup selected - address not required
      const pickupData = {
        shippingMethod: 'pickup',
        deliveryAddress: '',
        deliveryInstructions: ''
      };

      const validation3 = validator.validate(fields, pickupData);
      expect(validation3.valid).toBe(true); // Hidden fields don't need validation
    });

    it('should handle different toggle states correctly in extraction and validation', () => {
      const fields: Record<string, FieldConfigData> = {
        trigger: {
          type: 'boolean',
          label: 'Enable Feature'
        },
        dependent: {
          type: 'text',
          label: 'Dependent Field',
          required: true,
          conditional: {
            field: 'trigger',
            operator: '==',
            value: true
          }
        }
      };

      // Test with trigger off - dependent should be hidden
      const data1 = {
        trigger: false,
        dependent: 'some value'
      };

      const container1 = renderer.render(fields, data1);
      const extracted1 = extractor.extract(container1, fields);
      const validation1 = validator.validate(fields, extracted1);

      expect(extracted1.trigger).toBe(false);
      expect(extracted1.dependent).toBeNull(); // Hidden
      expect(validation1.valid).toBe(true); // Dependent is hidden, validation skipped

      // Test with trigger on and dependent filled - should pass
      const data2 = {
        trigger: true,
        dependent: 'some value'
      };

      const container2 = renderer.render(fields, data2);
      const extracted2 = extractor.extract(container2, fields);
      const validation2 = validator.validate(fields, extracted2);

      expect(extracted2.trigger).toBe(true);
      expect(extracted2.dependent).toBe('some value'); // Visible
      expect(validation2.valid).toBe(true);

      // Test with trigger on and dependent empty - should fail
      const data3 = {
        trigger: true,
        dependent: ''
      };

      const container3 = renderer.render(fields, data3);
      const extracted3 = extractor.extract(container3, fields);
      const validation3 = validator.validate(fields, extracted3);

      expect(extracted3.trigger).toBe(true);
      expect(extracted3.dependent).toBe(''); // Visible but empty
      expect(validation3.valid).toBe(false); // Should fail - required field empty
      expect(validation3.errors.length).toBeGreaterThan(0);
    });
  });
});
