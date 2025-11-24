import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  const config = context.config as any;

  // Create complete block editor - everything from block.json (100% DRY)
  return renderBlockEditor({
    title: config?.title || 'Block',
    icon: config?.icon,
    fields: config?.fields || {},
    data: context.data,
    collapsible: config?.collapsible
  });
}
