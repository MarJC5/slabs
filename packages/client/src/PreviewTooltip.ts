/**
 * PreviewTooltip
 *
 * Adds preview image tooltips to Editor.js toolbox items
 */

export class PreviewTooltip {
  private tooltip: HTMLElement | null = null;
  private previewMap: Map<string, string> = new Map();
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.createTooltipElement();
  }

  /**
   * Register a block's preview image
   */
  registerPreview(blockName: string, previewUrl: string): void {
    this.previewMap.set(blockName, previewUrl);
  }

  /**
   * Initialize preview tooltips for toolbox
   */
  init(): void {
    // Wait for Editor.js to render the toolbox
    setTimeout(() => {
      this.attachListeners();
    }, 100);
  }

  /**
   * Create tooltip element
   */
  private createTooltipElement(): void {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'slabs-preview-tooltip';
    this.tooltip.style.cssText = `
      position: fixed;
      z-index: 4;
      background: var(--color-background, #fff);
      border: 1px solid var(--color-border, #EFF0F1);
      border-radius: 6px;
      padding: 8px;
      box-shadow: 0 3px 15px -3px var(--color-shadow, rgba(13, 20, 33, .1));
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.1s ease;
      max-width: 320px;
      box-sizing: border-box;
    `;
    document.body.appendChild(this.tooltip);
  }

  /**
   * Attach hover listeners to toolbox items
   */
  private attachListeners(): void {
    const toolboxItems = document.querySelectorAll('.ce-popover-item');

    toolboxItems.forEach((item) => {
      // Get the tool name from the data-item-name attribute
      const toolName = item.getAttribute('data-item-name');

      if (!toolName) return;

      // Check if this tool has a preview
      const previewUrl = this.previewMap.get(toolName);

      if (!previewUrl) return;

      item.addEventListener('mouseenter', (e) => {
        this.showPreview(e as MouseEvent, previewUrl);
      });

      item.addEventListener('mouseleave', () => {
        this.hidePreview();
      });
    });
  }

  /**
   * Show preview tooltip
   */
  private showPreview(event: MouseEvent, previewUrl: string): void {
    if (!this.tooltip) return;

    // Clear any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Load image
    const img = document.createElement('img');
    img.src = previewUrl;
    img.style.cssText = `
      width: 100%;
      height: auto;
      display: block;
      border-radius: 4px;
    `;

    img.onerror = () => {
      // Hide tooltip if image fails to load
      this.hidePreview();
    };

    // Clear previous content
    this.tooltip.innerHTML = '';
    this.tooltip.appendChild(img);

    // Position tooltip
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position to the right of the toolbox item
    this.tooltip.style.left = `${rect.right + 12}px`;
    this.tooltip.style.top = `${rect.top}px`;

    // Show tooltip
    this.tooltip.style.opacity = '1';
  }

  /**
   * Hide preview tooltip
   */
  private hidePreview(): void {
    if (!this.tooltip) return;

    // Delay hiding slightly for smoother UX
    this.hideTimeout = setTimeout(() => {
      if (this.tooltip) {
        this.tooltip.style.opacity = '0';
      }
    }, 150);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
