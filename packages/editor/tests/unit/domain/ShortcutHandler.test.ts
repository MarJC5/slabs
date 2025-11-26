import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShortcutHandler } from '../../../src/domain/ShortcutHandler';

describe('ShortcutHandler', () => {
  let handler: ShortcutHandler;

  beforeEach(() => {
    handler = new ShortcutHandler();
  });

  describe('register', () => {
    it('should register a shortcut', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);

      expect(handler.has('mod+s')).toBe(true);
    });

    it('should register multiple shortcuts', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      handler.register('mod+s', callback1);
      handler.register('mod+k', callback2);

      expect(handler.has('mod+s')).toBe(true);
      expect(handler.has('mod+k')).toBe(true);
    });

    it('should overwrite existing shortcut', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      handler.register('mod+s', callback1);
      handler.register('mod+s', callback2);

      expect(handler.has('mod+s')).toBe(true);
      // We'll verify the new callback is used in execute tests
    });

    it('should handle different key combinations', () => {
      handler.register('mod+shift+p', vi.fn());
      handler.register('ctrl+k', vi.fn());
      handler.register('alt+enter', vi.fn());

      expect(handler.has('mod+shift+p')).toBe(true);
      expect(handler.has('ctrl+k')).toBe(true);
      expect(handler.has('alt+enter')).toBe(true);
    });
  });

  describe('unregister', () => {
    it('should unregister a shortcut', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);
      handler.unregister('mod+s');

      expect(handler.has('mod+s')).toBe(false);
    });

    it('should do nothing when unregistering non-existent shortcut', () => {
      expect(() => handler.unregister('mod+x')).not.toThrow();
    });

    it('should allow re-registering after unregister', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);
      handler.unregister('mod+s');
      handler.register('mod+s', callback);

      expect(handler.has('mod+s')).toBe(true);
    });
  });

  describe('execute', () => {
    it('should execute registered shortcut on Cmd+S (Mac)', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true, // Cmd on Mac
        ctrlKey: false
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should execute registered shortcut on Ctrl+S (Windows)', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: false,
        ctrlKey: true // Ctrl on Windows
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should execute shortcut with shift modifier', () => {
      const callback = vi.fn();
      handler.register('mod+shift+p', callback);

      const event = new KeyboardEvent('keydown', {
        key: 'p',
        metaKey: true,
        shiftKey: true
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should execute shortcut with alt modifier', () => {
      const callback = vi.fn();
      handler.register('alt+enter', callback);

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        altKey: true
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return false for unregistered shortcut', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'x',
        metaKey: true
      });

      const handled = handler.execute(event);

      expect(handled).toBe(false);
    });

    it('should not execute if modifiers do not match', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);

      // Just 's' without modifier
      const event = new KeyboardEvent('keydown', {
        key: 's'
      });

      const handled = handler.execute(event);

      expect(handled).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should execute latest callback when shortcut is overwritten', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      handler.register('mod+s', callback1);
      handler.register('mod+s', callback2);

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true
      });

      handler.execute(event);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle ctrl modifier explicitly', () => {
      const callback = vi.fn();
      handler.register('ctrl+k', callback);

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should be case-insensitive for key matching', () => {
      const callback = vi.fn();
      handler.register('mod+s', callback);

      const event = new KeyboardEvent('keydown', {
        key: 'S', // Uppercase
        metaKey: true
      });

      const handled = handler.execute(event);

      expect(handled).toBe(true);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear', () => {
    it('should clear all shortcuts', () => {
      handler.register('mod+s', vi.fn());
      handler.register('mod+k', vi.fn());
      handler.register('ctrl+p', vi.fn());

      handler.clear();

      expect(handler.has('mod+s')).toBe(false);
      expect(handler.has('mod+k')).toBe(false);
      expect(handler.has('ctrl+p')).toBe(false);
    });

    it('should allow registering after clear', () => {
      handler.register('mod+s', vi.fn());
      handler.clear();

      const callback = vi.fn();
      handler.register('mod+k', callback);

      expect(handler.has('mod+k')).toBe(true);
    });
  });

  describe('has', () => {
    it('should return true for registered shortcuts', () => {
      handler.register('mod+s', vi.fn());
      expect(handler.has('mod+s')).toBe(true);
    });

    it('should return false for unregistered shortcuts', () => {
      expect(handler.has('mod+x')).toBe(false);
    });

    it('should return false after unregister', () => {
      handler.register('mod+s', vi.fn());
      handler.unregister('mod+s');
      expect(handler.has('mod+s')).toBe(false);
    });
  });
});
