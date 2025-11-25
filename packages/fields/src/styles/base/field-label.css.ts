/**
 * Field Label Styles
 */

export const FIELD_LABEL_CSS = `
/* Field Label */
.slabs-field__label {
  font-weight: var(--field-font-semibold);
  color: var(--editorjs-color-dark);
  font-size: var(--field-text-label);
  display: block;
}

.slabs-field__label--required::after {
  content: ' *';
  color: var(--field-color-error);
}

/* Hide label for collapsible group fields (label is in the header) */
.slabs-field:has(> .slabs-field__input.group-field > .group-field__header) > .slabs-field__label {
  display: none;
}
`;