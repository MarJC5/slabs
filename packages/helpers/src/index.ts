/**
 * @slabs/helpers
 * ACF-like helper functions for working with Slabs field data
 */

// Basic field access
export {
  getField,
  getFieldOr,
  getFields,
  setField,
  setFields,
  deleteField,
  hasField
} from './basic';

// Repeater helpers
export {
  hasRows,
  getRowCount,
  getRows,
  getRow,
  getSubField,
  addRow,
  updateRow,
  deleteRow,
  addSubRow,
  updateSubField,
  deleteSubRow
} from './repeater';

// Group helpers
export {
  getGroup,
  getGroupField,
  getGroupFields,
  setGroupField,
  setGroupFields,
  hasGroup
} from './group';

// Flexible content helpers
export {
  getLayouts,
  getLayout,
  getLayoutFields,
  getLayoutField,
  getLayoutsByType,
  hasLayoutType,
  getLayoutTypeCount
} from './flexible';

export type { FlexibleBlock } from './flexible';

// Utility functions (exported for advanced usage)
export { getValueByPath, setValueByPath, deleteValueByPath } from './utils';
