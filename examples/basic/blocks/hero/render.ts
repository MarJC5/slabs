import type { RenderContext } from '@slabs/renderer';

export function render(data: any, context?: RenderContext): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hero-block';

  // Destructure data
  const { headline, subheadline, ctaText, ctaLink, backgroundStyle = 'light' } = data;

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

  // Add styles
  addRenderStyles();

  return container;
}

function addRenderStyles() {
  if (document.getElementById('hero-render-styles')) return;

  const style = document.createElement('style');
  style.id = 'hero-render-styles';
  style.textContent = `
    .hero-block {
      width: 100vw;
      margin-left: calc(50% - 50vw);
    }

    .hero-section {
      min-height: 50vh;
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-section--light {
      background: white;
      color: hsl(0 0% 9%);
    }

    .hero-section--dark {
      background: hsl(0 0% 9%);
      color: hsl(0 0% 98%);
      border-color: hsl(0 0% 20%);
    }

    .hero-section--accent {
      background: hsl(221 83% 53%);
      color: white;
      border-color: hsl(221 83% 45%);
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-headline {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin: 0 0 1rem;
    }

    .hero-subheadline {
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0 0 2rem;
      opacity: 0.9;
    }

    .hero-cta {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }

    .hero-section--light .hero-cta {
      background: hsl(0 0% 9%);
      color: hsl(0 0% 98%);
    }

    .hero-section--light .hero-cta:hover {
      background: hsl(0 0% 20%);
    }

    .hero-section--dark .hero-cta {
      background: white;
      color: hsl(0 0% 9%);
    }

    .hero-section--dark .hero-cta:hover {
      background: hsl(0 0% 90%);
    }

    .hero-section--accent .hero-cta {
      background: white;
      color: hsl(221 83% 53%);
    }

    .hero-section--accent .hero-cta:hover {
      background: hsl(0 0% 96%);
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1.5rem;
      }

      .hero-headline {
        font-size: 2rem;
      }

      .hero-subheadline {
        font-size: 1.125rem;
      }
    }
  `;
  document.head.appendChild(style);
}
