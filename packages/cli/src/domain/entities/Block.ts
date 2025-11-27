import { BlockName } from '../value-objects/BlockName';
import { Category } from '../value-objects/Category';
import { Icon } from '../value-objects/Icon';
import { Field } from './Field';

/**
 * Block aggregate root representing a complete Slabs block configuration.
 * This is the main domain entity that encapsulates all block metadata and fields.
 *
 * Blocks are immutable - operations like addField() return new Block instances.
 *
 * @example
 * ```typescript
 * const block = new Block({
 *   name: new BlockName('hero-section'),
 *   title: 'Hero Section',
 *   description: 'A prominent hero section',
 *   category: new Category('content'),
 *   icon: new Icon('🎯'),
 *   fields: [],
 *   collapsible: true
 * });
 * ```
 */
export class Block {
  private readonly name: BlockName;
  private readonly title: string;
  private readonly description: string;
  private readonly category: Category;
  private readonly icon: Icon;
  private readonly fields: Field[];
  private readonly collapsible: boolean;

  constructor(props: {
    name: BlockName;
    title: string;
    description: string;
    category: Category;
    icon: Icon;
    fields: Field[];
    collapsible?: boolean;
  }) {
    this.name = props.name;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.icon = props.icon;
    this.fields = [...props.fields]; // Create defensive copy
    this.collapsible = props.collapsible ?? true;
  }

  /**
   * Adds a field to the block and returns a new Block instance.
   * This follows immutability principles - the original block is unchanged.
   *
   * @param field - The field to add
   * @returns A new Block instance with the added field
   */
  addField(field: Field): Block {
    return new Block({
      name: this.name,
      title: this.title,
      description: this.description,
      category: this.category,
      icon: this.icon,
      fields: [...this.fields, field],
      collapsible: this.collapsible
    });
  }

  /**
   * Validates the block according to business rules.
   * A valid block must have:
   * - At least one field
   * - A non-empty title
   *
   * @returns true if the block is valid
   */
  validate(): boolean {
    return this.fields.length > 0 && this.title.length > 0;
  }

  /**
   * Converts the block to block.json format.
   * Fields are converted to a keyed object where keys are field names.
   *
   * @returns JSON representation suitable for block.json
   */
  toJSON(): Record<string, any> {
    const fieldsObject: Record<string, any> = {};

    for (const field of this.fields) {
      fieldsObject[field.name] = field.toJSON();
    }

    return {
      name: this.name.toNamespace('slabs'),
      title: this.title,
      description: this.description,
      category: this.category.value,
      icon: this.icon.value,
      collapsible: this.collapsible,
      fields: fieldsObject
    };
  }

  // Getters for accessing private properties

  /**
   * @returns The block name
   */
  getName(): BlockName {
    return this.name;
  }

  /**
   * @returns The block title
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * @returns The block description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * @returns The block category
   */
  getCategory(): Category {
    return this.category;
  }

  /**
   * @returns The block icon
   */
  getIcon(): Icon {
    return this.icon;
  }

  /**
   * @returns A defensive copy of the fields array
   */
  getFields(): Field[] {
    return [...this.fields];
  }

  /**
   * @returns Whether the block is collapsible in the editor
   */
  getCollapsible(): boolean {
    return this.collapsible;
  }
}
