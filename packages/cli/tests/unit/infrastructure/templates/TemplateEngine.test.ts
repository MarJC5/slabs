import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateEngine } from '../../../../src/infrastructure/templates/TemplateEngine';

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
  });

  describe('render', () => {
    it('should render simple template', () => {
      const template = 'Hello {{name}}!';
      const data = { name: 'World' };

      const result = engine.render(template, data);

      expect(result).toBe('Hello World!');
    });

    it('should render template with multiple variables', () => {
      const template = '{{greeting}} {{name}}, you are {{age}} years old.';
      const data = { greeting: 'Hello', name: 'Alice', age: 30 };

      const result = engine.render(template, data);

      expect(result).toBe('Hello Alice, you are 30 years old.');
    });

    it('should handle missing variables', () => {
      const template = 'Hello {{name}}!';
      const data = {};

      const result = engine.render(template, data);

      expect(result).toBe('Hello !');
    });

    it('should render nested object properties', () => {
      const template = '{{user.name}} lives in {{user.city}}';
      const data = { user: { name: 'Bob', city: 'NYC' } };

      const result = engine.render(template, data);

      expect(result).toBe('Bob lives in NYC');
    });

    it('should render arrays', () => {
      const template = '{{#each items}}{{this}}, {{/each}}';
      const data = { items: ['apple', 'banana', 'cherry'] };

      const result = engine.render(template, data);

      expect(result).toBe('apple, banana, cherry, ');
    });

    it('should render conditionals', () => {
      const template = '{{#if show}}Visible{{else}}Hidden{{/if}}';

      const result1 = engine.render(template, { show: true });
      const result2 = engine.render(template, { show: false });

      expect(result1).toBe('Visible');
      expect(result2).toBe('Hidden');
    });

    it('should handle complex block.json template', () => {
      const template = `{
  "name": "{{namespace}}/{{blockName}}",
  "title": "{{title}}",
  "description": "{{description}}",
  "category": "{{category}}",
  "icon": "{{icon}}",
  "collapsible": {{collapsible}},
  "fields": {
{{#each fields}}    "{{name}}": {
      "type": "{{type}}",
      "label": "{{label}}"{{#if required}},
      "required": {{required}}{{/if}}
    }{{#unless @last}},{{/unless}}
{{/each}}  }
}`;

      const data = {
        namespace: 'slabs',
        blockName: 'hero',
        title: 'Hero Section',
        description: 'A hero section',
        category: 'content',
        icon: 'Picture',
        collapsible: true,
        fields: [
          { name: 'title', type: 'text', label: 'Title', required: true },
          { name: 'subtitle', type: 'text', label: 'Subtitle', required: false }
        ]
      };

      const result = engine.render(template, data);

      expect(result).toContain('"name": "slabs/hero"');
      expect(result).toContain('"title": "Hero Section"');
      expect(result).toContain('"collapsible": true');
      expect(result).toContain('"title": {');
      expect(result).toContain('"required": true');
    });

    it('should handle TypeScript code template', () => {
      const template = `import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  return renderBlockEditor({
    title: context.config?.title || '{{title}}',
    icon: context.config?.icon,
    fields: context.config?.fields || {},
    data: context.data,
    collapsible: context.config?.collapsible
  });
}`;

      const data = { title: 'My Block' };
      const result = engine.render(template, data);

      expect(result).toContain("title: context.config?.title || 'My Block'");
    });

    it('should preserve indentation', () => {
      const template = `function test() {
  {{#each items}}
  const {{this}} = value;
  {{/each}}
}`;

      const data = { items: ['a', 'b'] };
      const result = engine.render(template, data);

      expect(result).toContain('  const a = value;');
      expect(result).toContain('  const b = value;');
    });
  });

  describe('compile', () => {
    it('should compile template once and reuse', () => {
      const template = 'Hello {{name}}!';

      const compiled = engine.compile(template);
      const result1 = compiled({ name: 'Alice' });
      const result2 = compiled({ name: 'Bob' });

      expect(result1).toBe('Hello Alice!');
      expect(result2).toBe('Hello Bob!');
    });

    it('should compile complex template', () => {
      const template = '{{#each items}}{{name}}: {{value}}{{#unless @last}}, {{/unless}}{{/each}}';

      const compiled = engine.compile(template);
      const result = compiled({
        items: [
          { name: 'a', value: 1 },
          { name: 'b', value: 2 }
        ]
      });

      expect(result).toBe('a: 1, b: 2');
    });
  });

  describe('registerHelper', () => {
    it('should register and use custom helper', () => {
      engine.registerHelper('uppercase', (str: string) => str.toUpperCase());

      const template = 'Hello {{uppercase name}}!';
      const result = engine.render(template, { name: 'world' });

      expect(result).toBe('Hello WORLD!');
    });

    it('should register helper with multiple arguments', () => {
      engine.registerHelper('concat', (a: string, b: string) => a + b);

      const template = '{{concat first last}}';
      const result = engine.render(template, { first: 'John', last: 'Doe' });

      expect(result).toBe('JohnDoe');
    });
  });
});
