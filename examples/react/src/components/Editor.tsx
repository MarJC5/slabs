import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from 'editorjs';
import { Slabs } from '@slabs/client';

interface EditorProps {
  data?: any;
  onChange?: (data: any) => void;
}

export interface EditorRef {
  save: () => Promise<any>;
  clear: () => Promise<void>;
}

export const Editor = forwardRef<EditorRef, EditorProps>(({ data, onChange }, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Expose save and clear methods to parent via ref
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorRef.current) throw new Error('Editor not initialized');
      return await editorRef.current.save();
    },
    clear: async () => {
      if (!editorRef.current) throw new Error('Editor not initialized');
      await editorRef.current.clear();
    }
  }));

  useEffect(() => {
    if (!holderRef.current || isInitialized.current) return;

    // Mark as initialized to prevent double initialization
    isInitialized.current = true;

    // Initialize Slabs to get Editor.js tools
    const slabs = new Slabs();
    const tools = slabs.getTools();

    // Initialize Editor.js with Slabs blocks
    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        ...tools
      },
      data: data || { blocks: [] },
      onChange: async () => {
        if (onChange) {
          const savedData = await editor.save();
          onChange(savedData);
        }
      },
      placeholder: 'Click + to add a block...',
      inlineToolbar: false
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);

  return <div ref={holderRef} />;
});
