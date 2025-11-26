/**
 * SaveButton - UI Component
 *
 * Fixed-position save button with icon-only design.
 * Handles loading states and positioning.
 */

import { renderIcon, type IconInput } from '../icons';
import { IconButton, type BaseIconButtonConfig } from './IconButton';

export interface SaveButtonConfig extends BaseIconButtonConfig {
  icon: IconInput; // 'check' | 'upload' | '<svg>...</svg>'
  onClick: () => void;
}

/**
 * SaveButton UI component
 */
export class SaveButton extends IconButton<SaveButtonConfig> {
  /**
   * Set loading state (disables button, shows loading indicator)
   */
  setLoading(loading: boolean): void {
    this.element.disabled = loading;

    if (loading) {
      this.element.classList.add('slabs-save-button--loading');
    } else {
      this.element.classList.remove('slabs-save-button--loading');
    }
  }

  /**
   * Create the button element
   */
  protected createButton(config: SaveButtonConfig): HTMLButtonElement {
    const iconHtml = renderIcon(config.icon);

    return this.createBaseButton(
      'slabs-save-button',
      'Save',
      iconHtml,
      () => config.onClick()
    );
  }
}
