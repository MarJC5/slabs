import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileSystemBlockRepository } from '../../../../src/infrastructure/repositories/FileSystemBlockRepository';
import { Block } from '../../../../src/domain/entities/Block';
import { Field } from '../../../../src/domain/entities/Field';
import { BlockName } from '../../../../src/domain/value-objects/BlockName';
import { Category } from '../../../../src/domain/value-objects/Category';
import { Icon } from '../../../../src/domain/value-objects/Icon';
import { FieldType } from '../../../../src/domain/value-objects/FieldType';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

describe('FileSystemBlockRepository', () => {
  let repository: FileSystemBlockRepository;
  const testDir = path.join(process.cwd(), 'test-blocks');

  beforeEach(() => {
    repository = new FileSystemBlockRepository();
  });

  afterEach(async () => {
    // Cleanup test directory
    if (existsSync(testDir)) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  describe('save', () => {
    it('should create block directory with all files', async () => {
      const block = new Block({
        name: new BlockName('test-block'),
        title: 'Test Block',
        description: 'A test block',
        category: new Category('content'),
        icon: new Icon('Code'),
        fields: [
          new Field({
            name: 'title',
            type: new FieldType('text'),
            label: 'Title',
            required: true
          })
        ]
      });

      await repository.save(block, testDir);

      const blockDir = path.join(testDir, 'test-block');
      expect(existsSync(blockDir)).toBe(true);
      expect(existsSync(path.join(blockDir, 'block.json'))).toBe(true);
      expect(existsSync(path.join(blockDir, 'edit.ts'))).toBe(true);
      expect(existsSync(path.join(blockDir, 'save.ts'))).toBe(true);
      expect(existsSync(path.join(blockDir, 'render.ts'))).toBe(true);
      expect(existsSync(path.join(blockDir, 'style.css'))).toBe(true);
    });

    it('should generate valid block.json', async () => {
      const block = new Block({
        name: new BlockName('hero'),
        title: 'Hero Section',
        description: 'A hero section',
        category: new Category('content'),
        icon: new Icon('Picture'),
        fields: [
          new Field({
            name: 'title',
            type: new FieldType('text'),
            label: 'Title',
            required: true
          }),
          new Field({
            name: 'subtitle',
            type: new FieldType('text'),
            label: 'Subtitle'
          })
        ],
        collapsible: false
      });

      await repository.save(block, testDir);

      const blockJsonPath = path.join(testDir, 'hero', 'block.json');
      const content = await fs.readFile(blockJsonPath, 'utf-8');
      const json = JSON.parse(content);

      expect(json.name).toBe('slabs/hero');
      expect(json.title).toBe('Hero Section');
      expect(json.description).toBe('A hero section');
      expect(json.category).toBe('content');
      expect(json.icon).toBe('Picture');
      expect(json.collapsible).toBe(false);
      expect(json.fields.title.type).toBe('text');
      expect(json.fields.title.required).toBe(true);
      expect(json.fields.subtitle.type).toBe('text');
    });

    it('should generate valid TypeScript files', async () => {
      const block = new Block({
        name: new BlockName('card'),
        title: 'Card',
        description: 'A card block',
        category: new Category('content'),
        icon: new Icon('FileText'),
        fields: [
          new Field({
            name: 'content',
            type: new FieldType('wysiwyg'),
            label: 'Content'
          })
        ]
      });

      await repository.save(block, testDir);

      const editTs = await fs.readFile(path.join(testDir, 'card', 'edit.ts'), 'utf-8');
      const saveTs = await fs.readFile(path.join(testDir, 'card', 'save.ts'), 'utf-8');
      const renderTs = await fs.readFile(path.join(testDir, 'card', 'render.ts'), 'utf-8');

      expect(editTs).toContain('import { renderBlockEditor }');
      expect(editTs).toContain("title: context.config?.title || 'Card'");
      expect(saveTs).toContain('import { extractFieldData }');
      expect(renderTs).toContain('export function render(data: any)');
    });

    it('should throw error if block directory already exists', async () => {
      const block = new Block({
        name: new BlockName('existing'),
        title: 'Existing',
        description: 'Already exists',
        category: new Category('content'),
        icon: new Icon('Code'),
        fields: [
          new Field({
            name: 'test',
            type: new FieldType('text'),
            label: 'Test'
          })
        ]
      });

      // Create first time
      await repository.save(block, testDir);

      // Try to create again
      await expect(repository.save(block, testDir)).rejects.toThrow();
    });
  });

  describe('exists', () => {
    it('should return true for existing block', async () => {
      const blockName = new BlockName('test-block');
      const block = new Block({
        name: blockName,
        title: 'Test',
        description: 'Test',
        category: new Category('content'),
        icon: new Icon('Code'),
        fields: [
          new Field({
            name: 'test',
            type: new FieldType('text'),
            label: 'Test'
          })
        ]
      });

      await repository.save(block, testDir);

      const exists = await repository.exists(blockName, testDir);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent block', async () => {
      const blockName = new BlockName('nonexistent');

      const exists = await repository.exists(blockName, testDir);
      expect(exists).toBe(false);
    });
  });

  describe('findByName', () => {
    it('should return null for non-existent block', async () => {
      const blockName = new BlockName('nonexistent');

      const block = await repository.findByName(blockName, testDir);
      expect(block).toBeNull();
    });

    it('should return block for existing block', async () => {
      const blockName = new BlockName('hero');
      const block = new Block({
        name: blockName,
        title: 'Hero',
        description: 'Hero block',
        category: new Category('content'),
        icon: new Icon('Picture'),
        fields: [
          new Field({
            name: 'title',
            type: new FieldType('text'),
            label: 'Title'
          })
        ]
      });

      await repository.save(block, testDir);

      const foundBlock = await repository.findByName(blockName, testDir);
      expect(foundBlock).not.toBeNull();
      expect(foundBlock?.getName().value).toBe('hero');
      expect(foundBlock?.getTitle()).toBe('Hero');
    });
  });
});
