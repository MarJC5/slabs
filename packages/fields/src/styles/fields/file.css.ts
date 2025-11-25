/**
 * File Field Styles
 */
export const FILE_FIELD_CSS = `
/* File Field Container */
.slabs-field-file {
  display: flex;
  flex-direction: column;
  gap: var(--field-spacing-md);
}

/* File Input */
.slabs-field__file-input {
  padding: var(--field-space-sm);
  border: var(--field-input-border-width-dashed) dashed var(--field-border-color-dashed);
  border-radius: var(--field-radius-xs);
  cursor: pointer;
  transition: border-color var(--field-transition-legacy-fast);
}

.slabs-field__file-input:hover {
  border-color: var(--field-border-color-focus);
}

.slabs-field__file-input--hidden {
  display: none;
}

/* File Info Container */
.slabs-field__file-info {
  display: flex;
  align-items: center;
  gap: var(--field-space-md);
  //padding: var(--field-space-lg);
  //background: var(--editorjs-bg-light);
  //border: 1px solid var(--field-border-color);
  //border-radius: var(--field-radius-md);
}

.slabs-field__file-info--hidden {
  display: none;
}

/* File Icon */
.slabs-field__file-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

/* File Details */
.slabs-field__file-details {
  flex: 1;
  min-width: 0;
}

.slabs-field__file-name {
  font-weight: var(--field-font-medium);
  color: var(--editorjs-color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slabs-field__file-size {
  font-size: var(--field-text-small);
  color: var(--editorjs-gray-text);
  margin-top: var(--field-spacing-xs);
}

/* File Actions */
.slabs-field__file-actions {
  display: flex;
  gap: var(--field-space-sm);
  flex-shrink: 0;
}

/* File buttons - consistent with repeater buttons */
.slabs-field__file-download,
.slabs-field__file-remove {
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
  text-decoration: none !important;
}

.slabs-field__file-download:focus-visible,
.slabs-field__file-remove:focus-visible {
  outline: 2px solid var(--field-border-color-secondary);
  outline-offset: 2px;
}

.slabs-field__file-download:hover,
.slabs-field__file-remove:hover {
  background: var(--field-bg-hover);
}
`;