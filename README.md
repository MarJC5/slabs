# Slabs

**ACF-like Field System for Editor.js Blocks**

A modern, extensible block system for Editor.js with automatic block discovery, ACF-like field configuration, and separate editing/rendering. Built with TypeScript, Vite, and @codexteam/icons.

---

## Features

- **ACF-like Fields** - Define fields in `block.json` with automatic UI generation
- **File-based Block Discovery** - Auto-discover blocks from `blocks/` directory
- **DRY Architecture** - Single source of truth in `block.json`
- **Modern UI** - Shadcn-inspired design with @codexteam/icons
- **Collapsible Blocks** - Save space in the editor with expandable blocks
- **TypeScript First** - Full type safety throughout
- **Hot Module Replacement** - Instant feedback during development
- **Separate Rendering** - Lightweight display bundle without Editor.js

---

## Packages

| Package | Environment | Size | Purpose |
|---------|-------------|------|---------|
| `@slabs/vite-plugin` | Node.js (build-time) | ~50KB | Scans filesystem, validates blocks, generates virtual module |
| `@slabs/client` | Browser (runtime) | ~2KB | Editor.js integration for editing |
| `@slabs/renderer` | Browser (runtime) | ~3KB | Display rendering for end-users |
| `@slabs/fields` | Browser (runtime) | ~23KB | ACF-like field system with validation |

---

## Quick Start

### Installation

```bash
# Install packages
npm install @slabs/vite-plugin @slabs/client @slabs/renderer --save-dev
npm install @editorjs/editorjs

# Or with pnpm
pnpm add -D @slabs/vite-plugin @slabs/client @slabs/renderer
pnpm add @editorjs/editorjs
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
    "backgroundStyle": {
      "type": "select",
      "label": "Background",
      "options": [
        { "value": "light", "label": "Light" },
        { "value": "dark", "label": "Dark" }
      ]
    }
  }
}
```

**edit.ts** - Use the DRY helper (100% from block.json):
```typescript
import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  const config = context.config as any;

  return renderBlockEditor({
    title: config?.title || 'Block',
    icon: config?.icon,
    fields: config?.fields || {},
    data: context.data,
    collapsible: config?.collapsible
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
  hero.className = `hero hero--${data.backgroundStyle}`;

  const headline = document.createElement('h1');
  headline.textContent = data.headline;
  hero.appendChild(headline);

  return hero;
}
```

### Use in Your App

**Admin Page (Editing):**
```javascript
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
    body: JSON.stringify(data)
  });
});
```

**Public Page (Display):**
```javascript
import { SlabsRenderer } from '@slabs/renderer';

const renderer = new SlabsRenderer();

// Load and display
const data = await fetch('/api/articles/123').then(r => r.json());
const html = await renderer.render(data);
document.getElementById('content').appendChild(html);
```

---

## Why Slabs?

### The Problem with Vanilla Editor.js

```javascript
// Manual registration for every block
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
// ... import 50 more tools

const editor = new EditorJS({
  tools: {
    header: Header,
    list: List,
    quote: Quote,
    // ... manually register 50 more
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
| Same code for edit + display | Separate edit.js and render.js |
| Full bundle on public pages (~100KB) | Minimal bundle (~3KB) |
| Manual TypeScript setup | Built-in type safety |
| Custom HMR setup | Built-in hot reload |

---

## Key Concepts

### ACF-like Fields

Define fields in `block.json` with automatic UI generation:

**Supported Field Types:**
- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Numeric input with min/max
- `select` - Dropdown selection
- `checkbox` - Boolean toggle
- `radio` - Radio button group
- `date` - Date picker
- `color` - Color picker

**Field Configuration:**
```json
{
  "fields": {
    "fieldName": {
      "type": "text",
      "label": "Display Label",
      "placeholder": "Placeholder text",
      "required": true,
      "default": "Default value"
    }
  }
}
```

### DRY Architecture

Everything comes from `block.json`:
- ✅ Block title
- ✅ Block icon (@codexteam/icons)
- ✅ Block description
- ✅ Field definitions
- ✅ Collapsible state
- ✅ Validation rules

No duplication in `edit.ts` - just use `renderBlockEditor` helper.

### Collapsible Blocks

Save editor space with expandable blocks:

```json
{
  "collapsible": false  // true = starts expanded, false = starts collapsed
}
```

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
        ↓                                  ↓
┌──────────────────┐              ┌──────────────────┐
│ Runtime (Browser)│              │ Runtime (Browser)│
├──────────────────┤              ├──────────────────┤
│                  │              │                  │
│ @slabs/client    │              │ @slabs/renderer  │
│ - Edit blocks    │              │ - Display blocks │
│ - Save data      │              │ - Read-only      │
│ - Editor.js      │              │ - No Editor.js   │
│ ~5KB + Editor.js │              │ ~3KB only        │
│                  │              │                  │
└──────────────────┘              └──────────────────┘
   Admin Pages                      Public Pages
```

---

## Block Structure

Each block follows a standardized structure:

```
blocks/BlockName/
├── block.json          # Metadata & configuration
├── edit.js             # Editable UI (admin)
├── save.js             # Data extraction (admin)
├── render.js           # Read-only display (public)
├── preview.png         # Block picker thumbnail
└── style.css           # Block-specific styles (optional)
```

### File Responsibilities

| File | Purpose | Used By | Editable |
|------|---------|---------|----------|
| `edit.js` | Create editable UI | @slabs/client | Yes |
| `save.js` | Extract block data | @slabs/client | - |
| `render.js` | Display read-only content | @slabs/renderer | No |
| `block.json` | Block metadata | Both | - |
| `preview.png` | Toolbox thumbnail | @slabs/client | - |

---

## Examples

### React Block

```tsx
// blocks/hero-section/edit.tsx
import { createRoot } from 'react-dom/client';
import { HeroEditor } from './HeroEditor';

export function render(context) {
  const wrapper = document.createElement('div');
  const root = createRoot(wrapper);
  root.render(<HeroEditor data={context.data} />);
  return wrapper;
}
```

### Vue Block

```vue
<!-- blocks/gallery/edit.vue -->
<template>
  <div class="gallery-editor">
    <img v-for="img in images" :src="img.url" :key="img.id" />
  </div>
</template>
```

### TypeScript Block

```typescript
// blocks/quote/edit.ts
interface QuoteData {
  text: string;
  author: string;
  source?: string;
}

export function render(context: { data: QuoteData }) {
  const blockquote = document.createElement('blockquote');
  blockquote.contentEditable = 'true';
  blockquote.textContent = context.data.text;
  return blockquote;
}
```

---

## Advanced Features

### Theming & Localization

```javascript
import { SlabsRenderer } from '@slabs/renderer';

const renderer = new SlabsRenderer();
const html = await renderer.render(data, {
  theme: 'dark',
  locale: 'fr-FR',
  baseUrl: 'https://cdn.example.com'
});
```

### SEO-Friendly Rendering

```javascript
// blocks/article/render.js
export function render(data, context) {
  const article = document.createElement('article');
  article.setAttribute('itemscope', '');
  article.setAttribute('itemtype', 'https://schema.org/Article');

  const title = document.createElement('h1');
  title.setAttribute('itemprop', 'headline');
  title.textContent = data.title;

  article.appendChild(title);
  return article;
}
```

### Server-Side Rendering

```javascript
import { SlabsRenderer } from '@slabs/renderer';
import { JSDOM } from 'jsdom';

// Setup for Node.js
global.document = new JSDOM().window.document;

// Render to HTML string
const renderer = new SlabsRenderer();
const htmlString = await renderer.renderToString(editorData);

res.send(`<article>${htmlString}</article>`);
```

---

## Performance

### Bundle Size Comparison

```
Editor Page (Admin):
├─ @editorjs/editorjs    ~100KB
├─ @slabs/client         ~5KB
└─ Your blocks           ~2KB/block
   ────────────────────────────────
   Total: ~105KB + blocks

Display Page (Public):
├─ @slabs/renderer       ~3KB
└─ Your blocks           ~1KB/block
   ────────────────────────────────
   Total: ~3KB + blocks

Savings: ~102KB (97% reduction!)
```

### Why This Matters

- **Faster page loads** on public pages
- **Lower bandwidth costs** for high-traffic sites
- **Better mobile experience** on slower connections
- **Improved SEO** through faster Time to Interactive

---

## Comparison

### vs. WordPress Gutenberg

| Feature | WordPress Gutenberg | Slabs |
|---------|---------------------|-------|
| Platform | WordPress only | Any JavaScript app |
| Block structure | block.json + JS | Same concept |
| Portability | WordPress only | Fully portable |
| PHP dependency | Required | None (pure JS) |
| Build tools | @wordpress/scripts | Vite plugin |

### vs. Vanilla Editor.js

| Feature | Vanilla Editor.js | Slabs |
|---------|-------------------|-------|
| Registration | Manual | Automatic |
| File structure | Custom | Standardized |
| Display rendering | Same as edit | Separate render.js |
| TypeScript | Manual | Built-in |
| HMR | Manual | Built-in |
| Bundle optimization | Manual | Automatic |

---

## Current Status

### Completed Features ✅
- [x] Core architecture with 4-package monorepo
- [x] @slabs/vite-plugin - Block discovery and hot reload
- [x] @slabs/client - Editor.js integration with @codexteam/icons
- [x] @slabs/renderer - Lightweight display rendering
- [x] @slabs/fields - ACF-like field system with validation
- [x] renderBlockEditor helper - DRY block creation
- [x] Collapsible blocks with shadcn-inspired UI
- [x] TypeScript support throughout
- [x] Example blocks (Hero, Testimonial)
- [x] Modern admin interface

### In Progress 🚧
- [ ] Documentation improvements
- [ ] More field types (image, repeater, etc.)
- [ ] Block templates/patterns
- [ ] CLI tool for scaffolding

### Roadmap 📋
- [ ] VSCode extension
- [ ] Block variations
- [ ] Block transforms
- [ ] Performance optimization
- [ ] Migration guides

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/MarJC5/slabs.git
cd slabs

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build packages
pnpm build
```

---

## License

MIT © Martin Jean-Christio

---

## Acknowledgments

- **[Editor.js](https://editorjs.io/)** - The amazing block editor that powers Slabs
- **[WordPress Gutenberg](https://wordpress.org/gutenberg/)** - Inspiration for the block structure
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and virtual modules

---

## Support

- [Issue Tracker](https://github.com/MarJC5/slabs/issues)
- [Discussions](https://github.com/MarJC5/slabs/discussions)

---

## Show Your Support

If you find Slabs useful, please consider:
- Starring the repository
- Sharing on social media
- Writing a blog post
- Contributing to the project

---

**Built with care for the Editor.js community**
