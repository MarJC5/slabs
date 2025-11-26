/**
 * EditorWithControls - React component wrapping Editor.js with @slabs/editor UI
 * Provides icon-only save button, view toggle, notifications, and keyboard shortcuts
 * Includes view/edit mode switching with renderer
 */

import { useEffect, useRef, useState } from 'react';
import EditorJS from 'editorjs';
import { Slabs } from '@slabs/client';
import { SlabsRenderer } from '@slabs/renderer';
import {
  SaveButton,
  ViewToggle,
  StatusAlert,
  ShortcutManager,
  PersistenceManager,
  NotificationManager,
  NotificationQueue,
  EditorState,
  LocalStoragePersistence
} from '@slabs/editor';
import '@slabs/editor/styles';

interface EditorWithControlsProps {
  storageKey?: string;
}

export function EditorWithControls({
  storageKey = 'slabs-content'
}: EditorWithControlsProps) {
  const editorHolderRef = useRef<HTMLDivElement>(null);
  const rendererHolderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [renderData, setRenderData] = useState<any>(null);
  const initializeRef = useRef(false);

  // Refs for @slabs/editor components
  const saveButtonRef = useRef<SaveButton | null>(null);
  const viewToggleRef = useRef<ViewToggle | null>(null);
  const statusAlertRef = useRef<StatusAlert | null>(null);
  const shortcutsRef = useRef<ShortcutManager | null>(null);
  const persistenceRef = useRef<PersistenceManager | null>(null);
  const notificationManagerRef = useRef<NotificationManager | null>(null);

  useEffect(() => {
    if (!editorHolderRef.current || initializeRef.current) return;
    initializeRef.current = true;

    async function initializeEditor() {
      if (!editorHolderRef.current) return;

      // Initialize Slabs
      const slabs = new Slabs();
      const tools = slabs.getTools();

      // Create editor state and persistence
      const state = new EditorState();
      const persistence = new PersistenceManager(
        new LocalStoragePersistence(storageKey),
        state
      );
      persistenceRef.current = persistence;

      // Load saved data
      const savedData = await persistence.load();
      setRenderData(savedData);

      // Initialize Editor.js
      const editor = new EditorJS({
        holder: editorHolderRef.current,
        tools: { ...tools },
        data: savedData || { blocks: [] },
        placeholder: 'Click + to add a block...',
        inlineToolbar: false,
        onChange: () => {
          state.markDirty();
        }
      });

      editorRef.current = editor;

      await editor.isReady;

      // Create notification system
      const notificationQueue = new NotificationQueue();
      const notificationManager = new NotificationManager(notificationQueue);
      notificationManagerRef.current = notificationManager;

      const statusAlert = new StatusAlert();
      statusAlert.render(document.body);
      statusAlertRef.current = statusAlert;
      notificationManager.attachComponent(statusAlert);

      // Save handler
      const handleSave = async () => {
        saveButtonRef.current?.flash(); // Flash for visual feedback

        try {
          const outputData = await editor.save();
          await persistence.save(outputData);
          setRenderData(outputData); // Update render data
          notificationManager.showSuccess('Saved successfully');
        } catch (error) {
          notificationManager.showError('Error saving content');
          console.error('Error saving content:', error);
        }
      };

      // Create save button
      const saveButton = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick: handleSave,
        ariaLabel: 'Save'
      });
      saveButton.render(document.body);
      saveButtonRef.current = saveButton;

      // Create view toggle
      const viewToggle = new ViewToggle({
        onViewClick: () => {
          setMode('view');
          viewToggleRef.current?.setMode('view');
        },
        onEditClick: () => {
          setMode('edit');
          viewToggleRef.current?.setMode('edit');
        },
        position: 'top-left'
      });
      viewToggle.render(document.body);
      viewToggle.setMode('edit');
      viewToggleRef.current = viewToggle;

      // Setup keyboard shortcuts
      const shortcuts = new ShortcutManager();
      shortcuts.registerDefaults(handleSave);
      shortcuts.listen();
      shortcutsRef.current = shortcuts;
    }

    initializeEditor();

    return () => {
      // Cleanup
      if (shortcutsRef.current) {
        shortcutsRef.current.unlisten();
      }
      if (saveButtonRef.current) {
        saveButtonRef.current.destroy();
      }
      if (viewToggleRef.current) {
        viewToggleRef.current.destroy();
      }
      if (statusAlertRef.current) {
        statusAlertRef.current.hide();
      }
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
      }
      initializeRef.current = false;
    };
  }, [storageKey]);

  // Render the preview when in view mode
  useEffect(() => {
    if (mode === 'view' && renderData && rendererHolderRef.current) {
      rendererHolderRef.current.innerHTML = '';
      const renderer = new SlabsRenderer();
      renderer.render(renderData).then((rendered) => {
        if (rendererHolderRef.current) {
          rendererHolderRef.current.appendChild(rendered);
        }
      });
    }
  }, [mode, renderData]);

  return (
    <>
      <div ref={editorHolderRef} id="editorjs-holder" style={{ display: mode === 'edit' ? 'block' : 'none' }} />
      <div ref={rendererHolderRef} style={{ display: mode === 'view' ? 'block' : 'none' }} />
    </>
  );
}
