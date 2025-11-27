import * as path from 'path';
import { Block } from '../../domain/entities/Block';
import { BlockName } from '../../domain/value-objects/BlockName';
import { Category } from '../../domain/value-objects/Category';
import { Icon } from '../../domain/value-objects/Icon';
import { Field } from '../../domain/entities/Field';
import { FieldType } from '../../domain/value-objects/FieldType';
import { IBlockRepository } from '../../domain/repositories/IBlockRepository';
import { FileSystemPort } from '../file-system/FileSystemPort';
import { TemplateEngine } from '../templates/TemplateEngine';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * File system implementation of the block repository.
 * Creates block directories and generates files from templates.
 *
 * @example
 * ```typescript
 * const repository = new FileSystemBlockRepository();
 * await repository.save(block, './blocks');
 * ```
 */
export class FileSystemBlockRepository implements IBlockRepository {
  private fileSystem: FileSystemPort;
  private templateEngine: TemplateEngine;

  constructor() {
    this.fileSystem = new FileSystemPort();
    this.templateEngine = new TemplateEngine();

    // Register custom Handlebars helpers
    this.templateEngine.registerHelper('json', (context: any) => {
      return JSON.stringify(context);
    });
  }

  /**
   * Saves a block to the file system.
   * Creates a directory with block.json and TypeScript files.
   *
   * @param block - The block to save
   * @param targetPath - Target directory (e.g., "./blocks")
   * @throws Error if block directory already exists
   */
  async save(block: Block, targetPath: string): Promise<void> {
    const blockDir = path.join(targetPath, block.getName().value);

    // Check if block already exists
    if (await this.fileSystem.exists(blockDir)) {
      throw new Error(`Block directory already exists: ${blockDir}`);
    }

    // Create block directory
    await this.fileSystem.mkdir(blockDir);

    // Prepare template data
    const templateData = this.prepareTemplateData(block);

    // Generate and write files
    await this.writeBlockJson(blockDir, templateData);
    await this.writeEditTs(blockDir, templateData);
    await this.writeSaveTs(blockDir, templateData);
    await this.writeRenderTs(blockDir, templateData);
    await this.writeStyleCss(blockDir, templateData);
  }

  /**
   * Checks if a block exists in the target path.
   *
   * @param name - Block name to check
   * @param targetPath - Target directory
   * @returns true if block directory exists
   */
  async exists(name: BlockName, targetPath: string): Promise<boolean> {
    const blockDir = path.join(targetPath, name.value);
    return await this.fileSystem.exists(blockDir);
  }

  /**
   * Finds and loads a block by name.
   *
   * @param name - Block name to find
   * @param targetPath - Target directory
   * @returns Block instance or null if not found
   */
  async findByName(name: BlockName, targetPath: string): Promise<Block | null> {
    const blockDir = path.join(targetPath, name.value);

    if (!(await this.fileSystem.exists(blockDir))) {
      return null;
    }

    // Read block.json
    const blockJsonPath = path.join(blockDir, 'block.json');
    const blockJsonContent = await this.fileSystem.readFile(blockJsonPath);
    const blockJson = JSON.parse(blockJsonContent);

    // Reconstruct block from JSON
    const fields: Field[] = [];
    if (blockJson.fields) {
      for (const [fieldName, fieldConfig] of Object.entries<any>(blockJson.fields)) {
        fields.push(
          new Field({
            name: fieldName,
            type: new FieldType(fieldConfig.type),
            label: fieldConfig.label,
            required: fieldConfig.required,
            placeholder: fieldConfig.placeholder,
            defaultValue: fieldConfig.default,
            options: this.extractFieldOptions(fieldConfig)
          })
        );
      }
    }

    return new Block({
      name,
      title: blockJson.title,
      description: blockJson.description,
      category: new Category(blockJson.category),
      icon: new Icon(blockJson.icon),
      fields,
      collapsible: blockJson.collapsible
    });
  }

  /**
   * Prepares template data from a block entity.
   */
  private prepareTemplateData(block: Block): any {
    const fields = block.getFields().map(field => ({
      name: field.name,
      type: field.type.value,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      options: field.options
    }));

    return {
      namespace: 'slabs',
      blockName: block.getName().value,
      title: block.getTitle(),
      description: block.getDescription(),
      category: block.getCategory().value,
      icon: block.getIcon().value,
      collapsible: block.getCollapsible(),
      hasFields: fields.length > 0,
      fields
    };
  }

  /**
   * Writes block.json file.
   */
  private async writeBlockJson(blockDir: string, data: any): Promise<void> {
    const template = await this.loadTemplate('block.json.hbs');
    const content = this.templateEngine.render(template, data);
    await this.fileSystem.writeFile(path.join(blockDir, 'block.json'), content);
  }

  /**
   * Writes edit.ts file.
   */
  private async writeEditTs(blockDir: string, data: any): Promise<void> {
    const template = await this.loadTemplate('edit.ts.hbs');
    const content = this.templateEngine.render(template, data);
    await this.fileSystem.writeFile(path.join(blockDir, 'edit.ts'), content);
  }

  /**
   * Writes save.ts file.
   */
  private async writeSaveTs(blockDir: string, data: any): Promise<void> {
    const template = await this.loadTemplate('save.ts.hbs');
    const content = this.templateEngine.render(template, data);
    await this.fileSystem.writeFile(path.join(blockDir, 'save.ts'), content);
  }

  /**
   * Writes render.ts file.
   */
  private async writeRenderTs(blockDir: string, data: any): Promise<void> {
    const template = await this.loadTemplate('render.ts.hbs');
    const content = this.templateEngine.render(template, data);
    await this.fileSystem.writeFile(path.join(blockDir, 'render.ts'), content);
  }

  /**
   * Writes style.css file.
   */
  private async writeStyleCss(blockDir: string, data: any): Promise<void> {
    const template = await this.loadTemplate('style.css.hbs');
    const content = this.templateEngine.render(template, data);
    await this.fileSystem.writeFile(path.join(blockDir, 'style.css'), content);
  }

  /**
   * Loads a template file from the templates directory.
   */
  private async loadTemplate(filename: string): Promise<string> {
    // When bundled by tsup, all code is in dist/index.js
    // Templates are in dist/infrastructure/templates/
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const templatePath = path.join(__dirname, 'infrastructure/templates', filename);
    return await this.fileSystem.readFile(templatePath);
  }

  /**
   * Extracts field options (excluding standard properties).
   */
  private extractFieldOptions(fieldConfig: any): any {
    const standardProps = ['type', 'label', 'required', 'placeholder', 'default'];
    const options: any = {};

    for (const [key, value] of Object.entries(fieldConfig)) {
      if (!standardProps.includes(key)) {
        options[key] = value;
      }
    }

    return Object.keys(options).length > 0 ? options : undefined;
  }
}
