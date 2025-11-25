/**
 * Group Field Styles
 * Provides visual grouping for related fields with optional collapsible behavior
 * Structure exactly matches RepeaterField's single row
 */
export const GROUP_FIELD_CSS = `
/* Group container - matches repeater-row */
.group-field {
  position: relative;
  background: var(--field-bg-base);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary) !important;
  border-radius: var(--field-radius-md);
  overflow: hidden;
}

.group-field--collapsible:not(.group-field--collapsed) .group-field__content {
  border-top: var(--field-input-border-width) solid var(--field-border-color-secondary);
}

/* Collapsible header */
.group-field__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--field-space-lg) var(--field-space-xl);
  background: var(--field-bg-muted);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--field-transition-legacy-fast);
}

.group-field__header:hover {
  background: var(--field-bg-hover);
}

.group-field__title {
  margin: 0;
  color: var(--field-color-muted);
  font-size: var(--field-text-absolute);
  line-height: var(--field-text-absolute-line);
  font-weight: var(--field-font-medium);
  flex: 1;
}

.group-field__hint {
  font-weight: var(--field-font-normal);
}

.group-field__toggle {
  background: none;
  border: none;
  color: var(--field-color-muted);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  width: var(--field-icon-size);
  height: var(--field-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--field-transition-legacy-base);
}

.group-field--collapsed .group-field__toggle {
  transform: rotate(-90deg);
}

/* Content area */
.group-field__content {
  background: var(--field-bg-base);
  padding: var(--field-space-md);
  max-height: 2000px;
  overflow: hidden;
  transition: max-height var(--field-transition-slow), padding var(--field-transition-slow);
}

.group-field--collapsible .group-field__content {
  padding: var(--field-space-xl);
}

.group-field--collapsed .group-field__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.group-field__fields {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
}

.group-field__fields .slabs-field {
  margin-bottom: 0;
}

.group-field__fields .slabs-field__input:invalid:focus {
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

/* Horizontal layout option */
.group-field__fields--horizontal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--field-space-xl);
}

/* Nested groups have subtle styling */
.group-field .group-field {
  background: transparent;
  border-color: var(--field-border-color-tertiary);
}

/* Hide the wrapper label for collapsible groups (label is in the header) */
.slabs-field:has(> .slabs-field__input.group-field .group-field__header) > .slabs-field__label {
  display: none;
}
`;