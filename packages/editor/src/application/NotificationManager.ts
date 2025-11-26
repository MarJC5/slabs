/**
 * NotificationManager - Application Service
 *
 * Manages notifications (toast messages) and coordinates with UI components.
 * Handles auto-dismissal and notification queueing.
 */

import { NotificationQueue } from '../domain/NotificationQueue';
import type { Notification } from '../domain/NotificationQueue';

/**
 * Minimal interface for the StatusAlert UI component
 */
export interface StatusAlertComponent {
  show(notification: Notification): void;
  hide(): void;
}

/**
 * NotificationManager handles showing/hiding notifications
 */
export class NotificationManager {
  private component: StatusAlertComponent | null = null;
  private timeouts = new Map<string, NodeJS.Timeout>();

  constructor(private queue: NotificationQueue) {}

  /**
   * Attach the UI component for displaying notifications
   * @param component - StatusAlert component
   */
  attachComponent(component: StatusAlertComponent): void {
    this.component = component;
  }

  /**
   * Show a success notification
   * @param message - Success message
   * @param duration - How long to show (milliseconds)
   */
  showSuccess(message: string, duration = 3000): void {
    this.showNotification('success', message, duration);
  }

  /**
   * Show an error notification
   * @param message - Error message
   * @param duration - How long to show (milliseconds)
   */
  showError(message: string, duration = 5000): void {
    this.showNotification('error', message, duration);
  }

  /**
   * Show an info notification
   * @param message - Info message
   * @param duration - How long to show (milliseconds)
   */
  showInfo(message: string, duration = 3000): void {
    this.showNotification('info', message, duration);
  }

  /**
   * Dismiss a notification by ID
   * @param id - Notification ID
   */
  dismiss(id: string): void {
    this.queue.dismiss(id);
    this.component?.hide();

    // Clear timeout if it exists
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  /**
   * Dismiss the current (first) notification
   */
  dismissCurrent(): void {
    const current = this.queue.getCurrent();
    if (current) {
      this.dismiss(current.id);
    }
  }

  /**
   * Internal method to show a notification
   */
  private showNotification(
    type: 'success' | 'error' | 'info',
    message: string,
    duration: number
  ): void {
    const notification = this.queue.add({ type, message, duration });

    // Show via UI component if attached
    this.component?.show(notification);

    // Auto-dismiss after duration
    const timeout = setTimeout(() => {
      this.dismiss(notification.id);
    }, duration);

    this.timeouts.set(notification.id, timeout);
  }
}
