/**
 * @slabs/editor - Complete Editor UI Package
 *
 * Icon-only editor UI with save, view toggle, and notifications.
 * Minimal, Shadcn-inspired design for CMS integration.
 */

// Domain Layer
export { EditorState } from './domain/EditorState';
export { ShortcutHandler } from './domain/ShortcutHandler';
export { NotificationQueue } from './domain/NotificationQueue';
export { LocalStoragePersistence, ApiFetchPersistence } from './domain/PersistenceStrategy';

// Application Layer
export { PersistenceManager } from './application/PersistenceManager';
export { ShortcutManager } from './application/ShortcutManager';
export { NotificationManager } from './application/NotificationManager';

// Infrastructure Layer
export { SaveButton } from './infrastructure/components/SaveButton';
export { ViewToggle } from './infrastructure/components/ViewToggle';
export { StatusAlert } from './infrastructure/components/StatusAlert';
export { ButtonGroup } from './infrastructure/ButtonGroup';
export { renderIcon, ICONS, isBuiltInIcon } from './infrastructure/icons';

// Types
export type {
  PersistenceStrategy,
  NotificationType,
  NotificationData,
  Notification,
  ShortcutKey,
  ShortcutCallback
} from './domain/types';

export type { SaveButtonConfig } from './infrastructure/components/SaveButton';
export type { ViewToggleConfig } from './infrastructure/components/ViewToggle';
export type { StatusAlertConfig } from './infrastructure/components/StatusAlert';
export type { IconName, IconInput } from './infrastructure/icons';

// Styles
import './styles/editor.css';
