/**
 * Group field helpers
 * Functions for working with grouped fields
 */

import { getValueByPath, setValueByPath } from './utils';

/**
 * Get group field value (entire group object)
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @returns Group object with all fields
 *
 * @example
 * ```typescript
 * const settings = getGroup(data, 'settings');
 * // { backgroundColor: '#fff', textColor: '#000', padding: 20 }
 * ```
 */
export function getGroup<T extends Record<string, any> = Record<string, any>>(
  data: any,
  groupName: string
): T | undefined {
  const value = getValueByPath(data, groupName);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as T;
}

/**
 * Get specific field from group
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @param fieldName - Field name within group
 * @returns Field value
 *
 * @example
 * ```typescript
 * const bgColor = getGroupField(data, 'settings', 'backgroundColor');
 * // '#fff'
 * ```
 */
export function getGroupField<T = any>(
  data: any,
  groupName: string,
  fieldName: string
): T | undefined {
  const group = getGroup(data, groupName);
  if (!group) {
    return undefined;
  }
  return getValueByPath(group, fieldName);
}

/**
 * Get all fields from group as object
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @returns Object with all group fields
 *
 * @example
 * ```typescript
 * const allSettings = getGroupFields(data, 'settings');
 * // { backgroundColor: '#fff', textColor: '#000', padding: 20 }
 * ```
 */
export function getGroupFields<T extends Record<string, any> = Record<string, any>>(
  data: any,
  groupName: string
): T {
  const group = getGroup<T>(data, groupName);
  return group ? { ...group } : {} as T;
}

/**
 * Set field value in group (immutable)
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @param fieldName - Field name within group
 * @param value - New value
 * @returns New data object with group field updated
 *
 * @example
 * ```typescript
 * const newData = setGroupField(data, 'settings', 'backgroundColor', '#000');
 * ```
 */
export function setGroupField(
  data: any,
  groupName: string,
  fieldName: string,
  value: any
): any {
  const group = getGroup(data, groupName) || {};
  const newGroup = setValueByPath(group, fieldName, value);
  return setValueByPath(data, groupName, newGroup);
}

/**
 * Set multiple fields in group (immutable)
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @param fields - Object with field names and values
 * @returns New data object with group fields updated
 *
 * @example
 * ```typescript
 * const newData = setGroupFields(data, 'settings', {
 *   backgroundColor: '#000',
 *   textColor: '#fff'
 * });
 * ```
 */
export function setGroupFields(
  data: any,
  groupName: string,
  fields: Record<string, any>
): any {
  const group = getGroup(data, groupName) || {};
  const newGroup = { ...group, ...fields };
  return setValueByPath(data, groupName, newGroup);
}

/**
 * Check if group exists and has fields
 *
 * @param data - Block data object
 * @param groupName - Group field name
 * @returns True if group exists and is not empty
 *
 * @example
 * ```typescript
 * if (hasGroup(data, 'settings')) {
 *   const settings = getGroup(data, 'settings');
 * }
 * ```
 */
export function hasGroup(data: any, groupName: string): boolean {
  const group = getGroup(data, groupName);
  return group !== undefined && Object.keys(group).length > 0;
}
