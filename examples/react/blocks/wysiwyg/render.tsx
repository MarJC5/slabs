import { getField } from '@slabs/helpers';
import type { RenderContext } from '@slabs/renderer';
import './style.css';

interface WysiwygBlockProps {
  data: any;
  context?: RenderContext;
}

export default function WysiwygBlock({ data }: WysiwygBlockProps) {
  const text = getField<string>(data, 'text');

  return (
    <div className="paragraph-block">
      {text && <div dangerouslySetInnerHTML={{ __html: text }} />}
    </div>
  );
}
