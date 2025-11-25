import type { RenderContext } from '@slabs/renderer';
import { getField, getFieldOr } from '@slabs/helpers';
import './style.css';

export function render(data: any, context?: RenderContext): HTMLElement {
  const container = document.createElement('div');
  container.className = 'testimonial-block';

  // Extract field values
  const quote = getField<string>(data, 'quote');
  const author = getField<string>(data, 'author');
  const position = getField<string>(data, 'position');
  const rating = getFieldOr(data, 'rating', 5);
  const showAvatar = getFieldOr(data, 'showAvatar', true);
  const avatarUrl = getField<string>(data, 'avatarUrl');

  // Create testimonial card
  const card = document.createElement('div');
  card.className = 'testimonial-card';

  // Add rating stars
  if (rating) {
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'testimonial-rating';

    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = i < rating ? 'star star-filled' : 'star';
      star.textContent = '★';
      ratingDiv.appendChild(star);
    }

    card.appendChild(ratingDiv);
  }

  // Add quote
  if (quote) {
    const quoteEl = document.createElement('blockquote');
    quoteEl.className = 'testimonial-quote';
    quoteEl.textContent = quote;
    card.appendChild(quoteEl);
  }

  // Add author section
  const authorSection = document.createElement('div');
  authorSection.className = 'testimonial-author';

  if (showAvatar && avatarUrl) {
    const avatar = document.createElement('img');
    avatar.className = 'testimonial-avatar';
    avatar.src = avatarUrl;
    avatar.alt = author || 'Author';
    authorSection.appendChild(avatar);
  }

  const authorInfo = document.createElement('div');
  authorInfo.className = 'testimonial-author-info';

  if (author) {
    const authorName = document.createElement('div');
    authorName.className = 'testimonial-author-name';
    authorName.textContent = author;
    authorInfo.appendChild(authorName);
  }

  if (position) {
    const authorPosition = document.createElement('div');
    authorPosition.className = 'testimonial-author-position';
    authorPosition.textContent = position;
    authorInfo.appendChild(authorPosition);
  }

  authorSection.appendChild(authorInfo);
  card.appendChild(authorSection);

  container.appendChild(card);
  return container;
}
