import { Block } from '../../domain/entities/Block';
import { Field } from '../../domain/entities/Field';
import { BlockName } from '../../domain/value-objects/BlockName';
import { Category } from '../../domain/value-objects/Category';
import { Icon } from '../../domain/value-objects/Icon';
import { FieldType } from '../../domain/value-objects/FieldType';
import { BlockValidator } from '../../domain/services/BlockValidator';
import { IBlockRepository } from '../../domain/repositories/IBlockRepository';
import { CreateBlockDTO } from '../dtos/CreateBlockDTO';
import { BlockConfigDTO } from '../dtos/BlockConfigDTO';

/**
 * Use case for creating a new block.
 * Orchestrates the creation of domain entities and persisting them via the repository.
 *
 * @example
 * ```typescript
 * const useCase = new CreateBlockUseCase(repository);
 * const result = await useCase.execute({
 *   name: 'hero-section',
 *   title: 'Hero Section',
 *   description: 'A hero section block',
 *   category: 'content',
 *   icon: 'Picture',
 *   fields: [...]
 * });
 * ```
 */
export class CreateBlockUseCase {
  private readonly repository: IBlockRepository;
  private readonly validator: BlockValidator;

  constructor(repository: IBlockRepository) {
    this.repository = repository;
    this.validator = new BlockValidator();
  }

  /**
   * Executes the create block use case.
   *
   * @param dto - Block creation data transfer object
   * @returns Block configuration result
   * @throws Error if validation fails or block already exists
   */
  async execute(dto: CreateBlockDTO): Promise<BlockConfigDTO> {
    try {
      // Create domain value objects (will throw if invalid)
      const blockName = new BlockName(dto.name);
      const category = new Category(dto.category);
      const icon = new Icon(dto.icon);

      // Create field entities
      const fields: Field[] = dto.fields.map(fieldDto => {
        const fieldType = new FieldType(fieldDto.type);
        return new Field({
          name: fieldDto.name,
          type: fieldType,
          label: fieldDto.label,
          required: fieldDto.required,
          placeholder: fieldDto.placeholder,
          defaultValue: fieldDto.defaultValue,
          options: fieldDto.options
        });
      });

      // Create block aggregate
      const block = new Block({
        name: blockName,
        title: dto.title,
        description: dto.description,
        category,
        icon,
        fields,
        collapsible: dto.collapsible ?? true
      });

      // Validate block using domain service
      const validationResult = this.validator.validate(block);
      if (!validationResult.isValid) {
        throw new Error(
          `Block validation failed: ${validationResult.errors.join(', ')}`
        );
      }

      // Persist via repository
      const targetPath = dto.targetDirectory ?? './blocks';
      await this.repository.save(block, targetPath);

      // Return success result
      return {
        blockName: dto.name,
        blockPath: `${targetPath}/${dto.name}`,
        createdFiles: [
          'block.json',
          'edit.ts',
          'save.ts',
          'render.ts',
          'style.css'
        ],
        success: true,
        message: `Block "${dto.name}" created successfully`
      };
    } catch (error) {
      // Re-throw domain/validation errors
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create block');
    }
  }
}
