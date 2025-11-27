import chalk from 'chalk';

/**
 * Output adapter wrapping Chalk for colored terminal output.
 * Provides semantic methods for different message types.
 *
 * @example
 * ```typescript
 * const output = new OutputAdapter();
 * output.success('Block created successfully!');
 * output.error('Failed to create block');
 * ```
 */
export class OutputAdapter {
  /**
   * Prints a success message in green.
   */
  success(message: string): void {
    console.log(chalk.green(message));
  }

  /**
   * Prints an error message in red.
   */
  error(message: string): void {
    console.error(chalk.red(message));
  }

  /**
   * Prints a warning message in yellow.
   */
  warning(message: string): void {
    console.warn(chalk.yellow(message));
  }

  /**
   * Prints an info message in blue.
   */
  info(message: string): void {
    console.log(chalk.blue(message));
  }

  /**
   * Prints a message with a checkmark prefix.
   */
  checkmark(message: string): void {
    console.log(chalk.green('✓') + ' ' + message);
  }

  /**
   * Prints a message with an X prefix.
   */
  cross(message: string): void {
    console.log(chalk.red('✗') + ' ' + message);
  }

  /**
   * Prints a plain message without formatting.
   */
  log(message: string): void {
    console.log(message);
  }

  /**
   * Prints a blank line.
   */
  blank(): void {
    console.log('');
  }

  /**
   * Prints a bold message.
   */
  bold(message: string): void {
    console.log(chalk.bold(message));
  }

  /**
   * Prints a dimmed/gray message.
   */
  dim(message: string): void {
    console.log(chalk.dim(message));
  }

  /**
   * Formats text as bold without printing.
   */
  formatBold(text: string): string {
    return chalk.bold(text);
  }

  /**
   * Formats text as green without printing.
   */
  formatSuccess(text: string): string {
    return chalk.green(text);
  }

  /**
   * Formats text as red without printing.
   */
  formatError(text: string): string {
    return chalk.red(text);
  }

  /**
   * Formats text as yellow without printing.
   */
  formatWarning(text: string): string {
    return chalk.yellow(text);
  }

  /**
   * Formats text as blue without printing.
   */
  formatInfo(text: string): string {
    return chalk.blue(text);
  }

  /**
   * Formats text as dim without printing.
   */
  formatDim(text: string): string {
    return chalk.dim(text);
  }
}
