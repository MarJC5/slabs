/**
 * ShortcutHandler - Domain Entity
 *
 * Manages keyboard shortcuts registration and execution.
 * This is a pure domain entity with no dependencies on infrastructure.
 */

/**
 * Shortcut key definition
 * Examples: 'mod+s', 'ctrl+k', 'alt+enter', 'mod+shift+p'
 */
export type ShortcutKey = string;

/**
 * Shortcut callback function
 */
export type ShortcutCallback = () => void;

/**
 * ShortcutHandler manages keyboard shortcut registration and execution
 */
export class ShortcutHandler {
  private shortcuts = new Map<string, ShortcutCallback>();

  /**
   * Register a keyboard shortcut
   * @param key - Shortcut key (e.g., 'mod+s', 'ctrl+k')
   * @param handler - Callback function to execute
   */
  register(key: ShortcutKey, handler: ShortcutCallback): void {
    const normalizedKey = this.normalizeShortcutKey(key);
    this.shortcuts.set(normalizedKey, handler);
  }

  /**
   * Unregister a keyboard shortcut
   * @param key - Shortcut key to remove
   */
  unregister(key: ShortcutKey): void {
    const normalizedKey = this.normalizeShortcutKey(key);
    this.shortcuts.delete(normalizedKey);
  }

  /**
   * Execute shortcut if it matches the keyboard event
   * @param event - Keyboard event
   * @returns true if shortcut was executed, false otherwise
   */
  execute(event: KeyboardEvent): boolean {
    const eventKey = this.eventToKey(event);
    const handler = this.shortcuts.get(eventKey);

    if (handler) {
      handler();
      return true;
    }

    return false;
  }

  /**
   * Check if a shortcut is registered
   * @param key - Shortcut key to check
   */
  has(key: ShortcutKey): boolean {
    const normalizedKey = this.normalizeShortcutKey(key);
    return this.shortcuts.has(normalizedKey);
  }

  /**
   * Clear all registered shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
  }

  /**
   * Convert keyboard event to shortcut key string
   * @param event - Keyboard event
   */
  private eventToKey(event: KeyboardEvent): string {
    const parts: string[] = [];

    // Handle modifier keys
    // Note: We treat metaKey OR ctrlKey as 'mod' for cross-platform compatibility
    if (event.metaKey || event.ctrlKey) {
      parts.push('mod');
    }
    if (event.altKey) {
      parts.push('alt');
    }
    if (event.shiftKey) {
      parts.push('shift');
    }

    // Add the main key (lowercase)
    parts.push(event.key.toLowerCase());

    const combinedKey = parts.join('+');

    // Check both the combined key and potential aliases
    // For example, 'ctrl+k' should also match if user pressed Ctrl+K
    // since we normalize metaKey/ctrlKey to 'mod'
    return combinedKey;
  }

  /**
   * Normalize shortcut registration to handle ctrl/mod aliasing
   * @param key - The shortcut key to normalize
   */
  private normalizeShortcutKey(key: string): string {
    // Replace 'ctrl+' with 'mod+' for cross-platform consistency
    return key.toLowerCase().replace(/^ctrl\+/, 'mod+');
  }
}
