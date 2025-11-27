import { FieldType } from '../value-objects/FieldType';

/**
 * Field entity representing a single field in a block configuration.
 * Fields must have camelCase names and contain metadata for rendering.
 *
 * @example
 * ```typescript
 * const field = new Field({
 *   name: 'firstName',
 *   type: new FieldType('text'),
 *   label: 'First Name',
 *   required: true,
 *   placeholder: 'Enter your first name'
 * });
 * ```
 */
export class Field {
  readonly name: string;
  readonly type: FieldType;
  readonly label: string;
  readonly required: boolean;
  readonly placeholder?: string;
  readonly defaultValue?: any;
  readonly options?: any;

  constructor(props: {
    name: string;
    type: FieldType;
    label: string;
    required?: boolean;
    placeholder?: string;
    defaultValue?: any;
    options?: any;
  }) {
    this.validateName(props.name);
    this.name = props.name;
    this.type = props.type;
    this.label = props.label;
    this.required = props.required ?? false;
    this.placeholder = props.placeholder;
    this.defaultValue = props.defaultValue;
    this.options = props.options;
  }

  /**
   * Validates that the field name follows camelCase convention.
   *
   * Valid examples: firstName, lastName, phoneNumber, address1
   * Invalid examples: FirstName, first-name, first_name, first name, 123field
   *
   * @param name - The field name to validate
   * @throws {Error} If the name is not valid camelCase
   */
  private validateName(name: string): void {
    // Must start with lowercase letter, followed by any combination of letters and numbers
    const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;

    if (!camelCaseRegex.test(name)) {
      throw new Error(
        'Field name must be camelCase (e.g., myField, firstName, address1)'
      );
    }
  }

  /**
   * Converts the field to JSON format for block.json.
   * Omits undefined properties and spreads options into the result.
   *
   * @returns JSON representation of the field
   */
  toJSON(): Record<string, any> {
    const json: Record<string, any> = {
      type: this.type.value,
      label: this.label,
      required: this.required,
    };

    // Add optional properties only if defined
    if (this.placeholder !== undefined) {
      json.placeholder = this.placeholder;
    }

    if (this.defaultValue !== undefined) {
      json.default = this.defaultValue;
    }

    // Spread options into the result
    if (this.options !== undefined) {
      Object.assign(json, this.options);
    }

    return json;
  }

  /**
   * Compares this field with another field for equality.
   * Two fields are equal if they have the same name.
   *
   * @param other - The other field to compare with
   * @returns true if fields have the same name
   */
  equals(other: Field): boolean {
    return this.name === other.name;
  }

  /**
   * Returns the field name as a string representation.
   *
   * @returns The field name
   */
  toString(): string {
    return this.name;
  }
}
