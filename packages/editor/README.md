# @slabs/editor

Complete editor UI component for CMS integration with Slabs. Icon-only interface with minimal, Shadcn-inspired design.

## Features

- **Icon-only UI** - No text labels, no i18n complexity
- **Save Button** - Fixed-position save button with loading states
- **View Toggle** - Switch between view and edit modes
- **Status Alerts** - Success/error/info notifications with auto-dismiss
- **Keyboard Shortcuts** - Cross-platform keyboard shortcuts (Cmd/Ctrl+S for save)
- **State Management** - Track dirty state, loading state, and errors
- **Persistence Strategies** - LocalStorage and API fetch implementations
- **DDD/TDD Architecture** - 191 tests, 100% coverage

## Installation

```bash
pnpm add @slabs/editor @codexteam/icons
```

## Usage

### Basic Example

```typescript
import {
  SaveButton,
  ViewToggle,
  StatusAlert,
  ShortcutManager,
  PersistenceManager,
  EditorState,
  LocalStoragePersistence
} from '@slabs/editor';
import '@slabs/editor/styles';

// Create state and persistence
const state = new EditorState();
const persistence = new PersistenceManager(
  new LocalStoragePersistence('editor-data'),
  state
);

// Create UI components
const saveButton = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: async () => {
    const data = await editorInstance.save();
    await persistence.save(data);
  }
});

const viewToggle = new ViewToggle({
  viewUrl: '/page/view',
  onEditClick: () => {
    // Switch to edit mode
  },
  position: 'bottom-left'
});

const statusAlert = new StatusAlert({
  onDismiss: (id) => {
    console.log('Dismissed:', id);
  }
});

// Render components
saveButton.render(document.body);
viewToggle.render(document.body);
statusAlert.render(document.body);

// Setup keyboard shortcuts
const shortcuts = new ShortcutManager();
shortcuts.registerDefaults(async () => {
  const data = await editorInstance.save();
  await persistence.save(data);
});
shortcuts.listen();

// Show notifications
statusAlert.show({
  id: '1',
  type: 'success',
  message: 'Saved successfully'
});
```

### With API Persistence

```typescript
import { ApiFetchPersistence } from '@slabs/editor';

const persistence = new PersistenceManager(
  new ApiFetchPersistence('/api/pages'),
  state,
  { pageId: '123' } // Context
);

// Save with context
await persistence.save(data);

// Load with context
const loadedData = await persistence.load();
```

### Custom Icons

```typescript
import { SaveButton } from '@slabs/editor';

// Built-in icon
const button1 = new SaveButton({
  icon: 'check',
  position: 'top-right',
  onClick: () => {}
});

// Custom SVG
const button2 = new SaveButton({
  icon: '<svg>...</svg>',
  position: 'top-right',
  onClick: () => {}
});
```

## Architecture

### Domain Layer

- `EditorState` - Manages dirty/loading/error states
- `ShortcutHandler` - Keyboard shortcut management
- `NotificationQueue` - FIFO queue for notifications
- `PersistenceStrategy` - Interface for save/load operations
- `LocalStoragePersistence` - LocalStorage implementation
- `ApiFetchPersistence` - Fetch API implementation

### Application Layer

- `PersistenceManager` - Orchestrates save/load with state
- `ShortcutManager` - DOM event listener coordination
- `NotificationManager` - Notification display coordination

### Infrastructure Layer

- `SaveButton` - Fixed-position save button component
- `ViewToggle` - View/edit mode toggle component
- `StatusAlert` - Status notification component
- `renderIcon()` - Icon rendering utility

## Styling

The package includes Shadcn-inspired CSS with HSL color variables. Import the styles:

```typescript
import '@slabs/editor/styles';
```

### CSS Variables

```css
:root {
  --slabs-primary: 222.2 47.4% 11.2%;
  --slabs-success: 142.1 76.2% 36.3%;
  --slabs-error: 0 84.2% 60.2%;
  --slabs-info: 221.2 83.2% 53.3%;
  /* ... and more */
}
```

## Testing

All components are fully tested with Vitest:

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

- **Domain Layer**: 77 tests
- **Application Layer**: 58 tests
- **Infrastructure Layer**: 56 tests
- **Total**: 191 tests

## License

MIT
