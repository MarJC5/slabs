import type { RenderContext } from '@slabs/renderer';
import { getField, getFieldOr } from '@slabs/helpers';
import './style.css';

/**
 * Vanilla JS render function for Pricing Card block
 * Conditionally displays features based on plan type
 */
export function render(data: any, context?: RenderContext): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pricing-block';

  // Extract field values using helpers
  const planName = getField<string>(data, 'planName') || 'Plan';
  const planType = getField<string>(data, 'planType') || 'basic';
  const price = getField<number>(data, 'price') || 0;
  const currency = getFieldOr(data, 'currency', '$');
  const description = getField<string>(data, 'description');
  const featured = getFieldOr(data, 'featured', false);

  // Conditional fields - will be null if hidden
  const showAnnualBilling = getField<boolean>(data, 'showAnnualBilling');
  const annualPrice = getField<number>(data, 'annualPrice');
  const annualSavings = getField<string>(data, 'annualSavings');
  const apiAccess = getField<boolean>(data, 'apiAccess');
  const apiCallsLimit = getField<number>(data, 'apiCallsLimit');
  const prioritySupport = getField<boolean>(data, 'prioritySupport');
  const supportEmail = getField<string>(data, 'supportEmail');
  const customBranding = getField<boolean>(data, 'customBranding');
  const brandColor = getField<string>(data, 'brandColor');
  const buttonText = getField<string>(data, 'buttonText') || 'Get Started';
  const buttonLink = getField<string>(data, 'buttonLink') || '#';

  // Create pricing card
  const card = document.createElement('div');
  card.className = `pricing-card pricing-card--${planType}`;
  if (featured) {
    card.classList.add('pricing-card--featured');
  }

  // Plan header
  const header = document.createElement('div');
  header.className = 'pricing-header';

  if (featured) {
    const badge = document.createElement('span');
    badge.className = 'pricing-badge';
    badge.textContent = 'Most Popular';
    header.appendChild(badge);
  }

  const title = document.createElement('h2');
  title.className = 'pricing-title';
  title.textContent = planName;
  header.appendChild(title);

  if (description) {
    const desc = document.createElement('p');
    desc.className = 'pricing-description';
    desc.textContent = description;
    header.appendChild(desc);
  }

  card.appendChild(header);

  // Pricing section
  const pricingSection = document.createElement('div');
  pricingSection.className = 'pricing-section';

  const priceWrapper = document.createElement('div');
  priceWrapper.className = 'pricing-amount';

  const currencyEl = document.createElement('span');
  currencyEl.className = 'pricing-currency';
  currencyEl.textContent = currency;

  const priceEl = document.createElement('span');
  priceEl.className = 'pricing-price';
  priceEl.textContent = price.toString();

  const periodEl = document.createElement('span');
  periodEl.className = 'pricing-period';
  periodEl.textContent = '/month';

  priceWrapper.appendChild(currencyEl);
  priceWrapper.appendChild(priceEl);
  priceWrapper.appendChild(periodEl);
  pricingSection.appendChild(priceWrapper);

  // Annual billing option (conditional)
  if (showAnnualBilling && annualPrice !== null) {
    const annualOption = document.createElement('div');
    annualOption.className = 'pricing-annual';

    const annualText = document.createElement('p');
    annualText.textContent = `or ${currency}${annualPrice}/month billed annually`;
    annualOption.appendChild(annualText);

    if (annualSavings) {
      const savingsTag = document.createElement('span');
      savingsTag.className = 'pricing-savings';
      savingsTag.textContent = annualSavings;
      annualOption.appendChild(savingsTag);
    }

    pricingSection.appendChild(annualOption);
  }

  card.appendChild(pricingSection);

  // Features list
  const features = document.createElement('div');
  features.className = 'pricing-features';

  const featuresList = document.createElement('ul');
  featuresList.className = 'pricing-features-list';

  // Add plan-specific features based on conditional fields
  const allFeatures: Array<{ text: string; included: boolean }> = [];

  // Basic features (always shown)
  allFeatures.push({ text: 'Core Features', included: true });
  allFeatures.push({ text: 'Email Support', included: true });

  // API Access (conditional)
  if (apiAccess !== null) {
    if (apiAccess && apiCallsLimit !== null) {
      allFeatures.push({
        text: `API Access - ${apiCallsLimit.toLocaleString()} calls/month`,
        included: true
      });
    } else if (!apiAccess) {
      allFeatures.push({ text: 'No API Access', included: false });
    }
  }

  // Priority Support (conditional)
  if (prioritySupport !== null) {
    if (prioritySupport && supportEmail) {
      allFeatures.push({
        text: `Priority Support (${supportEmail})`,
        included: true
      });
    }
  }

  // Custom Branding (conditional)
  if (customBranding !== null) {
    if (customBranding) {
      allFeatures.push({ text: 'Custom Branding', included: true });
      if (brandColor) {
        allFeatures.push({ text: 'Brand Color Customization', included: true });
      }
    }
  }

  // Render features
  allFeatures.forEach(feature => {
    const li = document.createElement('li');
    li.className = feature.included
      ? 'pricing-feature pricing-feature--included'
      : 'pricing-feature pricing-feature--excluded';

    const icon = document.createElement('span');
    icon.className = 'pricing-feature-icon';
    icon.textContent = feature.included ? '✓' : '✗';

    const text = document.createElement('span');
    text.textContent = feature.text;

    li.appendChild(icon);
    li.appendChild(text);
    featuresList.appendChild(li);
  });

  features.appendChild(featuresList);
  card.appendChild(features);

  // CTA Button
  const ctaButton = document.createElement('a');
  ctaButton.className = 'pricing-button';
  ctaButton.textContent = buttonText;
  ctaButton.href = buttonLink;

  // Apply custom brand color if available
  if (customBranding && brandColor) {
    ctaButton.style.backgroundColor = brandColor;
  }

  if (buttonLink && buttonLink !== '#') {
    ctaButton.target = '_blank';
    ctaButton.rel = 'noopener noreferrer';
  }

  card.appendChild(ctaButton);
  container.appendChild(card);

  return container;
}
