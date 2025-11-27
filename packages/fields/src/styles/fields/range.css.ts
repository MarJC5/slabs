/**
 * Range Slider Styles
 * Simple, consistent styling with Editor.js colors
 */

export const RANGE_FIELD_CSS = `
/* Range Container */
.slabs-field--range {
  gap: var(--field-space-xs);
}

/* Range Input - Base */
input[type="range"].slabs-field__input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  padding: 0;
  background: var(--editorjs-line-gray);
  border-radius: 2px;
  cursor: pointer;
  outline: none;
}

/* Range Track - Webkit (Chrome, Safari, Edge) */
input[type="range"].slabs-field__input::-webkit-slider-track {
  width: 100%;
  height: 4px;
  background: transparent;
  border: none;
}

/* Range Track - Firefox */
input[type="range"].slabs-field__input::-moz-range-track {
  width: 100%;
  height: 4px;
  background: var(--editorjs-line-gray);
  border-radius: 2px;
  border: none;
}

/* Range Progress Fill - Firefox */
input[type="range"].slabs-field__input::-moz-range-progress {
  height: 4px;
  background: var(--editorjs-gray-text);
  border-radius: 2px 0 0 2px;
}

/* Range Thumb - Webkit (Chrome, Safari, Edge) */
input[type="range"].slabs-field__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  margin-top: -5px;
  background: var(--field-color-white);
  border-radius: 50%;
  border: 2px solid var(--editorjs-gray-text);
  cursor: pointer;
  transition: all var(--field-transition-fast);
  box-shadow: var(--field-shadow-sm);
}

/* Range Thumb - Firefox */
input[type="range"].slabs-field__input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--field-color-white);
  border-radius: 50%;
  border: 2px solid var(--editorjs-gray-text);
  cursor: pointer;
  transition: all var(--field-transition-fast);
  box-shadow: var(--field-shadow-sm);
}

/* Range Thumb Hover - Webkit */
input[type="range"].slabs-field__input:hover::-webkit-slider-thumb {
  border-color: var(--editorjs-color-dark);
  box-shadow: var(--field-shadow-md);
}

/* Range Thumb Hover - Firefox */
input[type="range"].slabs-field__input:hover::-moz-range-thumb {
  background: var(--field-color-gray-100);
}

/* Range Thumb Active - Webkit */
input[type="range"].slabs-field__input:active::-webkit-slider-thumb {
  border-color: var(--editorjs-color-dark);
  transform: scale(1.05);
}

/* Range Thumb Active - Firefox */
input[type="range"].slabs-field__input:active::-moz-range-thumb {
  background: var(--field-color-gray-200);
}

/* Range Thumb Focus - Webkit */
input[type="range"].slabs-field__input:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px var(--field-color-gray-200);
}

/* Range Thumb Focus - Firefox */
input[type="range"].slabs-field__input:focus-visible::-moz-range-thumb {
  outline: 3px solid var(--field-color-gray-200);
  outline-offset: 2px;
}

input[type="range"].slabs-field__input:focus {
  border-color: transparent;
}

/* Range Value Display */
.slabs-field__range-value {
  font-size: var(--field-text-label);
  color: var(--editorjs-gray-text);
  font-weight: var(--field-font-medium);
  min-width: 3ch;
  text-align: right;
}
`;