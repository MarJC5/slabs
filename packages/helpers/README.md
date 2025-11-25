# @slabs/helpers

ACF-like helper functions for working with Slabs field data.

## Installation

```bash
npm install @slabs/helpers
# or
pnpm add @slabs/helpers
```

## Features

- ACF-inspired API - Familiar functions for WordPress/ACF users
- Immutable by default - All updates return new objects
- Type-safe - Full TypeScript support
- Lightweight - ~3KB minified
- Tree-shakeable - Import only what you need
- Dot notation - Access nested fields easily

## Basic Usage

```typescript
import { getField, setField, getRows } from '@slabs/helpers';

// Get field value
const title = getField(data, 'title');

// Get nested field using dot notation
const bgColor = getField(data, 'settings.backgroundColor');

// Set field (immutable - returns new object)
const newData = setField(data, 'title', 'New Title');

// Work with repeater fields
const items = getRows(data, 'items');
items.forEach(row => {
  console.log(getSubField(row, 'title'));
});
```

## API Reference

### Basic Helpers

#### `getField(data, fieldName)`
Get field value. Supports dot notation for nested access.

```typescript
const title = getField(data, 'title');
const bgColor = getField(data, 'settings.backgroundColor');
const firstItemTitle = getField(data, 'items.0.title');
```

#### `getFieldOr(data, fieldName, defaultValue)`
Get field value with default fallback.

```typescript
const title = getFieldOr(data, 'title', 'Untitled');
```

#### `getFields(data)`
Get all field values as object.

```typescript
const allData = getFields(data);
```

#### `setField(data, fieldName, value)`
Set field value (immutable).

```typescript
const newData = setField(data, 'title', 'New Title');
const newData2 = setField(data, 'settings.backgroundColor', '#fff');
```

#### `setFields(data, fields)`
Set multiple fields at once.

```typescript
const newData = setFields(data, {
  title: 'New Title',
  description: 'New Description'
});
```

#### `deleteField(data, fieldName)`
Delete field (immutable).

```typescript
const newData = deleteField(data, 'oldField');
```

#### `hasField(data, fieldName)`
Check if field exists and has a value.

```typescript
if (hasField(data, 'title')) {
  console.log('Title exists');
}
```

### Repeater Helpers

#### `getRows(data, fieldName)`
Get all rows from repeater field.

```typescript
const items = getRows(data, 'items');
items.forEach(row => {
  console.log(row.title);
});
```

#### `getRow(data, fieldName, index)`
Get specific row by index.

```typescript
const firstItem = getRow(data, 'items', 0);
```

#### `getRowCount(data, fieldName)`
Get number of rows.

```typescript
const count = getRowCount(data, 'items');
```

#### `hasRows(data, fieldName)`
Check if repeater has rows.

```typescript
if (hasRows(data, 'items')) {
  // Process items
}
```

#### `getSubField(rowData, subFieldName)`
Get sub-field value from row.

```typescript
const rows = getRows(data, 'items');
rows.forEach(row => {
  const title = getSubField(row, 'title');
  const image = getSubField(row, 'image');
});
```

#### `addRow(data, fieldName, rowData)`
Add new row to repeater (immutable).

```typescript
const newData = addRow(data, 'items', {
  title: 'New Item',
  description: 'Description'
});
```

#### `updateRow(data, fieldName, index, rowData)`
Update specific row (immutable).

```typescript
const newData = updateRow(data, 'items', 0, {
  title: 'Updated Title'
});
```

#### `deleteRow(data, fieldName, index)`
Delete row from repeater (immutable).

```typescript
const newData = deleteRow(data, 'items', 2);
```

#### `updateSubField(data, fieldName, rowIndex, subFieldName, value)`
Update sub-field in specific row.

```typescript
const newData = updateSubField(data, 'items', 0, 'title', 'New Title');
```

#### `addSubRow(data, fieldName, rowIndex, subFieldName, subRowData)`
Add row to nested repeater.

```typescript
const newData = addSubRow(data, 'sections', 0, 'items', {
  title: 'Nested Item'
});
```

#### `deleteSubRow(data, fieldName, rowIndex, subFieldName, subRowIndex)`
Delete row from nested repeater.

```typescript
const newData = deleteSubRow(data, 'sections', 0, 'items', 1);
```

### Group Helpers

#### `getGroup(data, groupName)`
Get entire group object.

```typescript
const settings = getGroup(data, 'settings');
// { backgroundColor: '#fff', textColor: '#000', padding: 20 }
```

#### `getGroupField(data, groupName, fieldName)`
Get specific field from group.

```typescript
const bgColor = getGroupField(data, 'settings', 'backgroundColor');
```

#### `getGroupFields(data, groupName)`
Get all fields from group.

```typescript
const allSettings = getGroupFields(data, 'settings');
```

#### `setGroupField(data, groupName, fieldName, value)`
Set field in group (immutable).

```typescript
const newData = setGroupField(data, 'settings', 'backgroundColor', '#000');
```

#### `setGroupFields(data, groupName, fields)`
Set multiple fields in group.

```typescript
const newData = setGroupFields(data, 'settings', {
  backgroundColor: '#000',
  textColor: '#fff'
});
```

#### `hasGroup(data, groupName)`
Check if group exists and has fields.

```typescript
if (hasGroup(data, 'settings')) {
  const settings = getGroup(data, 'settings');
}
```

### Flexible Content Helpers

#### `getLayouts(data, fieldName)`
Get all layouts from flexible content field.

```typescript
const sections = getLayouts(data, 'sections');
// [
//   { layout: 'hero', fields: { title: '...', image: {...} } },
//   { layout: 'text', fields: { content: '...' } }
// ]
```

#### `getLayout(block)`
Get layout name from flexible content block.

```typescript
const blocks = getLayouts(data, 'sections');
blocks.forEach(block => {
  const layoutName = getLayout(block);
  console.log(`Layout: ${layoutName}`);
});
```

#### `getLayoutFields(block)`
Get fields from flexible content block.

```typescript
const blocks = getLayouts(data, 'sections');
const firstBlockFields = getLayoutFields(blocks[0]);
```

#### `getLayoutField(block, fieldName)`
Get specific field from flexible content block.

```typescript
const title = getLayoutField(block, 'title');
```

#### `getLayoutsByType(data, fieldName, layoutType)`
Filter layouts by type.

```typescript
const heroSections = getLayoutsByType(data, 'sections', 'hero');
```

#### `hasLayoutType(data, fieldName, layoutType)`
Check if flexible content has specific layout type.

```typescript
if (hasLayoutType(data, 'sections', 'hero')) {
  console.log('Has hero section');
}
```

#### `getLayoutTypeCount(data, fieldName, layoutType)`
Get count of specific layout type.

```typescript
const heroCount = getLayoutTypeCount(data, 'sections', 'hero');
```

## Advanced Usage

### Dot Notation for Nested Access

```typescript
// Access nested group fields
const bgColor = getField(data, 'settings.colors.background');

// Access array items
const firstItemTitle = getField(data, 'items.0.title');

// Set nested values
const newData = setField(data, 'settings.colors.background', '#fff');
```

### Immutable Updates

All update functions return new objects without mutating the original:

```typescript
const data = { title: 'Hello', count: 5 };
const newData = setField(data, 'title', 'World');

console.log(data.title);    // 'Hello' - original unchanged
console.log(newData.title); // 'World' - new object
```

This is ideal for React/Vue where you need new references for change detection:

```typescript
// React example
const [blockData, setBlockData] = useState(initialData);

const handleUpdate = () => {
  setBlockData(prev => setField(prev, 'title', 'New Title'));
};
```

### Working with Complex Data

```typescript
// Nested repeaters
const data = {
  sections: [
    {
      title: 'Section 1',
      items: [
        { title: 'Item 1', description: 'Desc 1' },
        { title: 'Item 2', description: 'Desc 2' }
      ]
    }
  ]
};

// Add to nested repeater
const newData = addSubRow(data, 'sections', 0, 'items', {
  title: 'Item 3',
  description: 'Desc 3'
});

// Update nested repeater item
const updated = updateSubField(data, 'sections', 0, 'items.0.title', 'Updated');
```

### Flexible Content Rendering

```typescript
const sections = getLayouts(data, 'sections');

sections.forEach(section => {
  const layoutType = getLayout(section);

  switch (layoutType) {
    case 'hero':
      const title = getLayoutField(section, 'title');
      const image = getLayoutField(section, 'image');
      renderHero(title, image);
      break;

    case 'text':
      const content = getLayoutField(section, 'content');
      renderText(content);
      break;

    case 'gallery':
      const images = getLayoutField(section, 'images');
      renderGallery(images);
      break;
  }
});
```

## TypeScript Support

All functions are fully typed with TypeScript generics:

```typescript
interface BlockData {
  title: string;
  count: number;
  settings: {
    backgroundColor: string;
    textColor: string;
  };
  items: Array<{
    title: string;
    description: string;
  }>;
}

// Type-safe access
const title = getField<string>(data, 'title');
const count = getField<number>(data, 'count');
const items = getRows<{ title: string; description: string }>(data, 'items');
```

## License

MIT
