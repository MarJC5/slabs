/**
 * ConditionalEvaluator - Domain Service
 *
 * Responsible for evaluating conditional logic to determine field visibility.
 * This is a pure domain service with no infrastructure dependencies.
 */

import type { ConditionalConfig } from './types';

export class ConditionalEvaluator {
  /**
   * Evaluate a conditional configuration
   *
   * @param conditional - Conditional configuration
   * @param fieldValue - Current value of the watched field
   * @returns true if field should be shown, false if hidden
   */
  evaluate(conditional: ConditionalConfig, fieldValue: any): boolean {
    const { operator, value } = conditional;

    switch (operator) {
      case '==':
        return this.equals(fieldValue, value);

      case '!=':
        return !this.equals(fieldValue, value);

      case '>':
        return this.greaterThan(fieldValue, value);

      case '<':
        return this.lessThan(fieldValue, value);

      case '>=':
        return this.greaterThanOrEqual(fieldValue, value);

      case '<=':
        return this.lessThanOrEqual(fieldValue, value);

      case 'contains':
        return this.contains(fieldValue, value);

      case 'not_contains':
        return !this.contains(fieldValue, value);

      case 'in':
        return this.isIn(fieldValue, value);

      case 'not_in':
        return !this.isIn(fieldValue, value);

      case 'empty':
        return this.isEmpty(fieldValue);

      case 'not_empty':
        return !this.isEmpty(fieldValue);

      default:
        console.warn(`[Conditional] Unknown operator: ${operator}`);
        return true; // Show field by default on unknown operator
    }
  }

  /**
   * Loose equality check (handles type coercion)
   */
  private equals(a: any, b: any): boolean {
    // Handle null/undefined
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;

    // Handle booleans
    if (typeof a === 'boolean' || typeof b === 'boolean') {
      return Boolean(a) === Boolean(b);
    }

    // Handle numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return a === b;
    }

    // String comparison (case-insensitive)
    return String(a).toLowerCase() === String(b).toLowerCase();
  }

  /**
   * Greater than comparison
   */
  private greaterThan(a: any, b: any): boolean {
    return Number(a) > Number(b);
  }

  /**
   * Less than comparison
   */
  private lessThan(a: any, b: any): boolean {
    return Number(a) < Number(b);
  }

  /**
   * Greater than or equal comparison
   */
  private greaterThanOrEqual(a: any, b: any): boolean {
    return Number(a) >= Number(b);
  }

  /**
   * Less than or equal comparison
   */
  private lessThanOrEqual(a: any, b: any): boolean {
    return Number(a) <= Number(b);
  }

  /**
   * Check if haystack contains needle
   * Works for both strings and arrays
   */
  private contains(haystack: any, needle: any): boolean {
    if (haystack == null) return false;

    // Array check
    if (Array.isArray(haystack)) {
      return haystack.includes(needle);
    }

    // String check (case-insensitive)
    return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
  }

  /**
   * Check if value is in array
   */
  private isIn(value: any, array: any): boolean {
    if (!Array.isArray(array)) {
      console.warn('[Conditional] "in" operator requires array value');
      return false;
    }

    return array.includes(value);
  }

  /**
   * Check if value is empty
   * Empty means: null, undefined, empty string, empty array, empty object
   */
  private isEmpty(value: any): boolean {
    // Null or undefined
    if (value == null) return true;

    // Empty string (including whitespace-only strings)
    if (typeof value === 'string') return value.trim() === '';

    // Empty array
    if (Array.isArray(value)) return value.length === 0;

    // Empty object
    if (typeof value === 'object') return Object.keys(value).length === 0;

    // All other values (numbers, booleans, etc.) are not empty
    return false;
  }
}
