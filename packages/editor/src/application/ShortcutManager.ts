/**
 * ShortcutManager - Application Service
 *
 * Manages keyboard shortcuts and coordinates with DOM event listeners.
 * Registers default shortcuts (like save) and custom shortcuts.
 */

import { ShortcutHandler } from '../domain/ShortcutHandler';

/**
 * ShortcutManager handles keyboard shortcut registration and DOM events
 */
export class ShortcutManager {
  private handler: ShortcutHandler;
  private handleKeyDown: (e: KeyboardEvent) => void;

  constructor() {
    this.handler = new ShortcutHandler();
    this.handleKeyDown = this.onKeyDown.bind(this);
  }

  /**
   * Register default shortcuts (e.g., Cmd/Ctrl+S for save)
   * @param saveCallback - Callback for save shortcut
   */
  registerDefaults(saveCallback: () => void): void {
    this.handler.register('mod+s', saveCallback);
  }

  /**
   * Register custom shortcuts
   * @param shortcuts - Map of shortcut keys to callbacks
   */
  registerCustom(shortcuts: Record<string, () => void>): void {
    Object.entries(shortcuts).forEach(([key, callback]) => {
      this.handler.register(key, callback);
    });
  }

  /**
   * Start listening to keyboard events
   */
  listen(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Stop listening to keyboard events
   */
  unlisten(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle keydown events
   * @param e - Keyboard event
   */
  private onKeyDown(e: KeyboardEvent): void {
    const handled = this.handler.execute(e);
    if (handled) {
      e.preventDefault();
    }
  }
}
