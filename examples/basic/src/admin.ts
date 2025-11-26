/**
 * Admin Page - Editor.js Integration with @slabs/editor
 * Icon-only UI with save button, view toggle, and notifications
 */

import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';
import {
  SaveButton,
  ViewToggle,
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

// Create save button (icon-only)
const saveButton = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: handleSave,
  ariaLabel: 'Save'
});
saveButton.render(document.body);

// Create view toggle (shows both view and edit buttons)
const viewToggle = new ViewToggle({
  viewUrl: '/index.html',
  onEditClick: () => {
    // Already in edit mode, do nothing
  },
  position: 'top-left'
});
viewToggle.render(document.body);
// Highlight edit button since we're in edit mode
viewToggle.setMode('edit');

// Setup keyboard shortcuts
const shortcuts = new ShortcutManager();
shortcuts.registerDefaults(handleSave);
shortcuts.listen();
