import { useEffect, useRef } from 'react';
import { SlabsRenderer } from '@slabs/renderer';

interface RendererProps {
  data?: any;
}

export function Renderer({ data }: RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Initialize renderer
    const renderer = new SlabsRenderer();

    // Render the content
    renderer.render(data, {
      theme: 'light',
      mode: 'public'
    }).then(rendered => {
      containerRef.current?.appendChild(rendered);
    }).catch(error => {
      console.error('Error rendering content:', error);
    });
  }, [data]);

  if (!data || !data.blocks || data.blocks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No content yet</h2>
        <p>Create some content in the editor first</p>
      </div>
    );
  }

  return <div ref={containerRef} className="slabs-content" />;
}
