/**
 * ViewButton - UI Component
 *
 * Fixed-position view button with icon-only design.
 * Navigates to view/preview mode.
 */

import { renderIcon } from '../icons';
import { IconButton, type BaseIconButtonConfig } from './IconButton';

export interface ViewButtonConfig extends BaseIconButtonConfig {
  viewUrl?: string; // URL to navigate to (optional if onViewClick provided)
  onViewClick?: () => void; // Callback when clicked (alternative to viewUrl)
}

/**
 * ViewButton UI component
 */
export class ViewButton extends IconButton<ViewButtonConfig> {
  /**
   * Create the button element
   */
  protected createButton(config: ViewButtonConfig): HTMLButtonElement {
    const iconHtml = renderIcon('eye');

    return this.createBaseButton(
      'slabs-view-button',
      'View',
      iconHtml,
      () => {
        if (config.onViewClick) {
          config.onViewClick();
        } else if (config.viewUrl) {
          window.location.href = config.viewUrl;
        }
      }
    );
  }
}
