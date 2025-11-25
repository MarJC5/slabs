# @slabs/fields

ACF-like field system for building block editor interfaces with automatic UI generation, validation, and data extraction.

## Overview

The fields package provides a comprehensive field system inspired by WordPress Advanced Custom Fields (ACF). It enables you to define field schemas in JSON and automatically generate editable UIs, validate user input, and extract structured data. Perfect for building block editors with complex field configurations.

## Installation

```bash
npm install @slabs/fields
# or
pnpm add @slabs/fields
```

## Key Features

- 21 built-in field types (text, image, repeater, flexible, etc.)
- Automatic UI generation from field configurations
- Built-in validation with error messages
- Data extraction from rendered fields
- Nested fields support (repeater, flexible, group, tabs)
- Type-safe with full TypeScript support
- Lightweight and tree-shakeable
- Automatic style injection

## Quick Start

```typescript
import { renderFields, extractFieldData, validateFields } from '@slabs/fields';

// Define fields
const fields = {
  title: {
    type: 'text',
    label: 'Title',
    required: true,
    placeholder: 'Enter title...'
  },
  content: {
    type: 'textarea',
    label: 'Content',
    rows: 5
  }
};

// Render UI
const container = renderFields(fields);
document.body.appendChild(container);

// Extract data
const data = extractFieldData(container);
console.log(data); // { title: '...', content: '...' }

// Validate
const result = validateFields(fields, data);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

## Field Types

### Simple Fields

**Text**
```typescript
{
  type: 'text',
  label: 'Title',
  placeholder: 'Enter title',
  defaultValue: '',
  required: true,
  minLength: 3,
  maxLength: 100
}
```

**Textarea**
```typescript
{
  type: 'textarea',
  label: 'Description',
  rows: 5,
  placeholder: 'Enter description',
  minLength: 10,
  maxLength: 500
}
```

**Number**
```typescript
{
  type: 'number',
  label: 'Price',
  min: 0,
  max: 1000,
  step: 0.01,
  prefix: '$',
  suffix: 'USD',
  defaultValue: 0
}
```

**Email**
```typescript
{
  type: 'email',
  label: 'Email Address',
  required: true,
  placeholder: 'user@example.com'
}
```

**Password**
```typescript
{
  type: 'password',
  label: 'Password',
  required: true,
  minLength: 8,
  autocomplete: 'new-password'
}
```

**Link**
```typescript
{
  type: 'link',
  label: 'Website URL',
  placeholder: 'https://example.com'
}
```

### Selection Fields

**Select**
```typescript
{
  type: 'select',
  label: 'Category',
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' }
  ],
  defaultValue: 'tech',
  multiple: false
}
```

**Checkbox**
```typescript
{
  type: 'checkbox',
  label: 'Features',
  options: [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'pool', label: 'Pool' }
  ],
  defaultValue: ['wifi']
}
```

**Radio**
```typescript
{
  type: 'radio',
  label: 'Size',
  options: [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' }
  ],
  defaultValue: 'md'
}
```

**Boolean**
```typescript
{
  type: 'boolean',
  label: 'Published',
  defaultValue: false,
  display: 'switch'  // or 'checkbox'
}
```

### Media Fields

**Image**
```typescript
{
  type: 'image',
  label: 'Featured Image',
  accept: 'image/*',
  maxSize: 5242880  // 5MB in bytes
}
```

**File**
```typescript
{
  type: 'file',
  label: 'Attachment',
  accept: '.pdf,.doc,.docx',
  maxSize: 10485760  // 10MB
}
```

**OEmbed**
```typescript
{
  type: 'oembed',
  label: 'Video URL',
  placeholder: 'YouTube or Vimeo URL'
}
```

### Input Fields

**Color**
```typescript
{
  type: 'color',
  label: 'Brand Color',
  defaultValue: '#007bff'
}
```

**Date**
```typescript
{
  type: 'date',
  label: 'Event Date',
  defaultValue: '2024-01-01'
}
```

**Range**
```typescript
{
  type: 'range',
  label: 'Opacity',
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  showValue: true,
  suffix: '%'
}
```

**WYSIWYG**
```typescript
{
  type: 'wysiwyg',
  label: 'Rich Content',
  mode: 'full'  // or 'minimal'
}
```

### Structural Fields

**Repeater**
```typescript
{
  type: 'repeater',
  label: 'Team Members',
  buttonLabel: 'Add Member',
  layout: 'row',  // or 'block'
  fields: {
    name: {
      type: 'text',
      label: 'Name',
      required: true
    },
    role: {
      type: 'text',
      label: 'Role'
    },
    photo: {
      type: 'image',
      label: 'Photo'
    }
  }
}
```

**Flexible Content**
```typescript
{
  type: 'flexible',
  label: 'Page Sections',
  buttonLabel: 'Add Section',
  layouts: {
    hero: {
      label: 'Hero Section',
      fields: {
        title: { type: 'text', label: 'Title' },
        image: { type: 'image', label: 'Background' }
      }
    },
    text: {
      label: 'Text Section',
      fields: {
        content: { type: 'wysiwyg', label: 'Content' }
      }
    }
  }
}
```

**Group**
```typescript
{
  type: 'group',
  label: 'Settings',
  collapsible: true,
  collapsed: false,
  fields: {
    backgroundColor: {
      type: 'color',
      label: 'Background'
    },
    textColor: {
      type: 'color',
      label: 'Text Color'
    },
    padding: {
      type: 'number',
      label: 'Padding'
    }
  }
}
```

**Tabs**
```typescript
{
  type: 'tabs',
  tabs: {
    general: {
      label: 'General',
      fields: {
        title: { type: 'text', label: 'Title' }
      }
    },
    advanced: {
      label: 'Advanced',
      fields: {
        customClass: { type: 'text', label: 'CSS Class' }
      }
    }
  }
}
```

## API Reference

### Helper Functions

#### `renderFields(fields, data?, options?)`

Render field UI from configuration.

**Parameters:**
- `fields: Record<string, FieldConfigData>` - Field configurations
- `data?: Record<string, any>` - Initial field values
- `options?: RenderOptions` - Rendering options

**Returns:** `HTMLElement`

**Example:**

```typescript
const fields = {
  title: { type: 'text', label: 'Title' },
  content: { type: 'textarea', label: 'Content' }
};

const data = {
  title: 'Hello World',
  content: 'This is content'
};

const container = renderFields(fields, data, {
  className: 'my-fields',
  layout: 'vertical'
});
```

#### `extractFieldData(element)`

Extract data from rendered fields.

**Parameters:**
- `element: HTMLElement` - Container with rendered fields

**Returns:** `Record<string, any>`

**Example:**

```typescript
const container = renderFields(fields);
// User interacts with fields...
const data = extractFieldData(container);
```

#### `validateFields(fields, data)`

Validate field data against configuration.

**Parameters:**
- `fields: Record<string, FieldConfigData>` - Field configurations
- `data: Record<string, any>` - Data to validate

**Returns:** `ValidationResult`

**Example:**

```typescript
const result = validateFields(fields, data);

if (!result.valid) {
  result.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });
}
```

#### `renderBlockEditor(config)`

Render a complete block editor with title and fields.

**Parameters:**
- `config: BlockEditorConfig` - Block editor configuration

**Returns:** `HTMLElement`

**Example:**

```typescript
const editor = renderBlockEditor({
  title: 'Hero Block',
  icon: 'Picture',
  fields: {
    title: { type: 'text', label: 'Title' },
    subtitle: { type: 'text', label: 'Subtitle' },
    image: { type: 'image', label: 'Background' }
  },
  data: existingData,
  collapsible: true
});
```

### Domain Services

#### FieldRegistry

Manages field type registration.

```typescript
import { FieldRegistry, TextField } from '@slabs/fields';

const registry = FieldRegistry.createDefault();

// Register custom field
registry.register('custom', new CustomField());

// Get field type
const field = registry.get('text');
```

#### FieldRenderer

Renders fields with custom registry.

```typescript
import { FieldRenderer, FieldRegistry } from '@slabs/fields';

const registry = FieldRegistry.createDefault();
const renderer = new FieldRenderer(registry);

const container = renderer.render(fields, data);
```

#### FieldValidator

Validates fields with custom registry.

```typescript
import { FieldValidator, FieldRegistry } from '@slabs/fields';

const registry = FieldRegistry.createDefault();
const validator = new FieldValidator(registry);

const result = validator.validate(fields, data);
```

#### FieldExtractor

Extracts data with custom registry.

```typescript
import { FieldExtractor, FieldRegistry } from '@slabs/fields';

const registry = FieldRegistry.createDefault();
const extractor = new FieldExtractor(registry);

const data = extractor.extract(container);
```

## Field Configuration

### Common Options

All fields support these base options:

```typescript
interface FieldConfigData {
  type: string;              // Field type (required)
  label?: string;            // Field label
  placeholder?: string;      // Input placeholder
  defaultValue?: any;        // Default value
  required?: boolean;        // Required field
  className?: string;        // Custom CSS class
  width?: string | number;   // Field width
  description?: string;      // Help text
  hint?: string;             // Inline hint
}
```

### Validation Options

Fields support various validation rules:

```typescript
{
  type: 'text',
  label: 'Username',
  required: true,           // Field is required
  minLength: 3,            // Minimum length
  maxLength: 20,           // Maximum length
  pattern: /^[a-zA-Z0-9]+$/  // Regex pattern
}
```

### Layout Options

Control field layout and appearance:

```typescript
{
  type: 'text',
  label: 'Title',
  width: '50%',            // Field width
  className: 'my-field',   // Custom class
  description: 'Enter a descriptive title',
  hint: 'Keep it short and clear'
}
```

## Advanced Usage

### Custom Field Types

Create custom field implementations:

```typescript
import { FieldType, FieldConfigData, ValidationResult } from '@slabs/fields';

class CustomField implements FieldType {
  render(config: FieldConfigData, value: any): HTMLElement {
    const input = document.createElement('input');
    input.value = value || config.defaultValue || '';
    input.placeholder = config.placeholder || '';
    return input;
  }

  extract(element: HTMLElement): any {
    const input = element.querySelector('input');
    return input?.value || '';
  }

  validate(config: FieldConfigData, value: any): ValidationResult {
    const errors = [];

    if (config.required && !value) {
      errors.push({
        field: 'custom',
        message: 'This field is required'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Register custom field
import { getDefaultRegistry } from '@slabs/fields';

const registry = getDefaultRegistry();
registry.register('custom', new CustomField());
```

### Nested Repeater Fields

Create complex nested structures:

```typescript
const fields = {
  sections: {
    type: 'repeater',
    label: 'Page Sections',
    fields: {
      title: {
        type: 'text',
        label: 'Section Title'
      },
      items: {
        type: 'repeater',
        label: 'Items',
        fields: {
          name: { type: 'text', label: 'Name' },
          description: { type: 'textarea', label: 'Description' }
        }
      }
    }
  }
};
```

**Data structure:**

```typescript
{
  sections: [
    {
      title: 'Features',
      items: [
        { name: 'Fast', description: 'Lightning quick' },
        { name: 'Secure', description: 'Bank-level security' }
      ]
    },
    {
      title: 'Benefits',
      items: [
        { name: 'Easy', description: 'Simple to use' }
      ]
    }
  ]
}
```

### Conditional Logic

Show/hide fields based on other field values:

```typescript
const fields = {
  hasImage: {
    type: 'boolean',
    label: 'Include Image'
  },
  image: {
    type: 'image',
    label: 'Image',
    // Show only when hasImage is true
    conditionalLogic: {
      field: 'hasImage',
      operator: '==',
      value: true
    }
  }
};
```

### Style Customization

Fields come with default styles that are automatically injected. You can customize them:

```typescript
// Auto-inject styles (default)
import '@slabs/fields';

// Manual style injection
import { injectFieldStyles } from '@slabs/fields';

injectFieldStyles();
```

**CSS Custom Properties:**

```css
:root {
  --field-space-xs: 4px;
  --field-space-sm: 8px;
  --field-space-md: 12px;
  --field-space-lg: 16px;
  --field-space-xl: 24px;

  --field-color-primary: #007bff;
  --field-color-danger: #dc3545;
  --field-color-muted: #6c757d;

  --field-bg-base: #ffffff;
  --field-bg-muted: #f8f9fa;
  --field-bg-hover: #e9ecef;

  --field-border-color: #dee2e6;
  --field-border-color-focus: #007bff;

  --field-radius-sm: 4px;
  --field-radius-md: 6px;
  --field-radius-lg: 8px;
}
```

**Custom styling:**

```css
.my-fields .slabs-field {
  margin-bottom: 20px;
}

.my-fields .slabs-field__label {
  font-weight: 600;
  color: #333;
}

.my-fields .slabs-field__input {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}
```

## Integration Examples

### Vanilla JavaScript

```javascript
import { renderFields, extractFieldData } from '@slabs/fields';

const fields = {
  title: { type: 'text', label: 'Title' },
  content: { type: 'textarea', label: 'Content' }
};

const container = renderFields(fields);
document.getElementById('editor').appendChild(container);

document.getElementById('save-btn').addEventListener('click', () => {
  const data = extractFieldData(container);
  console.log('Saved data:', data);
});
```

### React Integration

```typescript
import { useEffect, useRef, useState } from 'react';
import { renderFields, extractFieldData } from '@slabs/fields';

function FieldEditor({ fields, initialData, onChange }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const rendered = renderFields(fields, initialData);
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(rendered);

      // Listen for changes
      containerRef.current.addEventListener('input', () => {
        const data = extractFieldData(containerRef.current);
        onChange(data);
      });
    }
  }, [fields, initialData]);

  return <div ref={containerRef} />;
}
```

### Vue Integration

```vue
<template>
  <div ref="fieldsContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { renderFields, extractFieldData } from '@slabs/fields';

const props = defineProps(['fields', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

const fieldsContainer = ref(null);

onMounted(() => {
  const rendered = renderFields(props.fields, props.modelValue);
  fieldsContainer.value.appendChild(rendered);

  fieldsContainer.value.addEventListener('input', () => {
    const data = extractFieldData(fieldsContainer.value);
    emit('update:modelValue', data);
  });
});
</script>
```

### Editor.js Block Integration

```typescript
import { renderBlockEditor, extractFieldData } from '@slabs/fields';

export function render(context) {
  return renderBlockEditor({
    title: context.config?.title || 'My Block',
    icon: context.config?.icon,
    fields: context.config?.fields || {},
    data: context.data,
    collapsible: context.config?.collapsible
  });
}

export function save(element) {
  const fieldsContainer = element.querySelector('.slabs-fields');
  return extractFieldData(fieldsContainer);
}
```

## Validation

### Built-in Validation

Each field type has built-in validation:

```typescript
const fields = {
  email: {
    type: 'email',
    label: 'Email',
    required: true
  },
  age: {
    type: 'number',
    label: 'Age',
    min: 18,
    max: 100
  },
  username: {
    type: 'text',
    label: 'Username',
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  }
};

const result = validateFields(fields, data);
```

### Validation Result

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  fieldErrors?: Record<string, ValidationError[]>;
}

interface ValidationError {
  field: string;
  message: string;
  code?: string;
}
```

**Example:**

```typescript
const result = validateFields(fields, data);

if (!result.valid) {
  // Show all errors
  result.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });

  // Or get errors by field
  const emailErrors = result.fieldErrors?.email || [];
}
```

### Custom Validation Messages

Validation messages are clear and actionable:

- "This field is required"
- "Must be at least 3 characters"
- "Must be at most 100 characters"
- "Must be a valid email address"
- "Must be a valid URL"
- "Must be between 0 and 100"
- "File size must not exceed 5MB"

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import {
  FieldConfigData,
  ValidationResult,
  FieldType,
  ValidFieldType,
  VALID_FIELD_TYPES
} from '@slabs/fields';

// Type-safe field config
const fields: Record<string, FieldConfigData> = {
  title: {
    type: 'text',
    label: 'Title',
    required: true
  }
};

// Type-safe validation
const result: ValidationResult = validateFields(fields, data);

// Valid field types
const fieldType: ValidFieldType = 'text';  // Type error if invalid
```

## Performance

**Bundle Size:**
- Core: ~23KB minified
- Auto-injected styles: ~8KB
- Individual fields are tree-shakeable

**Optimization Tips:**

1. Import only needed fields:
```typescript
import { TextField, TextareaField } from '@slabs/fields';
```

2. Use custom registry to reduce bundle:
```typescript
import { FieldRegistry, TextField, ImageField } from '@slabs/fields';

const registry = new FieldRegistry();
registry.register('text', new TextField());
registry.register('image', new ImageField());
```

3. Lazy load field types:
```typescript
const loadField = async (type) => {
  switch (type) {
    case 'wysiwyg':
      return (await import('@slabs/fields')).WysiwygField;
    default:
      return (await import('@slabs/fields')).TextField;
  }
};
```

## License

MIT
