/**
 * Image Upload Field Styles
 */

export const IMAGE_FIELD_CSS = `
/* Image Field */
.image-field {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-lg);
}

.image-input {
  padding: var(--field-space-sm);
  border: var(--field-input-border-width-dashed) dashed var(--field-border-color-dashed);
  border-radius: var(--field-radius-xs);
  cursor: pointer;
  transition: border-color var(--field-transition-legacy-fast);
}

.image-input:hover {
  border-color: var(--field-border-color-focus);
}

.image-input--hidden {
  display: none;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-sm);
  align-items: flex-start;
}

.image-preview.hidden {
  display: none;
}

.image-preview-img {
  max-width: var(--field-image-preview-max);
  max-height: var(--field-image-preview-max);
  border-radius: var(--field-radius-xs);
  border: var(--field-input-border-width) solid var(--field-border-color-secondary);
  object-fit: cover;
}

.image-remove {
  padding: 0.375rem var(--field-input-padding);
  background-color: var(--field-color-error);
  color: white;
  border: none;
  border-radius: var(--field-radius-xs);
  cursor: pointer;
  font-size: var(--field-text-sm);
  transition: background-color var(--field-transition-legacy-fast);
}

.image-remove:hover {
  background-color: var(--field-color-error-hover);
}
`;