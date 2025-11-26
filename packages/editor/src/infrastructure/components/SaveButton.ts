/**
 * SaveButton - UI Component
 *
 * Fixed-position save button with icon-only design.
 * Handles loading states and positioning.
 */

import { renderIcon, type IconInput } from '../icons';

export interface SaveButtonConfig {
  icon: IconInput; // 'check' | 'upload' | '<svg>...</svg>'
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClick: () => void;
  ariaLabel?: string; // For accessibility only
}

/**
 * SaveButton UI component
 */
export class SaveButton {
  private element: HTMLButtonElement;

  constructor(config: SaveButtonConfig) {
    this.element = this.createButton(config);
  }

  /**
   * Render the button to a container
   */
  render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

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
   * Flash the button to show visual feedback (e.g., when keyboard shortcut is used)
   */
  flash(): void {
    this.element.classList.add('slabs-save-button--active');

    setTimeout(() => {
      this.element.classList.remove('slabs-save-button--active');
    }, 200);
  }

  /**
   * Destroy the button (remove from DOM)
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Create the button element
   */
  private createButton(config: SaveButtonConfig): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `slabs-save-button slabs-save-button--${config.position}`;
    button.setAttribute('aria-label', config.ariaLabel || 'Save');
    button.type = 'button';

    // Render icon (built-in or custom SVG) directly on button element
    const svgString = renderIcon(config.icon);
    button.innerHTML = svgString;

    button.addEventListener('click', () => {
      if (!button.disabled) {
        config.onClick();
      }
    });

    return button;
  }
}
