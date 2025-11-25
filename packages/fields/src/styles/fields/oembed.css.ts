/**
 * OEmbed Field Styles
 * Embed preview with Editor.js colors
 */

export const OEMBED_FIELD_CSS = `
/* OEmbed Container */
.slabs-field-oembed {
  display: flex;
  flex-direction: column;
  gap: var(--field-space-md);
}

/* OEmbed Preview Container */
.slabs-field__oembed-preview {
  position: relative;
  width: 100%;
  background: var(--field-color-gray-100);
  border: 1px solid var(--field-border-color);
  border-radius: var(--field-radius-md);
  overflow: hidden;
}

/* OEmbed Service Badge */
.slabs-field__oembed-service {
  position: absolute;
  top: var(--field-space-sm);
  right: var(--field-space-sm);
  padding: var(--field-space-xs) var(--field-space-sm);
  background: var(--editorjs-color-dark);
  color: var(--field-color-white);
  font-size: var(--field-text-xs);
  font-weight: var(--field-font-medium);
  border-radius: var(--field-radius-sm);
  z-index: var(--field-z-dropdown);
  text-transform: capitalize;
}

/* OEmbed Iframe */
.slabs-field__oembed-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  display: block;
}
`;