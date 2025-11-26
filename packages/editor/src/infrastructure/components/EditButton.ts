/**
 * EditButton - UI Component
 *
 * Fixed-position edit button with icon-only design.
 * Navigates to edit mode.
 */

import { renderIcon } from '../icons';
import { IconButton, type BaseIconButtonConfig } from './IconButton';

export interface EditButtonConfig extends BaseIconButtonConfig {
  editUrl?: string; // URL to navigate to (optional if onEditClick provided)
  onEditClick?: () => void; // Callback when clicked (alternative to editUrl)
}

/**
 * EditButton UI component
 */
export class EditButton extends IconButton<EditButtonConfig> {
  /**
   * Create the button element
   */
  protected createButton(config: EditButtonConfig): HTMLButtonElement {
    const iconHtml = renderIcon('pencil');

    return this.createBaseButton(
      'slabs-edit-button',
      'Edit',
      iconHtml,
      () => {
        if (config.onEditClick) {
          config.onEditClick();
        } else if (config.editUrl) {
          window.location.href = config.editUrl;
        }
      }
    );
  }
}
