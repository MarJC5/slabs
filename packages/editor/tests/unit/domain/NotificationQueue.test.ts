import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationQueue } from '../../../src/domain/NotificationQueue';
import type { Notification } from '../../../src/domain/NotificationQueue';

describe('NotificationQueue', () => {
  let queue: NotificationQueue;

  beforeEach(() => {
    queue = new NotificationQueue();
  });

  describe('add', () => {
    it('should add a notification to the queue', () => {
      const notification = queue.add({
        type: 'success',
        message: 'Content saved',
        duration: 3000
      });

      expect(notification).toBeDefined();
      expect(notification.id).toBeDefined();
      expect(notification.type).toBe('success');
      expect(notification.message).toBe('Content saved');
      expect(notification.duration).toBe(3000);
    });

    it('should generate unique IDs for each notification', () => {
      const notification1 = queue.add({
        type: 'success',
        message: 'First',
        duration: 3000
      });

      const notification2 = queue.add({
        type: 'error',
        message: 'Second',
        duration: 3000
      });

      expect(notification1.id).not.toBe(notification2.id);
    });

    it('should increment queue size', () => {
      expect(queue.size()).toBe(0);

      queue.add({ type: 'success', message: 'Test', duration: 3000 });
      expect(queue.size()).toBe(1);

      queue.add({ type: 'error', message: 'Test 2', duration: 3000 });
      expect(queue.size()).toBe(2);
    });

    it('should handle different notification types', () => {
      const success = queue.add({ type: 'success', message: 'Success', duration: 3000 });
      const error = queue.add({ type: 'error', message: 'Error', duration: 3000 });
      const info = queue.add({ type: 'info', message: 'Info', duration: 3000 });

      expect(success.type).toBe('success');
      expect(error.type).toBe('error');
      expect(info.type).toBe('info');
    });
  });

  describe('getCurrent', () => {
    it('should return null when queue is empty', () => {
      expect(queue.getCurrent()).toBeNull();
    });

    it('should return the first notification added', () => {
      const notification1 = queue.add({ type: 'success', message: 'First', duration: 3000 });
      queue.add({ type: 'error', message: 'Second', duration: 3000 });

      const current = queue.getCurrent();
      expect(current).not.toBeNull();
      expect(current?.id).toBe(notification1.id);
      expect(current?.message).toBe('First');
    });

    it('should return next notification after dismissing current', () => {
      const notification1 = queue.add({ type: 'success', message: 'First', duration: 3000 });
      const notification2 = queue.add({ type: 'error', message: 'Second', duration: 3000 });

      queue.dismiss(notification1.id);

      const current = queue.getCurrent();
      expect(current?.id).toBe(notification2.id);
      expect(current?.message).toBe('Second');
    });
  });

  describe('dismiss', () => {
    it('should remove notification by ID', () => {
      const notification = queue.add({ type: 'success', message: 'Test', duration: 3000 });

      queue.dismiss(notification.id);

      expect(queue.size()).toBe(0);
      expect(queue.getCurrent()).toBeNull();
    });

    it('should do nothing when dismissing non-existent ID', () => {
      queue.add({ type: 'success', message: 'Test', duration: 3000 });

      expect(() => queue.dismiss('non-existent-id')).not.toThrow();
      expect(queue.size()).toBe(1);
    });

    it('should remove correct notification from middle of queue', () => {
      const notification1 = queue.add({ type: 'success', message: 'First', duration: 3000 });
      const notification2 = queue.add({ type: 'error', message: 'Second', duration: 3000 });
      const notification3 = queue.add({ type: 'info', message: 'Third', duration: 3000 });

      queue.dismiss(notification2.id);

      expect(queue.size()).toBe(2);
      expect(queue.getCurrent()?.id).toBe(notification1.id);

      queue.dismiss(notification1.id);
      expect(queue.getCurrent()?.id).toBe(notification3.id);
    });
  });

  describe('clear', () => {
    it('should remove all notifications', () => {
      queue.add({ type: 'success', message: 'First', duration: 3000 });
      queue.add({ type: 'error', message: 'Second', duration: 3000 });
      queue.add({ type: 'info', message: 'Third', duration: 3000 });

      queue.clear();

      expect(queue.size()).toBe(0);
      expect(queue.getCurrent()).toBeNull();
      expect(queue.isEmpty()).toBe(true);
    });

    it('should allow adding after clear', () => {
      queue.add({ type: 'success', message: 'First', duration: 3000 });
      queue.clear();

      const notification = queue.add({ type: 'error', message: 'New', duration: 3000 });

      expect(queue.size()).toBe(1);
      expect(queue.getCurrent()?.id).toBe(notification.id);
    });
  });

  describe('isEmpty', () => {
    it('should return true when queue is empty', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false when queue has notifications', () => {
      queue.add({ type: 'success', message: 'Test', duration: 3000 });
      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after clearing', () => {
      queue.add({ type: 'success', message: 'Test', duration: 3000 });
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      expect(queue.size()).toBe(0);
    });

    it('should return correct size after additions', () => {
      queue.add({ type: 'success', message: 'Test', duration: 3000 });
      expect(queue.size()).toBe(1);

      queue.add({ type: 'error', message: 'Test 2', duration: 3000 });
      expect(queue.size()).toBe(2);

      queue.add({ type: 'info', message: 'Test 3', duration: 3000 });
      expect(queue.size()).toBe(3);
    });

    it('should decrease after dismissing', () => {
      const notification1 = queue.add({ type: 'success', message: 'Test 1', duration: 3000 });
      queue.add({ type: 'error', message: 'Test 2', duration: 3000 });

      expect(queue.size()).toBe(2);

      queue.dismiss(notification1.id);

      expect(queue.size()).toBe(1);
    });
  });

  describe('getAll', () => {
    it('should return empty array when queue is empty', () => {
      expect(queue.getAll()).toEqual([]);
    });

    it('should return all notifications in order', () => {
      const notification1 = queue.add({ type: 'success', message: 'First', duration: 3000 });
      const notification2 = queue.add({ type: 'error', message: 'Second', duration: 3000 });
      const notification3 = queue.add({ type: 'info', message: 'Third', duration: 3000 });

      const all = queue.getAll();

      expect(all).toHaveLength(3);
      expect(all[0].id).toBe(notification1.id);
      expect(all[1].id).toBe(notification2.id);
      expect(all[2].id).toBe(notification3.id);
    });

    it('should not allow mutation of internal queue', () => {
      queue.add({ type: 'success', message: 'Test', duration: 3000 });

      const all = queue.getAll();
      all.pop(); // Try to mutate

      expect(queue.size()).toBe(1); // Should still be 1
    });
  });
});
