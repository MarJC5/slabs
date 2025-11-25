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
  ValidFieldType,
  ConditionalConfig,
  ConditionalOperator
} from './domain/types';

export { VALID_FIELD_TYPES } from './domain/types';

// Export field implementations
export { TextField } from './domain/fields/TextField';
export { TextareaField } from './domain/fields/TextareaField';
export { NumberField } from './domain/fields/NumberField';
export { EmailField } from './domain/fields/EmailField';
export { PasswordField } from './domain/fields/PasswordField';
export { LinkField } from './domain/fields/LinkField';
export { SelectField } from './domain/fields/SelectField';
export { CheckboxField } from './domain/fields/CheckboxField';
export { BooleanField } from './domain/fields/BooleanField';
export { RadioField } from './domain/fields/RadioField';
export { RangeField } from './domain/fields/RangeField';
export { ImageField } from './domain/fields/ImageField';
export { ColorField } from './domain/fields/ColorField';
export { DateField } from './domain/fields/DateField';
export { WysiwygField } from './domain/fields/WysiwygField';
export { RepeaterField } from './domain/fields/RepeaterField';
export { FlexibleField } from './domain/fields/FlexibleField';
export { GroupField } from './domain/fields/GroupField';
export { TabField } from './domain/fields/TabField';

// Export domain services
export { FieldRegistry } from './domain/FieldRegistry';
export { ConditionalEvaluator } from './domain/ConditionalEvaluator';

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
