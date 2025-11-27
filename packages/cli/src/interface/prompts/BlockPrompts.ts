import { PromptAdapter } from '../../infrastructure/cli/PromptAdapter';
import { OutputAdapter } from '../../infrastructure/cli/OutputAdapter';
import { CreateBlockDTO, FieldConfigDTO } from '../../application/dtos/CreateBlockDTO';
import { Category } from '../../domain/value-objects/Category';
import { FieldType } from '../../domain/value-objects/FieldType';
import { BlockName } from '../../domain/value-objects/BlockName';

/**
 * Interactive prompts for block creation.
 * Orchestrates the CLI prompt flow for gathering block configuration.
 *
 * @example
 * ```typescript
 * const prompts = new BlockPrompts();
 * const dto = await prompts.promptForBlock();
 * ```
 */
export class BlockPrompts {
  private prompts: PromptAdapter;
  private output: OutputAdapter;

  constructor() {
    this.prompts = new PromptAdapter();
    this.output = new OutputAdapter();
  }

  /**
   * Prompts user for complete block configuration.
   *
   * @returns CreateBlockDTO with all block data
   */
  async promptForBlock(): Promise<CreateBlockDTO> {
    this.output.blank();
    this.output.bold('Create a new Slabs block');
    this.output.blank();

    // Block name
    const name = await this.prompts.input(
      'Block name (kebab-case)',
      undefined,
      (value) => {
        try {
          new BlockName(value);
          return true;
        } catch (error) {
          return error instanceof Error ? error.message : 'Invalid block name';
        }
      }
    );

    // Title
    const title = await this.prompts.input('Block title', this.toTitleCase(name));

    // Description
    const description = await this.prompts.input('Description', `A ${title.toLowerCase()} block`);

    // Category
    const category = await this.prompts.select(
      'Category',
      Category.all()
    );

    // Icon
    const icon = await this.promptForIcon(category);

    // Collapsible
    const collapsible = await this.prompts.confirm('Collapsible in editor?', true);

    // Fields
    this.output.blank();
    this.output.info('Configure fields for your block');
    const fields = await this.promptForFields();

    // Target directory
    const targetDirectory = await this.prompts.input(
      'Target directory',
      './blocks'
    );

    return {
      name,
      title,
      description,
      category,
      icon,
      collapsible,
      fields,
      targetDirectory
    };
  }

  /**
   * Prompts for icon selection.
   */
  private async promptForIcon(category: string): Promise<string> {
    const defaultIcons: Record<string, string> = {
      content: 'FileText',
      media: 'Picture',
      design: 'Palette',
      widgets: 'Settings',
      theme: 'Brush',
      embed: 'Code'
    };

    const useDefault = await this.prompts.confirm(
      `Use default icon for ${category}? (${defaultIcons[category]})`,
      true
    );

    if (useDefault) {
      return defaultIcons[category] || 'FileText';
    }

    return await this.prompts.input(
      'Icon (CodexIcon name or emoji)',
      defaultIcons[category]
    );
  }

  /**
   * Prompts for field configurations.
   */
  private async promptForFields(): Promise<FieldConfigDTO[]> {
    const fields: FieldConfigDTO[] = [];
    let addMore = true;

    while (addMore) {
      this.output.blank();
      this.output.dim(`Field #${fields.length + 1}`);

      const field = await this.promptForField();
      fields.push(field);

      addMore = await this.prompts.confirm('Add another field?', fields.length === 0);
    }

    if (fields.length === 0) {
      this.output.warning('Warning: Block has no fields. Adding a default "content" field.');
      fields.push({
        name: 'content',
        type: 'text',
        label: 'Content',
        required: false
      });
    }

    return fields;
  }

  /**
   * Prompts for a single field configuration.
   */
  private async promptForField(): Promise<FieldConfigDTO> {
    // Field name
    const name = await this.prompts.input(
      'Field name (camelCase)',
      undefined,
      (value) => {
        const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
        if (!camelCaseRegex.test(value)) {
          return 'Field name must be camelCase (e.g., myField)';
        }
        return true;
      }
    );

    // Field type
    const type = await this.prompts.select(
      'Field type',
      FieldType.all()
    );

    // Label
    const label = await this.prompts.input('Field label', this.toTitleCase(name));

    // Required
    const required = await this.prompts.confirm('Required?', false);

    // Placeholder (for text-based fields)
    let placeholder: string | undefined;
    if (['text', 'textarea', 'email', 'link'].includes(type)) {
      const addPlaceholder = await this.prompts.confirm('Add placeholder?', false);
      if (addPlaceholder) {
        placeholder = await this.prompts.input('Placeholder text');
      }
    }

    // Default value
    let defaultValue: any;
    const addDefault = await this.prompts.confirm('Add default value?', false);
    if (addDefault) {
      defaultValue = await this.prompts.input('Default value');
    }

    // Options (for select fields)
    let options: any;
    const fieldType = new FieldType(type);
    if (fieldType.requiresOptions()) {
      options = await this.promptForFieldOptions(type);
    }

    return {
      name,
      type,
      label,
      required,
      placeholder,
      defaultValue,
      options
    };
  }

  /**
   * Prompts for field options (e.g., select choices).
   */
  private async promptForFieldOptions(type: string): Promise<any> {
    if (type === 'select') {
      const choices: string[] = [];
      let addMore = true;

      this.output.dim('Enter choices for select field:');
      while (addMore) {
        const choice = await this.prompts.input(`Choice #${choices.length + 1}`);
        choices.push(choice);
        addMore = await this.prompts.confirm('Add another choice?', choices.length < 3);
      }

      return { choices };
    }

    return {};
  }

  /**
   * Converts kebab-case or camelCase to Title Case.
   */
  private toTitleCase(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  }
}
