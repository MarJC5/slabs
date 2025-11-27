import { Command } from 'commander';
import { CreateBlockUseCase } from '../../application/use-cases/CreateBlockUseCase';
import { FileSystemBlockRepository } from '../../infrastructure/repositories/FileSystemBlockRepository';
import { BlockPrompts } from '../prompts/BlockPrompts';
import { OutputAdapter } from '../../infrastructure/cli/OutputAdapter';

/**
 * Create command for generating new blocks.
 * Orchestrates the entire block creation flow.
 *
 * @example
 * ```typescript
 * const command = new CreateCommand();
 * program.addCommand(command.getCommand());
 * ```
 */
export class CreateCommand {
  private output: OutputAdapter;

  constructor() {
    this.output = new OutputAdapter();
  }

  /**
   * Returns the Commander.js command instance.
   */
  getCommand(): Command {
    const command = new Command('create');

    command
      .description('Create a new Slabs block')
      .action(async () => {
        await this.execute();
      });

    return command;
  }

  /**
   * Executes the create command.
   */
  private async execute(): Promise<void> {
    try {
      // Show welcome message
      this.output.blank();
      this.output.bold('Slabs Block Generator');
      this.output.dim('Create a new block with interactive prompts');

      // Gather block configuration via prompts
      const prompts = new BlockPrompts();
      const blockConfig = await prompts.promptForBlock();

      this.output.blank();
      this.output.info('Creating block...');

      // Create the block using the use case
      const repository = new FileSystemBlockRepository();
      const useCase = new CreateBlockUseCase(repository);
      const result = await useCase.execute(blockConfig);

      // Show success message
      this.output.blank();
      this.output.success(`Block "${result.blockName}" created successfully!`);
      this.output.blank();

      this.output.log('Created files:');
      result.createdFiles.forEach(file => {
        this.output.checkmark(file);
      });

      this.output.blank();
      this.output.bold('Next steps:');
      this.output.log(`  1. Edit ${this.output.formatBold(result.blockPath + '/render.ts')} to customize rendering`);
      this.output.log(`  2. Add styles in ${this.output.formatBold(result.blockPath + '/style.css')}`);
      this.output.log(`  3. Start your dev server to see the block in action`);
      this.output.blank();
    } catch (error) {
      this.output.blank();
      this.output.error('Failed to create block');

      if (error instanceof Error) {
        this.output.error(error.message);
      }

      this.output.blank();
      process.exit(1);
    }
  }
}
