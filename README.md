# Slabs

**ACF-like Field System for Editor.js Blocks**

A modern, extensible block system for Editor.js with automatic block discovery, ACF-like field configuration, and separate editing/rendering bundles. Built with TypeScript, Vite, and designed for performance.

---

## Features

- **ACF-like Fields** - Define fields in `block.json` with automatic UI generation
- **File-based Discovery** - Auto-discover blocks from `blocks/` directory
- **DRY Architecture** - Single source of truth in `block.json`
- **Helper Functions** - ACF-inspired API for working with field data
- **TypeScript First** - Full type safety throughout
- **Hot Module Replacement** - Instant feedback during development
- **Separate Bundles** - Lightweight display rendering without Editor.js (97% smaller)
- **21 Field Types** - Text, image, repeater, flexible content, and more

---

## Packages

| Package | Environment | Size | Purpose | Documentation |
|---------|-------------|------|---------|---------------|
| `@slabs/vite-plugin` | Node.js (build) | ~50KB | Block discovery, validation, virtual module generation | [README](packages/vite-plugin/README.md) |
| `@slabs/client` | Browser (edit) | ~5KB | Editor.js integration for admin interfaces | [README](packages/client/README.md) |
| `@slabs/renderer` | Browser (display) | ~3KB | Lightweight rendering for public pages | [README](packages/renderer/README.md) |
| `@slabs/fields` | Browser (edit) | ~23KB | ACF-like field system with 21 field types | [README](packages/fields/README.md) |
| `@slabs/helpers` | Browser/Node | ~3KB | ACF-like helper functions for field data | [README](packages/helpers/README.md) |

---

## Quick Start

### Installation

```bash
npm install @slabs/vite-plugin @slabs/client @slabs/renderer @slabs/fields @editorjs/editorjs
# or
pnpm add @slabs/vite-plugin @slabs/client @slabs/renderer @slabs/fields @editorjs/editorjs
```

### Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { slabsPlugin } from '@slabs/vite-plugin';

export default defineConfig({
  plugins: [
    slabsPlugin({
      blocksDir: './blocks'
    })
  ]
});
```

### Create Your First Block

```
blocks/
└── hero/
    ├── block.json
    ├── edit.ts
    ├── save.ts
    └── render.ts
```

**block.json** - Define fields ACF-style:

```json
{
  "name": "slabs/hero",
  "title": "Hero",
  "icon": "Picture",
  "collapsible": false,
  "fields": {
    "headline": {
      "type": "text",
      "label": "Headline",
      "required": true
    },
    "subheadline": {
      "type": "text",
      "label": "Subheadline"
    },
    "ctaText": {
      "type": "text",
      "label": "CTA Text"
    },
    "backgroundImage": {
      "type": "image",
      "label": "Background Image"
    }
  }
}
```

**edit.ts** - Use the DRY helper:

```typescript
import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  return renderBlockEditor({
    title: context.config?.title || 'Block',
    icon: context.config?.icon,
    fields: context.config?.fields || {},
    data: context.data,
    collapsible: context.config?.collapsible
  });
}
```

**save.ts** - Extract field data:

```typescript
import { extractFieldData } from '@slabs/fields';

export function save(element: HTMLElement): any {
  const fieldsContainer = element.querySelector('.slabs-fields');
  return extractFieldData(fieldsContainer as HTMLElement);
}
```

**render.ts** - Display on frontend:

```typescript
export function render(data: any): HTMLElement {
  const hero = document.createElement('div');
  hero.className = 'hero';

  const headline = document.createElement('h1');
  headline.textContent = data.headline;
  hero.appendChild(headline);

  if (data.subheadline) {
    const subheadline = document.createElement('p');
    subheadline.textContent = data.subheadline;
    hero.appendChild(subheadline);
  }

  return hero;
}
```

### Use in Your App

**Admin Page (Editing):**

```typescript
import EditorJS from '@editorjs/editorjs';
import { Slabs } from '@slabs/client';

const slabs = new Slabs();
const editor = new EditorJS({
  holder: 'editorjs',
  tools: slabs.getTools()
});

// Save content
document.getElementById('save-btn').addEventListener('click', async () => {
  const data = await editor.save();
  await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
});
```

**Public Page (Display):**

```typescript
import { SlabsRenderer } from '@slabs/renderer';

const renderer = new SlabsRenderer();

// Load and display
const data = await fetch('/api/articles/123').then(r => r.json());
const html = await renderer.render(data);
document.getElementById('content').appendChild(html);
```

---

## Field System

### Supported Field Types

**Simple Fields:**
- `text` - Single line input
- `textarea` - Multi-line input
- `number` - Numeric input with min/max/step
- `email` - Email with validation
- `password` - Password input
- `link` - URL field

**Selection Fields:**
- `select` - Dropdown with options
- `checkbox` - Multiple choice
- `radio` - Radio buttons
- `boolean` - Toggle/switch

**Media Fields:**
- `image` - Image upload
- `file` - File upload
- `oembed` - Embed URLs (YouTube, Vimeo, etc.)

**Input Fields:**
- `color` - Color picker
- `date` - Date picker
- `range` - Slider
- `wysiwyg` - Rich text editor

**Structural Fields:**
- `repeater` - Repeatable field groups
- `flexible` - Flexible content layouts
- `group` - Grouped fields
- `tabs` - Tabbed interface

### Field Configuration Example

```json
{
  "fields": {
    "title": {
      "type": "text",
      "label": "Title",
      "placeholder": "Enter title",
      "required": true,
      "minLength": 3,
      "maxLength": 100
    },
    "price": {
      "type": "number",
      "label": "Price",
      "min": 0,
      "max": 1000,
      "step": 0.01,
      "prefix": "$"
    },
    "teamMembers": {
      "type": "repeater",
      "label": "Team Members",
      "buttonLabel": "Add Member",
      "fields": {
        "name": { "type": "text", "label": "Name", "required": true },
        "role": { "type": "text", "label": "Role" },
        "photo": { "type": "image", "label": "Photo" }
      }
    }
  }
}
```

---

## Helper Functions

Work with field data using ACF-like helper functions:

```typescript
import { getField, setField, getRows, addRow } from '@slabs/helpers';

// Get field value (supports dot notation)
const title = getField(data, 'title');
const bgColor = getField(data, 'settings.backgroundColor');

// Set field value (immutable)
const newData = setField(data, 'title', 'New Title');

// Work with repeater fields
const items = getRows(data, 'teamMembers');
items.forEach(member => {
  console.log(member.name, member.role);
});

// Add row to repeater
const updatedData = addRow(data, 'teamMembers', {
  name: 'John Doe',
  role: 'Developer',
  photo: { url: '/john.jpg' }
});

// Group fields
const settings = getGroup(data, 'settings');
const textColor = getGroupField(data, 'settings', 'textColor');

// Flexible content
const sections = getLayouts(data, 'pageSections');
const heroSections = getLayoutsByType(data, 'pageSections', 'hero');
```

See the [@slabs/helpers documentation](packages/helpers/README.md) for complete API reference.

---

## Why Slabs?

### The Problem with Vanilla Editor.js

```javascript
// Manual registration for every block
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
// ... import many more tools

const editor = new EditorJS({
  tools: {
    header: Header,
    list: List,
    quote: Quote,
    // ... manually register each one
  }
});
```

### The Slabs Solution

```javascript
// Automatic discovery and registration
import { Slabs } from '@slabs/client';

const editor = new EditorJS({
  tools: new Slabs().getTools()
});
```

### Key Benefits

| Before (Vanilla Editor.js) | After (Slabs) |
|----------------------------|---------------|
| Manual tool registration | Automatic discovery |
| No standard structure | WordPress-like file structure |
| Same code for edit + display | Separate edit/render bundles |
| Full bundle on public pages (~100KB) | Minimal bundle (~3KB) |
| Manual TypeScript setup | Built-in type safety |
| Custom HMR setup | Built-in hot reload |
| No field system | 21 built-in field types |
| No helper functions | ACF-like data manipulation API |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Build Time (Node.js)                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  @slabs/vite-plugin                                     │
│  ├─ Scans blocks/ directory                             │
│  ├─ Validates block structure                           │
│  ├─ Generates virtual:slabs-registry                    │
│  └─ Provides HMR during development                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓ generates
                  virtual:slabs-registry
                         │
        ┌────────────────┴────────────────┐
        ↓                                 ↓
┌──────────────────┐              ┌──────────────────┐
│ Runtime (Browser)│              │ Runtime (Browser)│
├──────────────────┤              ├──────────────────┤
│                  │              │                  │
│ @slabs/client    │              │ @slabs/renderer  │
│ + @slabs/fields  │              │                  │
│ ─────────────    │              │ ─────────────    │
│ - Edit blocks    │              │ - Display blocks │
│ - Save data      │              │ - Read-only      │
│ - Validation     │              │ - No Editor.js   │
│ ~100KB total     │              │ ~3KB only        │
│                  │              │                  │
└──────────────────┘              └──────────────────┘
   Admin Pages                      Public Pages
        │                                 │
        └────────────┬────────────────────┘
                     ↓
             @slabs/helpers
             (works with both)
```

---

## Block Structure

Each block follows a standardized structure:

```
blocks/BlockName/
├── block.json          # Metadata & field configuration
├── edit.ts             # Editable UI (admin)
├── save.ts             # Data extraction (admin)
├── render.ts           # Read-only display (public)
├── preview.png         # Block picker thumbnail (optional)
└── style.css           # Block-specific styles (optional)
```

### File Responsibilities

| File | Purpose | Used By | Required |
|------|---------|---------|----------|
| `block.json` | Block metadata and field definitions | Both | Yes |
| `edit.ts` | Create editable UI | @slabs/client | Yes |
| `save.ts` | Extract block data | @slabs/client | Yes |
| `render.ts` | Display read-only content | @slabs/renderer | Yes |
| `preview.png` | Toolbox thumbnail | @slabs/client | No |
| `style.css` | Block styles | Both | No |

---

## Performance

### Bundle Size Comparison

```
Editor Page (Admin):
├─ @editorjs/editorjs    ~100KB
├─ @slabs/client         ~5KB
├─ @slabs/fields         ~23KB
└─ Your blocks           ~2KB/block
   ────────────────────────────────
   Total: ~128KB + blocks

Display Page (Public):
├─ @slabs/renderer       ~3KB
└─ Your blocks           ~1KB/block
   ────────────────────────────────
   Total: ~3KB + blocks

Savings: ~125KB (97% reduction)
```

### Why This Matters

- **Faster page loads** - 97% smaller bundle on public pages
- **Lower bandwidth costs** - Significant savings for high-traffic sites
- **Better mobile experience** - Faster on slower connections
- **Improved SEO** - Faster Time to Interactive

---

## Advanced Features

### Nested Repeaters

```json
{
  "sections": {
    "type": "repeater",
    "label": "Page Sections",
    "fields": {
      "title": { "type": "text", "label": "Section Title" },
      "items": {
        "type": "repeater",
        "label": "Items",
        "fields": {
          "name": { "type": "text", "label": "Name" },
          "description": { "type": "textarea", "label": "Description" }
        }
      }
    }
  }
}
```

### Flexible Content

```json
{
  "content": {
    "type": "flexible",
    "label": "Page Content",
    "layouts": {
      "hero": {
        "label": "Hero Section",
        "fields": {
          "title": { "type": "text", "label": "Title" },
          "image": { "type": "image", "label": "Background" }
        }
      },
      "text": {
        "label": "Text Block",
        "fields": {
          "content": { "type": "wysiwyg", "label": "Content" }
        }
      },
      "gallery": {
        "label": "Image Gallery",
        "fields": {
          "images": {
            "type": "repeater",
            "label": "Images",
            "fields": {
              "image": { "type": "image", "label": "Image" },
              "caption": { "type": "text", "label": "Caption" }
            }
          }
        }
      }
    }
  }
}
```

### Group Fields

```json
{
  "settings": {
    "type": "group",
    "label": "Design Settings",
    "collapsible": true,
    "fields": {
      "backgroundColor": { "type": "color", "label": "Background" },
      "textColor": { "type": "color", "label": "Text Color" },
      "padding": { "type": "number", "label": "Padding (px)" },
      "borderRadius": { "type": "number", "label": "Border Radius (px)" }
    }
  }
}
```

### Server-Side Rendering

```typescript
import { SlabsRenderer } from '@slabs/renderer';
import { JSDOM } from 'jsdom';

// Setup for Node.js
global.document = new JSDOM().window.document;

// Render to HTML string
const renderer = new SlabsRenderer();
const htmlString = await renderer.renderToString(editorData);

res.send(`
  <!DOCTYPE html>
  <html>
    <body>
      <article>${htmlString}</article>
    </body>
  </html>
`);
```

---

## Comparison

### vs. WordPress Gutenberg

| Feature | WordPress Gutenberg | Slabs |
|---------|---------------------|-------|
| Platform | WordPress only | Any JavaScript app |
| Block structure | block.json + JS | Same concept |
| Field system | Custom components | ACF-like fields |
| Helper functions | WordPress functions | ACF-like helpers |
| Portability | WordPress only | Fully portable |
| PHP dependency | Required | None (pure JS) |
| Build tools | @wordpress/scripts | Vite plugin |

### vs. Vanilla Editor.js

| Feature | Vanilla Editor.js | Slabs |
|---------|-------------------|-------|
| Registration | Manual | Automatic |
| File structure | Custom | Standardized |
| Field system | None | 21 built-in types |
| Helper functions | None | ACF-like API |
| Display rendering | Same as edit | Separate bundle |
| TypeScript | Manual | Built-in |
| HMR | Manual | Built-in |
| Bundle optimization | Manual | Automatic |

---

## Examples

### React Block

```tsx
// blocks/interactive-chart/edit.tsx
import { createRoot } from 'react-dom/client';
import { ChartEditor } from './ChartEditor';

export function render(context) {
  const wrapper = document.createElement('div');
  const root = createRoot(wrapper);
  root.render(<ChartEditor data={context.data} />);
  return wrapper;
}
```

### Vue Block

```vue
<!-- blocks/image-gallery/edit.vue -->
<template>
  <div class="gallery-editor">
    <div v-for="img in images" :key="img.id" class="image-item">
      <img :src="img.url" :alt="img.alt" />
      <button @click="removeImage(img.id)">Remove</button>
    </div>
    <button @click="addImage">Add Image</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const images = ref([]);
</script>
```

### TypeScript Block with Validation

```typescript
// blocks/contact-form/edit.ts
interface ContactFormData {
  email: string;
  subject: string;
  message: string;
  gdprConsent: boolean;
}

export function render(context: { data: ContactFormData }) {
  // Use field system with validation
  return renderBlockEditor({
    title: 'Contact Form',
    fields: {
      email: { type: 'email', label: 'Email', required: true },
      subject: { type: 'text', label: 'Subject', required: true },
      message: { type: 'textarea', label: 'Message', required: true, rows: 5 },
      gdprConsent: { type: 'boolean', label: 'I agree to privacy policy', required: true }
    },
    data: context.data
  });
}
```

---

## Documentation

- [Vite Plugin Guide](packages/vite-plugin/README.md) - Block discovery and validation
- [Client Guide](packages/client/README.md) - Editor.js integration
- [Renderer Guide](packages/renderer/README.md) - Display rendering
- [Fields Guide](packages/fields/README.md) - Field system (21 types)
- [Helpers Guide](packages/helpers/README.md) - ACF-like helper functions

---

## Development

### Setup

```bash
# Clone repository
git clone https://github.com/MarJC5/slabs.git
cd slabs

# Install dependencies (requires pnpm)
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Watch mode
pnpm dev
```

### Monorepo Structure

```
slabs/
├── packages/
│   ├── vite-plugin/    # Build-time block scanner
│   ├── client/         # Editor.js runtime
│   ├── renderer/       # Display renderer
│   ├── fields/         # Field system (21 types)
│   └── helpers/        # Data manipulation helpers
└── examples/
    ├── basic/          # Vanilla JS example
    ├── react/          # React example
    └── vue/            # Vue example
```

### Running Examples

```bash
# Basic example
cd examples/basic
pnpm dev

# React example
cd examples/react
pnpm dev

# Vue example
cd examples/vue
pnpm dev
```

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @slabs/fields test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

---

## License

MIT © Martin Jean-Christio

---

## Acknowledgments

- [Editor.js](https://editorjs.io/) - The amazing block editor that powers Slabs
- [WordPress Gutenberg](https://wordpress.org/gutenberg/) - Inspiration for block structure
- [Advanced Custom Fields](https://www.advancedcustomfields.com/) - Inspiration for field system
- [Vite](https://vitejs.dev/) - Lightning-fast build tool

---

## Support

- [Issue Tracker](https://github.com/MarJC5/slabs/issues)
- [Discussions](https://github.com/MarJC5/slabs/discussions)

---

**Built for the Editor.js community**
