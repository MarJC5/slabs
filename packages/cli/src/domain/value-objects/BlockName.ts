/**
 * BlockName Value Object
 *
 * Represents a valid block name in kebab-case format.
 * Enforces domain rules for block naming.
 */
export class BlockName {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validates the block name according to domain rules:
   * - Not empty
   * - Lowercase letters, numbers, and hyphens only
   * - Must start and end with alphanumeric
   * - No consecutive hyphens
   */
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Block name cannot be empty');
    }

    // Must be lowercase kebab-case: a-z, 0-9, hyphens only
    // No leading/trailing hyphens, no consecutive hyphens
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

    if (!kebabCaseRegex.test(value)) {
      throw new Error('Block name must be lowercase kebab-case (e.g., my-block)');
    }
  }

  /**
   * Convert to namespaced format (e.g., "slabs/my-block")
   */
  toNamespace(namespace: string): string {
    return `${namespace}/${this._value}`;
  }

  /**
   * Convert to PascalCase (e.g., "MyBlock")
   */
  toPascalCase(): string {
    return this._value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Convert to camelCase (e.g., "myBlock")
   */
  toCamelCase(): string {
    const pascal = this.toPascalCase();
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  /**
   * Check equality with another BlockName
   */
  equals(other: BlockName): boolean {
    return this._value === other._value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }
}
