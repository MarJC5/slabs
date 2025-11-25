import { createRoot } from 'react-dom/client';
import type { RenderContext } from '@slabs/renderer';
import { getField, getFieldOr } from '@slabs/helpers';
import './style.css';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundStyle?: 'light' | 'dark' | 'accent';
}

/**
 * Hero React Component
 */
function Hero({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  backgroundStyle = 'light'
}: HeroProps) {
  return (
    <div className={`hero-section hero-section--${backgroundStyle}`}>
      <div className="hero-content">
        {headline && (
          <h1 className="hero-headline">{headline}</h1>
        )}

        {subheadline && (
          <div
            className="hero-subheadline"
            dangerouslySetInnerHTML={{ __html: subheadline }}
          />
        )}

        {ctaText && (
          <a
            className="hero-cta"
            href={ctaLink || '#'}
            target={ctaLink ? '_blank' : undefined}
            rel={ctaLink ? 'noopener noreferrer' : undefined}
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * React-based render function for Hero block
 * Demonstrates using @slabs/helpers for data access
 */
export function render(data: any, context?: RenderContext): HTMLElement {
  // Create wrapper element with hero-block class for full-width styling
  const wrapper = document.createElement('div');
  wrapper.className = 'hero-block';

  // Use helpers to safely extract field values
  const props: HeroProps = {
    headline: getField<string>(data, 'headline'),
    subheadline: getField<string>(data, 'subheadline'),
    ctaText: getField<string>(data, 'ctaText'),
    ctaLink: getField<string>(data, 'ctaLink'),
    backgroundStyle: getFieldOr(data, 'backgroundStyle', 'light')
  };

  // Create React root and render the Hero component
  const root = createRoot(wrapper);
  root.render(<Hero {...props} />);

  return wrapper;
}
