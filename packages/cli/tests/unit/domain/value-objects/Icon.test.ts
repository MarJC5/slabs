import { describe, it, expect } from 'vitest';
import { Icon } from '../../../../src/domain/value-objects/Icon';

describe('Icon', () => {
  describe('constructor', () => {
    it('should create valid icon from emoji', () => {
      const icon = new Icon('🚀');
      expect(icon.value).toBe('🚀');
    });

    it('should create valid icon from another emoji', () => {
      const icon = new Icon('🎨');
      expect(icon.value).toBe('🎨');
    });

    it('should accept various emoji types', () => {
      const emojis = ['🎨', '📝', '🎯', '💡', '🔧', '⚙️', '📦', '🌟'];
      emojis.forEach(emoji => {
        const icon = new Icon(emoji);
        expect(icon.value).toBe(emoji);
      });
    });

    it('should throw error for empty string', () => {
      expect(() => new Icon('')).toThrow('Icon cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => new Icon('   ')).toThrow('Icon cannot be empty');
    });

    it('should throw error for multiple characters', () => {
      expect(() => new Icon('ab')).toThrow('Icon must be a single character or emoji');
    });

    it('should throw error for multiple emojis', () => {
      expect(() => new Icon('🚀🎨')).toThrow('Icon must be a single character or emoji');
    });

    it('should allow single ASCII character', () => {
      const icon = new Icon('A');
      expect(icon.value).toBe('A');
    });

    it('should allow single number', () => {
      const icon = new Icon('1');
      expect(icon.value).toBe('1');
    });

    it('should allow special characters', () => {
      const specials = ['@', '#', '$', '%', '&', '*'];
      specials.forEach(char => {
        const icon = new Icon(char);
        expect(icon.value).toBe(char);
      });
    });
  });

  describe('isEmoji', () => {
    it('should return true for emoji', () => {
      const icon = new Icon('🚀');
      expect(icon.isEmoji()).toBe(true);
    });

    it('should return false for ASCII character', () => {
      const icon = new Icon('A');
      expect(icon.isEmoji()).toBe(false);
    });

    it('should return false for number', () => {
      const icon = new Icon('1');
      expect(icon.isEmoji()).toBe(false);
    });

    it('should return true for various emoji types', () => {
      const emojis = ['🎨', '📝', '🎯', '💡', '🔧', '⚙️'];
      emojis.forEach(emoji => {
        const icon = new Icon(emoji);
        expect(icon.isEmoji()).toBe(true);
      });
    });
  });

  describe('equals', () => {
    it('should return true for equal icons', () => {
      const icon1 = new Icon('🚀');
      const icon2 = new Icon('🚀');
      expect(icon1.equals(icon2)).toBe(true);
    });

    it('should return false for different icons', () => {
      const icon1 = new Icon('🚀');
      const icon2 = new Icon('🎨');
      expect(icon1.equals(icon2)).toBe(false);
    });

    it('should return true for equal ASCII characters', () => {
      const icon1 = new Icon('A');
      const icon2 = new Icon('A');
      expect(icon1.equals(icon2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the string value for emoji', () => {
      const icon = new Icon('🚀');
      expect(icon.toString()).toBe('🚀');
    });

    it('should return the string value for ASCII', () => {
      const icon = new Icon('A');
      expect(icon.toString()).toBe('A');
    });
  });

  describe('default icons', () => {
    it('should provide default content icon', () => {
      expect(Icon.defaultContentIcon()).toBe('📝');
    });

    it('should provide default media icon', () => {
      expect(Icon.defaultMediaIcon()).toBe('🎨');
    });

    it('should provide default design icon', () => {
      expect(Icon.defaultDesignIcon()).toBe('🎯');
    });

    it('should provide default widgets icon', () => {
      expect(Icon.defaultWidgetsIcon()).toBe('🔧');
    });

    it('should provide default theme icon', () => {
      expect(Icon.defaultThemeIcon()).toBe('🌟');
    });

    it('should provide default embed icon', () => {
      expect(Icon.defaultEmbedIcon()).toBe('📦');
    });
  });
});
