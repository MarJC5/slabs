import { describe, it, expect, beforeEach } from 'vitest';
import { FieldRegistry } from '../../../src/domain/FieldRegistry';
import { TextField } from '../../../src/domain/fields/TextField';
import { NumberField } from '../../../src/domain/fields/NumberField';
import { SelectField } from '../../../src/domain/fields/SelectField';
import type { FieldType } from '../../../src/domain/types';

describe('FieldRegistry', () => {
  let registry: FieldRegistry;

  beforeEach(() => {
    registry = new FieldRegistry();
  });

  describe('register', () => {
    it('should register a field type', () => {
      const textField = new TextField();

      registry.register('text', textField);

      expect(registry.has('text')).toBe(true);
    });

    it('should allow registering multiple field types', () => {
      registry.register('text', new TextField());
      registry.register('number', new NumberField());
      registry.register('select', new SelectField());

      expect(registry.has('text')).toBe(true);
      expect(registry.has('number')).toBe(true);
      expect(registry.has('select')).toBe(true);
    });

    it('should throw error when registering duplicate type', () => {
      registry.register('text', new TextField());

      expect(() => {
        registry.register('text', new TextField());
      }).toThrow('already registered');
    });
  });

  describe('get', () => {
    it('should retrieve registered field type', () => {
      const textField = new TextField();
      registry.register('text', textField);

      const retrieved = registry.get('text');

      expect(retrieved).toBe(textField);
    });

    it('should throw error for unregistered type', () => {
      expect(() => {
        registry.get('unknown');
      }).toThrow('not registered');
    });
  });

  describe('has', () => {
    it('should return true for registered type', () => {
      registry.register('text', new TextField());

      expect(registry.has('text')).toBe(true);
    });

    it('should return false for unregistered type', () => {
      expect(registry.has('unknown')).toBe(false);
    });
  });

  describe('unregister', () => {
    it('should unregister a field type', () => {
      registry.register('text', new TextField());

      registry.unregister('text');

      expect(registry.has('text')).toBe(false);
    });

    it('should allow re-registration after unregister', () => {
      const textField1 = new TextField();
      const textField2 = new TextField();

      registry.register('text', textField1);
      registry.unregister('text');
      registry.register('text', textField2);

      expect(registry.get('text')).toBe(textField2);
    });

    it('should not throw when unregistering non-existent type', () => {
      expect(() => {
        registry.unregister('unknown');
      }).not.toThrow();
    });
  });

  describe('getAllTypes', () => {
    it('should return empty array when no types registered', () => {
      const types = registry.getAllTypes();

      expect(types).toEqual([]);
    });

    it('should return all registered type names', () => {
      registry.register('text', new TextField());
      registry.register('number', new NumberField());
      registry.register('select', new SelectField());

      const types = registry.getAllTypes();

      expect(types).toEqual(['text', 'number', 'select']);
    });

    it('should return array in registration order', () => {
      registry.register('select', new SelectField());
      registry.register('text', new TextField());
      registry.register('number', new NumberField());

      const types = registry.getAllTypes();

      expect(types).toEqual(['select', 'text', 'number']);
    });
  });

  describe('createDefault', () => {
    it('should create registry with default field types', () => {
      const defaultRegistry = FieldRegistry.createDefault();

      expect(defaultRegistry.has('text')).toBe(true);
      expect(defaultRegistry.has('number')).toBe(true);
      expect(defaultRegistry.has('select')).toBe(true);
    });

    it('should return working field instances', () => {
      const defaultRegistry = FieldRegistry.createDefault();

      const textField = defaultRegistry.get('text');
      const element = textField.render({ type: 'text' }, 'test');

      expect(element.tagName).toBe('INPUT');
    });
  });
});
