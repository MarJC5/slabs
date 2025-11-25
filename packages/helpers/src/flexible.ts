/**
 * Flexible content field helpers
 * Functions for working with flexible content (ACF-like flexible content)
 */

import { getRows } from './repeater';

/**
 * Flexible content block structure
 */
export interface FlexibleBlock<T = any> {
  layout: string;
  fields: T;
}

/**
 * Get all layouts from flexible content field
 * Alias for getRows but with better naming for flexible content
 *
 * @param data - Block data object
 * @param fieldName - Flexible content field name
 * @returns Array of layout blocks
 *
 * @example
 * ```typescript
 * const sections = getLayouts(data, 'sections');
 * // [
 * //   { layout: 'hero', fields: { title: '...', image: {...} } },
 * //   { layout: 'text', fields: { content: '...' } }
 * // ]
 * ```
 */
export function getLayouts<T = any>(data: any, fieldName: string): FlexibleBlock<T>[] {
  return getRows<FlexibleBlock<T>>(data, fieldName);
}

/**
 * Get layout name from flexible content block
 *
 * @param block - Flexible content block
 * @returns Layout name
 *
 * @example
 * ```typescript
 * const blocks = getLayouts(data, 'sections');
 * blocks.forEach(block => {
 *   const layoutName = getLayout(block);
 *   console.log(`Layout: ${layoutName}`);
 * });
 * ```
 */
export function getLayout(block: FlexibleBlock): string {
  return block?.layout || '';
}

/**
 * Get fields from flexible content block
 *
 * @param block - Flexible content block
 * @returns Block fields object
 *
 * @example
 * ```typescript
 * const blocks = getLayouts(data, 'sections');
 * blocks.forEach(block => {
 *   const fields = getLayoutFields(block);
 *   console.log(fields.title);
 * });
 * ```
 */
export function getLayoutFields<T = any>(block: FlexibleBlock<T>): T {
  return block?.fields || ({} as T);
}

/**
 * Get specific field from flexible content block
 *
 * @param block - Flexible content block
 * @param fieldName - Field name
 * @returns Field value
 *
 * @example
 * ```typescript
 * const blocks = getLayouts(data, 'sections');
 * const heroBlock = blocks[0];
 * const title = getLayoutField(heroBlock, 'title');
 * ```
 */
export function getLayoutField<T = any>(block: FlexibleBlock, fieldName: string): T | undefined {
  const fields = getLayoutFields(block);
  if (!fields || typeof fields !== 'object') {
    return undefined;
  }
  return (fields as any)[fieldName];
}

/**
 * Filter layouts by layout type
 *
 * @param data - Block data object
 * @param fieldName - Flexible content field name
 * @param layoutType - Layout type to filter by
 * @returns Array of matching layout blocks
 *
 * @example
 * ```typescript
 * const heroSections = getLayoutsByType(data, 'sections', 'hero');
 * const textSections = getLayoutsByType(data, 'sections', 'text');
 * ```
 */
export function getLayoutsByType<T = any>(
  data: any,
  fieldName: string,
  layoutType: string
): FlexibleBlock<T>[] {
  const layouts = getLayouts<T>(data, fieldName);
  return layouts.filter(block => getLayout(block) === layoutType);
}

/**
 * Check if flexible content has specific layout type
 *
 * @param data - Block data object
 * @param fieldName - Flexible content field name
 * @param layoutType - Layout type to check for
 * @returns True if layout type exists
 *
 * @example
 * ```typescript
 * if (hasLayoutType(data, 'sections', 'hero')) {
 *   console.log('Has hero section');
 * }
 * ```
 */
export function hasLayoutType(data: any, fieldName: string, layoutType: string): boolean {
  const layouts = getLayouts(data, fieldName);
  return layouts.some(block => getLayout(block) === layoutType);
}

/**
 * Get count of specific layout type
 *
 * @param data - Block data object
 * @param fieldName - Flexible content field name
 * @param layoutType - Layout type to count
 * @returns Number of layouts of this type
 *
 * @example
 * ```typescript
 * const heroCount = getLayoutTypeCount(data, 'sections', 'hero');
 * console.log(`Found ${heroCount} hero sections`);
 * ```
 */
export function getLayoutTypeCount(data: any, fieldName: string, layoutType: string): number {
  return getLayoutsByType(data, fieldName, layoutType).length;
}
