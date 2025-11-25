/**
 * Tabs Field Styles
 * Aligned with Editor.js design language
 */

export const TABS_FIELD_CSS = `
/* Tabs Field - Editor.js-inspired style */
.slabs-tabs {
  width: 100%;
}

.slabs-tabs__buttons {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--editorjs-bg-light);
  padding: var(--field-space-xs);
  border-radius: var(--field-radius-md);
  width: fit-content;
  margin-bottom: var(--field-space-2xl);
  gap: var(--field-space-xs);
  border: 1px solid var(--field-border-color);
}

.slabs-tabs__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  padding: var(--field-space-sm) var(--field-space-lg);
  font-size: var(--field-text-sm);
  font-weight: var(--field-font-medium);
  transition: all var(--field-transition-fast);
  border: none;
  border-color: transparent;
  background: transparent;
  color: var(--editorjs-gray-text);
  cursor: pointer;
  border-radius: var(--field-radius-sm);
  font-family: inherit;
  outline: none;
  user-select: none;
  position: relative;
}

.slabs-tabs__button:hover:not(.slabs-tabs__button--active) {
  background: var(--field-color-white);
  color: var(--editorjs-color-dark);
  //box-shadow: var(--field-shadow-sm);
  border: 1px solid var(--field-border-color);
}

.slabs-tabs__button--active {
  color: var(--editorjs-color-dark);
  background: var(--field-color-white);
  //box-shadow: var(--field-shadow-sm);
  border: 1px solid var(--field-border-color);
}

.slabs-tabs__button:focus-visible {
  outline: 2px solid var(--field-color-primary);
  outline-offset: 2px;
}

.slabs-tabs__content {
  margin-top: 0;
}

.slabs-tabs__panel {
  animation: fadeIn var(--field-transition-fast);
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
`;