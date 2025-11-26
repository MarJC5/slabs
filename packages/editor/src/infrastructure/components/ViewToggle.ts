/**
 * ViewToggle - UI Component
 *
 * Icon-only view/edit mode toggle buttons.
 * Fixed position with active state highlighting.
 */

import { renderIcon } from '../icons';

export interface ViewToggleConfig {
  viewUrl?: string; // URL to navigate to when view button clicked (optional if onViewClick provided)
  onViewClick?: () => void; // Callback when view button clicked (alternative to viewUrl)
  onEditClick: () => void; // Callback when edit button clicked
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * ViewToggle UI component
 */
export class ViewToggle {
  private element: HTMLDivElement;
  private viewButton: HTMLButtonElement;
  private editButton: HTMLButtonElement;

  constructor(config: ViewToggleConfig) {
    const { element, viewButton, editButton } = this.createElement(config);
    this.element = element;
    this.viewButton = viewButton;
    this.editButton = editButton;

    // Default to edit mode
    this.setMode('edit');
  }

  /**
   * Render the toggle to a container
   */
  render(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  /**
   * Set the current mode (view or edit)
   * Updates button active states
   */
  setMode(mode: 'view' | 'edit'): void {
    if (mode === 'view') {
      this.viewButton.classList.add('slabs-view-toggle__button--active');
      this.editButton.classList.remove('slabs-view-toggle__button--active');
    } else {
      this.editButton.classList.add('slabs-view-toggle__button--active');
      this.viewButton.classList.remove('slabs-view-toggle__button--active');
    }
  }

  /**
   * Destroy the toggle (remove from DOM)
   */
  destroy(): void {
    this.element.remove();
  }

  /**
   * Create the toggle element with both buttons
   */
  private createElement(config: ViewToggleConfig): {
    element: HTMLDivElement;
    viewButton: HTMLButtonElement;
    editButton: HTMLButtonElement;
  } {
    const element = document.createElement('div');
    const position = config.position || 'bottom-left';
    element.className = `slabs-view-toggle slabs-view-toggle--${position}`;

    // View button
    const viewButton = document.createElement('button');
    viewButton.className = 'slabs-view-toggle__view slabs-view-toggle__button';
    viewButton.setAttribute('aria-label', 'View');
    viewButton.type = 'button';
    viewButton.innerHTML = renderIcon('eye');

    viewButton.addEventListener('click', () => {
      if (config.onViewClick) {
        config.onViewClick();
      } else if (config.viewUrl) {
        window.location.href = config.viewUrl;
      }
    });

    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'slabs-view-toggle__edit slabs-view-toggle__button';
    editButton.setAttribute('aria-label', 'Edit');
    editButton.type = 'button';
    editButton.innerHTML = renderIcon('pencil');

    editButton.addEventListener('click', () => {
      if (!editButton.disabled) {
        config.onEditClick();
      }
    });

    element.appendChild(viewButton);
    element.appendChild(editButton);

    return { element, viewButton, editButton };
  }
}
