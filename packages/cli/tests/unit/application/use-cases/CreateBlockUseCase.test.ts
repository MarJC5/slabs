import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBlockUseCase } from '../../../../src/application/use-cases/CreateBlockUseCase';
import { CreateBlockDTO } from '../../../../src/application/dtos/CreateBlockDTO';
import { IBlockRepository } from '../../../../src/domain/repositories/IBlockRepository';
import { Block } from '../../../../src/domain/entities/Block';
import { BlockName } from '../../../../src/domain/value-objects/BlockName';

// Mock repository
class MockBlockRepository implements IBlockRepository {
  saveCalled = false;
  savedBlock: Block | null = null;
  savedPath: string | null = null;
  shouldThrowOnSave = false;
  existsResult = false;

  async save(block: Block, targetPath: string): Promise<void> {
    if (this.shouldThrowOnSave) {
      throw new Error('Block directory already exists');
    }
    this.saveCalled = true;
    this.savedBlock = block;
    this.savedPath = targetPath;
  }

  async exists(_name: BlockName, _targetPath: string): Promise<boolean> {
    return this.existsResult;
  }

  async findByName(_name: BlockName, _targetPath: string): Promise<Block | null> {
    return null;
  }
}

describe('CreateBlockUseCase', () => {
  let useCase: CreateBlockUseCase;
  let mockRepository: MockBlockRepository;

  beforeEach(() => {
    mockRepository = new MockBlockRepository();
    useCase = new CreateBlockUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create a block with valid data', async () => {
      const dto: CreateBlockDTO = {
        name: 'hero-section',
        title: 'Hero Section',
        description: 'A hero section block',
        category: 'content',
        icon: 'Picture',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            required: true
          }
        ]
      };

      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
      expect(mockRepository.saveCalled).toBe(true);
      expect(mockRepository.savedBlock).not.toBeNull();
      expect(mockRepository.savedBlock?.getName().value).toBe('hero-section');
    });

    it('should create a block with multiple fields', async () => {
      const dto: CreateBlockDTO = {
        name: 'card',
        title: 'Card',
        description: 'A card block',
        category: 'content',
        icon: 'FileText',
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title'
          },
          {
            name: 'content',
            type: 'wysiwyg',
            label: 'Content'
          },
          {
            name: 'image',
            type: 'image',
            label: 'Image'
          }
        ]
      };

      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
      expect(mockRepository.savedBlock?.getFields()).toHaveLength(3);
    });

    it('should use default target directory if not provided', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await useCase.execute(dto);

      expect(mockRepository.savedPath).toBe('./blocks');
    });

    it('should use provided target directory', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }],
        targetDirectory: '/custom/path/blocks'
      };

      await useCase.execute(dto);

      expect(mockRepository.savedPath).toBe('/custom/path/blocks');
    });

    it('should set collapsible to true by default', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await useCase.execute(dto);

      expect(mockRepository.savedBlock?.getCollapsible()).toBe(true);
    });

    it('should respect collapsible setting', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }],
        collapsible: false
      };

      await useCase.execute(dto);

      expect(mockRepository.savedBlock?.getCollapsible()).toBe(false);
    });

    it('should handle field with all properties', async () => {
      const dto: CreateBlockDTO = {
        name: 'form',
        title: 'Form',
        description: 'Form block',
        category: 'widgets',
        icon: 'Settings',
        fields: [
          {
            name: 'email',
            type: 'text',
            label: 'Email',
            required: true,
            placeholder: 'Enter email',
            defaultValue: 'user@example.com',
            options: { minLength: 5, maxLength: 100 }
          }
        ]
      };

      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
      const field = mockRepository.savedBlock?.getFields()[0];
      expect(field?.name).toBe('email');
      expect(field?.required).toBe(true);
      expect(field?.placeholder).toBe('Enter email');
      expect(field?.defaultValue).toBe('user@example.com');
    });

    it('should throw error for invalid block name', async () => {
      const dto: CreateBlockDTO = {
        name: 'Invalid Name!',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });

    it('should throw error for invalid category', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'invalid-category',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });

    it('should throw error for invalid icon', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: '',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });

    it('should throw error for invalid field type', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [
          {
            name: 'test',
            type: 'invalid-type',
            label: 'Test'
          }
        ]
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });

    it('should throw error for invalid field name', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [
          {
            name: 'Invalid-Name',
            type: 'text',
            label: 'Test'
          }
        ]
      };

      await expect(useCase.execute(dto)).rejects.toThrow();
    });

    it('should propagate repository errors', async () => {
      mockRepository.shouldThrowOnSave = true;

      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      await expect(useCase.execute(dto)).rejects.toThrow('Block directory already exists');
    });

    it('should return success false and error message on failure', async () => {
      mockRepository.shouldThrowOnSave = true;

      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [{ name: 'test', type: 'text', label: 'Test' }]
      };

      try {
        await useCase.execute(dto);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('domain validation', () => {
    it('should validate block with BlockValidator', async () => {
      const dto: CreateBlockDTO = {
        name: 'test-block',
        title: 'Test',
        description: 'Test',
        category: 'content',
        icon: 'Code',
        fields: [
          {
            name: 'field1',
            type: 'text',
            label: 'Field 1'
          }
        ]
      };

      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
    });
  });
});
