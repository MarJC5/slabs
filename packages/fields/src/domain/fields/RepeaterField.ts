import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';
import { FieldRegistry } from '../FieldRegistry';
import { FieldRenderer } from '../../application/FieldRenderer';
import { FieldValidator } from '../../application/FieldValidator';
import { FieldExtractor } from '../../application/FieldExtractor';
import { TextField } from './TextField';
import { TextareaField } from './TextareaField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { RangeField } from './RangeField';
import { ImageField } from './ImageField';
import { ColorField } from './ColorField';
import { DateField } from './DateField';
import { WysiwygField } from './WysiwygField';
import { EmailField } from './EmailField';
import { PasswordField } from './PasswordField';
import { LinkField } from './LinkField';
import { FileField } from './FileField';
import { OEmbedField } from './OEmbedField';
import { BooleanField } from './BooleanField';
import * as CodexIcons from '@codexteam/icons';

/**
 * RepeaterField - Repeatable field groups (ACF-like)
 * Implements nested field rendering with add/remove functionality
 */
export class RepeaterField implements FieldType {
  private registry: FieldRegistry | null = null;
  private renderer: FieldRenderer | null = null;
  private validator: FieldValidator | null = null;
  private extractor: FieldExtractor | null = null;

  constructor() {
    // Lazy initialization to avoid circular dependency
    // Registry will be created on first use
  }

  /**
   * Get or create registry instance (lazy initialization)
   */
  private getRegistry(): FieldRegistry {
    if (!this.registry) {
      // Create registry WITHOUT repeater to avoid circular dependency
      this.registry = new FieldRegistry();

      this.registry.register('text', new TextField());
      this.registry.register('textarea', new TextareaField());
      this.registry.register('number', new NumberField());
      this.registry.register('select', new SelectField());
      this.registry.register('checkbox', new CheckboxField());
      this.registry.register('radio', new RadioField());
      this.registry.register('range', new RangeField());
      this.registry.register('image', new ImageField());
      this.registry.register('color', new ColorField());
      this.registry.register('date', new DateField());
      this.registry.register('wysiwyg', new WysiwygField());
      this.registry.register('email', new EmailField());
      this.registry.register('password', new PasswordField());
      this.registry.register('link', new LinkField());
      this.registry.register('file', new FileField());
      this.registry.register('oembed', new OEmbedField());
      this.registry.register('boolean', new BooleanField());
      // Note: NOT registering repeater to avoid circular dependency
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
   * Get arrow up icon SVG
   */
  private getArrowUpIcon(): string {
    return (CodexIcons as any).IconChevronUp || '▲';
  }

  /**
   * Get arrow down icon SVG
   */
  private getArrowDownIcon(): string {
    return (CodexIcons as any).IconChevronDown || '▼';
  }

  /**
   * Render repeater field with rows and add/remove buttons
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('repeater-field');
    container.dataset.fieldType = 'repeater';

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Normalize value to array
    let rows: any[] = [];
    if (Array.isArray(value)) {
      rows = value;
    } else if (value === null || value === undefined || value === '') {
      rows = Array.isArray(config.defaultValue) ? config.defaultValue : [];
    }

    // Create rows container
    const rowsContainer = document.createElement('div');
    rowsContainer.classList.add('repeater-rows');

    // Render existing rows
    rows.forEach((rowData, index) => {
      const row = this.renderRow(config, rowData, index);
      rowsContainer.appendChild(row);
    });

    container.appendChild(rowsContainer);

    // Add "Add Row" button
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('repeater-add');
    addButton.textContent = config.buttonLabel || 'Add Row';

    // Disable if max reached
    if (config.max && rows.length >= config.max) {
      addButton.disabled = true;
    }

    // Add click handler
    addButton.addEventListener('click', () => {
      this.addRow(container, config);
    });

    container.appendChild(addButton);

    return container;
  }

  /**
   * Render a single repeater row with sub-fields and remove button
   */
  private renderRow(config: FieldConfigData, rowData: any, rowIndex: number): HTMLElement {
    const row = document.createElement('div');
    row.classList.add('repeater-row');
    row.dataset.rowId = String(rowIndex);

    // Create collapsible header
    const header = document.createElement('div');
    header.classList.add('repeater-row__header');

    const title = document.createElement('div');
    title.classList.add('repeater-row__title');
    title.textContent = `Row ${rowIndex + 1}`;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.classList.add('repeater-row__toggle');
    toggle.innerHTML = this.getChevronIcon();
    toggle.setAttribute('aria-label', 'Toggle row');

    header.appendChild(title);
    header.appendChild(toggle);

    // Create content container
    const content = document.createElement('div');
    content.classList.add('repeater-row__content');

    const fieldsContainer = document.createElement('div');
    fieldsContainer.classList.add('repeater-row__fields');

    // Render each sub-field
    if (config.fields) {
      for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
        const fieldValue = rowData?.[fieldName];
        const fieldElement = this.getRenderer().renderField(fieldName, fieldConfig, fieldValue);

        // Add row ID to distinguish this field from other rows
        fieldElement.dataset.rowId = String(rowIndex);

        fieldsContainer.appendChild(fieldElement);
      }
    }

    content.appendChild(fieldsContainer);

    // Add action buttons
    const actions = document.createElement('div');
    actions.classList.add('repeater-row__actions');

    // Move up button
    const upButton = document.createElement('button');
    upButton.type = 'button';
    upButton.classList.add('repeater-row__move-up');
    upButton.innerHTML = this.getArrowUpIcon();
    upButton.setAttribute('aria-label', 'Move up');
    upButton.addEventListener('click', () => {
      this.moveRowUp(row);
    });

    // Move down button
    const downButton = document.createElement('button');
    downButton.type = 'button';
    downButton.classList.add('repeater-row__move-down');
    downButton.innerHTML = this.getArrowDownIcon();
    downButton.setAttribute('aria-label', 'Move down');
    downButton.addEventListener('click', () => {
      this.moveRowDown(row);
    });

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('repeater-remove');
    removeButton.textContent = 'Remove';
    removeButton.dataset.rowId = String(rowIndex);

    // Store reference to container for remove handler
    removeButton.addEventListener('click', () => {
      const container = row.parentElement?.parentElement as HTMLElement;
      if (container) {
        this.removeRow(container, row, config);
      }
    });

    actions.appendChild(upButton);
    actions.appendChild(downButton);
    actions.appendChild(removeButton);
    content.appendChild(actions);

    // Add collapse/expand functionality
    header.addEventListener('click', () => {
      row.classList.toggle('repeater-row--collapsed');
    });

    row.appendChild(header);
    row.appendChild(content);

    return row;
  }

  /**
   * Move row up in the list
   */
  private moveRowUp(row: HTMLElement): void {
    const previousRow = row.previousElementSibling as HTMLElement;
    if (previousRow && previousRow.classList.contains('repeater-row')) {
      row.parentElement?.insertBefore(row, previousRow);
      this.updateRowIndices(row.parentElement as HTMLElement);
    }
  }

  /**
   * Move row down in the list
   */
  private moveRowDown(row: HTMLElement): void {
    const nextRow = row.nextElementSibling as HTMLElement;
    if (nextRow && nextRow.classList.contains('repeater-row')) {
      row.parentElement?.insertBefore(nextRow, row);
      this.updateRowIndices(row.parentElement as HTMLElement);
    }
  }

  /**
   * Update row indices and titles after reordering
   */
  private updateRowIndices(rowsContainer: HTMLElement): void {
    const rows = rowsContainer.querySelectorAll('.repeater-row');
    rows.forEach((row, index) => {
      row.setAttribute('data-row-id', String(index));

      // Update title
      const title = row.querySelector('.repeater-row__title');
      if (title) {
        title.textContent = `Row ${index + 1}`;
      }

      // Update all fields within this row
      const elementsWithRowId = row.querySelectorAll('[data-row-id]');
      elementsWithRowId.forEach(element => {
        element.setAttribute('data-row-id', String(index));
      });
    });
  }

  /**
   * Add a new empty row
   */
  private addRow(container: HTMLElement, config: FieldConfigData): void {
    const rowsContainer = container.querySelector('.repeater-rows');
    if (!rowsContainer) return;

    const existingRows = rowsContainer.querySelectorAll('.repeater-row');
    const newIndex = existingRows.length;

    // Check max constraint
    if (config.max && newIndex >= config.max) return;

    const newRow = this.renderRow(config, {}, newIndex);
    rowsContainer.appendChild(newRow);

    // Update add button state
    const addButton = container.querySelector('.repeater-add') as HTMLButtonElement;
    if (config.max && newIndex + 1 >= config.max) {
      addButton.disabled = true;
    }
  }

  /**
   * Remove a row and re-index remaining rows
   */
  private removeRow(container: HTMLElement, row: HTMLElement, config: FieldConfigData): void {
    row.remove();

    // Re-index remaining rows
    const rowsContainer = container.querySelector('.repeater-rows');
    if (rowsContainer) {
      const rows = rowsContainer.querySelectorAll('.repeater-row');
      rows.forEach((row, index) => {
        row.setAttribute('data-row-id', String(index));
        // Update all fields and buttons within this row
        const elementsWithRowId = row.querySelectorAll('[data-row-id]');
        elementsWithRowId.forEach(element => {
          element.setAttribute('data-row-id', String(index));
        });
      });
    }

    // Re-enable add button if needed
    const addButton = container.querySelector('.repeater-add') as HTMLButtonElement;
    const currentRowCount = rowsContainer?.querySelectorAll('.repeater-row').length || 0;
    if (!config.max || currentRowCount < config.max) {
      addButton.disabled = false;
    }
  }

  /**
   * Extract data from repeater field
   * Returns array of row objects
   */
  extract(element: HTMLElement): any {
    if (!element.classList.contains('repeater-field')) {
      return [];
    }

    const rows = element.querySelectorAll('.repeater-row');
    const data: any[] = [];

    rows.forEach((row) => {
      const rowId = row.getAttribute('data-row-id');
      if (rowId === null) return;

      const rowData: Record<string, any> = {};

      // Find all fields in this specific row
      const fields = row.querySelectorAll(`.slabs-field[data-row-id="${rowId}"]`);

      fields.forEach((field) => {
        const fieldName = field.getAttribute('data-field-name');
        if (!fieldName) return;

        const value = this.getExtractor().extractField(field as HTMLElement);
        rowData[fieldName] = value;
      });

      data.push(rowData);
    });

    return data;
  }

  /**
   * Validate repeater field value
   * Validates row count constraints and sub-field values
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Field';

    // Type validation - must be array
    if (!Array.isArray(value)) {
      // Handle null/undefined as empty array
      if (value === null || value === undefined) {
        value = [];
      } else {
        errors.push({
          field: fieldLabel,
          message: `${fieldLabel} must be an array`,
          code: 'INVALID_TYPE'
        });
        return { valid: false, errors };
      }
    }

    const rows = value as any[];

    // Required validation
    if (config.required && rows.length === 0) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} is required`,
        code: 'REQUIRED'
      });
    }

    // Min rows validation
    if (config.min !== undefined && rows.length < config.min) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must have at least ${config.min} row${config.min !== 1 ? 's' : ''}`,
        code: 'MIN_ROWS'
      });
    }

    // Max rows validation
    if (config.max !== undefined && rows.length > config.max) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must not exceed ${config.max} row${config.max !== 1 ? 's' : ''}`,
        code: 'MAX_ROWS'
      });
    }

    // Skip sub-field validation if no fields defined
    if (!config.fields || Object.keys(config.fields).length === 0) {
      return {
        valid: errors.length === 0,
        errors
      };
    }

    // Validate each row's sub-fields
    rows.forEach((rowData, rowIndex) => {
      const rowResult = this.getValidator().validate(config.fields!, rowData || {});

      if (!rowResult.valid) {
        // Add row index to error messages
        rowResult.errors.forEach(error => {
          errors.push({
            field: error.field,
            message: `Row ${rowIndex + 1}: ${error.message}`,
            code: error.code
          });
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
