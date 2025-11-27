import { describe, it, expect } from 'vitest';
import { BlockValidator } from '../../../../src/domain/services/BlockValidator';
import { Block } from '../../../../src/domain/entities/Block';
import { Field } from '../../../../src/domain/entities/Field';
import { BlockName } from '../../../../src/domain/value-objects/BlockName';
import { Category } from '../../../../src/domain/value-objects/Category';
import { Icon } from '../../../../src/domain/value-objects/Icon';
import { FieldType } from '../../../../src/domain/value-objects/FieldType';

describe('BlockValidator', () => {
  const validator = new BlockValidator();

  describe('validate', () => {
    it('should return valid result for block with fields and title', () => {
      const field = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title',
        required: true
      });

      const block = new Block({
        name: new BlockName('hero'),
        title: 'Hero Section',
        description: 'A hero section',
        category: new Category('content'),
        icon: new Icon('🎯'),
        fields: [field]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return invalid result for block without fields', () => {
      const block = new Block({
        name: new BlockName('empty'),
        title: 'Empty Block',
        description: 'Block without fields',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: []
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Block must have at least one field and a title');
    });

    it('should return invalid result for block without title', () => {
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

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Block must have at least one field and a title');
    });

    it('should return invalid result for block without fields and title', () => {
      const block = new Block({
        name: new BlockName('invalid'),
        title: '',
        description: 'Invalid block',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: []
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should return valid result for block with multiple fields', () => {
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

      const field3 = new Field({
        name: 'image',
        type: new FieldType('image'),
        label: 'Image'
      });

      const block = new Block({
        name: new BlockName('card'),
        title: 'Card',
        description: 'Card block',
        category: new Category('content'),
        icon: new Icon('📄'),
        fields: [field1, field2, field3]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect duplicate field names', () => {
      const field1 = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const field2 = new Field({
        name: 'title', // duplicate
        type: new FieldType('text'),
        label: 'Title 2'
      });

      const block = new Block({
        name: new BlockName('duplicate'),
        title: 'Duplicate Fields',
        description: 'Block with duplicate field names',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field1, field2]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Duplicate field name: title');
    });

    it('should detect multiple duplicate field names', () => {
      const field1 = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const field2 = new Field({
        name: 'title', // duplicate
        type: new FieldType('text'),
        label: 'Title 2'
      });

      const field3 = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content'
      });

      const field4 = new Field({
        name: 'content', // duplicate
        type: new FieldType('wysiwyg'),
        label: 'Content 2'
      });

      const block = new Block({
        name: new BlockName('multiple-duplicates'),
        title: 'Multiple Duplicates',
        description: 'Block with multiple duplicate field names',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field1, field2, field3, field4]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Duplicate field name: title');
      expect(result.errors).toContain('Duplicate field name: content');
      expect(result.errors).toHaveLength(2);
    });

    it('should allow fields with unique names', () => {
      const field1 = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const field2 = new Field({
        name: 'subtitle',
        type: new FieldType('text'),
        label: 'Subtitle'
      });

      const field3 = new Field({
        name: 'content',
        type: new FieldType('wysiwyg'),
        label: 'Content'
      });

      const block = new Block({
        name: new BlockName('unique-fields'),
        title: 'Unique Fields',
        description: 'Block with unique field names',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field1, field2, field3]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate select fields have options', () => {
      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category'
        // Missing options
      });

      const block = new Block({
        name: new BlockName('missing-options'),
        title: 'Missing Options',
        description: 'Select field without options',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [selectField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field "category" of type "select" requires options');
    });

    it('should validate select fields have choices in options', () => {
      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: {} // Empty options, no choices
      });

      const block = new Block({
        name: new BlockName('missing-choices'),
        title: 'Missing Choices',
        description: 'Select field without choices',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [selectField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field "category" of type "select" requires options.choices');
    });

    it('should validate select fields have non-empty choices array', () => {
      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: { choices: [] } // Empty choices array
      });

      const block = new Block({
        name: new BlockName('empty-choices'),
        title: 'Empty Choices',
        description: 'Select field with empty choices',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [selectField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field "category" of type "select" must have at least one choice');
    });

    it('should allow select fields with valid choices', () => {
      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: { choices: ['Option 1', 'Option 2', 'Option 3'] }
      });

      const block = new Block({
        name: new BlockName('valid-select'),
        title: 'Valid Select',
        description: 'Select field with valid choices',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [selectField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate multiple select fields', () => {
      const selectField1 = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category',
        options: { choices: ['A', 'B'] }
      });

      const selectField2 = new Field({
        name: 'status',
        type: new FieldType('select'),
        label: 'Status'
        // Missing options
      });

      const block = new Block({
        name: new BlockName('multiple-selects'),
        title: 'Multiple Selects',
        description: 'Multiple select fields',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [selectField1, selectField2]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Field "status" of type "select" requires options');
    });

    it('should allow non-select fields without options', () => {
      const textField = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
        // No options - this is fine for text fields
      });

      const numberField = new Field({
        name: 'price',
        type: new FieldType('number'),
        label: 'Price'
        // No options - this is fine for number fields
      });

      const block = new Block({
        name: new BlockName('non-select'),
        title: 'Non-Select Fields',
        description: 'Non-select fields without options',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [textField, numberField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should accumulate all validation errors', () => {
      const field1 = new Field({
        name: 'title',
        type: new FieldType('text'),
        label: 'Title'
      });

      const field2 = new Field({
        name: 'title', // duplicate
        type: new FieldType('text'),
        label: 'Title 2'
      });

      const selectField = new Field({
        name: 'category',
        type: new FieldType('select'),
        label: 'Category'
        // Missing options
      });

      const block = new Block({
        name: new BlockName('all-errors'),
        title: '', // Empty title
        description: 'Block with all errors',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field1, field2, selectField]
      });

      const result = validator.validate(block);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Block must have at least one field and a title');
      expect(result.errors).toContain('Duplicate field name: title');
      expect(result.errors).toContain('Field "category" of type "select" requires options');
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('ValidationResult interface', () => {
    it('should return ValidationResult with isValid and errors', () => {
      const field = new Field({
        name: 'test',
        type: new FieldType('text'),
        label: 'Test'
      });

      const block = new Block({
        name: new BlockName('test'),
        title: 'Test',
        description: 'Test',
        category: new Category('content'),
        icon: new Icon('📦'),
        fields: [field]
      });

      const result = validator.validate(block);

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('errors');
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});
