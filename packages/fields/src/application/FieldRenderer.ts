import type { FieldConfigData } from '../domain/types';
import type { FieldRegistry } from '../domain/FieldRegistry';

export interface RenderOptions {
  containerClass?: string;
}

/**
 * FieldRenderer - Application service for rendering fields to DOM
 * Handles the orchestration of field rendering with labels, descriptions, and styling
 */
export class FieldRenderer {
  constructor(private registry: FieldRegistry) {}

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

    // Render label
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

    // Render each field in order
    for (const [name, config] of Object.entries(fields)) {
      const value = data[name];
      const fieldElement = this.renderField(name, config, value);
      container.appendChild(fieldElement);
    }

    return container;
  }
}
