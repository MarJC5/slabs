/**
 * Global styles for @slabs/fields
 * Auto-injects CSS when imported
 */

export const FIELDS_CSS = `/**
 * Global Styles for @slabs/fields
 * Base styles for all field types
 */

/* Field Container */
.slabs-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* Field Label */
.slabs-field__label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  display: block;
}

.slabs-field__label--required::after {
  content: ' *';
  color: #dc3545;
}

/* Field Input (Base styles for all inputs) */
.slabs-field__input {
  padding: 0.5rem 0.75rem;
  border: 1px solid hsl(0 0% 89.8%);
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: #ffffff;
}

.slabs-field__input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.slabs-field__input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.6;
}

.slabs-field__input:invalid,
.slabs-field__input--error {
  border-color: #dc3545;
}

.slabs-field__input:invalid:focus,
.slabs-field__input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Field Description */
.slabs-field__description {
  font-size: 0.85rem;
  color: #6c757d;
  font-style: italic;
  margin: 0;
}

/* Field Error */
.slabs-field__error {
  font-size: 0.85rem;
  color: #dc3545;
  margin: 0;
}

/* Specific Input Types */

/* Text Input */
input[type="text"].slabs-field__input,
input[type="email"].slabs-field__input,
input[type="url"].slabs-field__input,
input[type="password"].slabs-field__input {
  width: 100%;
}

/* Textarea */
textarea.slabs-field__input {
  width: 100%;
  resize: vertical;
  min-height: 80px;
}

/* Number Input */
input[type="number"].slabs-field__input {
  max-width: 150px;
}

/* Select */
select.slabs-field__input {
  cursor: pointer;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

/* Checkbox */
input[type="checkbox"].slabs-field__input {
  width: auto;
  margin-right: 0.5rem;
  cursor: pointer;
}

.slabs-field--checkbox {
  flex-direction: row;
  align-items: center;
}

.slabs-field--checkbox .slabs-field__label {
  order: 2;
  margin: 0;
  font-weight: normal;
  cursor: pointer;
}

.slabs-field--checkbox .slabs-field__input {
  order: 1;
}

/* Radio */
input[type="radio"].slabs-field__input {
  width: auto;
  margin-right: 0.5rem;
  cursor: pointer;
}

.slabs-field--radio {
  gap: 0.75rem;
}

.slabs-field__radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slabs-field__radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.slabs-field__radio-option input {
  margin: 0 0.5rem 0 0;
}

.slabs-field__radio-option label {
  margin: 0;
  cursor: pointer;
}

/* Range */
input[type="range"].slabs-field__input {
  padding: 0;
  width: 100%;
}

.slabs-field--range {
  gap: 0.25rem;
}

.slabs-field__range-value {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

/* Color */
input[type="color"].slabs-field__input {
  width: 60px;
  height: 40px;
  padding: 0.25rem;
  cursor: pointer;
}

/* Date */
input[type="date"].slabs-field__input {
  max-width: 200px;
}

/* Image Field */
.image-field {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-input {
  padding: 0.5rem;
  border: 2px dashed #ced4da;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s ease-in-out;
}

.image-input:hover {
  border-color: #80bdff;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.image-preview.hidden {
  display: none;
}

.image-preview-img {
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  object-fit: cover;
}

.image-remove {
  padding: 0.375rem 0.75rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.15s ease-in-out;
}

.image-remove:hover {
  background-color: #c82333;
}

/* Fields Container */
.slabs-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Collapsible Block */
.slabs-block-collapsible {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  margin-bottom: .4em;
}

.slabs-block-collapsible__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out;
}

.slabs-block-collapsible__header:hover {
  background: #e9ecef;
}

.slabs-block-collapsible__title {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: auto;
}

.slabs-block-collapsible__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.slabs-block-collapsible__icon svg {
  width: 100%;
  height: 100%;
}

.slabs-block-collapsible__toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  transition: transform 0.2s ease-in-out;
  font-size: 1.2rem;
}

.slabs-block-collapsible__toggle svg {
  width: 100%;
  height: 100%;
}

.slabs-block-collapsible--collapsed .slabs-block-collapsible__toggle {
  transform: rotate(-90deg);
}

.slabs-block-collapsible__content {
  padding: 1.5rem;
  background: #ffffff;
  max-height: 2000px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
}

.slabs-block-collapsible--collapsed .slabs-block-collapsible__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* WYSIWYG Field */
.slabs-wysiwyg {
  position: relative;
  border: 1px solid hsl(0 0% 89.8%);
  border-radius: 0.375rem;
  overflow: hidden;
}

.slabs-wysiwyg__toolbar {
  display: flex;
  gap: 0.125rem;
  padding: 0.375rem;
  background: white;
  border-bottom: 1px solid hsl(0 0% 89.8%);
}

.slabs-wysiwyg__tool {
  padding: 0.375rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  min-height: 28px;
}

.slabs-wysiwyg__tool svg {
  width: 18px;
  height: 18px;
}

.slabs-wysiwyg__tool:hover {
  background: hsl(0 0% 96.1%);
}

.slabs-wysiwyg__tool:active {
  background: hsl(0 0% 90%);
}

.slabs-wysiwyg__editor {
  min-height: 120px;
  padding: 0.75rem;
  background: #ffffff;
  outline: none;
  line-height: 1.6;
}

.slabs-wysiwyg:focus-within {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.slabs-wysiwyg__editor[data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: #6c757d;
  opacity: 0.6;
}

.slabs-wysiwyg__editor p {
  margin: 0 0 0.5rem;
}

.slabs-wysiwyg__editor p:last-child {
  margin-bottom: 0;
}

.slabs-wysiwyg__editor h1,
.slabs-wysiwyg__editor h2,
.slabs-wysiwyg__editor h3 {
  margin: 1rem 0 0.5rem;
}

.slabs-wysiwyg__editor h1:first-child,
.slabs-wysiwyg__editor h2:first-child,
.slabs-wysiwyg__editor h3:first-child {
  margin-top: 0;
}

.slabs-wysiwyg__editor h1 {
  font-size: 1.75rem;
}

.slabs-wysiwyg__editor h2 {
  font-size: 1.5rem;
}

.slabs-wysiwyg__editor h3 {
  font-size: 1.25rem;
}

.slabs-wysiwyg__editor ul,
.slabs-wysiwyg__editor ol {
  margin: 0 0 0.5rem;
  padding-left: 1.5rem;
}

.slabs-wysiwyg__editor a {
  color: #007bff;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .slabs-field__input {
    font-size: 16px; /* Prevent zoom on iOS */
  }

  input[type="number"].slabs-field__input {
    max-width: 100%;
  }

  input[type="date"].slabs-field__input {
    max-width: 100%;
  }
}
`;

// Only inject styles once
let stylesInjected = false;

/**
 * Inject global field styles into the document
 * Called automatically on module import, but can be called manually if needed
 */
export function injectFieldStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return;

  const styleId = 'slabs-fields-global-styles';
  if (document.getElementById(styleId)) {
    stylesInjected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = FIELDS_CSS;
  document.head.appendChild(style);

  stylesInjected = true;
}

// Auto-inject on module load (for browser environments)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFieldStyles);
  } else {
    injectFieldStyles();
  }
}
