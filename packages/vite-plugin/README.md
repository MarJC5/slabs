# @slabs/vite-plugin

Vite plugin for automatic block discovery and registration with Slabs.

## Overview

The Vite plugin scans your blocks directory, validates block structure, and generates a virtual module that can be imported by `@slabs/client` and `@slabs/renderer`. It provides automatic block discovery, hot module replacement, and comprehensive validation during development and build time.

## Installation

```bash
npm install @slabs/vite-plugin -D
# or
pnpm add @slabs/vite-plugin -D
```

## Key Features

- Automatic block discovery via filesystem scanning
- Virtual module generation for runtime imports
- Comprehensive block validation with Zod
- Hot Module Replacement (HMR) in development
- Type-safe configuration
- Strict mode for production builds
- Custom validation handlers

## Basic Usage

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

Then import the virtual module in your code:

```typescript
// In @slabs/client or @slabs/renderer
import { blocks, metadata } from 'virtual:slabs-registry';

console.log(`Loaded ${Object.keys(blocks).length} blocks`);
```

## Configuration

### SlabsPluginOptions

```typescript
interface SlabsPluginOptions {
  blocksDir: string;              // Path to blocks directory (required)
  watch?: boolean;                // Enable file watching (default: true in dev)
  scanOptions?: ScanOptions;      // Block scanning configuration
  validation?: ValidationOptions; // Validation configuration
  assets?: AssetOptions;          // Asset optimization options
  cache?: CacheOptions;           // Caching configuration
  autoInstallDeps?: boolean;      // Auto-install block dependencies
  namespace?: string;             // Namespace for monorepo support
  onValidation?: (results: ValidationResult[]) => void;  // Custom handler
}
```

### Basic Configuration

```typescript
slabsPlugin({
  blocksDir: './blocks',
  watch: true,
  validation: {
    strict: false,
    warnings: true
  }
})
```

### Validation Options

```typescript
interface ValidationOptions {
  strict?: boolean;           // Fail build on errors (default: false)
  warnings?: boolean;         // Show warnings (default: true)
  requirePreview?: boolean;   // Require preview.png (default: false)
}
```

**Example:**

```typescript
slabsPlugin({
  blocksDir: './blocks',
  validation: {
    strict: true,        // Fail build if validation errors
    warnings: true,      // Show validation warnings
    requirePreview: true // Require preview.png for all blocks
  }
})
```

### Scan Options

```typescript
interface ScanOptions {
  maxDepth?: number;      // Maximum directory depth (default: 2)
  ignore?: string[];      // Patterns to ignore
  extensions?: string[];  // File extensions to scan
}
```

**Example:**

```typescript
slabsPlugin({
  blocksDir: './blocks',
  scanOptions: {
    maxDepth: 3,
    ignore: ['**/*.test.ts', '**/draft/**'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
})
```

### Asset Options

```typescript
interface AssetOptions {
  preview?: {
    formats?: ('webp' | 'avif' | 'png' | 'jpg')[];
    sizes?: number[];
    quality?: number;
  };
  autoOptimize?: boolean;  // Auto-optimize during build
}
```

**Example:**

```typescript
slabsPlugin({
  blocksDir: './blocks',
  assets: {
    autoOptimize: true,
    preview: {
      formats: ['webp', 'png'],
      sizes: [128, 256, 512],
      quality: 85
    }
  }
})
```

### Cache Options

```typescript
interface CacheOptions {
  enabled?: boolean;      // Enable caching (default: true)
  cacheFile?: string;     // Cache file path (default: '.slabs-cache.json')
}
```

**Example:**

```typescript
slabsPlugin({
  blocksDir: './blocks',
  cache: {
    enabled: true,
    cacheFile: '.cache/slabs.json'
  }
})
```

## Advanced Usage

### Custom Validation Handler

Implement custom logic when blocks are validated:

```typescript
slabsPlugin({
  blocksDir: './blocks',
  onValidation: (results) => {
    const errors = results.filter(r => !r.valid);
    const warnings = results.flatMap(r => r.warnings);

    // Log to monitoring service
    if (errors.length > 0) {
      console.error(`Found ${errors.length} invalid blocks`);
      errors.forEach(result => {
        result.errors.forEach(error => {
          trackError({
            block: result.block?.name,
            error: error.message
          });
        });
      });
    }

    // Generate validation report
    if (warnings.length > 0) {
      fs.writeFileSync(
        'validation-report.json',
        JSON.stringify({ errors, warnings }, null, 2)
      );
    }
  }
})
```

### Monorepo Support

Use namespaces to organize blocks in monorepos:

```typescript
// apps/web/vite.config.ts
slabsPlugin({
  blocksDir: '../../packages/blocks',
  namespace: 'web'
})

// apps/admin/vite.config.ts
slabsPlugin({
  blocksDir: '../../packages/blocks',
  namespace: 'admin'
})
```

### Conditional Block Loading

Load different blocks for different environments:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { slabsPlugin } from '@slabs/vite-plugin';

export default defineConfig(({ mode }) => ({
  plugins: [
    slabsPlugin({
      blocksDir: mode === 'production' ? './blocks' : './blocks-dev',
      validation: {
        strict: mode === 'production'
      }
    })
  ]
}));
```

### Auto-Install Dependencies

Automatically install block dependencies during development:

```typescript
slabsPlugin({
  blocksDir: './blocks',
  autoInstallDeps: true  // Auto-install dependencies from block.json
})
```

**Note:** This requires block dependencies to be specified in `block.json`:

```json
{
  "name": "slabs/chart",
  "title": "Chart Block",
  "dependencies": {
    "chart.js": "^4.0.0"
  }
}
```

### Multiple Block Directories

Scan multiple directories by using multiple plugin instances:

```typescript
export default defineConfig({
  plugins: [
    slabsPlugin({
      blocksDir: './blocks/core',
      namespace: 'core'
    }),
    slabsPlugin({
      blocksDir: './blocks/custom',
      namespace: 'custom'
    })
  ]
});
```

## Virtual Module

The plugin generates a virtual module that exports block definitions:

```typescript
declare module 'virtual:slabs-registry' {
  export const blocks: Record<string, BlockDefinition>;
  export const metadata: {
    version: string;
    timestamp: number;
    totalBlocks: number;
    environment: 'development' | 'production';
  };
}
```

**Usage:**

```typescript
import { blocks, metadata } from 'virtual:slabs-registry';

// Access all blocks
Object.entries(blocks).forEach(([name, block]) => {
  console.log(`${name}: ${block.meta.title}`);
});

// Check registry info
console.log(`Registry v${metadata.version}`);
console.log(`Generated: ${new Date(metadata.timestamp)}`);
console.log(`Total blocks: ${metadata.totalBlocks}`);
```

## Block Validation

The plugin validates blocks using Zod schemas and ensures:

**Required Files:**
- `block.json` - Block metadata
- `edit.ts` (or `.js/.tsx/.jsx`) - Editable UI
- `save.ts` (or `.js/.tsx/.jsx`) - Data extraction
- `render.ts` (or `.js/.tsx/.jsx`) - Display rendering

**Optional Files:**
- `preview.png` - Toolbox thumbnail
- `style.css` - Block styles

**Validation Checks:**
- Valid `block.json` structure
- Required fields present (name, title)
- Valid block name format
- All required files exist
- TypeScript/JavaScript syntax validation
- Dependency compatibility

**Validation Errors:**

```
[Slabs] Found 3 blocks
  ✓ slabs/simple-text (Simple Text)
  ✗ slabs/hero - 2 error(s)
    - Missing required file: edit.ts
    - Invalid block.json: Missing required field "title"
  ✓ slabs/image (Image Block)
[Slabs] Found 1 invalid block(s). Run with validation.strict: true to fail the build.
```

**Strict Mode:**

In production, enable strict mode to fail builds on validation errors:

```typescript
slabsPlugin({
  blocksDir: './blocks',
  validation: {
    strict: process.env.NODE_ENV === 'production'
  }
})
```

## Hot Module Replacement

The plugin provides HMR during development:

**File Watching:**

The plugin watches the blocks directory and triggers HMR when:
- Block files are modified (`edit.ts`, `save.ts`, `render.ts`)
- `block.json` is updated
- New blocks are added
- Blocks are deleted

**HMR Behavior:**

```
[Slabs] File changed: blocks/hero/edit.ts
[Slabs] Scanning blocks...
[Slabs] Found 3 blocks
  ✓ slabs/simple-text (Simple Text)
  ✓ slabs/hero (Hero Block)
  ✓ slabs/image (Image Block)
[Slabs] Generated virtual module with 3 valid block(s)
[Slabs] Hot reload triggered
```

**Disable Watching:**

```typescript
slabsPlugin({
  blocksDir: './blocks',
  watch: false  // Disable file watching
})
```

## Performance

**Caching:**

The plugin caches block metadata to improve performance:

```typescript
// .slabs-cache.json (auto-generated)
{
  "version": "1.0.0",
  "timestamp": 1635603431943,
  "blocks": {
    "slabs/simple-text": {
      "hash": "abc123...",
      "meta": { ... }
    }
  }
}
```

Cache is invalidated when:
- Block files change
- `block.json` is modified
- Plugin options change

**Build Performance:**

```
[Slabs] Scanning blocks...
[Slabs] Found 25 blocks
[Slabs] Generated virtual module with 25 valid block(s)
Build time: ~150ms (cached)
```

Without cache: ~500ms
With cache: ~150ms

## TypeScript Support

Add type definitions for the virtual module:

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

declare module 'virtual:slabs-registry' {
  import type { BlockDefinition } from '@slabs/vite-plugin';

  export const blocks: Record<string, BlockDefinition>;
  export const metadata: {
    version: string;
    timestamp: number;
    totalBlocks: number;
    environment: 'development' | 'production';
  };
}
```

## Exported APIs

For advanced usage, the plugin exports core domain components:

```typescript
import {
  BlockScanner,
  BlockLoader,
  BlockValidator,
  RegistryGenerator
} from '@slabs/vite-plugin';

// Scan blocks manually
const scanner = new BlockScanner();
const blocks = await scanner.scanBlocks('./blocks');

// Validate a block
const validator = new BlockValidator();
const result = await validator.validate('./blocks/hero');

// Generate registry code
const generator = new RegistryGenerator();
const code = generator.generateModule(blocks);
```

## Block Structure

The plugin expects blocks to follow this structure:

```
blocks/
├── SimpleText/
│   ├── block.json       # Required
│   ├── edit.ts          # Required
│   ├── save.ts          # Required
│   ├── render.ts        # Required
│   ├── preview.png      # Optional
│   └── style.css        # Optional
├── Hero/
│   ├── block.json
│   ├── edit.ts
│   ├── save.ts
│   ├── render.ts
│   └── preview.png
└── Image/
    ├── block.json
    ├── edit.ts
    ├── save.ts
    └── render.ts
```

**block.json Schema:**

```json
{
  "name": "slabs/simple-text",
  "title": "Simple Text",
  "category": "text",
  "description": "A simple text block",
  "icon": "Text",
  "version": "1.0.0",
  "keywords": ["text", "paragraph"],
  "fields": {
    "content": {
      "type": "textarea",
      "label": "Content"
    }
  }
}
```

## Error Handling

**Common Errors:**

**Missing blocks directory:**
```
Error: [Slabs] Blocks directory not found: /path/to/blocks
```

**Invalid block.json:**
```
Error: [Slabs] Invalid block.json in blocks/hero
  - Missing required field "title"
  - Invalid block name format
```

**Missing required files:**
```
Error: [Slabs] Missing required files in blocks/hero
  - edit.ts not found
  - save.ts not found
```

**Solutions:**

1. Verify `blocksDir` path in config
2. Check `block.json` structure
3. Ensure all required files exist
4. Enable `validation.warnings` to see suggestions

## Migration Guide

### From Manual Registration

**Before:**

```typescript
// manual-blocks.ts
export const blocks = {
  'my-block': {
    edit: () => { ... },
    save: () => { ... },
    render: () => { ... }
  }
};
```

**After:**

```typescript
// vite.config.ts
slabsPlugin({
  blocksDir: './blocks'
})

// Use virtual module
import { blocks } from 'virtual:slabs-registry';
```

### From Other Build Tools

If migrating from Webpack or other bundlers:

1. Install `@slabs/vite-plugin`
2. Create `vite.config.ts` with plugin
3. Update imports to use `virtual:slabs-registry`
4. Remove old build configuration

## Troubleshooting

**Blocks not found:**

Check that `blocksDir` is relative to Vite root:

```typescript
slabsPlugin({
  blocksDir: './blocks'  // Relative to vite.config.ts location
})
```

**HMR not working:**

Ensure watching is enabled:

```typescript
slabsPlugin({
  blocksDir: './blocks',
  watch: true  // Enable in development
})
```

**Type errors with virtual module:**

Add type declarations:

```typescript
// vite-env.d.ts
declare module 'virtual:slabs-registry' {
  export const blocks: Record<string, any>;
  export const metadata: any;
}
```

## License

MIT
