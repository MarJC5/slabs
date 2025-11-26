/**
 * StatusAlert - UI Component
 *
 * Fixed-position status alert for notifications.
 * Minimal Shadcn-style design with just text (no icons).
 */

import type { Notification } from '../../domain/types';

export interface StatusAlertConfig {
  onDismiss?: (id: string) => void;
}

/**
 * StatusAlert UI component
 */
export class StatusAlert {
  private element: HTMLDivElement;
  private messageElement: HTMLSpanElement;

  constructor(_config?: StatusAlertConfig) {
    // config parameter kept for API compatibility but not used (auto-dismiss only, no manual dismiss)
    const { element, messageElement } = this.createElement();
    this.element = element;
    this.messageElement = messageElement;
  }

  /**
   * Render the alert to a container
   */
  render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  /**
   * Show a notification
   */
  show(notification: Notification): void {
    // Remove previous type classes
    this.element.classList.remove('slabs-alert--success', 'slabs-alert--error', 'slabs-alert--info');

    // Add new type class
    this.element.classList.add(`slabs-alert--${notification.type}`);

    // Update message
    this.messageElement.textContent = notification.message;

    // Show alert
    this.element.style.display = 'block';
  }

  /**
   * Hide the alert
   */
  hide(): void {
    this.element.style.display = 'none';
    // Clean up type classes
    this.element.classList.remove('slabs-alert--success', 'slabs-alert--error', 'slabs-alert--info');
  }

  /**
   * Destroy the alert (remove from DOM)
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Create the alert element
   */
  private createElement(): {
    element: HTMLDivElement;
    messageElement: HTMLSpanElement;
  } {
    const element = document.createElement('div');
    element.className = 'slabs-alert slabs-alert--fixed';
    element.style.display = 'none';

    // Message (just clean text, no icons)
    const messageElement = document.createElement('span');
    messageElement.className = 'slabs-alert__message';

    element.appendChild(messageElement);

    return { element, messageElement };
  }
}
