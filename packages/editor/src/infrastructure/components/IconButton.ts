/**
 * IconButton - Abstract Base Class
 *
 * Base class for all icon-only button components.
 * Provides common functionality for rendering, positioning, and state management.
 *
 * Following DDD principles:
 * - Infrastructure layer: UI/DOM manipulation
 * - Template Method pattern: Subclasses implement createButton()
 * - DRY: Common logic centralized here
 */

import { ButtonGroup } from '../ButtonGroup';

export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface BaseIconButtonConfig {
  position: Position;
  ariaLabel?: string;
}

/**
 * Abstract base class for icon buttons
 */
export abstract class IconButton<TConfig extends BaseIconButtonConfig> {
  protected element: HTMLButtonElement;
  protected config: TConfig;

  constructor(config: TConfig) {
    this.config = config;
    this.element = this.createButton(config);
  }

  /**
   * Render the button to a container (defaults to ButtonGroup)
   */
  render(container?: HTMLElement): void {
    if (container) {
      container.appendChild(this.element);
    } else {
      // Auto-attach to ButtonGroup for this position
      const group = ButtonGroup.getGroup(this.config.position);
      group.getContainer().appendChild(this.element);
    }
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    this.element.disabled = disabled;
  }

  /**
   * Set active state (for toggle buttons)
   */
  setActive(active: boolean): void {
    if (active) {
      this.element.classList.add('slabs-icon-button--active');
    } else {
      this.element.classList.remove('slabs-icon-button--active');
    }
  }

  /**
   * Flash the button to show visual feedback
   */
  flash(): void {
    this.element.classList.add('slabs-icon-button--active');

    setTimeout(() => {
      this.element.classList.remove('slabs-icon-button--active');
    }, 200);
  }

  /**
   * Show the button
   */
  show(): void {
    this.element.classList.remove('slabs-icon-button--hidden');
  }

  /**
   * Hide the button
   */
  hide(): void {
    this.element.classList.add('slabs-icon-button--hidden');
  }

  /**
   * Destroy the button (remove from DOM)
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Get the button element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Create the button element
   * Template method - subclasses must implement this
   */
  protected abstract createButton(config: TConfig): HTMLButtonElement;

  /**
   * Helper method to create base button element with common classes
   */
  protected createBaseButton(
    specificClass: string,
    ariaLabel: string,
    iconHtml: string,
    onClick: (event: MouseEvent) => void
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `slabs-icon-button ${specificClass} ${specificClass}--${this.config.position}`;
    button.setAttribute('aria-label', this.config.ariaLabel || ariaLabel);
    button.type = 'button';
    button.innerHTML = iconHtml;

    button.addEventListener('click', (event) => {
      if (!button.disabled) {
        onClick(event);
      }
    });

    return button;
  }
}
