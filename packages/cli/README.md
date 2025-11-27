# @slabs/cli

> CLI tool for scaffolding Slabs blocks with interactive prompts

## Features

- Interactive block creation with guided prompts
- Automatic file generation (block.json, edit.ts, save.ts, render.ts, style.css)
- Input validation for block names, field names, and field types
- Smart defaults based on context
- Colored terminal output for better UX
- Built with TDD/DDD architecture (241 tests, 90%+ coverage)

## Installation

```bash
# Install in your project
pnpm add -D @slabs/cli

# Or use directly with npx
npx @slabs/cli create
```

## Usage

### Create a New Block

```bash
pnpm slabs create
```

This will start an interactive prompt flow:

1. **Block name** - Kebab-case name (e.g., `hero-section`)
2. **Block title** - Human-readable title (e.g., `Hero Section`)
3. **Description** - Brief description
4. **Category** - content, media, design, widgets, theme, or embed
5. **Icon** - CodexIcon name or emoji
6. **Collapsible** - Whether the block is collapsible in the editor
7. **Fields** - Configure fields one by one
8. **Target directory** - Where to create the block (default: `./blocks`)

### Show CLI Info

```bash
pnpm slabs info
```

Shows implementation status and available commands.

### Show Help

```bash
pnpm slabs --help
```

## Example

```bash
$ pnpm slabs create

Create a new Slabs block

✔ Block name (kebab-case): pricing-card
✔ Block title: Pricing Card
✔ Description: Display pricing plans with features
✔ Category: content
✔ Use default icon for content? (FileText): Yes
✔ Collapsible in editor?: Yes

Configure fields for your block

Field #1
✔ Field name (camelCase): title
✔ Field type: text
✔ Field label: Title
✔ Required?: Yes
✔ Add placeholder?: Yes
✔ Placeholder text: Enter pricing plan title
✔ Add default value?: No
✔ Add another field?: Yes

Field #2
✔ Field name (camelCase): price
✔ Field type: number
✔ Field label: Price
✔ Required?: Yes
✔ Add another field?: Yes

Field #3
✔ Field name (camelCase): features
✔ Field type: textarea
✔ Field label: Features
✔ Required?: No
✔ Add placeholder?: No
✔ Add default value?: No
✔ Add another field?: No

✔ Target directory: ./blocks

Creating block...

✓ Block "pricing-card" created successfully!

Created files:
✓ block.json
✓ edit.ts
✓ save.ts
✓ render.ts
✓ style.css

Next steps:
  1. Edit blocks/pricing-card/render.ts to customize rendering
  2. Add styles in blocks/pricing-card/style.css
  3. Start your dev server to see the block in action
```

## Generated Files

The CLI generates a complete block structure:

```
blocks/your-block/
├── block.json    # Block metadata and field configuration
├── edit.ts       # Editor UI (uses @slabs/fields)
├── save.ts       # Data extraction
├── render.ts     # Frontend rendering (customize this!)
└── style.css     # Block styles
```

### block.json

```json
{
  "name": "slabs/pricing-card",
  "title": "Pricing Card",
  "description": "Display pricing plans with features",
  "category": "content",
  "icon": "FileText",
  "collapsible": true,
  "fields": {
    "title": {
      "type": "text",
      "label": "Title",
      "required": true,
      "placeholder": "Enter pricing plan title"
    },
    "price": {
      "type": "number",
      "label": "Price",
      "required": true
    },
    "features": {
      "type": "textarea",
      "label": "Features",
      "required": false
    }
  }
}
```

### edit.ts

Uses `@slabs/fields` for automatic UI generation:

```typescript
import { renderBlockEditor } from '@slabs/fields';
import type { EditContext } from 'virtual:slabs-registry';

export function render(context: EditContext): HTMLElement {
  return renderBlockEditor({
    title: context.config?.title || 'Pricing Card',
    icon: context.config?.icon,
    fields: context.config?.fields || {},
    data: context.data,
    collapsible: context.config?.collapsible
  });
}
```

### save.ts

Extracts field data:

```typescript
import { extractFieldData } from '@slabs/fields';

export function save(element: HTMLElement): any {
  const fieldsContainer = element.querySelector('.slabs-fields');
  if (!fieldsContainer) {
    return {};
  }
  return extractFieldData(fieldsContainer as HTMLElement);
}
```

### render.ts

**You customize this!** This is where you define how your block appears on the frontend:

```typescript
export function render(data: any): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pricing-card';

  // TODO: Customize the HTML structure for your block
  container.innerHTML = `
    <div class="pricing-card__content">
      <!-- Replace with your custom HTML -->
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>
  `;

  return container;
}
```

## Supported Field Types

- `text` - Single line text
- `textarea` - Multi-line text
- `wysiwyg` - Rich text editor
- `number` - Numeric input
- `email` - Email input
- `link` - URL input
- `select` - Dropdown with options
- `checkbox` - Boolean toggle
- `radio` - Radio button group
- `range` - Slider
- `date` - Date picker
- `color` - Color picker
- `image` - Image upload
- `repeater` - Repeatable field groups (requires manual configuration of nested fields)
- `group` - Groups related fields together (requires manual configuration of nested fields)

## Validation

The CLI validates inputs in real-time:

- **Block names**: Must be kebab-case (lowercase with hyphens)
- **Field names**: Must be camelCase (starts with lowercase letter)
- **Field types**: Must be one of the supported types
- **Select fields**: Must have at least one choice

## Architecture

Built with clean architecture principles:

- **Domain Layer**: Value objects, entities, domain services
- **Application Layer**: Use cases, DTOs
- **Infrastructure Layer**: File system, templates, repository
- **Interface Layer**: CLI commands, prompts, adapters

### Test Coverage

- **241 tests** across all layers
- **90%+ code coverage**
- Test-Driven Development (TDD)
- Domain-Driven Design (DDD)

## Development

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Type check
pnpm type-check
```

## License

MIT
