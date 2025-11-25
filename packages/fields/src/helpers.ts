/**
 * Helper functions for quick field operations
 */

import { FieldRegistry } from './domain/FieldRegistry';
import { FieldRenderer } from './application/FieldRenderer';
import { FieldValidator } from './application/FieldValidator';
import { FieldExtractor } from './application/FieldExtractor';
import type { FieldConfigData, ValidationResult } from './domain/types';
import type { RenderOptions } from './application/FieldRenderer';
import * as CodexIcons from '@codexteam/icons';

// Create singleton instances for convenience
const defaultRegistry = FieldRegistry.createDefault();
const defaultRenderer = new FieldRenderer(defaultRegistry);
const defaultValidator = new FieldValidator(defaultRegistry);
const defaultExtractor = new FieldExtractor(defaultRegistry);

/**
 * Convert icon name to SVG element
 * Supports @codexteam/icons or emoji fallback
 *
 * @param iconName - Icon name from @codexteam/icons (e.g., 'quote', 'bold') or emoji
 * @returns SVG string or emoji text
 */
function getIconSVG(iconName?: string): string {
  if (!iconName) return '';

  // If it's an emoji (single character or emoji), return as-is
  if (iconName.length <= 2 || /\p{Emoji}/u.test(iconName)) {
    return iconName;
  }

  // Try to get icon from @codexteam/icons
  // Icons are accessed as: icons.IconName (all icons start with "Icon" prefix)
  // User can provide "Quote" or "IconQuote" - both work
  let iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);

  // Add "Icon" prefix if not already present
  if (!iconKey.startsWith('Icon')) {
    iconKey = 'Icon' + iconKey;
  }

  const icon = (CodexIcons as any)[iconKey];

  if (icon) {
    return icon;
  }

  // Fallback to emoji or empty
  return iconName;
}

/**
 * Quick field rendering
 * Renders fields using the default registry
 */
export function renderFields(
  fields: Record<string, FieldConfigData>,
  data?: Record<string, any>,
  options?: RenderOptions
): HTMLElement {
  return defaultRenderer.render(fields, data, options);
}

/**
 * Extract field data from rendered container
 * @param element - The HTML element containing rendered fields
 * @param fields - Optional field configurations for handling conditional logic
 *                 If not provided, will attempt to retrieve from element's stored config
 */
export function extractFieldData(
  element: HTMLElement,
  fields?: Record<string, FieldConfigData>
): Record<string, any> {
  // If fields not provided, try to retrieve from stored config (set by renderBlockEditor)
  const fieldsConfig = fields || (element as any).__slabsFieldsConfig;
  return defaultExtractor.extract(element, fieldsConfig);
}

/**
 * Validate field data
 */
export function validateFields(
  fields: Record<string, FieldConfigData>,
  data: Record<string, any>
): ValidationResult {
  return defaultValidator.validate(fields, data);
}

/**
 * Get the default field registry
 * Useful for registering custom field types
 */
export function getDefaultRegistry(): FieldRegistry {
  return defaultRegistry;
}

/**
 * Block editor configuration interface
 */
export interface BlockEditorConfig {
  /** Block title (from block.json) */
  title: string;
  /** Block icon/emoji (from block.json) */
  icon?: string;
  /** Fields configuration (from block.json) */
  fields: Record<string, FieldConfigData>;
  /** Current field data */
  data?: Record<string, any>;
  /** Whether block starts collapsed (false) or expanded (true) */
  collapsible?: boolean;
  /** Custom validation handler */
  onValidate?: (data: Record<string, any>, errors: any[]) => void;
}

/**
 * Creates a complete collapsible block editor with header, fields, and validation
 *
 * This helper eliminates boilerplate by automatically creating:
 * - Collapsible header with title and toggle
 * - Field rendering from configuration
 * - Real-time validation feedback
 *
 * @param config - Block editor configuration
 * @returns Complete block editor HTMLElement
 *
 * @example
 * ```typescript
 * export function render(context: EditContext): HTMLElement {
 *   const config = context.config as any;
 *   return renderBlockEditor({
 *     title: 'My Block',
 *     icon: '📦',
 *     fields: config?.fields || {},
 *     data: context.data,
 *     collapsible: config?.collapsible
 *   });
 * }
 * ```
 */
export function renderBlockEditor(config: BlockEditorConfig): HTMLElement {
  // Create collapsible container
  const container = document.createElement('div');
  container.className = 'slabs-block-collapsible';

  // Set initial state: collapsed by default unless explicitly set to true
  const isExpanded = config.collapsible === true;
  if (!isExpanded) {
    container.classList.add('slabs-block-collapsible--collapsed');
  }

  // Create header with title and toggle
  const header = document.createElement('div');
  header.className = 'slabs-block-collapsible__header';

  const title = document.createElement('h3');
  title.className = 'slabs-block-collapsible__title';

  // Add icon if provided (supports @codexteam/icons SVG or emoji)
  if (config.icon) {
    const iconContent = getIconSVG(config.icon);
    const iconSpan = document.createElement('span');
    iconSpan.className = 'slabs-block-collapsible__icon';
    iconSpan.innerHTML = iconContent;
    title.appendChild(iconSpan);
  }

  // Add title text
  const titleText = document.createElement('span');
  titleText.textContent = config.title;
  title.appendChild(titleText);

  const toggle = document.createElement('span');
  toggle.className = 'slabs-block-collapsible__toggle';
  toggle.innerHTML = getIconSVG('ChevronDown');

  header.appendChild(title);
  header.appendChild(toggle);

  // Create content wrapper
  const content = document.createElement('div');
  content.className = 'slabs-block-collapsible__content';

  // Render fields
  const fieldsContainer = renderFields(config.fields, config.data || {}, {
    containerClass: 'slabs-fields'
  });

  // Store fields configuration for extraction
  (fieldsContainer as any).__slabsFieldsConfig = config.fields;

  // Add change listener for real-time inline validation
  fieldsContainer.addEventListener('input', () => {
    const currentData = extractDataFromFields(fieldsContainer, config.fields);
    const result = validateFields(config.fields, currentData);

    // Clear all previous error messages
    const allErrorContainers = fieldsContainer.querySelectorAll('.slabs-field__error');
    allErrorContainers.forEach((container) => {
      container.textContent = '';
      container.classList.remove('slabs-field__error--visible');
    });

    // Show inline errors for each field
    if (!result.valid) {
      result.errors.forEach((error: any) => {
        // Find the field wrapper by matching the error field name to config label
        const fieldWrapper = Array.from(fieldsContainer.querySelectorAll('.slabs-field')).find(
          (wrapper) => {
            const fieldName = wrapper.getAttribute('data-field-name');
            if (!fieldName) return false;
            const fieldConfig = config.fields[fieldName];
            const fieldLabel = fieldConfig?.label || fieldName;
            return error.field === fieldLabel;
          }
        );

        if (fieldWrapper) {
          const errorContainer = fieldWrapper.querySelector('.slabs-field__error');
          if (errorContainer) {
            errorContainer.textContent = error.message;
            errorContainer.classList.add('slabs-field__error--visible');
          }
        }
      });

      // Call custom validation handler if provided
      if (config.onValidate) {
        config.onValidate(currentData, result.errors);
      }
    } else {
      // Call custom validation handler if provided
      if (config.onValidate) {
        config.onValidate(currentData, []);
      }
    }
  });

  content.appendChild(fieldsContainer);

  // Add click handler for collapse/expand
  header.addEventListener('click', () => {
    container.classList.toggle('slabs-block-collapsible--collapsed');
  });

  container.appendChild(header);
  container.appendChild(content);

  return container;
}

/**
 * Helper to extract data from fields container
 * Uses the default FieldExtractor to properly handle all field types
 * @internal
 */
function extractDataFromFields(
  container: HTMLElement,
  fields?: Record<string, FieldConfigData>
): Record<string, any> {
  return defaultExtractor.extract(container, fields);
}
