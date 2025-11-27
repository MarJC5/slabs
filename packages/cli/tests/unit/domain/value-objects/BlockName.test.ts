import { describe, it, expect } from 'vitest';
import { BlockName } from '../../../../src/domain/value-objects/BlockName';

describe('BlockName', () => {
  describe('constructor', () => {
    it('should create valid block name from kebab-case string', () => {
      const name = new BlockName('my-awesome-block');
      expect(name.value).toBe('my-awesome-block');
    });

    it('should throw error for empty string', () => {
      expect(() => new BlockName('')).toThrow('Block name cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => new BlockName('   ')).toThrow('Block name cannot be empty');
    });

    it('should throw error for uppercase letters', () => {
      expect(() => new BlockName('MyBlock')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for spaces', () => {
      expect(() => new BlockName('my block')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for special characters', () => {
      expect(() => new BlockName('my-block!')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for underscores', () => {
      expect(() => new BlockName('my_block')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for camelCase', () => {
      expect(() => new BlockName('myBlock')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should allow numbers', () => {
      const name = new BlockName('block-123');
      expect(name.value).toBe('block-123');
    });

    it('should allow multiple hyphens', () => {
      const name = new BlockName('my-awesome-block-v2');
      expect(name.value).toBe('my-awesome-block-v2');
    });

    it('should throw error for leading hyphen', () => {
      expect(() => new BlockName('-my-block')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for trailing hyphen', () => {
      expect(() => new BlockName('my-block-')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });

    it('should throw error for consecutive hyphens', () => {
      expect(() => new BlockName('my--block')).toThrow(
        'Block name must be lowercase kebab-case'
      );
    });
  });

  describe('toNamespace', () => {
    it('should convert to namespaced format with default namespace', () => {
      const name = new BlockName('my-block');
      expect(name.toNamespace('slabs')).toBe('slabs/my-block');
    });

    it('should work with custom namespace', () => {
      const name = new BlockName('hero');
      expect(name.toNamespace('custom')).toBe('custom/hero');
    });
  });

  describe('toPascalCase', () => {
    it('should convert single word to PascalCase', () => {
      const name = new BlockName('hero');
      expect(name.toPascalCase()).toBe('Hero');
    });

    it('should convert multiple words to PascalCase', () => {
      const name = new BlockName('my-awesome-block');
      expect(name.toPascalCase()).toBe('MyAwesomeBlock');
    });

    it('should handle numbers correctly', () => {
      const name = new BlockName('block-123-test');
      expect(name.toPascalCase()).toBe('Block123Test');
    });
  });

  describe('toCamelCase', () => {
    it('should convert single word to camelCase', () => {
      const name = new BlockName('hero');
      expect(name.toCamelCase()).toBe('hero');
    });

    it('should convert multiple words to camelCase', () => {
      const name = new BlockName('my-awesome-block');
      expect(name.toCamelCase()).toBe('myAwesomeBlock');
    });

    it('should handle numbers correctly', () => {
      const name = new BlockName('block-123-test');
      expect(name.toCamelCase()).toBe('block123Test');
    });
  });

  describe('equals', () => {
    it('should return true for equal block names', () => {
      const name1 = new BlockName('my-block');
      const name2 = new BlockName('my-block');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different block names', () => {
      const name1 = new BlockName('my-block');
      const name2 = new BlockName('other-block');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the string value', () => {
      const name = new BlockName('my-block');
      expect(name.toString()).toBe('my-block');
    });
  });
});
