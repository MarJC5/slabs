/**
 * Link Field Styles
 */

export const LINK_FIELD_CSS = `
/* Link Field */
.slabs-field-link {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-md);
}

.slabs-field-link label {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-sm);
  font-weight: var(--field-font-semibold);
  color: var(--field-color-primary);
  font-size: var(--field-text-label);
}

.slabs-field-link input,
.slabs-field-link select {
  padding: var(--field-input-padding);
  border: var(--field-input-border-width) solid var(--field-border-color);
  border-radius: var(--field-input-radius);
  font-size: var(--field-text-base);
  font-family: inherit;
  font-weight: normal;
  transition: border-color var(--field-transition-legacy-fast), box-shadow var(--field-transition-legacy-fast);
  background-color: var(--field-bg-base);
}

.slabs-field-link input:focus,
.slabs-field-link select:focus {
  outline: none;
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}
`;