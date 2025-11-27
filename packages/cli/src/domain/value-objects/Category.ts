/**
 * Category Value Object
 *
 * Represents a valid block category.
 * Categories are used to organize blocks in the Editor.js toolbox.
 */
export class Category {
  private static readonly VALID_CATEGORIES = [
    'content',
    'media',
    'design',
    'widgets',
    'theme',
    'embed'
  ] as const;

  private readonly _value: (typeof Category.VALID_CATEGORIES)[number];

  constructor(value: string) {
    if (!Category.isValid(value)) {
      throw new Error(
        `Invalid category: ${value}. Must be one of: ${Category.VALID_CATEGORIES.join(', ')}`
      );
    }
    this._value = value as (typeof Category.VALID_CATEGORIES)[number];
  }

  get value(): string {
    return this._value;
  }

  /**
   * Get all valid categories
   */
  static all(): string[] {
    return [...Category.VALID_CATEGORIES];
  }

  /**
   * Check if a value is a valid category
   */
  static isValid(value: string): boolean {
    return (Category.VALID_CATEGORIES as readonly string[]).includes(value);
  }

  /**
   * Check equality with another Category
   */
  equals(other: Category): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
