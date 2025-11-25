import type { FieldConfigData } from '../domain/types';
import type { FieldRegistry } from '../domain/FieldRegistry';
import { ConditionalEvaluator } from '../domain/ConditionalEvaluator';

export interface RenderOptions {
  containerClass?: string;
}

/**
 * FieldRenderer - Application service for rendering fields to DOM
 * Handles the orchestration of field rendering with labels, descriptions, and styling
 */
export class FieldRenderer {
  private evaluator: ConditionalEvaluator;

  constructor(private registry: FieldRegistry) {
    this.evaluator = new ConditionalEvaluator();
  }

  /**
   * Render a single field with wrapper, label, and description
   */
  renderField(name: string, config: FieldConfigData, value: any): HTMLElement {
    const fieldType = this.registry.get(config.type);

    // Create field wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('slabs-field');
    wrapper.setAttribute('data-field-name', name);

    // Apply custom className
    if (config.className) {
      wrapper.classList.add(config.className);
    }

    // Render label for all field types
    if (config.label) {
      const label = document.createElement('label');
      label.classList.add('slabs-field__label');
      label.textContent = config.label;
      wrapper.appendChild(label);
    }

    // Render input element
    const input = fieldType.render(config, value);
    input.classList.add('slabs-field__input');
    wrapper.appendChild(input);

    // Render description
    if (config.description) {
      const description = document.createElement('div');
      description.classList.add('slabs-field__description');
      description.textContent = config.description;
      wrapper.appendChild(description);
    }

    // Add inline validation error container
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('slabs-field__error');
    wrapper.appendChild(errorContainer);

    return wrapper;
  }

  /**
   * Render multiple fields to a container
   */
  render(
    fields: Record<string, FieldConfigData>,
    data: Record<string, any> = {},
    options: RenderOptions = {}
  ): HTMLElement {
    const container = document.createElement('div');
    container.classList.add(options.containerClass || 'slabs-fields');

    // First pass: render all fields
    for (const [name, config] of Object.entries(fields)) {
      const value = data[name];
      const fieldElement = this.renderField(name, config, value);

      // Handle initial conditional visibility
      if (config.conditional) {
        const watchedFieldValue = data[config.conditional.field];
        const shouldShow = this.evaluator.evaluate(
          config.conditional,
          watchedFieldValue
        );

        if (!shouldShow) {
          fieldElement.style.display = 'none';
          fieldElement.dataset.conditionalHidden = 'true';
        }
      }

      container.appendChild(fieldElement);
    }

    // Second pass: setup conditional listeners
    this.setupConditionalListeners(container, fields);

    return container;
  }

  /**
   * Setup event listeners for conditional field watching
   */
  private setupConditionalListeners(
    container: HTMLElement,
    fields: Record<string, FieldConfigData>
  ): void {
    // Build dependency map: which fields watch which fields
    const watchers = new Map<string, string[]>();

    for (const [fieldName, config] of Object.entries(fields)) {
      if (config.conditional) {
        const watchedField = config.conditional.field;

        if (!watchers.has(watchedField)) {
          watchers.set(watchedField, []);
        }

        watchers.get(watchedField)!.push(fieldName);
      }
    }

    // Setup listeners for watched fields
    container.addEventListener('input', (e) => {
      const target = e.target as HTMLElement;
      const fieldWrapper = target.closest('.slabs-field') as HTMLElement;

      if (!fieldWrapper || !fieldWrapper.dataset.fieldName) return;

      const watchedFieldName = fieldWrapper.dataset.fieldName;
      const dependentFields = watchers.get(watchedFieldName);

      if (!dependentFields) return;

      // Extract current value of watched field
      const watchedValue = this.extractFieldValue(target);

      // Update visibility of dependent fields
      for (const dependentFieldName of dependentFields) {
        const config = fields[dependentFieldName];
        if (!config || !config.conditional) continue;

        const shouldShow = this.evaluator.evaluate(
          config.conditional,
          watchedValue
        );

        const dependentElement = container.querySelector(
          `[data-field-name="${dependentFieldName}"]`
        ) as HTMLElement;

        if (dependentElement) {
          this.toggleFieldVisibility(dependentElement, shouldShow);
        }
      }
    });

    // Also listen for change events (for select, radio, checkbox)
    container.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const fieldWrapper = target.closest('.slabs-field') as HTMLElement;
      if (!fieldWrapper || !fieldWrapper.dataset.fieldName) return;

      const watchedFieldName = fieldWrapper.dataset.fieldName;
      const dependentFields = watchers.get(watchedFieldName);

      if (!dependentFields) return;

      // Extract current value of watched field
      const watchedValue = this.extractFieldValue(target);

      // Update visibility of dependent fields
      for (const dependentFieldName of dependentFields) {
        const config = fields[dependentFieldName];
        if (!config || !config.conditional) continue;

        const shouldShow = this.evaluator.evaluate(
          config.conditional,
          watchedValue
        );

        const dependentElement = container.querySelector(
          `[data-field-name="${dependentFieldName}"]`
        ) as HTMLElement;

        if (dependentElement) {
          this.toggleFieldVisibility(dependentElement, shouldShow);
        }
      }
    });
  }

  /**
   * Toggle field visibility with animation
   */
  private toggleFieldVisibility(element: HTMLElement, show: boolean): void {
    if (show) {
      element.style.display = '';
      delete element.dataset.conditionalHidden;

      // Trigger animation (optional)
      element.style.opacity = '0';
      element.style.transform = 'translateY(-10px)';

      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.2s, transform 0.2s';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      });
    } else {
      element.style.opacity = '0';
      element.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        element.style.display = 'none';
        element.dataset.conditionalHidden = 'true';
      }, 200);
    }
  }

  /**
   * Extract value from field input element
   */
  private extractFieldValue(element: HTMLElement): any {
    const input = element as HTMLInputElement;

    // Checkbox
    if (input.type === 'checkbox') {
      return input.checked;
    }

    // Radio
    if (input.type === 'radio') {
      const name = input.name;
      const checked = element.closest('.slabs-fields')?.querySelector(
        `input[name="${name}"]:checked`
      ) as HTMLInputElement;
      return checked?.value || '';
    }

    // Select
    if (element.tagName === 'SELECT') {
      return (element as HTMLSelectElement).value;
    }

    // Number
    if (input.type === 'number') {
      return input.valueAsNumber;
    }

    // Text, textarea, etc.
    return input.value;
  }
}
