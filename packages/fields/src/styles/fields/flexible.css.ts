/**
 * Flexible Content Field Styles
 */

export const FLEXIBLE_FIELD_CSS = `
/* Flexible Field - inspired by repeater but with layout selector */
.flexible-field {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
  width: 100%;
}

.flexible-rows {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.flexible-row {
  position: relative;
  background: var(--field-bg-base);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary);
  border-radius: var(--field-radius-md);
  overflow: hidden;
}

.flexible-row:not(.flexible-row--collapsed) .flexible-row__content {
  border-top: var(--field-input-border-width) solid var(--field-border-color-secondary);
}

/* Collapsible header */
.flexible-row__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--field-space-lg) var(--field-space-xl);
  background: var(--field-bg-muted);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--field-transition-legacy-fast);
}

.flexible-row__header:hover {
  background: var(--field-bg-hover);
}

.flexible-row__title {
  margin: 0;
  color: var(--field-color-muted);
  font-size: var(--field-text-absolute);
  line-height: var(--field-text-absolute-line);
  font-weight: var(--field-font-medium);
  flex: 1;
}

.flexible-row__toggle {
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

.flexible-row--collapsed .flexible-row__toggle {
  transform: rotate(-90deg);
}

/* Content area */
.flexible-row__content {
  padding: var(--field-space-xl);
  background: var(--field-bg-base);
  max-height: 2000px;
  overflow: hidden;
  transition: max-height var(--field-transition-slow), padding var(--field-transition-slow);
}

.flexible-row--collapsed .flexible-row__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.flexible-row__fields {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
}

.flexible-row__fields .slabs-field {
  margin-bottom: 0;
}

.flexible-row__fields .slabs-field__input:invalid:focus {
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.flexible-row__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--field-space-sm);
  padding-top: var(--field-space-lg);
}

/* Flexible buttons - match repeater style */
.flexible-remove,
.flexible-add,
.flexible-row__move-up,
.flexible-row__move-down {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--field-space-sm) var(--field-space-lg);
  border-radius: var(--field-radius-sm);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary);
  font-size: var(--field-text-sm);
  font-weight: var(--field-font-medium);
  cursor: pointer;
  transition: background-color var(--field-transition-legacy-fast);
  font-family: inherit;
  outline: none;
  user-select: none;
  background: var(--field-bg-muted);
  color: var(--field-color-muted);
}

.flexible-remove:focus-visible,
.flexible-add:focus-visible,
.flexible-row__move-up:focus-visible,
.flexible-row__move-down:focus-visible {
  outline: 2px solid var(--field-border-color-secondary);
  outline-offset: 2px;
}

.flexible-remove:hover:not(:disabled),
.flexible-add:hover:not(:disabled),
.flexible-row__move-up:hover:not(:disabled),
.flexible-row__move-down:hover:not(:disabled) {
  background: var(--field-bg-hover);
}

/* Move buttons are icon-only, smaller */
.flexible-row__move-up,
.flexible-row__move-down {
  padding: var(--field-space-sm);
  width: 36px;
  height: 36px;
}

.flexible-row__move-up svg,
.flexible-row__move-down svg {
  width: var(--field-icon-size);
  height: var(--field-icon-size);
}

.flexible-add:disabled,
.flexible-remove:disabled,
.flexible-row__move-up:disabled,
.flexible-row__move-down:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Layout selector container */
.flexible-add-container {
  display: flex;
  gap: var(--field-space-md);
  align-items: center;
}

.flexible-layout-selector {
  flex: 1;
  max-width: 300px;
  padding: var(--field-space-sm) var(--field-space-md);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary);
  border-radius: var(--field-radius-sm);
  background: var(--field-bg-base);
  color: var(--field-color-muted);
  font-size: var(--field-text-sm);
  font-weight: var(--field-font-medium);
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color var(--field-transition-legacy-fast);
}

.flexible-layout-selector:hover {
  border-color: var(--field-border-color-focus);
}

.flexible-layout-selector:focus {
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.flexible-add {
  flex-shrink: 0;
}
`;