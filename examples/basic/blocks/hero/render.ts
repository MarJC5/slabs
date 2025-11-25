import type { RenderContext } from '@slabs/renderer';
import { getField, getFieldOr } from '@slabs/helpers';
import './style.css';

/**
 * Vanilla JS render function for Hero block
 * Demonstrates using @slabs/helpers for data access
 */
export function render(data: any, context?: RenderContext): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hero-block';

  // Use helpers to safely extract field values
  const headline = getField<string>(data, 'headline');
  const subheadline = getField<string>(data, 'subheadline');
  const ctaText = getField<string>(data, 'ctaText');
  const ctaLink = getField<string>(data, 'ctaLink');
  const backgroundStyle = getFieldOr(data, 'backgroundStyle', 'light');

  // Create hero section
  const hero = document.createElement('div');
  hero.className = `hero-section hero-section--${backgroundStyle}`;

  // Create content wrapper
  const content = document.createElement('div');
  content.className = 'hero-content';

  // Add headline
  if (headline) {
    const headlineEl = document.createElement('h1');
    headlineEl.className = 'hero-headline';
    headlineEl.textContent = headline;
    content.appendChild(headlineEl);
  }

  // Add subheadline
  if (subheadline) {
    const subheadlineEl = document.createElement('div');
    subheadlineEl.className = 'hero-subheadline';
    subheadlineEl.innerHTML = subheadline;
    content.appendChild(subheadlineEl);
  }

  // Add CTA button
  if (ctaText) {
    const ctaButton = document.createElement('a');
    ctaButton.className = 'hero-cta';
    ctaButton.textContent = ctaText;
    ctaButton.href = ctaLink || '#';
    if (ctaLink) {
      ctaButton.target = '_blank';
      ctaButton.rel = 'noopener noreferrer';
    }
    content.appendChild(ctaButton);
  }

  hero.appendChild(content);
  container.appendChild(hero);

  return container;
}
