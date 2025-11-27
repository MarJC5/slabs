import Handlebars from 'handlebars';

/**
 * Template engine adapter wrapping Handlebars.
 * Provides template compilation and rendering for block file generation.
 *
 * @example
 * ```typescript
 * const engine = new TemplateEngine();
 * const result = engine.render('Hello {{name}}!', { name: 'World' });
 * ```
 */
export class TemplateEngine {
  private handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
  }

  /**
   * Renders a template string with data.
   *
   * @param template - Handlebars template string
   * @param data - Data to pass to the template
   * @returns Rendered string
   */
  render(template: string, data: any): string {
    const compiled = this.handlebars.compile(template);
    return compiled(data);
  }

  /**
   * Compiles a template for reuse.
   *
   * @param template - Handlebars template string
   * @returns Compiled template function
   */
  compile(template: string): HandlebarsTemplateDelegate {
    return this.handlebars.compile(template);
  }

  /**
   * Registers a custom Handlebars helper.
   *
   * @param name - Helper name
   * @param fn - Helper function
   */
  registerHelper(name: string, fn: Handlebars.HelperDelegate): void {
    this.handlebars.registerHelper(name, fn);
  }
}
