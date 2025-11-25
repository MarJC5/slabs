# @slabs/renderer

Lightweight browser runtime for rendering Slabs blocks on public pages without Editor.js.

## Overview

The renderer package provides a minimal (~3KB) alternative to Editor.js for displaying saved content on public pages. It renders Editor.js block data to HTML using only the block render functions, resulting in a **97% smaller bundle** compared to loading the full Editor.js library.

## Installation

```bash
npm install @slabs/renderer
# or
pnpm add @slabs/renderer
```

## Key Benefits

- **Lightweight** - ~3KB vs ~100KB with Editor.js
- **Fast** - No editor overhead, just pure rendering
- **Type-safe** - Full TypeScript support
- **Flexible** - Custom error handlers and block filtering
- **SSR-ready** - Render to string for server-side rendering

## Basic Usage

```typescript
import { SlabsRenderer } from '@slabs/renderer';

// Create renderer instance
const renderer = new SlabsRenderer();

// Fetch saved content
const data = await fetch('/api/articles/123').then(r => r.json());

// Render to DOM
const contentElement = await renderer.render(data);
document.getElementById('article').appendChild(contentElement);
```

## API Reference

### Constructor

```typescript
new SlabsRenderer(options?: RendererOptions)
```

Create a new renderer instance with optional configuration.

**Options:**

```typescript
interface RendererOptions {
  include?: string[];           // Only render these block types
  exclude?: string[];           // Exclude these block types
  onError?: (block, error) => HTMLElement;  // Custom error handler
  onUnknownBlock?: (block) => HTMLElement;  // Custom unknown block handler
  containerClass?: string;      // Container class name (default: 'slabs-content')
}
```

**Example:**

```typescript
const renderer = new SlabsRenderer({
  containerClass: 'article-content',
  exclude: ['slabs/deprecated-block'],
  onError: (block, error) => {
    const div = document.createElement('div');
    div.className = 'render-error';
    div.textContent = `Failed to render: ${error.message}`;
    return div;
  }
});
```

### Methods

#### `render(editorData, context?)`

Render complete Editor.js output to HTMLElement.

**Parameters:**
- `editorData: EditorJSData` - Saved Editor.js content
- `context?: RenderContext` - Optional rendering context

**Returns:** `Promise<HTMLElement>`

**Example:**

```typescript
const data = {
  blocks: [
    { type: 'slabs/simple-text', data: { content: 'Hello World' } },
    { type: 'slabs/hero', data: { title: 'Welcome', image: {...} } }
  ]
};

const element = await renderer.render(data);
document.body.appendChild(element);
```

#### `renderBlock(block, context?)`

Render a single block to HTMLElement.

**Parameters:**
- `block: EditorJSBlock` - Single block object
- `context?: RenderContext` - Optional rendering context

**Returns:** `Promise<HTMLElement>`

**Example:**

```typescript
const block = {
  type: 'slabs/simple-text',
  data: { content: 'Hello World' }
};

const element = await renderer.renderBlock(block);
document.body.appendChild(element);
```

#### `renderToString(editorData, context?)`

Render to HTML string (useful for SSR).

**Parameters:**
- `editorData: EditorJSData` - Saved Editor.js content
- `context?: RenderContext` - Optional rendering context

**Returns:** `Promise<string>`

**Example:**

```typescript
// Server-side rendering
const htmlString = await renderer.renderToString(data);
res.send(`<article>${htmlString}</article>`);
```

## Rendering Context

Pass additional context to customize rendering:

```typescript
interface RenderContext {
  className?: string;           // Additional CSS classes
  attributes?: Record<string, string>;  // Custom HTML attributes
  mode?: string;                // Render mode (e.g., 'preview', 'public')
  theme?: 'light' | 'dark' | string;   // Theme preference
  locale?: string;              // Locale for i18n
  baseUrl?: string;             // Base URL for assets (CDN)
  userPreferences?: {
    fontSize?: 'small' | 'medium' | 'large';
    reducedMotion?: boolean;
  };
  [key: string]: any;           // Custom properties
}
```

**Example:**

```typescript
const element = await renderer.render(data, {
  theme: 'dark',
  locale: 'fr-FR',
  baseUrl: 'https://cdn.example.com',
  userPreferences: {
    fontSize: 'large',
    reducedMotion: true
  }
});
```

## Advanced Usage

### Block Filtering

Render only specific blocks or exclude certain types:

```typescript
// Only render these blocks
const renderer = new SlabsRenderer({
  include: ['slabs/simple-text', 'slabs/hero', 'slabs/image']
});

// Exclude specific blocks
const renderer = new SlabsRenderer({
  exclude: ['slabs/admin-only', 'slabs/draft']
});
```

### Custom Error Handling

Provide custom error handlers for graceful degradation:

```typescript
const renderer = new SlabsRenderer({
  onError: (block, error) => {
    // Log to monitoring service
    console.error('Render error:', { block, error });

    // Return fallback UI
    const div = document.createElement('div');
    div.className = 'render-error';
    div.innerHTML = `
      <p>Unable to display content</p>
      <small>Block type: ${block.type}</small>
    `;
    return div;
  },

  onUnknownBlock: (block) => {
    // Handle deprecated or missing blocks
    const div = document.createElement('div');
    div.className = 'unknown-block';
    div.textContent = `Content unavailable (${block.type})`;
    return div;
  }
});
```

### Server-Side Rendering

Generate HTML on the server for better SEO and performance:

```typescript
// Express.js example
app.get('/articles/:id', async (req, res) => {
  const article = await db.articles.findById(req.params.id);
  const renderer = new SlabsRenderer();

  const contentHtml = await renderer.renderToString(article.content);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${article.title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <article class="article">
          <h1>${article.title}</h1>
          <div class="content">
            ${contentHtml}
          </div>
        </article>
      </body>
    </html>
  `);
});
```

### Progressive Enhancement

Render basic HTML on server, enhance with interactivity on client:

```typescript
// server.js - SSR
const renderer = new SlabsRenderer();
const staticHtml = await renderer.renderToString(data);

// client.js - Hydration
const renderer = new SlabsRenderer();
const interactive = await renderer.render(data, {
  mode: 'interactive'
});
```

### Custom Styling

Style rendered content with CSS:

```typescript
const renderer = new SlabsRenderer({
  containerClass: 'article-content'
});

const element = await renderer.render(data, {
  className: 'dark-theme large-text'
});
```

```css
/* Custom styles */
.article-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-content.dark-theme {
  background: #1a1a1a;
  color: #ffffff;
}

.article-content.large-text {
  font-size: 1.25rem;
}
```

## Data Structure

### Editor.js Data Format

```typescript
interface EditorJSData {
  time?: number;      // Creation timestamp
  blocks: Array<{
    id?: string;      // Block ID
    type: string;     // Block type (e.g., 'slabs/simple-text')
    data: any;        // Block-specific data
  }>;
  version?: string;   // Editor.js version
}
```

**Example:**

```typescript
const editorData = {
  time: 1635603431943,
  blocks: [
    {
      id: 'block1',
      type: 'slabs/simple-text',
      data: {
        content: 'This is a paragraph of text.'
      }
    },
    {
      id: 'block2',
      type: 'slabs/hero',
      data: {
        title: 'Welcome to Our Site',
        subtitle: 'Discover amazing content',
        image: {
          url: '/images/hero.jpg',
          alt: 'Hero image'
        }
      }
    },
    {
      id: 'block3',
      type: 'slabs/image',
      data: {
        url: '/images/photo.jpg',
        caption: 'A beautiful photo',
        alt: 'Photo description'
      }
    }
  ],
  version: '2.28.0'
};
```

## Error Handling

The renderer provides built-in error handling with customizable fallbacks:

**Unknown Blocks:**

When a block type is not registered, the renderer displays a fallback UI:

```html
<div class="slabs-unknown-block">
  <p>Unknown block type: slabs/missing-block</p>
  <!-- Debug info in development mode -->
</div>
```

**Render Errors:**

When a render function throws an error:

```html
<div class="slabs-error-block">
  <p>Error rendering block: slabs/problematic-block</p>
</div>
```

**Custom Handling:**

Override default behavior with custom handlers:

```typescript
const renderer = new SlabsRenderer({
  onError: (block, error) => {
    // Send to error tracking
    trackError({ block, error });

    // Return user-friendly message
    const div = document.createElement('div');
    div.textContent = 'This content is temporarily unavailable';
    return div;
  }
});
```

## Development vs Production

The renderer behaves differently in development and production:

**Development Mode:**
- Logs initialization and errors to console
- Shows debug information in fallback blocks
- Includes block data in unknown block placeholders

**Production Mode:**
- Silent initialization
- Minimal error output
- Clean fallback UI without debug info

Mode is determined by `import.meta.env.DEV` (Vite environment variable).

## Bundle Size Comparison

| Package | Size | Use Case |
|---------|------|----------|
| Editor.js + Blocks | ~100KB | Editor interface (admin) |
| @slabs/renderer | ~3KB | Display only (public) |

Use `@slabs/client` for editing interfaces and `@slabs/renderer` for displaying saved content on public pages.

## TypeScript Support

Full TypeScript support with type definitions included:

```typescript
import { SlabsRenderer, type RendererOptions, type RenderContext } from '@slabs/renderer';

const options: RendererOptions = {
  containerClass: 'content',
  exclude: ['internal-block']
};

const context: RenderContext = {
  theme: 'dark',
  locale: 'en-US'
};

const renderer = new SlabsRenderer(options);
const element = await renderer.render(data, context);
```

## License

MIT
