/**
 * Domain types for @slabs/fields
 */

/**
 * Field configuration data
 */
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
  'select',
  'checkbox',
  'radio',
  'range',
  'image',
  'color',
  'date',
  'wysiwyg'
] as const;

export type ValidFieldType = typeof VALID_FIELD_TYPES[number];
