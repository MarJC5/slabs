/**
 * Base Field Input Styles
 */

export const FIELD_INPUT_CSS = `
/* Field Input (Base styles for all inputs) */
.slabs-field__input {
  padding: var(--field-input-padding);
  border: var(--field-input-border-width) solid var(--field-border-color);
  border-radius: var(--field-input-radius);
  font-size: var(--field-text-base);
  font-family: inherit;
  transition: border-color var(--field-transition-legacy-fast), box-shadow var(--field-transition-legacy-fast);
  background-color: var(--field-bg-base);
}

.slabs-field__input:focus {
  outline: none;
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.slabs-field__input:disabled {
  background-color: var(--field-bg-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.slabs-field__input:invalid,
.slabs-field__input--error {
  border-color: var(--field-border-color-error);
}

.slabs-field__input:invalid:focus,
.slabs-field__input--error:focus {
  border-color: var(--field-border-color-error);
  box-shadow: var(--field-shadow-error-ring);
}

/* Remove border/padding/background for checkbox, boolean, radio, and complex field containers */
.slabs-field__input.slabs-field__checkbox-option,
.slabs-field__input.slabs-field__boolean-checkbox,
.slabs-field__input.slabs-field__boolean-switch,
.slabs-field__input.slabs-field__radio-group,
.slabs-field__input.repeater-field,
.slabs-field__input.flexible-field,
.slabs-field__input.group-field {
  border: none;
  padding: 0;
  background-color: transparent;
}

.slabs-field__input.slabs-field__checkbox-option:focus,
.slabs-field__input.slabs-field__boolean-checkbox:focus,
.slabs-field__input.slabs-field__boolean-switch:focus,
.slabs-field__input.slabs-field__radio-group:focus,
.slabs-field__input.repeater-field:focus,
.slabs-field__input.flexible-field:focus,
.slabs-field__input.group-field:focus {
  border: none;
  box-shadow: none;
}
`;