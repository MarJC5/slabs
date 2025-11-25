/**
 * Basic field access helpers
 * ACF-like functions for getting and setting field values
 */

import { getValueByPath, setValueByPath, deleteValueByPath } from './utils';

/**
 * Get field value by name
 * Supports dot notation for nested access: 'settings.backgroundColor'
 * Supports array notation for repeater access: 'items.0.title'
 *
 * @param data - Block data object
 * @param fieldName - Field name or path (supports dot notation)
 * @returns Field value or undefined
 *
 * @example
 * ```typescript
 * const title = getField(data, 'title');
 * const bgColor = getField(data, 'settings.backgroundColor');
 * const firstItemTitle = getField(data, 'items.0.title');
 * ```
 */
export function getField<T = any>(data: any, fieldName: string): T | undefined {
  return getValueByPath(data, fieldName);
}

/**
 * Get field value with default fallback
 *
 * @param data - Block data object
 * @param fieldName - Field name or path
 * @param defaultValue - Default value if field doesn't exist
 * @returns Field value or default value
 *
 * @example
 * ```typescript
 * const title = getFieldOr(data, 'title', 'Untitled');
 * const count = getFieldOr(data, 'count', 0);
 * ```
 */
export function getFieldOr<T = any>(data: any, fieldName: string, defaultValue: T): T {
  const value = getValueByPath(data, fieldName);
  return value !== undefined ? value : defaultValue;
}

/**
 * Get all field values as a flat object
 *
 * @param data - Block data object
 * @returns Object with all field values
 *
 * @example
 * ```typescript
 * const allData = getFields(data);
 * // { title: 'Hello', description: 'World', count: 5 }
 * ```
 */
export function getFields<T extends Record<string, any> = Record<string, any>>(data: any): T {
  if (!data || typeof data !== 'object') {
    return {} as T;
  }
  return { ...data } as T;
}

/**
 * Set field value (immutable - returns new object)
 * Supports dot notation for nested updates: 'settings.backgroundColor'
 * Supports array notation for repeater updates: 'items.0.title'
 *
 * @param data - Block data object
 * @param fieldName - Field name or path
 * @param value - New value
 * @returns New data object with updated value
 *
 * @example
 * ```typescript
 * const newData = setField(data, 'title', 'New Title');
 * const newData2 = setField(data, 'settings.backgroundColor', '#fff');
 * const newData3 = setField(data, 'items.0.title', 'Updated Item');
 * ```
 */
export function setField<T = any>(data: any, fieldName: string, value: T): any {
  return setValueByPath(data, fieldName, value);
}

/**
 * Set multiple field values at once (immutable - returns new object)
 *
 * @param data - Block data object
 * @param fields - Object with field names and values
 * @returns New data object with updated values
 *
 * @example
 * ```typescript
 * const newData = setFields(data, {
 *   title: 'New Title',
 *   description: 'New Description',
 *   count: 10
 * });
 * ```
 */
export function setFields(data: any, fields: Record<string, any>): any {
  let result = data;
  for (const [fieldName, value] of Object.entries(fields)) {
    result = setField(result, fieldName, value);
  }
  return result;
}

/**
 * Delete field value (immutable - returns new object)
 * Supports dot notation for nested deletion: 'settings.backgroundColor'
 *
 * @param data - Block data object
 * @param fieldName - Field name or path
 * @returns New data object without the field
 *
 * @example
 * ```typescript
 * const newData = deleteField(data, 'oldField');
 * const newData2 = deleteField(data, 'settings.deprecated');
 * ```
 */
export function deleteField(data: any, fieldName: string): any {
  return deleteValueByPath(data, fieldName);
}

/**
 * Check if field exists and has a value
 *
 * @param data - Block data object
 * @param fieldName - Field name or path
 * @returns True if field exists and is not undefined/null
 *
 * @example
 * ```typescript
 * if (hasField(data, 'title')) {
 *   console.log('Title exists');
 * }
 * ```
 */
export function hasField(data: any, fieldName: string): boolean {
  const value = getValueByPath(data, fieldName);
  return value !== undefined && value !== null;
}
