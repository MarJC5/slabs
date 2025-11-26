/**
 * ButtonGroup - Default button groups in each corner
 *
 * Automatically creates groups in all four corners that components can attach to.
 * Components with the same position will automatically be grouped together.
 */

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type Orientation = 'horizontal' | 'vertical';

export interface ButtonGroupOptions {
  orientation?: Orientation; // Layout direction (default: horizontal)
}

export class ButtonGroup {
  private static instances: Map<Position, ButtonGroup> = new Map();
  private static orientations: Map<Position, Orientation> = new Map();
  private container: HTMLDivElement;
  private orientation: Orientation;

  private constructor(position: Position, orientation: Orientation = 'horizontal') {
    this.orientation = orientation;
    this.container = this.createContainer(position, orientation);
  }

  /**
   * Configure orientation for a position before components are created
   */
  static configure(position: Position, options: ButtonGroupOptions): void {
    const orientation = options.orientation || 'horizontal';
    this.orientations.set(position, orientation);

    // Update existing group if already created
    const instance = this.instances.get(position);
    if (instance && instance.orientation !== orientation) {
      instance.setOrientation(orientation);
    }
  }

  /**
   * Get or create a button group for a position
   */
  static getGroup(position: Position, options: ButtonGroupOptions = {}): ButtonGroup {
    // Use configured orientation or option or default
    const configuredOrientation = this.orientations.get(position);
    const orientation = configuredOrientation || options.orientation || 'horizontal';

    let instance = this.instances.get(position);

    if (!instance) {
      instance = new ButtonGroup(position, orientation);
      this.instances.set(position, instance);
      // Auto-render to body
      instance.render();
    } else if (instance.orientation !== orientation) {
      // Update orientation if different
      instance.setOrientation(orientation);
    }

    return instance;
  }

  /**
   * Render the group to the page
   */
  render(parent: HTMLElement = document.body): void {
    if (!this.container.parentElement) {
      parent.appendChild(this.container);
    }
  }

  /**
   * Get the container element for rendering child buttons
   */
  getContainer(): HTMLElement {
    return this.container;
  }

  /**
   * Set the orientation of the group
   */
  setOrientation(orientation: Orientation): void {
    this.orientation = orientation;
    this.container.classList.remove('slabs-button-group--horizontal', 'slabs-button-group--vertical');
    this.container.classList.add(`slabs-button-group--${orientation}`);
  }

  /**
   * Create the container element
   */
  private createContainer(position: Position, orientation: Orientation): HTMLDivElement {
    const container = document.createElement('div');
    container.className = `slabs-button-group slabs-button-group--${position} slabs-button-group--${orientation}`;
    return container;
  }

  /**
   * Destroy all groups
   */
  static destroyAll(): void {
    for (const instance of this.instances.values()) {
      instance.container.remove();
    }
    this.instances.clear();
  }
}
