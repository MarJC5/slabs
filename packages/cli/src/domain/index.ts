// Value Objects
export { BlockName } from './value-objects/BlockName';
export { Category } from './value-objects/Category';
export { FieldType } from './value-objects/FieldType';
export { Icon } from './value-objects/Icon';

// Entities
export { Block } from './entities/Block';
export { Field } from './entities/Field';

// Domain Services
export { BlockValidator, type ValidationResult } from './services/BlockValidator';

// Repository Interfaces (Ports)
export { type IBlockRepository } from './repositories/IBlockRepository';
