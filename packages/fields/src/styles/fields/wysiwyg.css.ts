/**
 * WYSIWYG Editor Styles
 */

export const WYSIWYG_FIELD_CSS = `
/* WYSIWYG Field */
.slabs-wysiwyg {
  position: relative;
  border: var(--field-input-border-width) solid var(--field-border-color);
  border-radius: var(--field-radius-sm);
  overflow: hidden;
}

.slabs-wysiwyg__toolbar {
  display: flex;
  gap: 0.125rem;
  padding: var(--field-space-sm);
  background: white;
  border-bottom: var(--field-input-border-width) solid var(--field-border-color);
}

.slabs-wysiwyg__tool {
  padding: var(--field-space-sm);
  background: transparent;
  border: none;
  border-radius: var(--field-radius-xs);
  cursor: pointer;
  transition: all var(--field-transition-legacy-base);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
}

.slabs-wysiwyg__tool svg {
  width: var(--field-icon-size);
  height: var(--field-icon-size);
}

.slabs-wysiwyg__tool:hover {
  background: var(--field-bg-muted);
}

.slabs-wysiwyg__tool:active {
  background: var(--field-bg-muted);
}

.slabs-wysiwyg__editor {
  min-height: 120px;
  padding: var(--field-input-padding);
  background: var(--field-bg-base);
  outline: none;
  line-height: 1.6;
}

.slabs-wysiwyg:focus-within {
  border-color: var(--field-border-color-focus);
  box-shadow: var(--field-shadow-focus);
}

.slabs-wysiwyg__editor[data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: var(--field-color-muted);
  opacity: 0.6;
}

.slabs-wysiwyg__editor p {
  margin: 0 0 var(--field-space-sm);
}

.slabs-wysiwyg__editor p:last-child {
  margin-bottom: 0;
}

.slabs-wysiwyg__editor h1,
.slabs-wysiwyg__editor h2,
.slabs-wysiwyg__editor h3 {
  margin: var(--field-space-lg) 0 var(--field-space-sm);
}

.slabs-wysiwyg__editor h1:first-child,
.slabs-wysiwyg__editor h2:first-child,
.slabs-wysiwyg__editor h3:first-child {
  margin-top: 0;
}

.slabs-wysiwyg__editor h1 {
  font-size: var(--field-text-2xl);
}

.slabs-wysiwyg__editor h2 {
  font-size: var(--field-text-xl);
}

.slabs-wysiwyg__editor h3 {
  font-size: var(--field-text-lg);
}

.slabs-wysiwyg__editor ul,
.slabs-wysiwyg__editor ol {
  margin: 0 0 var(--field-space-sm);
  padding-left: var(--field-space-xl);
}

.slabs-wysiwyg__editor a {
  color: var(--field-color-link);
  text-decoration: underline;
}
`;