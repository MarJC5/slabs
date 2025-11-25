/**
 * Boolean Field Styles (Checkbox and Switch Display)
 */

export const BOOLEAN_FIELD_CSS = `
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
  width: var(--field-switch-width);
  height: var(--field-switch-height);
  background-color: var(--field-border-color);
  border-radius: var(--field-radius-switch);
  transition: background-color var(--field-transition-legacy-base);
  flex-shrink: 0;
}

.slabs-field__boolean-slider::before {
  content: '';
  position: absolute;
  width: var(--field-switch-slider-size);
  height: var(--field-switch-slider-size);
  left: var(--field-switch-slider-offset);
  top: var(--field-switch-slider-offset);
  background-color: white;
  border-radius: 50%;
  transition: transform var(--field-transition-legacy-base);
  box-shadow: var(--field-shadow-switch);
}

.slabs-field__boolean-switch:hover .slabs-field__boolean-slider {
  background-color: var(--field-color-gray-400);
}

.slabs-field__boolean-switch .slabs-field__boolean-input:checked + .slabs-field__boolean-slider {
  background-color: var(--field-color-muted);
}

.slabs-field__boolean-switch .slabs-field__boolean-input:checked + .slabs-field__boolean-slider::before {
  transform: translateX(var(--field-switch-slider-translate));
}

.slabs-field__boolean-switch .slabs-field__boolean-input:focus + .slabs-field__boolean-slider {
  box-shadow: var(--field-shadow-neutral-ring);
}

.slabs-field__boolean-input {
  margin: 0;
  cursor: pointer;
  width: var(--field-checkbox-size);
  height: var(--field-checkbox-size);
  flex-shrink: 0;
  accent-color: var(--field-bg-muted);
}
`;