import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  const config = context.config as any;

  // Create complete block editor with conditional fields support
  // Conditional fields will automatically show/hide based on user selections
  return renderBlockEditor({
    title: config?.title || 'Pricing Card',
    icon: config?.icon,
    fields: config?.fields || {},
    data: context.data,
    collapsible: config?.collapsible
  });
}
