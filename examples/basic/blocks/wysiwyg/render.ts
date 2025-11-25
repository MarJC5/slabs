import type { RenderContext } from '@slabs/renderer';
import { getField } from '@slabs/helpers';
import './style.css';

export function render(data: any, context?: RenderContext): HTMLElement {
  const text = getField<string>(data, 'text');

  const paragraph = document.createElement('div');
  paragraph.className = 'paragraph-block';

  if (text) {
    paragraph.innerHTML = text;
  }

  return paragraph;
}
