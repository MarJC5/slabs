/**
 * NotificationQueue - Domain Entity
 *
 * Manages the queue and lifecycle of notifications (toast messages).
 * This is a pure domain entity with no dependencies on infrastructure.
 */

/**
 * Notification type (visual style)
 */
export type NotificationType = 'success' | 'error' | 'info';

/**
 * Notification data without ID
 */
export interface NotificationData {
  type: NotificationType;
  message: string;
  duration: number; // milliseconds
}

/**
 * Complete notification with generated ID
 */
export interface Notification extends NotificationData {
  id: string;
}

/**
 * NotificationQueue manages a FIFO queue of notifications
 */
export class NotificationQueue {
  private queue: Notification[] = [];
  private idCounter = 0;

  /**
   * Add a notification to the queue
   * @param data - Notification data (type, message, duration)
   * @returns The created notification with generated ID
   */
  add(data: NotificationData): Notification {
    const notification: Notification = {
      ...data,
      id: this.generateId()
    };

    this.queue.push(notification);

    return notification;
  }

  /**
   * Get the current (first) notification in the queue
   * @returns The first notification, or null if queue is empty
   */
  getCurrent(): Notification | null {
    return this.queue.length > 0 ? this.queue[0]! : null;
  }

  /**
   * Get all notifications in the queue
   * @returns Array of all notifications (copy to prevent mutation)
   */
  getAll(): Notification[] {
    return [...this.queue];
  }

  /**
   * Dismiss (remove) a notification by ID
   * @param id - Notification ID to remove
   */
  dismiss(id: string): void {
    const index = this.queue.findIndex(n => n.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  /**
   * Clear all notifications from the queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Check if the queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Get the number of notifications in the queue
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Generate a unique ID for a notification
   */
  private generateId(): string {
    return `notification-${++this.idCounter}-${Date.now()}`;
  }
}
