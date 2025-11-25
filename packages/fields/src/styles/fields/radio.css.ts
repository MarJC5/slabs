/**
 * Radio Button Styles
 */

export const RADIO_FIELD_CSS = `
/* Radio */
.slabs-field__radio-group {
  display: flex;
  flex-direction: row;
  gap: var(--field-space-lg);
  flex-wrap: wrap;
  padding: var(--field-space-sm) 0;
}

.slabs-field__radio-option {
  display: flex;
  align-items: center;
  gap: var(--field-space-sm);
  cursor: pointer;
  user-select: none;
}

.slabs-field__radio-input {
  margin: 0;
  cursor: pointer;
  width: var(--field-radio-size);
  height: var(--field-radio-size);
  accent-color: var(--field-color-primary);
}

.slabs-field__radio-label {
  margin: 0;
  cursor: pointer;
  font-size: var(--field-text-base);
  color: var(--field-color-primary);
  font-weight: var(--field-font-medium);
}

.slabs-field__radio-option:has(.slabs-field__radio-input:checked) .slabs-field__radio-label {
  font-weight: var(--field-font-semibold);
  color: var(--field-color-primary-dark);
}

/* Fallback for browsers that don't support :has() */
@supports not selector(:has(*)) {
  .slabs-field__radio-input:checked + .slabs-field__radio-label {
    font-weight: var(--field-font-semibold);
    color: var(--field-color-primary-dark);
  }
}
`;