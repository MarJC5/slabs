/**
 * Tests for Slabs class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Slabs } from '../src/Slabs';

// Mock the virtual module
vi.mock('virtual:slabs-registry', () => ({
  blocks: {
    'slabs/simple-text': {
      meta: {
        name: 'slabs/simple-text',
        title: 'Simple Text',
        category: 'text' as const,
        description: 'A simple text block',
        version: '1.0.0',
        icon: '📝'
      },
      edit: vi.fn((context) => {
        const div = document.createElement('div');
        div.textContent = context.data?.content || '';
        return div;
      }),
      save: vi.fn((element) => ({
        content: element.textContent
      })),
      render: vi.fn((data) => {
        const div = document.createElement('div');
        div.textContent = data.content;
        return div;
      })
    },
    'slabs/hero-section': {
      meta: {
        name: 'slabs/hero-section',
        title: 'Hero Section',
        category: 'design' as const,
        description: 'A hero section',
        version: '1.0.0',
        icon: '🎯'
      },
      edit: vi.fn(() => document.createElement('div')),
      save: vi.fn(() => ({})),
      render: vi.fn(() => document.createElement('div'))
    },
    'slabs/deprecated-block': {
      meta: {
        name: 'slabs/deprecated-block',
        title: 'Deprecated Block',
        category: 'text' as const,
        version: '0.1.0'
      },
      edit: vi.fn(() => document.createElement('div')),
      save: vi.fn(() => ({})),
      render: vi.fn(() => document.createElement('div'))
    }
  },
  metadata: {
    version: '1.0.0',
    totalBlocks: 3,
    generatedAt: '2024-01-01T00:00:00.000Z'
  }
}));

describe('Slabs', () => {
  describe('constructor', () => {
    it('should initialize with all blocks by default', () => {
      const slabs = new Slabs();

      expect(slabs.getBlockCount()).toBe(3);
    });

    it('should filter blocks using include option', () => {
      const slabs = new Slabs({
        include: ['slabs/simple-text', 'slabs/hero-section']
      });

      expect(slabs.getBlockCount()).toBe(2);
      expect(slabs.getTool('slabs/simple-text')).toBeDefined();
      expect(slabs.getTool('slabs/hero-section')).toBeDefined();
      expect(slabs.getTool('slabs/deprecated-block')).toBeUndefined();
    });

    it('should filter blocks using exclude option', () => {
      const slabs = new Slabs({
        exclude: ['slabs/deprecated-block']
      });

      expect(slabs.getBlockCount()).toBe(2);
      expect(slabs.getTool('slabs/simple-text')).toBeDefined();
      expect(slabs.getTool('slabs/hero-section')).toBeDefined();
      expect(slabs.getTool('slabs/deprecated-block')).toBeUndefined();
    });

    it('should apply exclude before include', () => {
      const slabs = new Slabs({
        include: ['slabs/simple-text', 'slabs/deprecated-block'],
        exclude: ['slabs/deprecated-block']
      });

      expect(slabs.getBlockCount()).toBe(1);
      expect(slabs.getTool('slabs/simple-text')).toBeDefined();
      expect(slabs.getTool('slabs/deprecated-block')).toBeUndefined();
    });
  });

  describe('getTools', () => {
    it('should return all tools as object', () => {
      const slabs = new Slabs();
      const tools = slabs.getTools();

      expect(tools).toBeDefined();
      expect(typeof tools).toBe('object');
      expect(Object.keys(tools)).toHaveLength(3);
    });

    it('should return Tool classes', () => {
      const slabs = new Slabs();
      const tools = slabs.getTools();

      expect(typeof tools['slabs/simple-text']).toBe('function');
    });

    it('should include toolbox configuration', () => {
      const slabs = new Slabs();
      const tools = slabs.getTools();

      const SimpleTool = tools['slabs/simple-text'];
      expect(SimpleTool).toBeDefined();

      // @ts-ignore - accessing static property
      expect(SimpleTool.toolbox).toBeDefined();
      // @ts-ignore
      expect(SimpleTool.toolbox.title).toBe('Simple Text');
    });
  });

  describe('getTool', () => {
    it('should return specific tool by name', () => {
      const slabs = new Slabs();
      const tool = slabs.getTool('slabs/simple-text');

      expect(tool).toBeDefined();
      expect(typeof tool).toBe('function');
    });

    it('should return undefined for non-existent tool', () => {
      const slabs = new Slabs();
      const tool = slabs.getTool('slabs/non-existent');

      expect(tool).toBeUndefined();
    });

    it('should return undefined for excluded tool', () => {
      const slabs = new Slabs({
        exclude: ['slabs/simple-text']
      });
      const tool = slabs.getTool('slabs/simple-text');

      expect(tool).toBeUndefined();
    });
  });

  describe('getMetadata', () => {
    it('should return array of block metadata', () => {
      const slabs = new Slabs();
      const metadata = slabs.getMetadata();

      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata).toHaveLength(3);
    });

    it('should include correct metadata fields', () => {
      const slabs = new Slabs();
      const metadata = slabs.getMetadata();

      const simpleMeta = metadata.find(m => m.name === 'slabs/simple-text');
      expect(simpleMeta).toBeDefined();
      expect(simpleMeta?.title).toBe('Simple Text');
      expect(simpleMeta?.category).toBe('text');
      expect(simpleMeta?.description).toBe('A simple text block');
      expect(simpleMeta?.version).toBe('1.0.0');
    });

    it('should respect include filter', () => {
      const slabs = new Slabs({
        include: ['slabs/simple-text']
      });
      const metadata = slabs.getMetadata();

      expect(metadata).toHaveLength(1);
      expect(metadata[0]?.name).toBe('slabs/simple-text');
    });

    it('should respect exclude filter', () => {
      const slabs = new Slabs({
        exclude: ['slabs/deprecated-block']
      });
      const metadata = slabs.getMetadata();

      expect(metadata).toHaveLength(2);
      expect(metadata.find(m => m.name === 'slabs/deprecated-block')).toBeUndefined();
    });
  });

  describe('getBlockCount', () => {
    it('should return correct count of loaded blocks', () => {
      const slabs = new Slabs();

      expect(slabs.getBlockCount()).toBe(3);
    });

    it('should return correct count after filtering', () => {
      const slabs = new Slabs({
        include: ['slabs/simple-text']
      });

      expect(slabs.getBlockCount()).toBe(1);
    });

    it('should return 0 when all blocks are excluded', () => {
      const slabs = new Slabs({
        exclude: ['slabs/simple-text', 'slabs/hero-section', 'slabs/deprecated-block']
      });

      expect(slabs.getBlockCount()).toBe(0);
    });
  });

  describe('getRegistryMetadata', () => {
    it('should return registry metadata', () => {
      const slabs = new Slabs();
      const meta = slabs.getRegistryMetadata();

      expect(meta).toBeDefined();
      expect(meta.version).toBe('1.0.0');
      expect(meta.totalBlocks).toBe(3);
      expect(meta.generatedAt).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('Tool integration', () => {
    it('should create functional Editor.js Tool instances', () => {
      const slabs = new Slabs();
      const SimpleTool = slabs.getTool('slabs/simple-text')!;

      // Create tool instance
      const tool = new SimpleTool({
        data: { content: 'Hello' },
        api: {},
        config: {},
        readOnly: false,
        block: {}
      });

      expect(tool).toBeDefined();
      expect(typeof tool.render).toBe('function');
      expect(typeof tool.save).toBe('function');
    });

    it('should render editable block', () => {
      const slabs = new Slabs();
      const SimpleTool = slabs.getTool('slabs/simple-text')!;

      const tool = new SimpleTool({
        data: { content: 'Test content' },
        api: {},
        config: {},
        readOnly: false,
        block: {}
      });

      const element = tool.render();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.textContent).toBe('Test content');
    });

    it('should save block data', () => {
      const slabs = new Slabs();
      const SimpleTool = slabs.getTool('slabs/simple-text')!;

      const tool = new SimpleTool({
        data: {},
        api: {},
        config: {},
        readOnly: false,
        block: {}
      });

      const element = document.createElement('div');
      element.textContent = 'Saved content';

      const data = tool.save(element);

      expect(data).toBeDefined();
      expect(data.content).toBe('Saved content');
    });
  });

  describe('custom toolbox configuration', () => {
    it('should use custom toolbox config', () => {
      const slabs = new Slabs({
        toolboxConfig: (block) => ({
          title: `Custom ${block.meta.title}`,
          icon: '⭐'
        })
      });

      const SimpleTool = slabs.getTool('slabs/simple-text')!;

      // @ts-ignore - accessing static property
      expect(SimpleTool.toolbox.title).toBe('Custom Simple Text');
      // @ts-ignore
      expect(SimpleTool.toolbox.icon).toBe('⭐');
    });
  });
});
