import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ShortcutManager } from '../../../src/application/ShortcutManager';
import { ShortcutHandler } from '../../../src/domain/ShortcutHandler';

describe('ShortcutManager', () => {
  let manager: ShortcutManager;
  let mockSaveCallback: () => void;

  beforeEach(() => {
    manager = new ShortcutManager();
    mockSaveCallback = vi.fn();
  });

  afterEach(() => {
    // Clean up event listeners
    manager.unlisten();
  });

  describe('registerDefaults', () => {
    it('should register default save shortcut', () => {
      manager.registerDefaults(mockSaveCallback);

      const handler = (manager as any).handler as ShortcutHandler;
      expect(handler.has('mod+s')).toBe(true);
    });

    it('should execute save callback on mod+s', () => {
      manager.registerDefaults(mockSaveCallback);
      manager.listen();

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true
      });

      document.dispatchEvent(event);

      expect(mockSaveCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerCustom', () => {
    it('should register custom shortcuts', () => {
      const customCallback = vi.fn();
      const shortcuts = {
        'mod+k': customCallback
      };

      manager.registerCustom(shortcuts);

      const handler = (manager as any).handler as ShortcutHandler;
      expect(handler.has('mod+k')).toBe(true);
    });

    it('should register multiple custom shortcuts', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const shortcuts = {
        'mod+k': callback1,
        'mod+shift+p': callback2,
        'alt+enter': vi.fn()
      };

      manager.registerCustom(shortcuts);

      const handler = (manager as any).handler as ShortcutHandler;
      expect(handler.has('mod+k')).toBe(true);
      expect(handler.has('mod+shift+p')).toBe(true);
      expect(handler.has('alt+enter')).toBe(true);
    });

    it('should execute custom shortcuts', () => {
      const customCallback = vi.fn();
      manager.registerCustom({ 'mod+k': customCallback });
      manager.listen();

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true
      });

      document.dispatchEvent(event);

      expect(customCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('listen', () => {
    it('should attach keydown listener to document', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      manager.listen();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });

    it('should execute shortcuts on keydown events', () => {
      const callback = vi.fn();
      manager.registerCustom({ 'mod+x': callback });
      manager.listen();

      const event = new KeyboardEvent('keydown', {
        key: 'x',
        metaKey: true
      });

      document.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should prevent default for handled shortcuts', () => {
      manager.registerDefaults(mockSaveCallback);
      manager.listen();

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true,
        cancelable: true
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not prevent default for unhandled shortcuts', () => {
      manager.listen();

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        metaKey: true,
        cancelable: true
      });

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      document.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('unlisten', () => {
    it('should remove keydown listener from document', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      manager.listen();
      manager.unlisten();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('should not execute shortcuts after unlisten', () => {
      const callback = vi.fn();
      manager.registerCustom({ 'mod+x': callback });
      manager.listen();
      manager.unlisten();

      const event = new KeyboardEvent('keydown', {
        key: 'x',
        metaKey: true
      });

      document.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should be safe to call multiple times', () => {
      manager.listen();

      expect(() => {
        manager.unlisten();
        manager.unlisten();
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should support both default and custom shortcuts together', () => {
      const customCallback = vi.fn();

      manager.registerDefaults(mockSaveCallback);
      manager.registerCustom({ 'mod+k': customCallback });
      manager.listen();

      // Test default shortcut
      const saveEvent = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true
      });
      document.dispatchEvent(saveEvent);

      // Test custom shortcut
      const customEvent = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true
      });
      document.dispatchEvent(customEvent);

      expect(mockSaveCallback).toHaveBeenCalledTimes(1);
      expect(customCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid keystrokes', () => {
      const callback = vi.fn();
      manager.registerCustom({ 'mod+k': callback });
      manager.listen();

      for (let i = 0; i < 5; i++) {
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true
        });
        document.dispatchEvent(event);
      }

      expect(callback).toHaveBeenCalledTimes(5);
    });
  });
});
