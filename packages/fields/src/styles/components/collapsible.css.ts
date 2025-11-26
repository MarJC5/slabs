/**
 * Collapsible Block Styles
 */

export const COLLAPSIBLE_CSS = `
/* Collapsible Block */
.slabs-block-collapsible {
  border: var(--field-input-border-width) solid var(--field-color-gray-100);
  border-radius: var(--field-input-radius);
  overflow: hidden;
  margin-bottom: .4em;
  box-shadow: var(--field-shadow-sm);
}

.slabs-block-collapsible__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--field-space-lg) var(--field-space-xl);
  //background: var(--field-bg-muted);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--field-transition-legacy-fast);
}

.slabs-block-collapsible:hover .slabs-block-collapsible__header  {
  background: var(--field-bg-muted);
}

.slabs-block-collapsible__title {
  margin: 0;
  color: var(--field-color-gray-900);
  font-size: var(--field-text-absolute);
  line-height: var(--field-text-absolute-line);
  font-weight: var(--field-font-medium);
  display: flex;
  align-items: center;
  gap: var(--field-space-sm);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: auto;
}

.slabs-block-collapsible__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--field-toggle-size);
  height: var(--field-toggle-size);
}

.slabs-block-collapsible__icon svg {
  width: 100%;
  height: 100%;
}

.slabs-block-collapsible__toggle {
  width: var(--field-toggle-size);
  height: var(--field-toggle-size);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--field-color-gray-900);
  transition: transform var(--field-transition-legacy-base);
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
  padding: var(--field-space-xl);
  background: var(--field-bg-base);
  max-height: 100%;
  overflow: hidden;
  transition: max-height var(--field-transition-slow), padding var(--field-transition-slow);
}

.slabs-block-collapsible:not(.slabs-block-collapsible--collapsed) .slabs-block-collapsible__content {
  border-top: var(--field-input-border-width) solid var(--field-color-gray-100);
}

.slabs-block-collapsible--collapsed .slabs-block-collapsible__content {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
`;