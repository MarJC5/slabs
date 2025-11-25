import type { RenderContext } from '@slabs/renderer';
import { getField, getRows } from '@slabs/helpers';
import './style.css';

export function render(data: any, context?: RenderContext): HTMLElement {
  const container = document.createElement('div');
  container.className = 'features-block';

  // Extract field values
  const title = getField<string>(data, 'title');
  const items = getRows(data, 'items');

  // Add title if provided
  if (title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'features-title';
    titleEl.textContent = title;
    container.appendChild(titleEl);
  }

  // Create features grid
  if (items && items.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'features-grid';

    items.forEach((item: any) => {
      const featureCard = document.createElement('div');
      featureCard.className = 'feature-card';

      // Icon
      if (item.icon) {
        const iconEl = document.createElement('div');
        iconEl.className = 'feature-icon';
        iconEl.textContent = item.icon;
        featureCard.appendChild(iconEl);
      }

      // Content
      const content = document.createElement('div');
      content.className = 'feature-content';

      if (item.title) {
        const featureTitle = document.createElement('h3');
        featureTitle.className = 'feature-title';
        featureTitle.textContent = item.title;
        content.appendChild(featureTitle);
      }

      if (item.description) {
        const description = document.createElement('p');
        description.className = 'feature-description';
        description.textContent = item.description;
        content.appendChild(description);
      }

      featureCard.appendChild(content);
      grid.appendChild(featureCard);
    });

    container.appendChild(grid);
  }

  return container;
}
