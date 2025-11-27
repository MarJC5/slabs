import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  treeshake: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  onSuccess: async () => {
    // Copy template files to dist
    const templates = [
      'block.json.hbs',
      'edit.ts.hbs',
      'save.ts.hbs',
      'render.ts.hbs',
      'style.css.hbs'
    ];

    mkdirSync('dist/infrastructure/templates', { recursive: true });

    templates.forEach(template => {
      copyFileSync(
        join('src/infrastructure/templates', template),
        join('dist/infrastructure/templates', template)
      );
    });

    console.log('✓ Copied template files to dist');
  }
});
