/**
 * ClearButton - UI Component
 *
 * Fixed-position clear button with icon-only design.
 * Clears all blocks from the editor with confirmation.
 */

import { renderIcon, type IconInput } from '../icons';
import { IconButton, type BaseIconButtonConfig } from './IconButton';

export interface ClearButtonConfig extends BaseIconButtonConfig {
  icon?: IconInput; // Default: 'trash' | custom SVG
  onClick: () => void;
  confirmMessage?: string; // Confirmation message before clearing
}

/**
 * ClearButton UI component
 */
export class ClearButton extends IconButton<ClearButtonConfig> {
  constructor(config: ClearButtonConfig) {
    // Set default confirm message
    const configWithDefaults = {
      confirmMessage: 'Are you sure you want to clear all blocks?',
      ...config
    };
    super(configWithDefaults);
  }

  /**
   * Create the button element
   */
  protected createButton(config: ClearButtonConfig): HTMLButtonElement {
    const icon = config.icon || 'trash';
    const iconHtml = renderIcon(icon);

    return this.createBaseButton(
      'slabs-clear-button',
      'Clear all blocks',
      iconHtml,
      () => {
        // Show confirmation if message is provided
        if (config.confirmMessage) {
          if (confirm(config.confirmMessage)) {
            config.onClick();
          }
        } else {
          config.onClick();
        }
      }
    );
  }
}
