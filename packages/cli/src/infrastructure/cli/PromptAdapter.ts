import { input, select, confirm } from '@inquirer/prompts';

/**
 * Prompt adapter wrapping @inquirer/prompts.
 * Provides a clean interface for interactive CLI prompts.
 *
 * @example
 * ```typescript
 * const prompts = new PromptAdapter();
 * const name = await prompts.input('Block name', 'my-block');
 * const category = await prompts.select('Category', ['content', 'media']);
 * ```
 */
export class PromptAdapter {
  /**
   * Prompts for text input.
   *
   * @param message - Question to ask
   * @param defaultValue - Default value
   * @param validate - Optional validation function
   * @returns User input
   */
  async input(
    message: string,
    defaultValue?: string,
    validate?: (value: string) => boolean | string
  ): Promise<string> {
    return await input({
      message,
      default: defaultValue,
      validate
    });
  }

  /**
   * Prompts for selection from a list.
   *
   * @param message - Question to ask
   * @param choices - Array of choices
   * @returns Selected value
   */
  async select<T extends string>(
    message: string,
    choices: T[]
  ): Promise<T> {
    return await select({
      message,
      choices: choices.map(choice => ({ name: choice, value: choice }))
    });
  }

  /**
   * Prompts for selection from a list with labels and values.
   *
   * @param message - Question to ask
   * @param choices - Array of {label, value} objects
   * @returns Selected value
   */
  async selectWithLabels<T>(
    message: string,
    choices: Array<{ label: string; value: T }>
  ): Promise<T> {
    return await select({
      message,
      choices: choices.map(choice => ({ name: choice.label, value: choice.value }))
    });
  }

  /**
   * Prompts for yes/no confirmation.
   *
   * @param message - Question to ask
   * @param defaultValue - Default value
   * @returns true for yes, false for no
   */
  async confirm(message: string, defaultValue = true): Promise<boolean> {
    return await confirm({
      message,
      default: defaultValue
    });
  }
}
