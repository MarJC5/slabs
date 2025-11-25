/**
 * Domain types for @slabs/fields
 */

/**
 * Field configuration data
 */
/**
 * Conditional operator types
 */
export type ConditionalOperator =
  | '=='          // Equal
  | '!='          // Not equal
  | '>'           // Greater than
  | '<'           // Less than
  | '>='          // Greater than or equal
  | '<='          // Less than or equal
  | 'contains'    // String/array contains value
  | 'not_contains'  // String/array does not contain value
  | 'in'          // Value is in array
  | 'not_in'      // Value is not in array
  | 'empty'       // Field is empty (null, undefined, '', [], {})
  | 'not_empty';  // Field is not empty

/**
 * Conditional display configuration (value object)
 */
export interface ConditionalConfig {
  /** Field name to watch */
  field: string;

  /** Comparison operator */
  operator: ConditionalOperator;

  /** Value to compare against */
  value: any;
}

export interface FieldConfigData {
  type: string;
  label?: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  className?: string;
  width?: string | number;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  description?: string;
  hint?: string;
  autocomplete?: string;  // password, email, text - browser autocomplete hints

  // Conditional display
  conditional?: ConditionalConfig;

  // Type-specific options
  rows?: number;  // textarea
  step?: number;  // number
  prefix?: string;  // number
  suffix?: string;  // number, range
  options?: Array<{ value: string | number; label: string }>;  // select, radio
  multiple?: boolean;  // select
  accept?: string;  // image
  maxSize?: number;  // image
  showValue?: boolean;  // range
  mode?: 'minimal' | 'full';  // wysiwyg
  display?: 'checkbox' | 'switch';  // boolean - display mode
  buttonLabel?: string;  // repeater, flexible - custom "Add Row" / "Add Block" button text
  layout?: 'row' | 'block' | 'vertical' | 'horizontal';  // repeater - compact vs full-width layout; group - field arrangement
  fields?: Record<string, FieldConfigData>;  // repeater, group - nested field definitions
  layouts?: Record<string, FieldConfigData>;  // flexible - layout type definitions with their own fields
  collapsible?: boolean;  // group - whether the group can be collapsed
  collapsed?: boolean;  // group - initial collapsed state
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  fieldErrors?: Record<string, ValidationError[]>;
}

/**
 * Field type interface
 * All field types must implement this
 */
export interface FieldType {
  /**
   * Render field to HTMLElement
   */
  render(config: FieldConfigData, value: any): HTMLElement;

  /**
   * Extract value from rendered element
   */
  extract(element: HTMLElement): any;

  /**
   * Validate field value
   */
  validate(config: FieldConfigData, value: any): ValidationResult;
}

/**
 * Valid field type names
 */
export const VALID_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'email',
  'password',
  'link',
  'select',
  'checkbox',
  'boolean',
  'radio',
  'range',
  'image',
  'color',
  'date',
  'wysiwyg',
  'repeater',
  'flexible',
  'group',
  'tabs',
  'oembed',
  'file'
] as const;

export type ValidFieldType = typeof VALID_FIELD_TYPES[number];
