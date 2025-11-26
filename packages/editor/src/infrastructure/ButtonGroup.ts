/**
 * ButtonGroup - Helper for grouping buttons at the same position
 *
 * When you want SaveButton and ViewToggle side-by-side at the same position
 */

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export class ButtonGroup {
  private container: HTMLDivElement;

  constructor(position: Position) {
    this.container = this.createContainer(position);
  }

  /**
   * Render the group to the page
   */
  render(parent: HTMLElement = document.body): void {
    parent.appendChild(this.container);
  }

  /**
   * Get the container element for rendering child buttons
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * Create the container element
   */
  private createContainer(position: Position): HTMLDivElement {
    const container = document.createElement('div');
    container.className = `slabs-button-group slabs-button-group--${position}`;
    return container;
  }

  /**
   * Destroy the group
   */
  destroy(): void {
    this.container.remove();
  }
}
