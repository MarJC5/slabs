<template>
  <div>
    <div ref="editorHolderRef" v-show="mode === 'edit'"></div>
    <div ref="rendererHolderRef" v-show="mode === 'view'"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * EditorWithControls - Vue component wrapping Editor.js with @slabs/editor UI
 * Provides icon-only save button, view toggle, notifications, and keyboard shortcuts
 * Includes view/edit mode switching with renderer
 */

import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
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

interface Props {
  storageKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  storageKey: 'slabs-content'
});

const editorHolderRef = ref<HTMLDivElement | null>(null);
const rendererHolderRef = ref<HTMLDivElement | null>(null);
const mode = ref<'edit' | 'view'>('edit');
const renderData = ref<any>(null);

let editor: EditorJS | null = null;
let saveButton: SaveButton | null = null;
let clearButton: ClearButton | null = null;
let viewButton: ViewButton | null = null;
let editButton: EditButton | null = null;
let statusAlert: StatusAlert | null = null;
let shortcuts: ShortcutManager | null = null;
let persistence: PersistenceManager | null = null;

onMounted(async () => {
  if (!editorHolderRef.value) return;

  // Initialize Slabs
  const slabs = new Slabs();
  const tools = slabs.getTools();

  // Create editor state and persistence
  const state = new EditorState();
  persistence = new PersistenceManager(
    new LocalStoragePersistence(props.storageKey),
    state
  );

  // Load saved data
  const savedData = await persistence.load();
  renderData.value = savedData;

  // Initialize Editor.js
  editor = new EditorJS({
    holder: editorHolderRef.value,
    tools: { ...tools },
    data: savedData || { blocks: [] },
    placeholder: 'Click + to add a block...',
    inlineToolbar: false,
    onChange: () => {
      state.markDirty();
    }
  });

  await editor.isReady;

  // Create notification system
  const notificationQueue = new NotificationQueue();
  const notificationManager = new NotificationManager(notificationQueue);

  statusAlert = new StatusAlert();
  statusAlert.render(document.body);
  notificationManager.attachComponent(statusAlert);

  // Save handler
  const handleSave = async () => {
    saveButton?.flash(); // Flash for visual feedback

    try {
      if (!editor) return;
      const outputData = await editor.save();
      await persistence!.save(outputData);
      renderData.value = outputData; // Update render data
      notificationManager.showSuccess('Saved successfully');
    } catch (error) {
      notificationManager.showError('Error saving content');
      console.error('Error saving content:', error);
    }
  };

  // Clear handler
  const handleClear = () => {
    try {
      if (!editor) return;
      editor.clear();
      renderData.value = { blocks: [] };
      notificationManager.showSuccess('Content cleared');
    } catch (error) {
      notificationManager.showError('Error clearing content');
      console.error('Error clearing content:', error);
    }
  };

  // Configure button groups
  ButtonGroup.configure('top-left', { orientation: 'vertical' });
  ButtonGroup.configure('top-right', { orientation: 'vertical' });

  // Create save button
  saveButton = new SaveButton({
    icon: 'check',
    position: 'top-right',
    onClick: handleSave,
    ariaLabel: 'Save'
  });
  saveButton.render();

  // Create clear button
  clearButton = new ClearButton({
    position: 'top-right',
    onClick: handleClear,
    ariaLabel: 'Clear all blocks'
  });
  clearButton.render();

  // Create view button
  viewButton = new ViewButton({
    onViewClick: () => {
      mode.value = 'view';
      viewButton?.setActive(true);
      editButton?.setActive(false);
    },
    position: 'top-left',
    ariaLabel: 'View'
  });
  viewButton.render();

  // Create edit button
  editButton = new EditButton({
    onEditClick: () => {
      mode.value = 'edit';
      editButton?.setActive(true);
      viewButton?.setActive(false);
    },
    position: 'top-left',
    ariaLabel: 'Edit'
  });
  editButton.render();
  editButton.setActive(true); // Start in edit mode

  // Setup keyboard shortcuts
  shortcuts = new ShortcutManager();
  shortcuts.registerDefaults(handleSave);
  shortcuts.registerCustom({
    'mod+shift+k': handleClear
  });
  shortcuts.listen();
});

// Render the preview when in view mode
watch([mode, renderData], async () => {
  if (mode.value === 'view' && renderData.value && rendererHolderRef.value) {
    rendererHolderRef.value.innerHTML = '';
    const renderer = new SlabsRenderer();
    const rendered = await renderer.render(renderData.value);
    if (rendererHolderRef.value) {
      rendererHolderRef.value.appendChild(rendered);
    }
  }
});

onBeforeUnmount(() => {
  // Cleanup
  if (shortcuts) {
    shortcuts.unlisten();
  }
  if (saveButton) {
    saveButton.destroy();
  }
  if (clearButton) {
    clearButton.destroy();
  }
  if (viewButton) {
    viewButton.destroy();
  }
  if (editButton) {
    editButton.destroy();
  }
  if (statusAlert) {
    statusAlert.hide();
  }
  if (editor && typeof editor.destroy === 'function') {
    editor.destroy();
    editor = null;
  }
});
</script>
