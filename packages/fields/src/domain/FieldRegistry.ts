import type { FieldType } from './types';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { NumberField } from './fields/NumberField';
import { SelectField } from './fields/SelectField';
import { CheckboxField } from './fields/CheckboxField';
import { RadioField } from './fields/RadioField';
import { RangeField } from './fields/RangeField';
import { ImageField } from './fields/ImageField';
import { ColorField } from './fields/ColorField';
import { DateField } from './fields/DateField';
import { WysiwygField } from './fields/WysiwygField';
import { EmailField } from './fields/EmailField';
import { LinkField } from './fields/LinkField';

/**
 * FieldRegistry - Repository for managing field types
 * Implements the repository pattern for field type management
 */
export class FieldRegistry {
  private fields: Map<string, FieldType>;

  constructor() {
    this.fields = new Map();
  }

  /**
   * Register a field type
   * @throws Error if type is already registered
   */
  register(type: string, field: FieldType): void {
    if (this.fields.has(type)) {
      throw new Error(`Field type '${type}' is already registered`);
    }
    this.fields.set(type, field);
  }

  /**
   * Get a registered field type
   * @throws Error if type is not registered
   */
  get(type: string): FieldType {
    const field = this.fields.get(type);
    if (!field) {
      throw new Error(`Field type '${type}' is not registered`);
    }
    return field;
  }

  /**
   * Check if a field type is registered
   */
  has(type: string): boolean {
    return this.fields.has(type);
  }

  /**
   * Unregister a field type
   */
  unregister(type: string): void {
    this.fields.delete(type);
  }

  /**
   * Get all registered field type names
   */
  getAllTypes(): string[] {
    return Array.from(this.fields.keys());
  }

  /**
   * Create a registry with default field types
   */
  static createDefault(): FieldRegistry {
    const registry = new FieldRegistry();
    registry.register('text', new TextField());
    registry.register('textarea', new TextareaField());
    registry.register('number', new NumberField());
    registry.register('select', new SelectField());
    registry.register('checkbox', new CheckboxField());
    registry.register('radio', new RadioField());
    registry.register('range', new RangeField());
    registry.register('image', new ImageField());
    registry.register('color', new ColorField());
    registry.register('date', new DateField());
    registry.register('wysiwyg', new WysiwygField());
    registry.register('email', new EmailField());
    registry.register('link', new LinkField());
    return registry;
  }
}
