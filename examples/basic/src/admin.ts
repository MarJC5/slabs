/**
 * Admin Page - Editor.js Integration with @slabs/editor
 * Icon-only UI with save button, view toggle, and notifications
 */

import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';
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

// Initialize Slabs to get Editor.js tools
const slabs = new Slabs();
const tools = slabs.getTools();

// Create editor state and persistence manager
const state = new EditorState();
const persistence = new PersistenceManager(
  new LocalStoragePersistence('slabs-content'),
  state
);

// Load data and initialize Editor.js
const savedData = await persistence.load();

const editor = new EditorJS({
  holder: 'editorjs',
  tools: { ...tools },
  data: savedData || { blocks: [] },
  placeholder: 'Click + to add a block...',
  inlineToolbar: false,

  onReady: () => {
    console.log('✅ Editor.js is ready!');
  },

  onChange: () => {
    state.markDirty();
  }
});

// Create notification system
const notificationQueue = new NotificationQueue();
const notificationManager = new NotificationManager(notificationQueue);

const statusAlert = new StatusAlert();
statusAlert.render(document.body);
notificationManager.attachComponent(statusAlert);

// Configure button group orientations
ButtonGroup.configure('top-right', { orientation: 'vertical' });

// Save handler function
async function handleSave() {
  saveButton.flash();

  try {
    const outputData = await editor.save();
    await persistence.save(outputData);

    notificationManager.showSuccess('Saved successfully');
    console.log('Content saved:', outputData);
  } catch (error) {
    notificationManager.showError('Error saving content');
    console.error('Error saving content:', error);
  }
}

// Clear handler function
function handleClear() {
  try {
    editor.clear();
    state.markClean();
    notificationManager.showSuccess('Content cleared');
    console.log('Content cleared');
  } catch (error) {
    notificationManager.showError('Error clearing content');
    console.error('Error clearing content:', error);
  }
}

// Top-right group: Save + Clear (vertical stack)
const saveButton = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: handleSave,
  ariaLabel: 'Save'
});
saveButton.render();

const clearButton = new ClearButton({
  position: 'top-right',
  onClick: handleClear,
  ariaLabel: 'Clear all blocks'
});
clearButton.render();

// Top-left group: View + Edit (vertical stack)
const viewButton = new ViewButton({
  viewUrl: '/index.html',
  position: 'top-right',
  ariaLabel: 'View'
});
viewButton.render();

const editButton = new EditButton({
  onEditClick: () => {
    // Already in edit mode
  },
  position: 'top-right',
  ariaLabel: 'Edit'
});
editButton.render();

// Mode: Edit
// Show: Save, Clear, View
// Hide: Edit
editButton.hide();

// Setup keyboard shortcuts
const shortcuts = new ShortcutManager();
shortcuts.registerDefaults(handleSave);
shortcuts.registerCustom({
  'mod+shift+k': handleClear // Cmd/Ctrl+Shift+K to clear
});
shortcuts.listen();
