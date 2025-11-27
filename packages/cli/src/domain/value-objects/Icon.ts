/**
 * Icon Value Object
 *
 * Represents a valid icon for blocks.
 * Supports two formats:
 * 1. Single character/emoji (e.g., '🎯', 'A')
 * 2. CodexIcon name (e.g., 'Picture', 'Bold', 'Settings')
 *
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
   * - Either a single character/emoji OR a CodexIcon name (PascalCase string)
   */
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Icon cannot be empty');
    }

    // Check if it's a CodexIcon name (PascalCase: starts with uppercase, contains only letters)
    const isPascalCase = /^[A-Z][a-zA-Z]*$/.test(value);

    if (isPascalCase) {
      // Valid CodexIcon name - no further validation needed
      return;
    }

    // Otherwise, validate as single character/emoji
    // Use Intl.Segmenter for proper grapheme cluster counting (handles complex emojis)
    // If not available, fall back to simple length check with generous limits
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
      const graphemes = Array.from(segmenter.segment(value));

      if (graphemes.length > 1) {
        throw new Error('Icon must be a single character/emoji or a CodexIcon name (e.g., Picture, Bold)');
      }
    } else {
      // Fallback: allow up to 7 code units to accommodate complex emojis with modifiers
      if (value.length > 7) {
        throw new Error('Icon must be a single character/emoji or a CodexIcon name (e.g., Picture, Bold)');
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
   * Check if the icon is a CodexIcon name (PascalCase string)
   */
  isCodexIcon(): boolean {
    return /^[A-Z][a-zA-Z]*$/.test(this._value);
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
   * Default CodexIcon names for each category
   */
  static defaultContentIcon(): string {
    return 'FileText';
  }

  static defaultMediaIcon(): string {
    return 'Picture';
  }

  static defaultDesignIcon(): string {
    return 'Palette';
  }

  static defaultWidgetsIcon(): string {
    return 'Settings';
  }

  static defaultThemeIcon(): string {
    return 'Brush';
  }

  static defaultEmbedIcon(): string {
    return 'Code';
  }
}
