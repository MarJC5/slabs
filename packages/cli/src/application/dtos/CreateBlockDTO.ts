/**
 * Data Transfer Object for block creation.
 * Carries data from the interface layer to the application layer.
 */
export interface CreateBlockDTO {
  /**
   * Block name in kebab-case (e.g., "hero-section")
   */
  name: string;

  /**
   * Human-readable title (e.g., "Hero Section")
   */
  title: string;

  /**
   * Block description
   */
  description: string;

  /**
   * Category (content, media, design, widgets, theme, embed)
   */
  category: string;

  /**
   * Icon (emoji or CodexIcon name like "Picture")
   */
  icon: string;

  /**
   * Whether the block is collapsible in the editor
   * @default true
   */
  collapsible?: boolean;

  /**
   * Array of field configurations
   */
  fields: FieldConfigDTO[];

  /**
   * Target directory where the block should be created
   * @default "./blocks"
   */
  targetDirectory?: string;
}

/**
 * Field configuration within a block
 */
export interface FieldConfigDTO {
  /**
   * Field name in camelCase (e.g., "firstName")
   */
  name: string;

  /**
   * Field type (text, wysiwyg, select, checkbox, etc.)
   */
  type: string;

  /**
   * Human-readable label
   */
  label: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Default value
   */
  defaultValue?: any;

  /**
   * Additional options (for select, etc.)
   */
  options?: Record<string, any>;
}
