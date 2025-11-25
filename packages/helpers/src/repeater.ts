/**
 * Repeater field helpers
 * ACF-like functions for working with repeater and flexible content fields
 */

import { getValueByPath, setValueByPath } from './utils';

/**
 * Check if field has rows (for repeater/flexible fields)
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @returns True if field has rows
 *
 * @example
 * ```typescript
 * if (hasRows(data, 'items')) {
 *   const items = getRows(data, 'items');
 * }
 * ```
 */
export function hasRows(data: any, fieldName: string): boolean {
  const value = getValueByPath(data, fieldName);
  return Array.isArray(value) && value.length > 0;
}

/**
 * Get row count for repeater/flexible field
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @returns Number of rows
 *
 * @example
 * ```typescript
 * const count = getRowCount(data, 'items'); // 5
 * ```
 */
export function getRowCount(data: any, fieldName: string): number {
  const value = getValueByPath(data, fieldName);
  return Array.isArray(value) ? value.length : 0;
}

/**
 * Get all rows from repeater/flexible field
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @returns Array of row objects
 *
 * @example
 * ```typescript
 * const items = getRows(data, 'items');
 * items.forEach(row => {
 *   console.log(row.title);
 * });
 * ```
 */
export function getRows<T = any>(data: any, fieldName: string): T[] {
  const value = getValueByPath(data, fieldName);
  return Array.isArray(value) ? value : [];
}

/**
 * Get specific row from repeater/flexible field
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @param index - Row index (0-based)
 * @returns Row object or undefined
 *
 * @example
 * ```typescript
 * const firstItem = getRow(data, 'items', 0);
 * console.log(firstItem.title);
 * ```
 */
export function getRow<T = any>(data: any, fieldName: string, index: number): T | undefined {
  const rows = getRows<T>(data, fieldName);
  return rows[index];
}

/**
 * Get sub-field value from row data
 *
 * @param rowData - Row data object
 * @param subFieldName - Sub-field name
 * @returns Sub-field value
 *
 * @example
 * ```typescript
 * const rows = getRows(data, 'items');
 * rows.forEach(row => {
 *   const title = getSubField(row, 'title');
 *   const image = getSubField(row, 'image');
 * });
 * ```
 */
export function getSubField<T = any>(rowData: any, subFieldName: string): T | undefined {
  if (!rowData || typeof rowData !== 'object') {
    return undefined;
  }
  return getValueByPath(rowData, subFieldName);
}

/**
 * Add new row to repeater/flexible field (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @param rowData - New row data
 * @returns New data object with row added
 *
 * @example
 * ```typescript
 * const newData = addRow(data, 'items', {
 *   title: 'New Item',
 *   description: 'Description'
 * });
 * ```
 */
export function addRow(data: any, fieldName: string, rowData: any): any {
  const currentRows = getRows(data, fieldName);
  const newRows = [...currentRows, rowData];
  return setValueByPath(data, fieldName, newRows);
}

/**
 * Update specific row in repeater/flexible field (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @param index - Row index to update
 * @param rowData - Updated row data (merged with existing)
 * @returns New data object with row updated
 *
 * @example
 * ```typescript
 * const newData = updateRow(data, 'items', 0, {
 *   title: 'Updated Title'
 * });
 * ```
 */
export function updateRow(data: any, fieldName: string, index: number, rowData: any): any {
  const currentRows = getRows(data, fieldName);

  if (index < 0 || index >= currentRows.length) {
    return data;
  }

  const newRows = [...currentRows];
  newRows[index] = { ...currentRows[index], ...rowData };

  return setValueByPath(data, fieldName, newRows);
}

/**
 * Delete row from repeater/flexible field (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @param index - Row index to delete
 * @returns New data object with row removed
 *
 * @example
 * ```typescript
 * const newData = deleteRow(data, 'items', 2);
 * ```
 */
export function deleteRow(data: any, fieldName: string, index: number): any {
  const currentRows = getRows(data, fieldName);

  if (index < 0 || index >= currentRows.length) {
    return data;
  }

  const newRows = currentRows.filter((_, i) => i !== index);
  return setValueByPath(data, fieldName, newRows);
}

/**
 * Add row to sub-repeater (nested repeater) (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Parent repeater field name
 * @param rowIndex - Parent row index
 * @param subFieldName - Sub-repeater field name
 * @param subRowData - New sub-row data
 * @returns New data object with sub-row added
 *
 * @example
 * ```typescript
 * const newData = addSubRow(data, 'sections', 0, 'items', {
 *   title: 'Nested Item'
 * });
 * ```
 */
export function addSubRow(
  data: any,
  fieldName: string,
  rowIndex: number,
  subFieldName: string,
  subRowData: any
): any {
  const currentRow = getRow(data, fieldName, rowIndex);
  if (!currentRow) {
    return data;
  }

  const currentSubRows = Array.isArray(currentRow[subFieldName]) ? currentRow[subFieldName] : [];
  const newSubRows = [...currentSubRows, subRowData];

  return updateRow(data, fieldName, rowIndex, {
    [subFieldName]: newSubRows
  });
}

/**
 * Update sub-field in specific row (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Repeater field name
 * @param rowIndex - Row index
 * @param subFieldName - Sub-field name
 * @param value - New value
 * @returns New data object with sub-field updated
 *
 * @example
 * ```typescript
 * const newData = updateSubField(data, 'items', 0, 'title', 'New Title');
 * ```
 */
export function updateSubField(
  data: any,
  fieldName: string,
  rowIndex: number,
  subFieldName: string,
  value: any
): any {
  return updateRow(data, fieldName, rowIndex, {
    [subFieldName]: value
  });
}

/**
 * Delete sub-row from nested repeater (immutable)
 *
 * @param data - Block data object
 * @param fieldName - Parent repeater field name
 * @param rowIndex - Parent row index
 * @param subFieldName - Sub-repeater field name
 * @param subRowIndex - Sub-row index to delete
 * @returns New data object with sub-row removed
 *
 * @example
 * ```typescript
 * const newData = deleteSubRow(data, 'sections', 0, 'items', 1);
 * ```
 */
export function deleteSubRow(
  data: any,
  fieldName: string,
  rowIndex: number,
  subFieldName: string,
  subRowIndex: number
): any {
  const currentRow = getRow(data, fieldName, rowIndex);
  if (!currentRow) {
    return data;
  }

  const currentSubRows = Array.isArray(currentRow[subFieldName]) ? currentRow[subFieldName] : [];
  const newSubRows = currentSubRows.filter((_, i) => i !== subRowIndex);

  return updateRow(data, fieldName, rowIndex, {
    [subFieldName]: newSubRows
  });
}
