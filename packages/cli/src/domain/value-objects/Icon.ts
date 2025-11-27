/**
 * Icon Value Object
 *
 * Represents a valid icon (emoji or single character) for blocks.
 * Enforces domain rules for icons.
 */
export class Icon {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validates the icon according to domain rules:
   * - Not empty
   * - Single character or emoji (including those with variation selectors)
   */
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Icon cannot be empty');
    }

    // Use Intl.Segmenter for proper grapheme cluster counting (handles complex emojis)
    // If not available, fall back to simple length check with generous limits
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
      const graphemes = Array.from(segmenter.segment(value));

      if (graphemes.length > 1) {
        throw new Error('Icon must be a single character or emoji');
      }
    } else {
      // Fallback: allow up to 7 code units to accommodate complex emojis with modifiers
      if (value.length > 7) {
        throw new Error('Icon must be a single character or emoji');
      }
    }
  }

  /**
   * Check if the icon is an emoji (non-ASCII character)
   */
  isEmoji(): boolean {
    // Check if any character code is outside ASCII range (0-127)
    return [...this._value].some(char => char.charCodeAt(0) > 127);
  }

  /**
   * Check equality with another Icon
   */
  equals(other: Icon): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }

  /**
   * Default icons for each category
   */
  static defaultContentIcon(): string {
    return '📝';
  }

  static defaultMediaIcon(): string {
    return '🎨';
  }

  static defaultDesignIcon(): string {
    return '🎯';
  }

  static defaultWidgetsIcon(): string {
    return '🔧';
  }

  static defaultThemeIcon(): string {
    return '🌟';
  }

  static defaultEmbedIcon(): string {
    return '📦';
  }
}
