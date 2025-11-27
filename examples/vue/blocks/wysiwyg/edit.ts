import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  return renderBlockEditor({
    title: context.config?.title || 'Paragraph',
    icon: context.config?.icon,
    fields: context.config?.fields || {},
    data: context.data,
    collapsible: context.config?.collapsible
  });
}
