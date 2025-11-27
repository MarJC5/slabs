/**
 * FieldType Value Object
 *
 * Represents a valid field type for block fields.
 * Enforces domain rules for field types.
 */
export class FieldType {
  private static readonly VALID_TYPES = [
    'text',
    'wysiwyg',
    'select',
    'checkbox',
    'number',
    'color',
    'image',
    'repeater'
  ] as const;

  private static readonly TYPES_REQUIRING_OPTIONS = ['select'] as const;

  private readonly _value: (typeof FieldType.VALID_TYPES)[number];

  constructor(value: string) {
    if (!FieldType.isValid(value)) {
      throw new Error(
        `Invalid field type: ${value}. Must be one of: ${FieldType.VALID_TYPES.join(', ')}`
      );
    }
    this._value = value as (typeof FieldType.VALID_TYPES)[number];
  }

  get value(): string {
    return this._value;
  }

  /**
   * Get all valid field types
   */
  static all(): string[] {
    return [...FieldType.VALID_TYPES];
  }

  /**
   * Check if a value is a valid field type
   */
  static isValid(value: string): boolean {
    return (FieldType.VALID_TYPES as readonly string[]).includes(value);
  }

  /**
   * Check if this field type requires options
   */
  requiresOptions(): boolean {
    return (FieldType.TYPES_REQUIRING_OPTIONS as readonly string[]).includes(this._value);
  }

  /**
   * Check equality with another FieldType
   */
  equals(other: FieldType): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
