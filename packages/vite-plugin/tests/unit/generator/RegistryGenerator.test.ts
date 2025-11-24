import { describe, it, expect, beforeEach } from 'vitest';
import { RegistryGenerator } from '../../../src/domain/generator/RegistryGenerator';
import type { BlockDefinition } from '../../../src/domain/types';

describe('RegistryGenerator', () => {
  let generator: RegistryGenerator;

  beforeEach(() => {
    generator = new RegistryGenerator();
  });

  describe('generateModule', () => {
    it('should generate complete virtual module code', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/simple-text',
          path: '/blocks/simple-text',
          meta: {
            name: 'slabs/simple-text',
            title: 'Simple Text',
            category: 'text',
            version: '1.0.0'
          },
          files: {
            editPath: '/blocks/simple-text/edit.js',
            savePath: '/blocks/simple-text/save.js',
            renderPath: '/blocks/simple-text/render.js',
            previewPath: '/blocks/simple-text/preview.png'
          }
        }
      ];

      const code = generator.generateModule(blocks);

      // Should contain imports
      expect(code).toContain('import { render as slabsSimpleTextEdit }');
      expect(code).toContain('import { save as slabsSimpleTextSave }');
      expect(code).toContain('import { render as slabsSimpleTextRender }');
      expect(code).toContain('import slabsSimpleTextPreview');

      // Should contain exports
      expect(code).toContain("export const blocks = {");
      expect(code).toContain("'slabs/simple-text': {");

      // Should contain metadata
      expect(code).toContain('export const metadata = {');
      expect(code).toContain('totalBlocks: 1');
    });

    it('should handle blocks without preview images', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/no-preview',
          path: '/blocks/no-preview',
          meta: {
            name: 'slabs/no-preview',
            title: 'No Preview'
          },
          files: {
            editPath: '/blocks/no-preview/edit.js',
            savePath: '/blocks/no-preview/save.js',
            renderPath: '/blocks/no-preview/render.js'
          }
        }
      ];

      const code = generator.generateModule(blocks);

      // Should not import preview variable
      expect(code).not.toContain('slabsNoPreviewPreview');

      // Should still have all required imports
      expect(code).toContain('import { render as slabsNoPreviewEdit }');
      expect(code).toContain('import { save as slabsNoPreviewSave }');
      expect(code).toContain('import { render as slabsNoPreviewRender }');
    });

    it('should generate empty module for no blocks', () => {
      const blocks: BlockDefinition[] = [];

      const code = generator.generateModule(blocks);

      expect(code).toContain('export const blocks = {\n\n};');
      expect(code).toContain('totalBlocks: 0');
    });

    it('should handle multiple blocks', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/block-1',
          path: '/blocks/block-1',
          meta: { name: 'slabs/block-1', title: 'Block 1' },
          files: {
            editPath: '/blocks/block-1/edit.js',
            savePath: '/blocks/block-1/save.js',
            renderPath: '/blocks/block-1/render.js'
          }
        },
        {
          name: 'slabs/block-2',
          path: '/blocks/block-2',
          meta: { name: 'slabs/block-2', title: 'Block 2' },
          files: {
            editPath: '/blocks/block-2/edit.js',
            savePath: '/blocks/block-2/save.js',
            renderPath: '/blocks/block-2/render.js'
          }
        }
      ];

      const code = generator.generateModule(blocks);

      expect(code).toContain('slabsBlock1Edit');
      expect(code).toContain('slabsBlock2Edit');
      expect(code).toContain("'slabs/block-1': {");
      expect(code).toContain("'slabs/block-2': {");
      expect(code).toContain('totalBlocks: 2');
    });
  });

  describe('generateImports', () => {
    it('should generate import statements for all block files', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/test-block',
          path: '/blocks/test-block',
          meta: { name: 'slabs/test-block', title: 'Test Block' },
          files: {
            editPath: '/blocks/test-block/edit.js',
            savePath: '/blocks/test-block/save.js',
            renderPath: '/blocks/test-block/render.js',
            previewPath: '/blocks/test-block/preview.png'
          }
        }
      ];

      const imports = generator.generateImports(blocks);

      expect(imports).toContain("import { render as slabsTestBlockEdit } from '/blocks/test-block/edit.js';");
      expect(imports).toContain("import { save as slabsTestBlockSave } from '/blocks/test-block/save.js';");
      expect(imports).toContain("import { render as slabsTestBlockRender } from '/blocks/test-block/render.js';");
      expect(imports).toContain("import slabsTestBlockPreview from '/blocks/test-block/preview.png';");
    });

    it('should include style imports when present', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/styled-block',
          path: '/blocks/styled-block',
          meta: { name: 'slabs/styled-block', title: 'Styled Block' },
          files: {
            editPath: '/blocks/styled-block/edit.js',
            savePath: '/blocks/styled-block/save.js',
            renderPath: '/blocks/styled-block/render.js',
            stylePath: '/blocks/styled-block/style.css'
          }
        }
      ];

      const imports = generator.generateImports(blocks);

      expect(imports).toContain("import '/blocks/styled-block/style.css';");
    });
  });

  describe('generateExports', () => {
    it('should generate exports object with block metadata', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/hero',
          path: '/blocks/hero',
          meta: {
            name: 'slabs/hero',
            title: 'Hero Section',
            category: 'design',
            description: 'A hero section block',
            version: '1.0.0'
          },
          files: {
            editPath: '/blocks/hero/edit.js',
            savePath: '/blocks/hero/save.js',
            renderPath: '/blocks/hero/render.js'
          }
        }
      ];

      const exports = generator.generateExports(blocks);

      expect(exports).toContain("'slabs/hero': {");
      expect(exports).toContain('edit: slabsHeroEdit,');
      expect(exports).toContain('save: slabsHeroSave,');
      expect(exports).toContain('render: slabsHeroRender,');
      expect(exports).toContain('"title": "Hero Section"');
      expect(exports).toContain('"category": "design"');
    });
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct block count', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/block-1',
          path: '/blocks/block-1',
          meta: { name: 'slabs/block-1', title: 'Block 1' },
          files: {
            editPath: '/blocks/block-1/edit.js',
            savePath: '/blocks/block-1/save.js',
            renderPath: '/blocks/block-1/render.js'
          }
        },
        {
          name: 'slabs/block-2',
          path: '/blocks/block-2',
          meta: { name: 'slabs/block-2', title: 'Block 2' },
          files: {
            editPath: '/blocks/block-2/edit.js',
            savePath: '/blocks/block-2/save.js',
            renderPath: '/blocks/block-2/render.js'
          }
        },
        {
          name: 'slabs/block-3',
          path: '/blocks/block-3',
          meta: { name: 'slabs/block-3', title: 'Block 3' },
          files: {
            editPath: '/blocks/block-3/edit.js',
            savePath: '/blocks/block-3/save.js',
            renderPath: '/blocks/block-3/render.js'
          }
        }
      ];

      const metadata = generator.generateMetadata(blocks);

      expect(metadata).toContain('totalBlocks: 3');
      expect(metadata).toContain("version: '1.0.0'");
      expect(metadata).toContain('generatedAt:');
    });

    it('should include ISO timestamp', () => {
      const blocks: BlockDefinition[] = [];
      const metadata = generator.generateMetadata(blocks);

      // Check that it contains a valid ISO date
      const isoDateRegex = /generatedAt: '\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z'/;
      expect(metadata).toMatch(isoDateRegex);
    });
  });

  describe('generateTypes', () => {
    it('should generate TypeScript declarations', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/text',
          path: '/blocks/text',
          meta: { name: 'slabs/text', title: 'Text' },
          files: {
            editPath: '/blocks/text/edit.js',
            savePath: '/blocks/text/save.js',
            renderPath: '/blocks/text/render.js'
          }
        }
      ];

      const types = generator.generateTypes(blocks);

      expect(types).toContain("declare module 'virtual:slabs-registry'");
      expect(types).toContain('export interface BlockDefinition');
      expect(types).toContain('export interface BlockMetadata');
      expect(types).toContain("export const blocks: Record<'slabs/text', BlockDefinition>");
    });

    it('should handle multiple block names in type union', () => {
      const blocks: BlockDefinition[] = [
        {
          name: 'slabs/block-1',
          path: '/blocks/block-1',
          meta: { name: 'slabs/block-1', title: 'Block 1' },
          files: {
            editPath: '/blocks/block-1/edit.js',
            savePath: '/blocks/block-1/save.js',
            renderPath: '/blocks/block-1/render.js'
          }
        },
        {
          name: 'slabs/block-2',
          path: '/blocks/block-2',
          meta: { name: 'slabs/block-2', title: 'Block 2' },
          files: {
            editPath: '/blocks/block-2/edit.js',
            savePath: '/blocks/block-2/save.js',
            renderPath: '/blocks/block-2/render.js'
          }
        }
      ];

      const types = generator.generateTypes(blocks);

      expect(types).toContain("'slabs/block-1' | 'slabs/block-2'");
    });
  });
});
