# @slabs/client

Browser runtime for Editor.js integration with Slabs blocks.

## Overview

The client package provides the runtime that converts Slabs block definitions into Editor.js tools, enabling the block-based editor interface. It automatically discovers blocks, handles tool registration, and provides a clean API for initializing Editor.js with your custom blocks.

## Installation

```bash
npm install @slabs/client @editorjs/editorjs
# or
pnpm add @slabs/client @editorjs/editorjs
```

**Peer Dependency:** Requires `@editorjs/editorjs` ^2.28.0

## Key Features

- Automatic block discovery and registration
- Editor.js tool conversion
- Block filtering and configuration
- Type-safe API with full TypeScript support
- Lightweight runtime (~5KB)
- Icon support via @codexteam/icons

## Basic Usage

```typescript
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

// Create Slabs instance
const slabs = new Slabs();

// Initialize Editor.js with all registered blocks
const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools()
});
```

## API Reference

### Constructor

```typescript
new Slabs(options?: SlabsOptions)
```

Create a new Slabs instance with optional configuration.

**Options:**

```typescript
interface SlabsOptions {
  include?: string[];       // Only load these block types
  exclude?: string[];       // Exclude these block types
  toolboxConfig?: (block: BlockDefinition) => ToolboxConfig;  // Custom toolbox config
}
```

**Example:**

```typescript
const slabs = new Slabs({
  exclude: ['slabs/deprecated-block'],
  toolboxConfig: (block) => ({
    title: block.meta.title,
    icon: customIconMap[block.meta.name] || block.meta.icon
  })
});
```

### Methods

#### `getTools()`

Get all tools for Editor.js registration.

**Returns:** `Record<string, EditorJSTool>`

**Example:**

```typescript
const slabs = new Slabs();
const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools(),
  data: existingData
});
```

#### `getTool(name)`

Get a specific tool by block name.

**Parameters:**
- `name: string` - Block name (e.g., 'slabs/simple-text')

**Returns:** `EditorJSTool | undefined`

**Example:**

```typescript
const slabs = new Slabs();
const textTool = slabs.getTool('slabs/simple-text');

if (textTool) {
  // Use tool for custom initialization
  const editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      text: textTool
    }
  });
}
```

#### `getMetadata()`

Get metadata for all loaded blocks.

**Returns:** `BlockMetadata[]`

**Example:**

```typescript
const slabs = new Slabs();
const metadata = slabs.getMetadata();

metadata.forEach(meta => {
  console.log(`Block: ${meta.name}`);
  console.log(`Title: ${meta.title}`);
  console.log(`Category: ${meta.category}`);
});
```

#### `getBlockCount()`

Get total number of loaded blocks.

**Returns:** `number`

**Example:**

```typescript
const slabs = new Slabs();
console.log(`Loaded ${slabs.getBlockCount()} blocks`);
```

#### `getRegistryMetadata()`

Get registry metadata from the virtual module.

**Returns:** Registry metadata object

**Example:**

```typescript
const slabs = new Slabs();
const registryInfo = slabs.getRegistryMetadata();

console.log(`Registry version: ${registryInfo.version}`);
console.log(`Total blocks: ${registryInfo.totalBlocks}`);
console.log(`Generated: ${new Date(registryInfo.timestamp)}`);
```

## Advanced Usage

### Block Filtering

Load only specific blocks or exclude certain types:

```typescript
// Only load these blocks
const slabs = new Slabs({
  include: [
    'slabs/simple-text',
    'slabs/hero',
    'slabs/image'
  ]
});

// Exclude specific blocks
const slabs = new Slabs({
  exclude: [
    'slabs/admin-only',
    'slabs/beta-feature'
  ]
});
```

### Custom Toolbox Configuration

Customize how blocks appear in the Editor.js toolbox:

```typescript
const slabs = new Slabs({
  toolboxConfig: (block) => {
    // Custom icon mapping
    const iconMap = {
      'slabs/simple-text': '📝',
      'slabs/hero': '🎯',
      'slabs/image': '🖼️'
    };

    return {
      title: block.meta.title.toUpperCase(),
      icon: iconMap[block.meta.name] || block.meta.icon
    };
  }
});
```

### Conditional Block Loading

Load different blocks based on user permissions or environment:

```typescript
// Admin editor with all blocks
const adminSlabs = new Slabs();

// Public editor with limited blocks
const publicSlabs = new Slabs({
  exclude: ['slabs/admin-settings', 'slabs/analytics']
});

// User-specific editor
const userBlocks = getUserAllowedBlocks(currentUser);
const userSlabs = new Slabs({
  include: userBlocks
});
```

### Multiple Editor Instances

Use different block configurations for different editors:

```typescript
// Main content editor
const contentSlabs = new Slabs({
  include: ['slabs/simple-text', 'slabs/hero', 'slabs/image']
});

const contentEditor = new EditorJS({
  holder: 'content-editor',
  tools: contentSlabs.getTools()
});

// Sidebar editor
const sidebarSlabs = new Slabs({
  include: ['slabs/widget', 'slabs/callout']
});

const sidebarEditor = new EditorJS({
  holder: 'sidebar-editor',
  tools: sidebarSlabs.getTools()
});
```

### Block Metadata Inspection

Query block capabilities and configuration:

```typescript
const slabs = new Slabs();
const metadata = slabs.getMetadata();

// Find blocks by category
const textBlocks = metadata.filter(m => m.category === 'text');
const mediaBlocks = metadata.filter(m => m.category === 'media');

// Find blocks by keyword
const searchTerm = 'image';
const matchingBlocks = metadata.filter(m =>
  m.keywords?.some(k => k.includes(searchTerm))
);

// Check block capabilities
metadata.forEach(meta => {
  if (meta.supports?.align) {
    console.log(`${meta.title} supports alignment`);
  }
});
```

### Custom Editor Configuration

Combine Slabs with Editor.js configuration:

```typescript
const slabs = new Slabs();

const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools(),

  // Editor.js configuration
  autofocus: true,
  placeholder: 'Start writing...',

  // Custom settings
  minHeight: 300,

  // Callbacks
  onChange: async (api, event) => {
    const data = await editor.save();
    console.log('Content changed:', data);
  },

  onReady: () => {
    console.log(`Editor ready with ${slabs.getBlockCount()} blocks`);
  }
});
```

### Icon Configuration

Slabs supports icons from @codexteam/icons or custom emojis:

**In block.json:**

```json
{
  "name": "slabs/my-block",
  "title": "My Block",
  "icon": "Text"
}
```

Supported formats:
- Codex icon name: `"Text"`, `"Quote"`, `"Image"`
- With Icon prefix: `"IconText"`, `"IconQuote"`
- Emoji: `"📝"`, `"🎯"`, `"🖼️"`

**Custom icon mapping:**

```typescript
const slabs = new Slabs({
  toolboxConfig: (block) => ({
    title: block.meta.title,
    icon: getCustomIcon(block.meta.name)
  })
});

function getCustomIcon(blockName: string): string {
  const icons = {
    'slabs/simple-text': '<svg>...</svg>',
    'slabs/hero': '🎯',
    'slabs/image': '<svg>...</svg>'
  };
  return icons[blockName] || '📦';
}
```

## Block Metadata

Each block provides metadata from its `block.json` file:

```typescript
interface BlockMetadata {
  name: string;              // Block identifier (e.g., 'slabs/simple-text')
  title: string;             // Display title
  category?: string;         // 'text' | 'media' | 'design' | 'widgets' | 'theme' | 'embed'
  description?: string;      // Block description
  keywords?: string[];       // Search keywords
  version?: string;          // Block version
  icon?: string;             // Icon name or emoji
  attributes?: Record<string, any>;     // Block attributes
  supports?: Record<string, any>;       // Block capabilities
  dependencies?: Record<string, string>; // NPM dependencies
}
```

**Example usage:**

```typescript
const slabs = new Slabs();
const metadata = slabs.getMetadata();

// Build block palette
const palette = metadata.map(meta => ({
  id: meta.name,
  label: meta.title,
  icon: meta.icon,
  category: meta.category || 'other',
  description: meta.description
}));

// Group by category
const grouped = palette.reduce((acc, block) => {
  const category = block.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(block);
  return acc;
}, {});
```

## Integration Examples

### React Integration

```typescript
import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

function Editor({ data, onChange }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const slabs = new Slabs();

    const editorInstance = new EditorJS({
      holder: editorRef.current,
      tools: slabs.getTools(),
      data: data,
      onChange: async () => {
        const content = await editorInstance.save();
        onChange(content);
      }
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  return <div ref={editorRef} />;
}
```

### Vue Integration

```vue
<template>
  <div ref="editorEl"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const editorEl = ref(null);
let editor = null;

onMounted(() => {
  const slabs = new Slabs();

  editor = new EditorJS({
    holder: editorEl.value,
    tools: slabs.getTools(),
    data: props.modelValue,
    onChange: async () => {
      const content = await editor.save();
      emit('update:modelValue', content);
    }
  });
});

onUnmounted(() => {
  if (editor) {
    editor.destroy();
  }
});
</script>
```

### Vanilla JavaScript

```javascript
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

// Initialize
const slabs = new Slabs();
const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools()
});

// Save content
document.getElementById('save-btn').addEventListener('click', async () => {
  const data = await editor.save();
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
});

// Load content
async function loadContent(id) {
  const response = await fetch(`/api/content/${id}`);
  const data = await response.json();
  await editor.render(data);
}
```

## Block Structure

Slabs automatically converts block definitions to Editor.js tools:

**Block Definition (discovered from blocks/ directory):**

```typescript
// blocks/MyBlock/edit.ts
export function render(context) {
  const div = document.createElement('div');
  // Build editable UI
  return div;
}

// blocks/MyBlock/save.ts
export function save(element) {
  // Extract data from UI
  return { content: element.textContent };
}

// blocks/MyBlock/block.json
{
  "name": "slabs/my-block",
  "title": "My Block",
  "icon": "Text"
}
```

**Generated Editor.js Tool:**

```typescript
class MyBlockTool {
  static toolbox = {
    title: 'My Block',
    icon: '📝'
  };

  render() { /* calls edit.ts */ }
  save(blockContent) { /* calls save.ts */ }
}
```

## Development vs Production

The client behaves differently in development and production:

**Development Mode:**
- Logs initialization details to console
- Shows block count and metadata
- Detailed error messages
- Debug information in error placeholders

**Production Mode:**
- Silent initialization
- Minimal console output
- Clean error UI

Mode is determined by `import.meta.env.DEV` (Vite environment variable).

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import { Slabs, type SlabsOptions, type BlockMetadata } from '@slabs/client';

const options: SlabsOptions = {
  exclude: ['slabs/beta']
};

const slabs = new Slabs(options);

const metadata: BlockMetadata[] = slabs.getMetadata();
const count: number = slabs.getBlockCount();
```

## Performance Considerations

**Bundle Splitting:**

The client only includes Editor.js integration code. For public pages, use `@slabs/renderer` instead to avoid the Editor.js overhead:

| Package | Size | Use Case |
|---------|------|----------|
| @slabs/client + Editor.js | ~100KB | Admin/editor interfaces |
| @slabs/renderer | ~3KB | Display only (public pages) |

**Lazy Loading:**

For large applications, consider lazy loading the editor:

```typescript
// Load editor only when needed
async function initializeEditor() {
  const [{ default: EditorJS }, { Slabs }] = await Promise.all([
    import('@editorjs/editorjs'),
    import('@slabs/client')
  ]);

  const slabs = new Slabs();
  const editor = new EditorJS({
    holder: 'editorjs',
    tools: slabs.getTools()
  });
}

// Trigger on user action
document.getElementById('edit-btn').addEventListener('click', initializeEditor);
```

## License

MIT
