import type { FieldType, FieldConfigData, ValidationResult, ValidationError } from '../types';
import { FieldRegistry } from '../FieldRegistry';
import { FieldRenderer } from '../../application/FieldRenderer';
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
 * FlexibleBlock - Represents a single block in the flexible content
 */
export interface FlexibleBlock {
  layout: string;
  fields: Record<string, any>;
}

/**
 * FlexibleField - Flexible content field (ACF-like flexible content)
 * Allows users to add multiple layout types with different field configurations
 */
export class FlexibleField implements FieldType {
  private registry: FieldRegistry | null = null;
  private renderer: FieldRenderer | null = null;
  private extractor: FieldExtractor | null = null;

  constructor() {
    // Lazy initialization to avoid circular dependency
  }

  /**
   * Get or create registry instance (lazy initialization)
   */
  private getRegistry(): FieldRegistry {
    if (!this.registry) {
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
   * Render flexible field with blocks and add/remove buttons
   */
  render(config: FieldConfigData, value: any): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('flexible-field');
    container.dataset.fieldType = 'flexible';

    // Apply custom className
    if (config.className) {
      container.classList.add(config.className);
    }

    // Normalize value to array
    let blocks: FlexibleBlock[] = [];
    if (Array.isArray(value)) {
      blocks = value;
    } else if (value === null || value === undefined || value === '') {
      blocks = Array.isArray(config.defaultValue) ? config.defaultValue : [];
    }

    // Create blocks container
    const blocksContainer = document.createElement('div');
    blocksContainer.classList.add('flexible-rows');

    // Render existing blocks
    blocks.forEach((blockData, index) => {
      const block = this.renderBlock(config, blockData, index);
      blocksContainer.appendChild(block);
    });

    container.appendChild(blocksContainer);

    // Create layout selector and add button container
    const addContainer = document.createElement('div');
    addContainer.classList.add('flexible-add-container');

    // Create layout selector dropdown
    const layoutSelector = document.createElement('select');
    layoutSelector.classList.add('flexible-layout-selector');

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select layout...';
    layoutSelector.appendChild(defaultOption);

    // Add layout options
    if (config.layouts) {
      for (const [layoutKey, layoutConfig] of Object.entries(config.layouts)) {
        const option = document.createElement('option');
        option.value = layoutKey;
        option.textContent = (layoutConfig as any).label || layoutKey;
        option.classList.add('flexible-layout-option');
        layoutSelector.appendChild(option);
      }
    }

    // Add "Add Block" button
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('flexible-add');
    addButton.textContent = config.buttonLabel || 'Add Block';

    // Disable if max reached or no layout selected
    if (config.max && blocks.length >= config.max) {
      addButton.disabled = true;
    }

    // Add click handler
    addButton.addEventListener('click', () => {
      const selectedLayout = layoutSelector.value;
      if (selectedLayout) {
        this.addBlock(container, config, selectedLayout);
        layoutSelector.value = ''; // Reset selector
      }
    });

    // Enable/disable add button based on selection
    layoutSelector.addEventListener('change', () => {
      addButton.disabled = !layoutSelector.value || (config.max ? blocks.length >= config.max : false);
    });

    // Initially disable if no selection
    if (!layoutSelector.value) {
      addButton.disabled = true;
    }

    addContainer.appendChild(layoutSelector);
    addContainer.appendChild(addButton);
    container.appendChild(addContainer);

    // Update button states based on constraints (after all blocks are rendered)
    this.updateButtonStates(container, config);

    return container;
  }

  /**
   * Render a single flexible block with sub-fields and action buttons
   */
  private renderBlock(config: FieldConfigData, blockData: FlexibleBlock, blockIndex: number): HTMLElement {
    const block = document.createElement('div');
    block.classList.add('flexible-row');
    block.dataset.rowId = String(blockIndex);

    // Get layout configuration
    const layoutKey = blockData.layout;
    const layoutConfig = config.layouts?.[layoutKey] as FieldConfigData | undefined;

    if (!layoutConfig) {
      // Invalid layout - render error message
      const error = document.createElement('div');
      error.textContent = `Unknown layout: ${layoutKey}`;
      error.style.color = 'red';
      block.appendChild(error);
      return block;
    }

    // Hidden input to store layout type
    const layoutInput = document.createElement('input');
    layoutInput.type = 'hidden';
    layoutInput.classList.add('flexible-layout-type');
    layoutInput.value = layoutKey;
    block.appendChild(layoutInput);

    // Create collapsible header
    const header = document.createElement('div');
    header.classList.add('flexible-row__header');

    const title = document.createElement('div');
    title.classList.add('flexible-row__title');
    title.textContent = layoutConfig.label || layoutKey;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.classList.add('flexible-row__toggle');
    toggle.innerHTML = this.getChevronIcon();
    toggle.setAttribute('aria-label', 'Toggle block');

    header.appendChild(title);
    header.appendChild(toggle);

    // Create content container
    const content = document.createElement('div');
    content.classList.add('flexible-row__content');

    const fieldsContainer = document.createElement('div');
    fieldsContainer.classList.add('flexible-row__fields');

    // Render each sub-field based on layout
    if (layoutConfig.fields) {
      for (const [fieldName, fieldConfig] of Object.entries(layoutConfig.fields)) {
        const fieldValue = blockData.fields?.[fieldName];
        const fieldElement = this.getRenderer().renderField(fieldName, fieldConfig, fieldValue);

        // Add block ID to distinguish this field from other blocks
        fieldElement.dataset.rowId = String(blockIndex);

        fieldsContainer.appendChild(fieldElement);
      }
    }

    content.appendChild(fieldsContainer);

    // Add action buttons
    const actions = document.createElement('div');
    actions.classList.add('flexible-row__actions');

    // Move up button
    const upButton = document.createElement('button');
    upButton.type = 'button';
    upButton.classList.add('flexible-row__move-up');
    upButton.innerHTML = this.getArrowUpIcon();
    upButton.setAttribute('aria-label', 'Move up');
    upButton.addEventListener('click', () => {
      this.moveBlockUp(block);
    });

    // Move down button
    const downButton = document.createElement('button');
    downButton.type = 'button';
    downButton.classList.add('flexible-row__move-down');
    downButton.innerHTML = this.getArrowDownIcon();
    downButton.setAttribute('aria-label', 'Move down');
    downButton.addEventListener('click', () => {
      this.moveBlockDown(block);
    });

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('flexible-remove');
    removeButton.textContent = 'Remove';
    removeButton.dataset.rowId = String(blockIndex);

    // Store reference to container for remove handler
    removeButton.addEventListener('click', () => {
      const container = block.parentElement?.parentElement as HTMLElement;
      if (container) {
        this.removeBlock(container, block, config);
      }
    });

    actions.appendChild(upButton);
    actions.appendChild(downButton);
    actions.appendChild(removeButton);
    content.appendChild(actions);

    // Add collapse/expand functionality
    header.addEventListener('click', () => {
      block.classList.toggle('flexible-row--collapsed');
    });

    block.appendChild(header);
    block.appendChild(content);

    return block;
  }

  /**
   * Add a new block
   */
  private addBlock(container: HTMLElement, config: FieldConfigData, layoutKey: string): void {
    const blocksContainer = container.querySelector('.flexible-rows') as HTMLElement;
    if (!blocksContainer) return;

    const blocks = blocksContainer.querySelectorAll('.flexible-row');
    const blockIndex = blocks.length;

    // Check max constraint
    if (config.max && blocks.length >= config.max) {
      return;
    }

    // Create new block with empty data
    const newBlockData: FlexibleBlock = {
      layout: layoutKey,
      fields: {}
    };

    const newBlock = this.renderBlock(config, newBlockData, blockIndex);
    blocksContainer.appendChild(newBlock);

    // Update button states
    this.updateButtonStates(container, config);
  }

  /**
   * Remove a block
   */
  private removeBlock(container: HTMLElement, block: HTMLElement, config: FieldConfigData): void {
    const blocksContainer = container.querySelector('.flexible-rows') as HTMLElement;
    if (!blocksContainer) return;

    const blocks = blocksContainer.querySelectorAll('.flexible-row');

    // Check min constraint
    if (config.min && blocks.length <= config.min) {
      return;
    }

    block.remove();

    // Update row indices
    this.updateBlockIndices(blocksContainer);

    // Update button states
    this.updateButtonStates(container, config);
  }

  /**
   * Move block up in the list
   */
  private moveBlockUp(block: HTMLElement): void {
    const previousBlock = block.previousElementSibling as HTMLElement;
    if (previousBlock && previousBlock.classList.contains('flexible-row')) {
      block.parentElement?.insertBefore(block, previousBlock);
      this.updateBlockIndices(block.parentElement as HTMLElement);
    }
  }

  /**
   * Move block down in the list
   */
  private moveBlockDown(block: HTMLElement): void {
    const nextBlock = block.nextElementSibling as HTMLElement;
    if (nextBlock && nextBlock.classList.contains('flexible-row')) {
      block.parentElement?.insertBefore(nextBlock, block);
      this.updateBlockIndices(block.parentElement as HTMLElement);
    }
  }

  /**
   * Update block indices after reordering
   */
  private updateBlockIndices(blocksContainer: HTMLElement): void {
    const blocks = blocksContainer.querySelectorAll('.flexible-row');
    blocks.forEach((block, index) => {
      block.setAttribute('data-row-id', String(index));

      // Update all fields within this block
      const fields = block.querySelectorAll('.slabs-field');
      fields.forEach(field => {
        field.setAttribute('data-row-id', String(index));
      });
    });
  }

  /**
   * Update add/remove button states based on constraints
   */
  private updateButtonStates(container: HTMLElement, config: FieldConfigData): void {
    const blocksContainer = container.querySelector('.flexible-rows') as HTMLElement;
    if (!blocksContainer) return;

    const blocks = blocksContainer.querySelectorAll('.flexible-row');
    const addButton = container.querySelector('.flexible-add') as HTMLButtonElement;
    const layoutSelector = container.querySelector('.flexible-layout-selector') as HTMLSelectElement;
    const removeButtons = container.querySelectorAll('.flexible-remove');

    // Update add button
    if (addButton) {
      const hasSelection = layoutSelector && layoutSelector.value;
      addButton.disabled = !hasSelection || (config.max !== undefined && blocks.length >= config.max);
    }

    // Update remove buttons
    removeButtons.forEach(btn => {
      (btn as HTMLButtonElement).disabled = config.min !== undefined && blocks.length <= config.min;
    });
  }

  /**
   * Extract value from flexible field
   */
  extract(element: HTMLElement): FlexibleBlock[] {
    const blocks: FlexibleBlock[] = [];
    const blockElements = element.querySelectorAll('.flexible-row');

    blockElements.forEach(blockElement => {
      const layoutInput = blockElement.querySelector('.flexible-layout-type') as HTMLInputElement;
      if (!layoutInput) return;

      const layoutKey = layoutInput.value;
      const fieldsContainer = blockElement.querySelector('.flexible-row__fields');

      if (!fieldsContainer) return;

      // Extract all fields within this block
      const blockFields: Record<string, any> = {};
      const fieldElements = fieldsContainer.querySelectorAll('.slabs-field[data-field-name]');

      fieldElements.forEach(fieldElement => {
        const fieldName = fieldElement.getAttribute('data-field-name');
        if (!fieldName) return;

        const fieldValue = this.getExtractor().extractField(fieldElement as HTMLElement);
        blockFields[fieldName] = fieldValue;
      });

      blocks.push({
        layout: layoutKey,
        fields: blockFields
      });
    });

    return blocks;
  }

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors: ValidationError[] = [];
    const fieldLabel = config.label || 'Flexible Content';

    // Normalize value to array
    const blocks: FlexibleBlock[] = Array.isArray(value) ? value : [];

    // Required validation
    if (config.required && blocks.length === 0) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} is required`,
        code: 'REQUIRED'
      });
    }

    // Min constraint
    if (config.min !== undefined && blocks.length < config.min) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must have at least ${config.min} block(s)`,
        code: 'MIN_BLOCKS'
      });
    }

    // Max constraint
    if (config.max !== undefined && blocks.length > config.max) {
      errors.push({
        field: fieldLabel,
        message: `${fieldLabel} must have at most ${config.max} block(s)`,
        code: 'MAX_BLOCKS'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}