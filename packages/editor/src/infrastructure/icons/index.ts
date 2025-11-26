/**
 * Icon System
 *
 * Uses @codexteam/icons for consistent editor UI icons.
 * Supports both built-in icons and custom SVG strings.
 */

import { IconSave, IconCross, IconTableWithHeadings, IconMarker } from '@codexteam/icons';

/**
 * Built-in icons from @codexteam/icons
 */
export const ICONS = {
  check: IconSave,
  cross: IconCross,
  eye: IconTableWithHeadings,
  pencil: IconMarker
} as const;

export type IconName = keyof typeof ICONS;

/**
 * Icon input can be either a built-in icon name or a custom SVG string
 */
export type IconInput = IconName | string;

/**
 * Render an icon (built-in or custom SVG string)
 * @param icon - Icon name or custom SVG string
 * @returns SVG string
 */
export function renderIcon(icon: IconInput): string {
  // If it's a built-in icon name, use it
  if (icon in ICONS) {
    return ICONS[icon as IconName];
  }
  // Otherwise, treat it as custom SVG string
  return icon;
}

/**
 * Type guard to check if icon is a built-in icon name
 */
export function isBuiltInIcon(icon: IconInput): icon is IconName {
  return icon in ICONS;
}
