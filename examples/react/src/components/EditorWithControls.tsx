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
  ClearButton,
  ViewButton,
  EditButton,
  StatusAlert,
  ButtonGroup,
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
  const clearButtonRef = useRef<ClearButton | null>(null);
  const viewButtonRef = useRef<ViewButton | null>(null);
  const editButtonRef = useRef<EditButton | null>(null);
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

      // Clear handler
      const handleClear = () => {
        clearButtonRef.current?.flash(); // Flash for visual feedback
        
        try {
          editor.clear();
          state.markClean();
          setRenderData({ blocks: [] });
          notificationManager.showSuccess('Content cleared');
        } catch (error) {
          notificationManager.showError('Error clearing content');
          console.error('Error clearing content:', error);
        }
      };

      // Configure button groups
      ButtonGroup.configure('top-left', { orientation: 'horizontal' });
      ButtonGroup.configure('top-right', { orientation: 'horizontal' });

      // Create save button
      const saveButton = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick: handleSave,
        ariaLabel: 'Save'
      });
      saveButton.render();
      saveButtonRef.current = saveButton;

      // Create clear button
      const clearButton = new ClearButton({
        position: 'top-right',
        onClick: handleClear,
        ariaLabel: 'Clear all blocks'
      });
      clearButton.render();
      clearButtonRef.current = clearButton;

      // Create view button
      const viewButton = new ViewButton({
        onViewClick: () => {
          setMode('view');
          // Show: Edit | Hide: Save, Clear, View
          saveButtonRef.current?.hide();
          clearButtonRef.current?.hide();
          viewButtonRef.current?.hide();
          editButtonRef.current?.show();
          editButtonRef.current?.setActive(true);
          viewButtonRef.current?.setActive(false);
        },
        position: 'top-left',
        ariaLabel: 'View'
      });
      viewButton.render();
      viewButtonRef.current = viewButton;

      // Create edit button
      const editButton = new EditButton({
        onEditClick: () => {
          setMode('edit');
          // Show: Save, Clear, View | Hide: Edit
          saveButtonRef.current?.show();
          clearButtonRef.current?.show();
          viewButtonRef.current?.show();
          editButtonRef.current?.hide();
          editButtonRef.current?.setActive(false);
          viewButtonRef.current?.setActive(false);
        },
        position: 'top-left',
        ariaLabel: 'Edit'
      });
      editButton.render();
      editButton.hide(); // Start in edit mode, so hide edit button
      editButtonRef.current = editButton;

      // Setup keyboard shortcuts
      const shortcuts = new ShortcutManager();
      shortcuts.registerDefaults(handleSave);
      shortcuts.registerCustom({
        'mod+shift+k': handleClear
      });
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
      if (clearButtonRef.current) {
        clearButtonRef.current.destroy();
      }
      if (viewButtonRef.current) {
        viewButtonRef.current.destroy();
      }
      if (editButtonRef.current) {
        editButtonRef.current.destroy();
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
