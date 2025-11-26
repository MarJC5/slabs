/**
 * Domain Types
 *
 * Core interfaces and types for the editor domain layer
 */

/**
 * Persistence strategy interface (Repository pattern)
 * Defines the contract for save/load operations
 */
export interface PersistenceStrategy {
  /**
   * Save editor data
   * @param data - Editor content data
   * @param context - Optional context (e.g., page ID, user ID)
   */
  save(data: any, context?: any): Promise<void>;

  /**
   * Load editor data
   * @param context - Optional context (e.g., page ID)
   */
  load(context?: any): Promise<any>;
}

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'info';

/**
 * Notification data (input for creating notifications)
 */
export interface NotificationData {
  type: NotificationType;
  message: string;
  duration?: number;
}

/**
 * Notification (with generated ID)
 */
export interface Notification extends NotificationData {
  id: string;
}

/**
 * Keyboard shortcut key
 * Supports 'mod' prefix which maps to Cmd on Mac, Ctrl on Windows/Linux
 */
export type ShortcutKey = string;

/**
 * Shortcut callback function
 */
export type ShortcutCallback = () => void;
