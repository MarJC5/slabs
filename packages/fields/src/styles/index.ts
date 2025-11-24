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
  padding: 0.75rem;
  border: 1px solid hsl(0 0% 89.8%);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: #ffffff;
}

.slabs-field__input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}

.slabs-field__input:disabled {
  background-color: hsl(0 0% 92%);
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

/* Remove border/padding/background for checkbox, boolean, and radio containers */
.slabs-field__input.slabs-field__checkbox-option,
.slabs-field__input.slabs-field__boolean-checkbox,
.slabs-field__input.slabs-field__boolean-switch,
.slabs-field__input.slabs-field__radio-group {
  border: none;
  padding: 0;
  background-color: transparent;
}

.slabs-field__input.slabs-field__checkbox-option:focus,
.slabs-field__input.slabs-field__boolean-checkbox:focus,
.slabs-field__input.slabs-field__boolean-switch:focus,
.slabs-field__input.slabs-field__radio-group:focus {
  border: none;
  box-shadow: none;
}

/* Field Description */
.slabs-field__description {
  font-size: 0.85rem;
  color: hsl(0 0% 45%);
  font-style: italic;
  margin: 0;
}

/* Field Error */
.slabs-field__error {
  font-size: 0.85rem;
  color: #dc3545;
  margin: 0;
  display: none;
  margin-top: 0.25rem;
}

.slabs-field__error--visible {
  display: block;
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
  width: 100%;
}

/* Number Input with Prefix/Suffix */
.slabs-field__number-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid hsl(0 0% 89.8%);
  border-radius: 8px;
  background-color: #ffffff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.slabs-field__number-wrapper:focus-within {
  outline: none;
  border-color: #80bdff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}

.slabs-field__number-prefix,
.slabs-field__number-suffix {
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
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
  font-size: 0.95rem;
  font-family: inherit;
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
.slabs-field__checkbox-option {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.slabs-field__checkbox-input {
  margin: 0;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: #495057;
}

/* Boolean Field - Checkbox Display */
.slabs-field__boolean-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

/* Boolean Field - Switch Display */
.slabs-field__boolean-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.slabs-field__boolean-switch .slabs-field__boolean-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.slabs-field__boolean-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background-color: hsl(0 0% 89.8%);
  border-radius: 24px;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0;
}

.slabs-field__boolean-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.slabs-field__boolean-switch:hover .slabs-field__boolean-slider {
  background-color: hsl(0 0% 80%);
}

.slabs-field__boolean-switch .slabs-field__boolean-input:checked + .slabs-field__boolean-slider {
  background-color: hsl(0 0% 45%);
}

.slabs-field__boolean-switch .slabs-field__boolean-input:checked + .slabs-field__boolean-slider::before {
  transform: translateX(24px);
}

.slabs-field__boolean-switch .slabs-field__boolean-input:focus + .slabs-field__boolean-slider {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
}

.slabs-field__boolean-input {
  margin: 0;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: #495057;
}

/* Radio */
.slabs-field__radio-group {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}

.slabs-field__radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.slabs-field__radio-input {
  margin: 0;
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #495057;
}

.slabs-field__radio-label {
  margin: 0;
  cursor: pointer;
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
}

.slabs-field__radio-option:has(.slabs-field__radio-input:checked) .slabs-field__radio-label {
  font-weight: 600;
  color: #212529;
}

/* Fallback for browsers that don't support :has() */
@supports not selector(:has(*)) {
  .slabs-field__radio-input:checked + .slabs-field__radio-label {
    font-weight: 600;
    color: #212529;
  }
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

/* Link Field */
.slabs-field-link {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slabs-field-link label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.slabs-field-link input,
.slabs-field-link select {
  padding: 0.75rem;
  border: 1px solid hsl(0 0% 89.8%);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: normal;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: #ffffff;
}

.slabs-field-link input:focus,
.slabs-field-link select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
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
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
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
  background: hsl(0 0% 92%);
}

.slabs-block-collapsible__title {
  margin: 0;
  color: hsl(0 0% 45%);
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
  color: hsl(0 0% 45%);
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
  max-height: 100%;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
}

.slabs-block-collapsible:not(.slabs-block-collapsible--collapsed) .slabs-block-collapsible__content {
  border-top: 1px solid #dee2e6;
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
  width: 20px;
  height: 20px;
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
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}

.slabs-wysiwyg__editor[data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: hsl(0 0% 45%);
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

/* Repeater Field - shadcn-ui inspired */
.repeater-field {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.repeater-rows {
  display: flex;
  flex-direction: column;
  gap: .4em;
}

.repeater-row {
  position: relative;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.repeater-row:not(.repeater-row--collapsed) .repeater-row__content {
  border-top: 1px solid #dee2e6;
}

/* Collapsible header */
.repeater-row__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out;
}

.repeater-row__header:hover {
  background: hsl(0 0% 92%);
}

.repeater-row__title {
  margin: 0;
  color: hsl(0 0% 45%);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  flex: 1;
}

.repeater-row__toggle {
  background: none;
  border: none;
  color: hsl(0 0% 45%);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
}

.repeater-row--collapsed .repeater-row__toggle {
  transform: rotate(-90deg);
}

/* Content area */
.repeater-row__content {
  padding: 1.5rem;
  background: #ffffff;
  max-height: 2000px;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
}

.repeater-row--collapsed .repeater-row__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.repeater-row__fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.repeater-row__fields .slabs-field {
  margin-bottom: 0;
}

.repeater-row__fields .slabs-field__input:invalid:focus {
  border-color: #80bdff;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}

.repeater-row__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
}

/* Repeater buttons - exact match to collapsible header */
.repeater-remove,
.repeater-add,
.repeater-row__move-up,
.repeater-row__move-down {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  font-family: inherit;
  outline: none;
  user-select: none;
  background: #f8f9fa;
  color: hsl(0 0% 45%);
}

.repeater-remove:focus-visible,
.repeater-add:focus-visible,
.repeater-row__move-up:focus-visible,
.repeater-row__move-down:focus-visible {
  outline: 2px solid #dee2e6;
  outline-offset: 2px;
}

.repeater-remove:hover:not(:disabled),
.repeater-add:hover:not(:disabled),
.repeater-row__move-up:hover:not(:disabled),
.repeater-row__move-down:hover:not(:disabled) {
  background: hsl(0 0% 92%);
}

/* Move buttons are icon-only, smaller */
.repeater-row__move-up,
.repeater-row__move-down {
  padding: 0.5rem;
  width: 36px;
  height: 36px;
}

.repeater-row__move-up svg,
.repeater-row__move-down svg {
  width: 20px;
  height: 20px;
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
  gap: 0.75rem;
}

/* Tabs Field - shadcn-ui style (light pills) */
.slabs-tabs {
  width: 100%;
}

.slabs-tabs__buttons {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  background: #f8f9fa;
  padding: 0.25rem;
  border-radius: 0.5rem;
  width: fit-content;
  margin-bottom: 2rem;
  gap: 0.25rem;
}

.slabs-tabs__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background: transparent;
  color: hsl(0 0% 45%);
  cursor: pointer;
  border-radius: 0.375rem;
  font-family: inherit;
  outline: none;
  user-select: none;
  position: relative;
}

.slabs-tabs__button:hover:not(.slabs-tabs__button--active) {
  background: hsl(0 0% 92%);
}

.slabs-tabs__button--active {
  color: hsl(0 0% 9%);
  background: hsl(0 0% 100%);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  font-weight: 500;
}

.slabs-tabs__button:focus-visible {
  outline: 2px solid hsl(0 0% 45%);
  outline-offset: 2px;
}

.slabs-tabs__content {
  margin-top: 0;
}

.slabs-tabs__panel {
  animation: fadeIn 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.slabs-tabs__panel--hidden {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  .slabs-tabs__buttons {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .slabs-tabs__button {
    flex-shrink: 0;
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
