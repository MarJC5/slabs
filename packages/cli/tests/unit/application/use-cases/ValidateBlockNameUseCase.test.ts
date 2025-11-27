import { describe, it, expect, beforeEach } from 'vitest';
import { ValidateBlockNameUseCase } from '../../../../src/application/use-cases/ValidateBlockNameUseCase';

describe('ValidateBlockNameUseCase', () => {
  let useCase: ValidateBlockNameUseCase;

  beforeEach(() => {
    useCase = new ValidateBlockNameUseCase();
  });

  describe('execute', () => {
    it('should return valid result for kebab-case name', async () => {
      const result = await useCase.execute('my-block');

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return valid result for name with numbers', async () => {
      const result = await useCase.execute('block-123');

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid result for empty string', async () => {
      const result = await useCase.execute('');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Block name cannot be empty');
    });

    it('should return invalid result for whitespace only', async () => {
      const result = await useCase.execute('   ');

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Block name cannot be empty');
    });

    it('should return invalid result for uppercase characters', async () => {
      const result = await useCase.execute('MyBlock');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for spaces', async () => {
      const result = await useCase.execute('my block');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for underscores', async () => {
      const result = await useCase.execute('my_block');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for special characters', async () => {
      const result = await useCase.execute('my-block!');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for starting with hyphen', async () => {
      const result = await useCase.execute('-myblock');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for ending with hyphen', async () => {
      const result = await useCase.execute('myblock-');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return invalid result for consecutive hyphens', async () => {
      const result = await useCase.execute('my--block');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should allow names with only numbers', async () => {
      const result = await useCase.execute('123');

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should allow name starting with letter followed by numbers', async () => {
      const result = await useCase.execute('h1-section');

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should handle very long names', async () => {
      const longName = 'a'.repeat(100);
      const result = await useCase.execute(longName);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('result interface', () => {
    it('should return ValidationResult with isValid and errors properties', async () => {
      const result = await useCase.execute('test-block');

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});
