import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';
import { FieldRegistry } from '../FieldRegistry';
import { FieldRenderer } from '../../application/FieldRenderer';
import { FieldValidator } from '../../application/FieldValidator';
import { FieldExtractor } from '../../application/FieldExtractor';
import * as CodexIcons from '@codexteam/icons';

/**
 * GroupField - Groups related fields together with optional collapsible behavior
 * Structure exactly matches RepeaterField's single row
 */
export class GroupField implements FieldType {
  private registry: FieldRegistry | null = null;
  private renderer: FieldRenderer | null = null;
  private validator: FieldValidator | null = null;
  private extractor: FieldExtractor | null = null;

  /**
   * Get or create registry instance (lazy initialization)
   */
  private getRegistry(): FieldRegistry {
    if (!this.registry) {
      this.registry = FieldRegistry.createDefault();
    }
    return this.registry;
  }

  /**
   * Get or create renderer instance
   */
  private getRenderer(): FieldRenderer {
    if (!this.renderer) {
      this.renderer = new FieldRenderer(this.getRegistry());
    }
    return this.renderer;
  }

  /**
   * Get or create validator instance
   */
  private getValidator(): FieldValidator {
    if (!this.validator) {
      this.validator = new FieldValidator(this.getRegistry());
    }
    return this.validator;
  }

  /**
   * Get or create extractor instance
   */
  private getExtractor(): FieldExtractor {
    if (!this.extractor) {
      this.extractor = new FieldExtractor(this.getRegistry());
    }
    return this.extractor;
  }

  /**
   * Get chevron down icon SVG
   */
  private getChevronIcon(): string {
    return (CodexIcons as any).IconChevronDown || '▼';
  }

  /**
   * Render group field - structure matches repeater row exactly
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    // Main container (like repeater-row)
    const container = document.createElement('div');
    container.classList.add('group-field');
    container.dataset.fieldType = 'group';

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Create collapsible header (if collapsible option is set)
    if (config.collapsible) {
      container.classList.add('group-field--collapsible');
      const header = document.createElement('div');
      header.classList.add('group-field__header');

      const title = document.createElement('div');
      title.classList.add('group-field__title');

      // Add label
      const labelText = config.label || 'Group';
      const labelSpan = document.createElement('span');
      labelSpan.classList.add('group-field__label');
      labelSpan.textContent = labelText;
      title.appendChild(labelSpan);

      // If hint exists, add it with lighter font weight
      if (config.hint) {
        const separator = document.createTextNode(' - ');
        const hintSpan = document.createElement('span');
        hintSpan.classList.add('group-field__hint');
        hintSpan.textContent = config.hint;
        title.appendChild(separator);
        title.appendChild(hintSpan);
      }

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.classList.add('group-field__toggle');
      toggle.innerHTML = this.getChevronIcon();
      toggle.setAttribute('aria-label', 'Toggle group');

      header.appendChild(title);
      header.appendChild(toggle);

      // Add collapse/expand functionality
      header.addEventListener('click', () => {
        container.classList.toggle('group-field--collapsed');
      });

      container.appendChild(header);

      // Set initial collapsed state
      if (config.collapsed) {
        container.classList.add('group-field--collapsed');
      }
    }

    // Create content container (like repeater-row__content)
    const content = document.createElement('div');
    content.classList.add('group-field__content');

    // Create fields container (like repeater-row__fields)
    const fieldsContainer = document.createElement('div');
    fieldsContainer.classList.add('group-field__fields');

    // Apply horizontal layout if configured
    if (config.layout === 'horizontal') {
      fieldsContainer.classList.add('group-field__fields--horizontal');
    }

    // Normalize value to object
    const groupValue = value && typeof value === 'object' ? value : {};

    // Render each sub-field
    if (config.fields) {
      for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
        const fieldValue = groupValue[fieldName];
        const fieldElement = this.getRenderer().renderField(fieldName, fieldConfig, fieldValue);
        fieldsContainer.appendChild(fieldElement);
      }
    }

    content.appendChild(fieldsContainer);
    container.appendChild(content);

    return container;
  }

  /**
   * Extract data from group field
   * Returns object with all sub-field values
   */
  extract(element: HTMLElement): any {
    if (!element.classList.contains('group-field')) {
      return {};
    }

    const data: Record<string, any> = {};

    // Find the fields container
    const fieldsContainer = element.querySelector('.group-field__fields');
    if (!fieldsContainer) {
      return data;
    }

    // Only get direct child fields (not nested within other groups)
    const fields = fieldsContainer.querySelectorAll(':scope > .slabs-field');

    fields.forEach((field) => {
      const fieldName = field.getAttribute('data-field-name');
      if (!fieldName) return;

      const value = this.getExtractor().extractField(field as HTMLElement);
      data[fieldName] = value;
    });

    return data;
  }

  /**
   * Validate group field value
   * Validates the group as required and all sub-field constraints
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Group';

    // Required validation
    if (config.required) {
      if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} is required`,
          code: 'REQUIRED'
        });
        return { valid: false, errors };
      }

      // Check if all values are empty
      const hasValue = Object.values(value).some(v => {
        if (v === null || v === undefined || v === '') return false;
        if (typeof v === 'object' && Object.keys(v).length === 0) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      });

      if (!hasValue) {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} is required`,
          code: 'REQUIRED'
        });
        return { valid: false, errors };
      }
    }

    // Skip sub-field validation if no fields defined
    if (!config.fields || Object.keys(config.fields).length === 0) {
      return {
        valid: errors.length === 0,
        errors
      };
    }

    // Validate each sub-field
    const groupValue = value && typeof value === 'object' ? value : {};
    const result = this.getValidator().validate(config.fields, groupValue);

    if (!result.valid) {
      errors.push(...result.errors);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}