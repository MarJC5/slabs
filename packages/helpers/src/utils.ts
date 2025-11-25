/**
 * Utility functions for helpers
 */

/**
 * Get value from object using dot notation or array path
 * Examples:
 *   - 'title' -> data.title
 *   - 'settings.backgroundColor' -> data.settings.backgroundColor
 *   - 'items.0.title' -> data.items[0].title
 */
export function getValueByPath(data: any, path: string): any {
  if (!data || typeof data !== 'object') {
    return undefined;
  }

  // Simple field (no dots)
  if (!path.includes('.')) {
    return data[path];
  }

  // Navigate through path
  const parts = path.split('.');
  let current = data;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    // Check if part is array index (numeric)
    const arrayIndex = parseInt(part, 10);
    if (!isNaN(arrayIndex) && Array.isArray(current)) {
      current = current[arrayIndex];
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Set value in object using dot notation or array path (immutable)
 * Returns a new object with the value set at the specified path
 */
export function setValueByPath(data: any, path: string, value: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Simple field (no dots) - shallow clone and set
  if (!path.includes('.')) {
    if (Array.isArray(data)) {
      const newData = [...data];
      (newData as any)[path] = value;
      return newData;
    }
    return { ...data, [path]: value };
  }

  // Deep path - need to recursively clone
  const parts = path.split('.');
  const [first, ...rest] = parts;

  if (!first) {
    return data;
  }

  const restPath = rest.join('.');

  if (Array.isArray(data)) {
    const arrayIndex = parseInt(first, 10);
    if (!isNaN(arrayIndex)) {
      const newData = [...data];
      newData[arrayIndex] = setValueByPath(data[arrayIndex], restPath, value);
      return newData;
    }
  }

  return {
    ...data,
    [first]: setValueByPath(data[first] || {}, restPath, value)
  };
}

/**
 * Delete value from object using dot notation or array path (immutable)
 * Returns a new object without the value at the specified path
 */
export function deleteValueByPath(data: any, path: string): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Simple field (no dots)
  if (!path.includes('.')) {
    if (Array.isArray(data)) {
      return data.filter((_, index) => index.toString() !== path);
    }
    const { [path]: _, ...rest } = data;
    return rest;
  }

  // Deep path
  const parts = path.split('.');
  const [first, ...rest] = parts;

  if (!first) {
    return data;
  }

  const restPath = rest.join('.');

  if (Array.isArray(data)) {
    const arrayIndex = parseInt(first, 10);
    if (!isNaN(arrayIndex)) {
      const newData = [...data];
      newData[arrayIndex] = deleteValueByPath(data[arrayIndex], restPath);
      return newData;
    }
  }

  return {
    ...data,
    [first]: deleteValueByPath(data[first], restPath)
  };
}
