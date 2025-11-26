# @slabs/editor

Icon-only UI components for building Editor.js admin interfaces with keyboard shortcuts, notifications, and auto-persistence.

## Overview

The editor package provides a minimal, icon-only UI layer for Editor.js admin interfaces. It includes essential components like save buttons, view toggles, notifications, and keyboard shortcuts with automatic state management and persistence. Built with DDD/TDD architecture and full TypeScript support.

## Installation

```bash
npm install @slabs/editor @editorjs/editorjs
# or
pnpm add @slabs/editor @editorjs/editorjs
```

**Peer Dependency:** Requires `@editorjs/editorjs` ^2.28.0

## Key Features

- Icon-only UI components using EditorJS CSS variables
- Keyboard shortcuts with Cmd/Ctrl+S support
- Auto-persistence with LocalStorage or custom strategies
- Notification system with queue and display
- Editor state management (dirty tracking)
- ViewToggle for edit/preview mode switching
- SaveButton with visual flash feedback
- StatusAlert with minimal Shadcn style
- Full TypeScript support
- Lightweight (~7.5KB)
- 185 passing tests (DDD/TDD architecture)

## Basic Usage

```typescript
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';
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

// Initialize Slabs
const slabs = new Slabs();

// Create editor state and persistence
const state = new EditorState();
const persistence = new PersistenceManager(
  new LocalStoragePersistence('my-content'),
  state
);

// Load saved data
const savedData = await persistence.load();

// Initialize Editor.js
const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools(),
  data: savedData || { blocks: [] },
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

// Save handler
async function handleSave() {
  try {
    const outputData = await editor.save();
    await persistence.save(outputData);
    notificationManager.showSuccess('Saved successfully');
  } catch (error) {
    notificationManager.showError('Error saving content');
  }
}

// Create save button
const saveButton = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: handleSave,
  ariaLabel: 'Save'
});
saveButton.render(document.body);

// Create view toggle
const viewToggle = new ViewToggle({
  viewUrl: '/preview.html',
  onEditClick: () => {},
  position: 'bottom-left'
});
viewToggle.render(document.body);
viewToggle.setMode('edit');

// Setup keyboard shortcuts
const shortcuts = new ShortcutManager();
shortcuts.registerDefaults(handleSave);
shortcuts.listen();
```

## Components

### SaveButton

Icon-only save button with flash feedback for keyboard shortcuts.

```typescript
const saveButton = new SaveButton({
  icon: 'check',               // Icon name from @codexteam/icons
  position: 'top-right',       // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onClick: handleSave,         // Save callback
  ariaLabel: 'Save'            // Accessibility label
});

saveButton.render(document.body);

// Flash for visual feedback on keyboard save
saveButton.flash();

// Disable/enable
saveButton.disable();
saveButton.enable();

// Cleanup
saveButton.destroy();
```

### ViewToggle

Toggle buttons for switching between edit and preview modes.

```typescript
const viewToggle = new ViewToggle({
  viewUrl: '/preview.html',    // URL to navigate to on view click
  onViewClick: () => {},       // Or provide callback instead of URL
  onEditClick: () => {},       // Callback when edit button clicked
  position: 'bottom-left'      // Fixed position
});

viewToggle.render(document.body);

// Set active mode
viewToggle.setMode('edit');   // or 'view'

// Cleanup
viewToggle.destroy();
```

### StatusAlert

Minimal notification display with Shadcn-inspired styling.

```typescript
const statusAlert = new StatusAlert();
statusAlert.render(document.body);

// Show notification
statusAlert.show({
  message: 'Saved successfully',
  type: 'success',             // 'success' | 'error' | 'info'
  duration: 3000               // Auto-hide duration in ms
});

// Hide manually
statusAlert.hide();
```

### ButtonGroup

Helper for grouping multiple buttons at the same position.

```typescript
const buttonGroup = new ButtonGroup('top-right');
buttonGroup.render(document.body);

// Add buttons to group
saveButton.render(buttonGroup.getContainer());
viewToggle.render(buttonGroup.getContainer());

// Cleanup
buttonGroup.destroy();
```

## Application Services

### NotificationManager

Manages notification queue and display components.

```typescript
const notificationQueue = new NotificationQueue();
const notificationManager = new NotificationManager(notificationQueue);

// Attach display component
const statusAlert = new StatusAlert();
statusAlert.render(document.body);
notificationManager.attachComponent(statusAlert);

// Show notifications
notificationManager.showSuccess('Operation successful');
notificationManager.showError('Operation failed');
notificationManager.showInfo('Information message');

// Or queue custom notification
notificationManager.showNotification({
  message: 'Custom message',
  type: 'success',
  duration: 3000
});
```

### PersistenceManager

Handles saving and loading editor content with dirty state tracking.

```typescript
const state = new EditorState();
const persistence = new PersistenceManager(
  new LocalStoragePersistence('my-key'),
  state
);

// Load data
const data = await persistence.load();

// Save data
await persistence.save(editorData);

// Check if has changes
if (state.isDirty()) {
  console.log('Unsaved changes');
}

// Mark clean
state.markClean();
```

### ShortcutManager

Manages keyboard shortcuts with platform detection.

```typescript
const shortcuts = new ShortcutManager();

// Register default shortcuts (Cmd/Ctrl+S)
shortcuts.registerDefaults(handleSave);

// Register custom shortcuts
shortcuts.registerCustom({
  'mod+b': handleBold,
  'mod+i': handleItalic,
  'esc': handleCancel
});

// Start listening
shortcuts.listen();

// Stop listening
shortcuts.unlisten();
```

## Domain Entities

### EditorState

Tracks editor dirty state (unsaved changes).

```typescript
const state = new EditorState();

// Check state
console.log(state.isDirty());  // false

// Mark dirty
state.markDirty();
console.log(state.isDirty());  // true

// Mark clean
state.markClean();
console.log(state.isDirty());  // false
```

### NotificationQueue

FIFO queue for managing notifications.

```typescript
const queue = new NotificationQueue();

// Add notifications
queue.enqueue({
  message: 'First notification',
  type: 'success',
  duration: 3000
});

queue.enqueue({
  message: 'Second notification',
  type: 'info',
  duration: 2000
});

// Get current
const current = queue.getCurrent();

// Remove current
queue.dequeue();

// Get all
const all = queue.getAll();

// Clear all
queue.clear();
```

### ShortcutHandler

Handles keyboard shortcut registration and execution.

```typescript
const handler = new ShortcutHandler();

// Register shortcuts
handler.register('mod+s', saveCallback);
handler.register('esc', cancelCallback);

// Execute from keyboard event
const wasHandled = handler.execute(keyboardEvent);
```

## Persistence Strategies

### LocalStoragePersistence

Built-in localStorage persistence strategy.

```typescript
const storage = new LocalStoragePersistence('content-key');

// Save
await storage.save(editorData);

// Load
const data = await storage.load();
```

### Custom Persistence

Implement custom persistence for API, IndexedDB, etc.

```typescript
import { PersistenceStrategy } from '@slabs/editor';

class ApiPersistence implements PersistenceStrategy {
  async save(data: any): Promise<void> {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async load(): Promise<any | null> {
    const response = await fetch('/api/load');
    return response.json();
  }
}

// Use custom persistence
const state = new EditorState();
const persistence = new PersistenceManager(
  new ApiPersistence(),
  state
);
```

## Advanced Usage

### Complete Admin Interface

```typescript
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

// Initialize
const slabs = new Slabs();
const state = new EditorState();
const persistence = new PersistenceManager(
  new LocalStoragePersistence('content'),
  state
);

const savedData = await persistence.load();

const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools(),
  data: savedData || { blocks: [] },
  onChange: () => state.markDirty()
});

// Notifications
const notificationQueue = new NotificationQueue();
const notificationManager = new NotificationManager(notificationQueue);
const statusAlert = new StatusAlert();
statusAlert.render(document.body);
notificationManager.attachComponent(statusAlert);

// Save handler with flash feedback
async function handleSave() {
  saveButton.flash();

  try {
    const outputData = await editor.save();
    await persistence.save(outputData);
    notificationManager.showSuccess('Saved successfully');
  } catch (error) {
    notificationManager.showError('Error saving content');
  }
}

// UI Components
const buttonGroup = new ButtonGroup('top-right');
buttonGroup.render(document.body);

const viewToggle = new ViewToggle({
  viewUrl: '/preview.html',
  onEditClick: () => {},
  position: 'top-right'
});
viewToggle.render(buttonGroup.getContainer());
viewToggle.setMode('edit');

const saveButton = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: handleSave,
  ariaLabel: 'Save'
});
saveButton.render(buttonGroup.getContainer());

// Keyboard shortcuts
const shortcuts = new ShortcutManager();
shortcuts.registerDefaults(handleSave);
shortcuts.listen();
```

### Framework Integration

**React:**

```typescript
import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';
import {
  SaveButton,
  StatusAlert,
  ShortcutManager,
  PersistenceManager,
  NotificationManager,
  NotificationQueue,
  EditorState,
  LocalStoragePersistence
} from '@slabs/editor';
import '@slabs/editor/styles';

function AdminEditor() {
  const editorRef = useRef(null);
  const saveButtonRef = useRef(null);
  const shortcutsRef = useRef(null);

  useEffect(() => {
    // Initialize editor and UI components
    // See basic usage example above

    return () => {
      // Cleanup
      if (shortcutsRef.current) {
        shortcutsRef.current.unlisten();
      }
      if (saveButtonRef.current) {
        saveButtonRef.current.destroy();
      }
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return <div ref={editorRef} />;
}
```

**Vue:**

```vue
<template>
  <div ref="editorRef"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';
import {
  SaveButton,
  ShortcutManager,
  // ... other imports
} from '@slabs/editor';
import '@slabs/editor/styles';

const editorRef = ref(null);
let editor = null;
let saveButton = null;
let shortcuts = null;

onMounted(() => {
  // Initialize editor and UI components
  // See basic usage example above
});

onBeforeUnmount(() => {
  // Cleanup
  if (shortcuts) shortcuts.unlisten();
  if (saveButton) saveButton.destroy();
  if (editor) editor.destroy();
});
</script>
```

## Styling

The package includes default styles using EditorJS CSS variables.

**Import styles:**

```typescript
import '@slabs/editor/styles';
```

**CSS Variables:**

```css
/* Uses EditorJS variables */
--color-background: #fff;
--color-text-primary: #1d202b;
--color-border: #EFF0F1;
--color-background-hover: #f7f7f7;
--color-shadow: rgba(13, 20, 33, .1);
```

**Custom styling:**

```css
.slabs-save-button {
  /* Override button styles */
}

.slabs-view-toggle {
  /* Override toggle styles */
}

.slabs-alert {
  /* Override alert styles */
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  Notification,
  NotificationType,
  PersistenceStrategy,
  SaveButtonConfig,
  ViewToggleConfig,
  StatusAlertConfig
} from '@slabs/editor';
```

## Testing

The package includes comprehensive tests:

- **Domain**: 77 tests (EditorState, NotificationQueue, ShortcutHandler, PersistenceStrategy)
- **Application**: 58 tests (NotificationManager, PersistenceManager, ShortcutManager)
- **Infrastructure**: 50 tests (SaveButton, ViewToggle, StatusAlert)
- **Total**: 185 passing tests

Run tests:

```bash
pnpm test
```

## Architecture

Built with Domain-Driven Design (DDD) principles:

```
src/
├── domain/              # Core business logic
│   ├── EditorState.ts
│   ├── NotificationQueue.ts
│   ├── ShortcutHandler.ts
│   └── PersistenceStrategy.ts
├── application/         # Use cases & orchestration
│   ├── NotificationManager.ts
│   ├── PersistenceManager.ts
│   └── ShortcutManager.ts
└── infrastructure/      # UI components & external adapters
    ├── components/
    │   ├── SaveButton.ts
    │   ├── ViewToggle.ts
    │   └── StatusAlert.ts
    ├── ButtonGroup.ts
    └── icons/
```

## License

MIT
