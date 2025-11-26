import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationManager } from '../../../src/application/NotificationManager';
import { NotificationQueue } from '../../../src/domain/NotificationQueue';
import type { Notification } from '../../../src/domain/NotificationQueue';

// Mock UI component
interface MockStatusAlert {
  show: (notification: Notification) => void;
  hide: () => void;
}

describe('NotificationManager', () => {
  let manager: NotificationManager;
  let queue: NotificationQueue;
  let mockComponent: MockStatusAlert;

  beforeEach(() => {
    queue = new NotificationQueue();
    manager = new NotificationManager(queue);

    mockComponent = {
      show: vi.fn(),
      hide: vi.fn()
    };
  });

  describe('attachComponent', () => {
    it('should attach UI component', () => {
      expect(() => manager.attachComponent(mockComponent as any)).not.toThrow();
    });

    it('should allow showing notifications after attaching', () => {
      manager.attachComponent(mockComponent as any);
      manager.showSuccess('Test message');

      expect(mockComponent.show).toHaveBeenCalled();
    });
  });

  describe('showSuccess', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should add notification to queue', () => {
      manager.showSuccess('Content saved');

      expect(queue.size()).toBe(1);
      expect(queue.getCurrent()?.type).toBe('success');
      expect(queue.getCurrent()?.message).toBe('Content saved');
    });

    it('should use default duration if not specified', () => {
      manager.showSuccess('Test');

      const notification = queue.getCurrent();
      expect(notification?.duration).toBe(3000);
    });

    it('should use custom duration if specified', () => {
      manager.showSuccess('Test', 5000);

      const notification = queue.getCurrent();
      expect(notification?.duration).toBe(5000);
    });

    it('should call component show method', () => {
      manager.showSuccess('Test message');

      expect(mockComponent.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          message: 'Test message'
        })
      );
    });

    it('should auto-dismiss after duration', async () => {
      vi.useFakeTimers();

      manager.showSuccess('Test', 1000);

      expect(queue.size()).toBe(1);

      // Fast-forward time
      vi.advanceTimersByTime(1000);

      expect(queue.size()).toBe(0);

      vi.useRealTimers();
    });

    it('should not throw if component not attached', () => {
      const managerWithoutComponent = new NotificationManager(queue);

      expect(() => managerWithoutComponent.showSuccess('Test')).not.toThrow();
    });
  });

  describe('showError', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should add error notification to queue', () => {
      manager.showError('An error occurred');

      expect(queue.size()).toBe(1);
      expect(queue.getCurrent()?.type).toBe('error');
      expect(queue.getCurrent()?.message).toBe('An error occurred');
    });

    it('should use default error duration if not specified', () => {
      manager.showError('Test');

      const notification = queue.getCurrent();
      expect(notification?.duration).toBe(5000); // Errors show longer
    });

    it('should use custom duration if specified', () => {
      manager.showError('Test', 10000);

      const notification = queue.getCurrent();
      expect(notification?.duration).toBe(10000);
    });

    it('should call component show method', () => {
      manager.showError('Error message');

      expect(mockComponent.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: 'Error message'
        })
      );
    });
  });

  describe('showInfo', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should add info notification to queue', () => {
      manager.showInfo('Information');

      expect(queue.size()).toBe(1);
      expect(queue.getCurrent()?.type).toBe('info');
      expect(queue.getCurrent()?.message).toBe('Information');
    });

    it('should use default duration', () => {
      manager.showInfo('Test');

      const notification = queue.getCurrent();
      expect(notification?.duration).toBe(3000);
    });
  });

  describe('dismiss', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should remove notification from queue', () => {
      manager.showSuccess('Test');
      const notification = queue.getCurrent();

      if (notification) {
        manager.dismiss(notification.id);
      }

      expect(queue.size()).toBe(0);
    });

    it('should call component hide method', () => {
      manager.showSuccess('Test');
      const notification = queue.getCurrent();

      if (notification) {
        manager.dismiss(notification.id);
      }

      expect(mockComponent.hide).toHaveBeenCalled();
    });

    it('should do nothing for non-existent ID', () => {
      expect(() => manager.dismiss('non-existent')).not.toThrow();
    });
  });

  describe('dismissCurrent', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should dismiss the current notification', () => {
      manager.showSuccess('Test');
      expect(queue.size()).toBe(1);

      manager.dismissCurrent();
      expect(queue.size()).toBe(0);
    });

    it('should call component hide method', () => {
      manager.showSuccess('Test');
      manager.dismissCurrent();

      expect(mockComponent.hide).toHaveBeenCalled();
    });

    it('should do nothing if queue is empty', () => {
      expect(() => manager.dismissCurrent()).not.toThrow();
    });
  });

  describe('multiple notifications', () => {
    beforeEach(() => {
      manager.attachComponent(mockComponent as any);
    });

    it('should queue multiple notifications', () => {
      manager.showSuccess('First');
      manager.showError('Second');
      manager.showInfo('Third');

      expect(queue.size()).toBe(3);
    });

    it('should show notifications in order', () => {
      manager.showSuccess('First');
      manager.showError('Second');

      const current = queue.getCurrent();
      expect(current?.message).toBe('First');
    });

    it('should dismiss first and make second current', () => {
      manager.showSuccess('First');
      const first = queue.getCurrent();
      manager.showSuccess('Second');

      expect(queue.size()).toBe(2);
      expect(queue.getCurrent()?.message).toBe('First');

      // Manually dismiss first
      if (first) {
        manager.dismiss(first.id);
      }

      expect(queue.size()).toBe(1);
      expect(queue.getCurrent()?.message).toBe('Second');
    });
  });
});
