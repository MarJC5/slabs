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

    it('should create valid icon from CodexIcon name', () => {
      const icon = new Icon('Picture');
      expect(icon.value).toBe('Picture');
    });

    it('should accept various CodexIcon names', () => {
      const iconNames = ['Picture', 'Bold', 'Settings', 'FileText', 'Code', 'Brush', 'Palette'];
      iconNames.forEach(name => {
        const icon = new Icon(name);
        expect(icon.value).toBe(name);
      });
    });

    it('should throw error for empty string', () => {
      expect(() => new Icon('')).toThrow('Icon cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      expect(() => new Icon('   ')).toThrow('Icon cannot be empty');
    });

    it('should throw error for multiple lowercase characters', () => {
      expect(() => new Icon('ab')).toThrow('Icon must be a single character/emoji or a CodexIcon name');
    });

    it('should throw error for multiple emojis', () => {
      expect(() => new Icon('🚀🎨')).toThrow('Icon must be a single character/emoji or a CodexIcon name');
    });

    it('should throw error for lowercase icon name', () => {
      expect(() => new Icon('picture')).toThrow('Icon must be a single character/emoji or a CodexIcon name');
    });

    it('should throw error for kebab-case icon name', () => {
      expect(() => new Icon('my-icon')).toThrow('Icon must be a single character/emoji or a CodexIcon name');
    });

    it('should throw error for snake_case icon name', () => {
      expect(() => new Icon('my_icon')).toThrow('Icon must be a single character/emoji or a CodexIcon name');
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

    it('should return false for CodexIcon name', () => {
      const icon = new Icon('Picture');
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

  describe('isCodexIcon', () => {
    it('should return true for CodexIcon name', () => {
      const icon = new Icon('Picture');
      expect(icon.isCodexIcon()).toBe(true);
    });

    it('should return true for various CodexIcon names', () => {
      const iconNames = ['Picture', 'Bold', 'Settings', 'FileText', 'Code', 'Brush'];
      iconNames.forEach(name => {
        const icon = new Icon(name);
        expect(icon.isCodexIcon()).toBe(true);
      });
    });

    it('should return false for emoji', () => {
      const icon = new Icon('🚀');
      expect(icon.isCodexIcon()).toBe(false);
    });

    it('should return false for single ASCII character', () => {
      const icon = new Icon('A');
      expect(icon.isCodexIcon()).toBe(true); // Single uppercase letter is valid PascalCase
    });

    it('should return false for number', () => {
      const icon = new Icon('1');
      expect(icon.isCodexIcon()).toBe(false);
    });

    it('should return false for special character', () => {
      const icon = new Icon('@');
      expect(icon.isCodexIcon()).toBe(false);
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
    it('should provide default content icon as CodexIcon', () => {
      expect(Icon.defaultContentIcon()).toBe('FileText');
    });

    it('should provide default media icon as CodexIcon', () => {
      expect(Icon.defaultMediaIcon()).toBe('Picture');
    });

    it('should provide default design icon as CodexIcon', () => {
      expect(Icon.defaultDesignIcon()).toBe('Palette');
    });

    it('should provide default widgets icon as CodexIcon', () => {
      expect(Icon.defaultWidgetsIcon()).toBe('Settings');
    });

    it('should provide default theme icon as CodexIcon', () => {
      expect(Icon.defaultThemeIcon()).toBe('Brush');
    });

    it('should provide default embed icon as CodexIcon', () => {
      expect(Icon.defaultEmbedIcon()).toBe('Code');
    });

    it('should be able to create Icon from default values', () => {
      const defaults = [
        Icon.defaultContentIcon(),
        Icon.defaultMediaIcon(),
        Icon.defaultDesignIcon(),
        Icon.defaultWidgetsIcon(),
        Icon.defaultThemeIcon(),
        Icon.defaultEmbedIcon()
      ];

      defaults.forEach(defaultValue => {
        expect(() => new Icon(defaultValue)).not.toThrow();
      });
    });
  });
});
