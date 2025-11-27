import { describe, it, expect } from 'vitest';
import { Block } from '../../../../src/domain/entities/Block';
import { BlockName } from '../../../../src/domain/value-objects/BlockName';
import { Category } from '../../../../src/domain/value-objects/Category';
import { Icon } from '../../../../src/domain/value-objects/Icon';
import { Field } from '../../../../src/domain/entities/Field';
import { FieldType } from '../../../../src/domain/value-objects/FieldType';

describe('Block', () => {
  describe('constructor', () => {
    it('should create valid block with required properties', () => {
      const block = new Block({
        name: new BlockName('hero-section'),
        title: 'Hero Section',
        description: 'A hero section block',
        category: new Category('content'),
        icon: new Icon('🎯'),
        fields: []
      });

      expect(block.getName().value).toBe('hero-section');
      expect(block.getTitle()).toBe('Hero Section');
      expect(block.getDescription()).toBe('A hero section block');
      expect(block.getCategory().value).toBe('content');
      expect(block.getIcon().value).toBe('🎯');
      expect(block.getFields()).toEqual([]);
      expect(block.getCollapsible()).toBe(true); // default
    });

    it('should create block with fields', () => {
      const titleField = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title',
        required: true
      });

      const contentField = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content'
      });

      const block = new Block({
        name: new BlockName('card'),
        title: 'Card',
        description: 'A card block',
        category: new Category('content'),
        icon: new Icon('📄'),
        fields: [titleField, contentField]
      });

      expect(block.getFields()).toHaveLength(2);
      expect(block.getFields()[0]).toBe(titleField);
      expect(block.getFields()[1]).toBe(contentField);
    });

    it('should create block with collapsible false', () => {
      const block = new Block({
        name: new BlockName('alert'),
        title: 'Alert',
        description: 'Alert block',
        category: new Category('design'),
        icon: new Icon('⚠️'),
        fields: [],
        collapsible: false
      });

      expect(block.getCollapsible()).toBe(false);
    });

    it('should create block with collapsible true explicitly', () => {
      const block = new Block({
        name: new BlockName('section'),
        title: 'Section',
        description: 'Section block',
        category: new Category('design'),
        icon: new Icon('📦'),
        fields: [],
        collapsible: true
      });

      expect(block.getCollapsible()).toBe(true);
    });
  });

  describe('addField', () => {
    it('should add field and return new Block instance', () => {
      const block = new Block({
        name: new BlockName('form'),
        title: 'Form',
        description: 'Form block',
        category: new Category('widgets'),
        icon: new Icon('📝'),
        fields: []
      });

      const field = new Field({
        name: 'email',
        type: new FieldType('text'),
        label: 'Email'
      });

      const newBlock = block.addField(field);

      // Should return new instance
      expect(newBlock).not.toBe(block);

      // Original block should be unchanged
      expect(block.getFields()).toHaveLength(0);

      // New block should have the field
      expect(newBlock.getFields()).toHaveLength(1);
      expect(newBlock.getFields()[0]).toBe(field);
    });

    it('should add multiple fields sequentially', () => {
      const block = new Block({
        name: new BlockName('contact'),
        title: 'Contact',
        description: 'Contact block',
        category: new Category('widgets'),
        icon: new Icon('📧'),
        fields: []
      });

      const field1 = new Field({
        name: 'name',
        type: new FieldType('text'),
        label: 'Name'
      });

      const field2 = new Field({
        name: 'email',
        type: new FieldType('text'),
        label: 'Email'
      });

      const field3 = new Field({
        name: 'message',
        type: new FieldType('wysiwyg'),
        label: 'Message'
      });

      const block1 = block.addField(field1);
      const block2 = block1.addField(field2);
      const block3 = block2.addField(field3);

      expect(block3.getFields()).toHaveLength(3);
      expect(block3.getFields()[0]).toBe(field1);
      expect(block3.getFields()[1]).toBe(field2);
      expect(block3.getFields()[2]).toBe(field3);
    });

    it('should preserve other block properties when adding field', () => {
      const block = new Block({
        name: new BlockName('testimonial'),
        title: 'Testimonial',
        description: 'Testimonial block',
        category: new Category('content'),
        icon: new Icon('💬'),
        fields: [],
        collapsible: false
      });

      const field = new Field({
        name: 'quote',
        type: new FieldType('wysiwyg'),
        label: 'Quote'
      });

      const newBlock = block.addField(field);

      expect(newBlock.getName().value).toBe('testimonial');
      expect(newBlock.getTitle()).toBe('Testimonial');
      expect(newBlock.getDescription()).toBe('Testimonial block');
      expect(newBlock.getCategory().value).toBe('content');
      expect(newBlock.getIcon().value).toBe('💬');
      expect(newBlock.getCollapsible()).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return true for valid block with fields and title', () => {
      const field = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const block = new Block({
        name: new BlockName('hero'),
        title: 'Hero',
        description: 'Hero block',
        category: new Category('content'),
        icon: new Icon('🎯'),
        fields: [field]
      });

      expect(block.validate()).toBe(true);
    });

    it('should return false for block without fields', () => {
      const block = new Block({
        name: new BlockName('empty'),
        title: 'Empty Block',
        description: 'Empty block',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: []
      });

      expect(block.validate()).toBe(false);
    });

    it('should return false for block with empty title', () => {
      const field = new Field({
        name: 'content',
        type: new FieldType('text'),
        label: 'Content'
      });

      const block = new Block({
        name: new BlockName('untitled'),
        title: '',
        description: 'Block without title',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field]
      });

      expect(block.validate()).toBe(false);
    });

    it('should return false for block without fields and empty title', () => {
      const block = new Block({
        name: new BlockName('invalid'),
        title: '',
        description: 'Invalid block',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: []
      });

      expect(block.validate()).toBe(false);
    });

    it('should return true for block with multiple fields', () => {
      const field1 = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const field2 = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content'
      });

      const block = new Block({
        name: new BlockName('article'),
        title: 'Article',
        description: 'Article block',
        category: new Category('content'),
        icon: new Icon('📄'),
        fields: [field1, field2]
      });

      expect(block.validate()).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should convert block to JSON with minimal fields', () => {
      const block = new Block({
        name: new BlockName('simple'),
        title: 'Simple Block',
        description: 'A simple block',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: []
      });

      const json = block.toJSON();

      expect(json).toEqual({
        name: 'slabs/simple',
        title: 'Simple Block',
        description: 'A simple block',
        category: 'content',
        icon: '📦',
        collapsible: true,
        fields: {}
      });
    });

    it('should convert block with fields to JSON', () => {
      const titleField = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title',
        required: true
      });

      const contentField = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content',
        placeholder: 'Enter content here'
      });

      const block = new Block({
        name: new BlockName('card'),
        title: 'Card',
        description: 'Card block',
        category: new Category('content'),
        icon: new Icon('📄'),
        fields: [titleField, contentField],
        collapsible: false
      });

      const json = block.toJSON();

      expect(json).toEqual({
        name: 'slabs/card',
        title: 'Card',
        description: 'Card block',
        category: 'content',
        icon: '📄',
        collapsible: false,
        fields: {
          title: {
            type: 'text',
            label: 'Title',
            required: true
          },
          content: {
            type: 'wysiwyg',
            label: 'Content',
            required: false,
            placeholder: 'Enter content here'
          }
        }
      });
    });

    it('should use namespaced block name in JSON', () => {
      const block = new Block({
        name: new BlockName('my-block'),
        title: 'My Block',
        description: 'Description',
        category: new Category('content'),
        icon: new Icon('🎯'),
        fields: []
      });

      const json = block.toJSON();

      expect(json.name).toBe('slabs/my-block');
    });

    it('should convert multiple fields with different types', () => {
      const textField = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const numberField = new Field({
        name: 'price',
        type: new FieldType('number'),
        label: 'Price',
        defaultValue: 0
      });

      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: { choices: ['A', 'B', 'C'] }
      });

      const block = new Block({
        name: new BlockName('product'),
        title: 'Product',
        description: 'Product block',
        category: new Category('content'),
        icon: new Icon('🛍️'),
        fields: [textField, numberField, selectField]
      });

      const json = block.toJSON();

      expect(json.fields).toEqual({
        title: {
          type: 'text',
          label: 'Title',
          required: false
        },
        price: {
          type: 'number',
          label: 'Price',
          required: false,
          default: 0
        },
        category: {
          type: 'select',
          label: 'Category',
          required: false,
          choices: ['A', 'B', 'C']
        }
      });
    });
  });

  describe('getters', () => {
    it('should provide access to all properties via getters', () => {
      const field = new Field({
        name: 'content',
        type: new FieldType('text'),
        label: 'Content'
      });

      const blockName = new BlockName('test-block');
      const category = new Category('media');
      const icon = new Icon('🎨');

      const block = new Block({
        name: blockName,
        title: 'Test Block',
        description: 'A test block',
        category,
        icon,
        fields: [field],
        collapsible: false
      });

      expect(block.getName()).toBe(blockName);
      expect(block.getTitle()).toBe('Test Block');
      expect(block.getDescription()).toBe('A test block');
      expect(block.getCategory()).toBe(category);
      expect(block.getIcon()).toBe(icon);
      expect(block.getFields()).toEqual([field]);
      expect(block.getCollapsible()).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should not mutate original block when adding fields', () => {
      const originalBlock = new Block({
        name: new BlockName('immutable'),
        title: 'Immutable Block',
        description: 'Test immutability',
        category: new Category('content'),
        icon: new Icon('🔒'),
        fields: []
      });

      const field = new Field({
        name: 'test',
        type: new FieldType('text'),
        label: 'Test'
      });

      const newBlock = originalBlock.addField(field);

      expect(originalBlock.getFields()).toHaveLength(0);
      expect(newBlock.getFields()).toHaveLength(1);
      expect(originalBlock).not.toBe(newBlock);
    });

    it('should preserve field array immutability', () => {
      const field1 = new Field({
        name: 'field1',
        type: new FieldType('text'),
        label: 'Field 1'
      });

      const block = new Block({
        name: new BlockName('test'),
        title: 'Test',
        description: 'Test',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field1]
      });

      const fields = block.getFields();

      // Try to mutate the returned array (should not affect internal state)
      const field2 = new Field({
        name: 'field2',
        type: new FieldType('text'),
        label: 'Field 2'
      });

      fields.push(field2);

      // Original block should still have only 1 field
      expect(block.getFields()).toHaveLength(1);
    });
  });

  describe('integration with value objects', () => {
    it('should work with all category types', () => {
      const categories = Category.all();

      categories.forEach(cat => {
        const block = new Block({
          name: new BlockName('test-block'),
          title: 'Test',
          description: 'Test',
          category: new Category(cat),
          icon: new Icon('📦'),
          fields: []
        });

        expect(block.getCategory().value).toBe(cat);
      });
    });

    it('should work with all field types', () => {
      const fieldTypes = FieldType.all();

      fieldTypes.forEach((type, index) => {
        const field = new Field({
          name: `field${index}`,
          type: new FieldType(type),
          label: `Field ${index}`
        });

        const block = new Block({
          name: new BlockName('test-block'),
          title: 'Test',
          description: 'Test',
          category: new Category('content'),
          icon: new Icon('📦'),
          fields: [field]
        });

        expect(block.getFields()[0].type.value).toBe(type);
      });
    });
  });
});
