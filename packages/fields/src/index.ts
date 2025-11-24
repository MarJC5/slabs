/**
 * @slabs/fields
 * ACF-like field system for Slabs
 */

// Auto-inject global styles on import
import './styles';

// Re-export style injection function for manual control
export { injectFieldStyles } from './styles';

// Export domain types
export type {
  FieldConfigData,
  ValidationError,
  ValidationResult,
  FieldType,
  ValidFieldType
} from './domain/types';

export { VALID_FIELD_TYPES } from './domain/types';

// Export field implementations
export { TextField } from './domain/fields/TextField';
export { TextareaField } from './domain/fields/TextareaField';
export { NumberField } from './domain/fields/NumberField';
export { SelectField } from './domain/fields/SelectField';
export { CheckboxField } from './domain/fields/CheckboxField';
export { RadioField } from './domain/fields/RadioField';
export { RangeField } from './domain/fields/RangeField';
export { ImageField } from './domain/fields/ImageField';
export { ColorField } from './domain/fields/ColorField';
export { DateField } from './domain/fields/DateField';

// Export domain services
export { FieldRegistry } from './domain/FieldRegistry';

// Export application services
export { FieldRenderer } from './application/FieldRenderer';
export { FieldValidator } from './application/FieldValidator';
export { FieldExtractor } from './application/FieldExtractor';
export type { RenderOptions } from './application/FieldRenderer';

// Export helper functions
export {
  renderFields,
  extractFieldData,
  validateFields,
  getDefaultRegistry,
  renderBlockEditor
} from './helpers';

export type { BlockEditorConfig } from './helpers';
