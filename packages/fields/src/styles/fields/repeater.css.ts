/**
 * Repeater Field Styles
 */

export const REPEATER_FIELD_CSS = `
/* Repeater Field - shadcn-ui inspired */
.repeater-field {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
  width: 100%;
}

.repeater-rows {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.repeater-row {
  position: relative;
  background: var(--field-bg-muted);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary);
  border-radius: var(--field-radius-md);
  overflow: hidden;
}

.repeater-row:not(.repeater-row--collapsed) .repeater-row__content {
  border-top: var(--field-input-border-width) solid var(--field-border-color-secondary);
}

/* Collapsible header */
.repeater-row__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--field-space-lg) var(--field-space-xl);
  background: var(--field-bg-muted);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--field-transition-legacy-fast);
}

.repeater-row__header:hover {
  background: var(--field-bg-muted);
}

.repeater-row__title {
  margin: 0;
  color: var(--field-color-muted);
  font-size: var(--field-text-absolute);
  line-height: var(--field-text-absolute-line);
  font-weight: var(--field-font-medium);
  flex: 1;
}

.repeater-row__toggle {
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

.repeater-row--collapsed .repeater-row__toggle {
  transform: rotate(-90deg);
}

/* Content area */
.repeater-row__content {
  padding: var(--field-space-xl);
  background: var(--field-bg-base);
  max-height: 2000px;
  overflow: hidden;
  transition: max-height var(--field-transition-slow), padding var(--field-transition-slow);
}

.repeater-row--collapsed .repeater-row__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.repeater-row__fields {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
}

.repeater-row__fields .slabs-field {
  margin-bottom: 0;
}

.repeater-row__fields .slabs-field__input:invalid:focus {
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.repeater-row__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--field-space-sm);
  padding-top: var(--field-space-lg);
}

/* Repeater buttons - exact match to collapsible header */
.repeater-remove,
.repeater-add,
.repeater-row__move-up,
.repeater-row__move-down {
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

.repeater-remove:focus-visible,
.repeater-add:focus-visible,
.repeater-row__move-up:focus-visible,
.repeater-row__move-down:focus-visible {
  outline: 2px solid var(--field-border-color-secondary);
  outline-offset: 2px;
}

.repeater-remove:hover:not(:disabled),
.repeater-add:hover:not(:disabled),
.repeater-row__move-up:hover:not(:disabled),
.repeater-row__move-down:hover:not(:disabled) {
  background: var(--field-bg-muted);
}

/* Move buttons are icon-only, smaller */
.repeater-row__move-up,
.repeater-row__move-down {
  padding: var(--field-space-sm);
  width: 36px;
  height: 36px;
}

.repeater-row__move-up svg,
.repeater-row__move-down svg {
  width: var(--field-icon-size);
  height: var(--field-icon-size);
}

.repeater-add {
  width: 100%;
}

.repeater-add:disabled,
.repeater-remove:disabled,
.repeater-row__move-up:disabled,
.repeater-row__move-down:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Compact Layout */
.repeater-field--compact .repeater-row__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--field-space-md);
}
`;