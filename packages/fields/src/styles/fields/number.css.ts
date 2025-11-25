/**
 * Number Input Styles
 */

export const NUMBER_FIELD_CSS = `
/* Number Input */
input[type="number"].slabs-field__input {
  width: 100%;
}

/* Number Input with Prefix/Suffix */
.slabs-field__number-wrapper {
  display: flex;
  align-items: center;
  gap: var(--field-space-sm);
  width: 100%;
  padding: var(--field-input-padding);
  border: var(--field-input-border-width) solid var(--field-border-color);
  border-radius: var(--field-input-radius);
  background-color: var(--field-bg-base);
  transition: border-color var(--field-transition-legacy-fast), box-shadow var(--field-transition-legacy-fast);
}

.slabs-field__number-wrapper:focus-within {
  outline: none;
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.slabs-field__number-prefix,
.slabs-field__number-suffix {
  font-size: var(--field-text-base);
  color: var(--field-color-primary);
  font-weight: var(--field-font-medium);
  user-select: none;
  flex-shrink: 0;
}

.slabs-field__number-wrapper input[type="number"] {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  padding: 0;
  outline: none;
  background: transparent;
  font-size: var(--field-text-base);
  font-family: inherit;
}
`;