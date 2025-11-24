import type { FieldType, FieldConfigData, ValidationResult } from '../types';
import { FieldRenderer } from '../../application/FieldRenderer';
import { FieldValidator } from '../../application/FieldValidator';
import { FieldExtractor } from '../../application/FieldExtractor';
import type { FieldRegistry } from '../FieldRegistry';

/**
 * TabField - Container field type for organizing fields into tabs
 * Implements a tabbed interface with nested fields
 */
export class TabField implements FieldType {
  private renderer: FieldRenderer | null = null;
  private validator: FieldValidator | null = null;
  private extractor: FieldExtractor | null = null;

  /**
   * Set the registry (called after the field is registered to avoid circular dependency)
   */
  setRegistry(registry: FieldRegistry): void {
    this.renderer = new FieldRenderer(registry);
    this.validator = new FieldValidator(registry);
    this.extractor = new FieldExtractor(registry);
  }

  /**
   * Render tabbed interface with nested fields
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    if (!this.renderer) {
      throw new Error('TabField: renderer not initialized. Call setRegistry() first.');
    }

    const container = document.createElement('div');
    container.classList.add('slabs-tabs');
    container.setAttribute('data-field-type', 'tabs');

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Get tabs configuration
    const tabs = config.fields || {};
    const tabNames = Object.keys(tabs);

    if (tabNames.length === 0) {
      return container;
    }

    // Create tab buttons
    const tabButtons = document.createElement('div');
    tabButtons.classList.add('slabs-tabs__buttons');

    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.classList.add('slabs-tabs__content');

    // Render each tab
    tabNames.forEach((tabName, index) => {
      const tabConfig = tabs[tabName];
      if (!tabConfig) return;

      const tabFields = tabConfig.fields || {};

      // Create tab button
      const button = document.createElement('button');
      button.classList.add('slabs-tabs__button');
      button.textContent = tabConfig.label || tabName;
      button.type = 'button';
      button.setAttribute('data-tab', tabName);

      if (index === 0) {
        button.classList.add('slabs-tabs__button--active');
      }

      // Create tab panel
      const panel = document.createElement('div');
      panel.classList.add('slabs-tabs__panel');
      panel.setAttribute('data-tab', tabName);

      if (index !== 0) {
        panel.classList.add('slabs-tabs__panel--hidden');
      }

      // Render fields for this tab
      const tabValue = value?.[tabName] || {};
      const fieldsContainer = this.renderer!.render(tabFields, tabValue, {
        containerClass: 'slabs-fields'
      });
      panel.appendChild(fieldsContainer);
      tabContent.appendChild(panel);

      // Tab switching logic
      button.addEventListener('click', () => {
        // Update button states
        tabButtons.querySelectorAll('.slabs-tabs__button').forEach(btn => {
          btn.classList.remove('slabs-tabs__button--active');
        });
        button.classList.add('slabs-tabs__button--active');

        // Update panel visibility
        tabContent.querySelectorAll('.slabs-tabs__panel').forEach(p => {
          p.classList.add('slabs-tabs__panel--hidden');
        });
        panel.classList.remove('slabs-tabs__panel--hidden');
      });

      tabButtons.appendChild(button);
    });

    container.appendChild(tabButtons);
    container.appendChild(tabContent);

    return container;
  }

  /**
   * Extract values from all tabs
   */
  extract(element: HTMLElement): any {
    if (!this.extractor) {
      throw new Error('TabField: extractor not initialized. Call setRegistry() first.');
    }

    const data: Record<string, any> = {};

    // Find all tab panels
    const panels = element.querySelectorAll('.slabs-tabs__panel');

    panels.forEach(panel => {
      const tabName = panel.getAttribute('data-tab');
      if (!tabName) return;

      // Extract data from fields in this tab
      const fieldsContainer = panel.querySelector('.slabs-fields');
      if (fieldsContainer) {
        data[tabName] = this.extractor!.extract(fieldsContainer as HTMLElement);
      }
    });

    return data;
  }

  /**
   * Validate all fields in all tabs
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    if (!this.validator) {
      throw new Error('TabField: validator not initialized. Call setRegistry() first.');
    }

    const allErrors: any[] = [];

    const tabs = config.fields || {};

    Object.entries(tabs).forEach(([tabName, tabConfig]) => {
      const tabFields = tabConfig.fields || {};
      const tabValue = value?.[tabName] || {};

      const result = this.validator!.validate(tabFields, tabValue);
      if (!result.valid) {
        // Prefix errors with tab name for clarity
        result.errors.forEach(error => {
          allErrors.push({
            ...error,
            field: `${tabConfig.label || tabName} > ${error.field}`
          });
        });
      }
    });

    return {
      valid: allErrors.length === 0,
      errors: allErrors
    };
  }
}
