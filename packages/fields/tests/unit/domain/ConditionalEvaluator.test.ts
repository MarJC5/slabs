/**
 * ConditionalEvaluator Tests
 * Domain service for evaluating conditional field logic
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConditionalEvaluator } from '../../../src/domain/ConditionalEvaluator';
import type { ConditionalConfig } from '../../../src/domain/types';

describe('ConditionalEvaluator', () => {
  let evaluator: ConditionalEvaluator;

  beforeEach(() => {
    evaluator = new ConditionalEvaluator();
  });

  describe('equality operators', () => {
    it('should evaluate == correctly for strings', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '==',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, 'foo')).toBe(true);
      expect(evaluator.evaluate(condition, 'bar')).toBe(false);
    });

    it('should evaluate == correctly for numbers', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '==',
        value: 5
      };

      expect(evaluator.evaluate(condition, 5)).toBe(true);
      expect(evaluator.evaluate(condition, 10)).toBe(false);
    });

    it('should evaluate == with case-insensitive string comparison', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '==',
        value: 'Foo'
      };

      expect(evaluator.evaluate(condition, 'foo')).toBe(true);
      expect(evaluator.evaluate(condition, 'FOO')).toBe(true);
    });

    it('should handle boolean coercion for ==', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '==',
        value: true
      };

      expect(evaluator.evaluate(condition, true)).toBe(true);
      expect(evaluator.evaluate(condition, 'true')).toBe(true);
      expect(evaluator.evaluate(condition, 1)).toBe(true);
      expect(evaluator.evaluate(condition, false)).toBe(false);
    });

    it('should evaluate != correctly', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '!=',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, 'bar')).toBe(true);
      expect(evaluator.evaluate(condition, 'foo')).toBe(false);
    });

    it('should handle null/undefined for equality', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '==',
        value: null
      };

      expect(evaluator.evaluate(condition, null)).toBe(true);
      expect(evaluator.evaluate(condition, undefined)).toBe(true);
      expect(evaluator.evaluate(condition, '')).toBe(false);
    });
  });

  describe('comparison operators', () => {
    it('should evaluate > correctly', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '>',
        value: 5
      };

      expect(evaluator.evaluate(condition, 10)).toBe(true);
      expect(evaluator.evaluate(condition, 5)).toBe(false);
      expect(evaluator.evaluate(condition, 3)).toBe(false);
    });

    it('should evaluate < correctly', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '<',
        value: 10
      };

      expect(evaluator.evaluate(condition, 5)).toBe(true);
      expect(evaluator.evaluate(condition, 10)).toBe(false);
      expect(evaluator.evaluate(condition, 15)).toBe(false);
    });

    it('should evaluate >= correctly', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '>=',
        value: 5
      };

      expect(evaluator.evaluate(condition, 10)).toBe(true);
      expect(evaluator.evaluate(condition, 5)).toBe(true);
      expect(evaluator.evaluate(condition, 3)).toBe(false);
    });

    it('should evaluate <= correctly', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: '<=',
        value: 10
      };

      expect(evaluator.evaluate(condition, 5)).toBe(true);
      expect(evaluator.evaluate(condition, 10)).toBe(true);
      expect(evaluator.evaluate(condition, 15)).toBe(false);
    });
  });

  describe('contains operator', () => {
    it('should check string contains', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'contains',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, 'hello foo world')).toBe(true);
      expect(evaluator.evaluate(condition, 'hello bar world')).toBe(false);
    });

    it('should check string contains case-insensitively', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'contains',
        value: 'FOO'
      };

      expect(evaluator.evaluate(condition, 'hello foo world')).toBe(true);
      expect(evaluator.evaluate(condition, 'hello FoO world')).toBe(true);
    });

    it('should check array contains', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'contains',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, ['foo', 'bar', 'baz'])).toBe(true);
      expect(evaluator.evaluate(condition, ['bar', 'baz'])).toBe(false);
    });

    it('should handle null for contains', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'contains',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, null)).toBe(false);
      expect(evaluator.evaluate(condition, undefined)).toBe(false);
    });
  });

  describe('not_contains operator', () => {
    it('should check string not contains', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'not_contains',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, 'hello bar world')).toBe(true);
      expect(evaluator.evaluate(condition, 'hello foo world')).toBe(false);
    });

    it('should check array not contains', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'not_contains',
        value: 'foo'
      };

      expect(evaluator.evaluate(condition, ['bar', 'baz'])).toBe(true);
      expect(evaluator.evaluate(condition, ['foo', 'bar'])).toBe(false);
    });
  });

  describe('in operator', () => {
    it('should check if value is in array', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'in',
        value: ['foo', 'bar', 'baz']
      };

      expect(evaluator.evaluate(condition, 'foo')).toBe(true);
      expect(evaluator.evaluate(condition, 'bar')).toBe(true);
      expect(evaluator.evaluate(condition, 'qux')).toBe(false);
    });

    it('should handle non-array value for in operator', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'in',
        value: 'not-an-array'
      };

      // Should return false and log warning
      expect(evaluator.evaluate(condition, 'foo')).toBe(false);
    });
  });

  describe('not_in operator', () => {
    it('should check if value is not in array', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'not_in',
        value: ['foo', 'bar', 'baz']
      };

      expect(evaluator.evaluate(condition, 'qux')).toBe(true);
      expect(evaluator.evaluate(condition, 'foo')).toBe(false);
    });
  });

  describe('empty operator', () => {
    it('should detect empty string', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'empty',
        value: null
      };

      expect(evaluator.evaluate(condition, '')).toBe(true);
      expect(evaluator.evaluate(condition, '   ')).toBe(true);  // Whitespace only
      expect(evaluator.evaluate(condition, 'text')).toBe(false);
    });

    it('should detect empty array', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'empty',
        value: null
      };

      expect(evaluator.evaluate(condition, [])).toBe(true);
      expect(evaluator.evaluate(condition, [1, 2, 3])).toBe(false);
    });

    it('should detect empty object', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'empty',
        value: null
      };

      expect(evaluator.evaluate(condition, {})).toBe(true);
      expect(evaluator.evaluate(condition, { foo: 'bar' })).toBe(false);
    });

    it('should detect null and undefined as empty', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'empty',
        value: null
      };

      expect(evaluator.evaluate(condition, null)).toBe(true);
      expect(evaluator.evaluate(condition, undefined)).toBe(true);
    });

    it('should not consider 0 or false as empty', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'empty',
        value: null
      };

      expect(evaluator.evaluate(condition, 0)).toBe(false);
      expect(evaluator.evaluate(condition, false)).toBe(false);
    });
  });

  describe('not_empty operator', () => {
    it('should detect non-empty values', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'not_empty',
        value: null
      };

      expect(evaluator.evaluate(condition, 'text')).toBe(true);
      expect(evaluator.evaluate(condition, [1, 2])).toBe(true);
      expect(evaluator.evaluate(condition, { foo: 'bar' })).toBe(true);
      expect(evaluator.evaluate(condition, 0)).toBe(true);
      expect(evaluator.evaluate(condition, false)).toBe(true);

      expect(evaluator.evaluate(condition, '')).toBe(false);
      expect(evaluator.evaluate(condition, [])).toBe(false);
      expect(evaluator.evaluate(condition, {})).toBe(false);
      expect(evaluator.evaluate(condition, null)).toBe(false);
    });
  });

  describe('unknown operator', () => {
    it('should return true and log warning for unknown operator', () => {
      const condition: ConditionalConfig = {
        field: 'test',
        operator: 'unknown' as any,
        value: 'foo'
      };

      // Default to showing field on unknown operator
      expect(evaluator.evaluate(condition, 'anything')).toBe(true);
    });
  });
});
