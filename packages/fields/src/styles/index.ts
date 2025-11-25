/**
 * Global styles for @slabs/fields
 * Auto-injects CSS when imported
 */

// Import CSS Variables
import { CSS_VARIABLES } from './variables.css.js';

// Import Base Styles
import { FIELD_CONTAINER_CSS } from './base/field-container.css.js';
import { FIELD_LABEL_CSS } from './base/field-label.css.js';
import { FIELD_INPUT_CSS } from './base/field-input.css.js';
import { FIELD_DESCRIPTION_CSS } from './base/field-description.css.js';
import { FIELD_ERROR_CSS } from './base/field-error.css.js';

// Import Field-Specific Styles
import { TEXT_FIELD_CSS } from './fields/text.css.js';
import { TEXTAREA_FIELD_CSS } from './fields/textarea.css.js';
import { NUMBER_FIELD_CSS } from './fields/number.css.js';
import { SELECT_FIELD_CSS } from './fields/select.css.js';
import { CHECKBOX_FIELD_CSS } from './fields/checkbox.css.js';
import { BOOLEAN_FIELD_CSS } from './fields/boolean.css.js';
import { RADIO_FIELD_CSS } from './fields/radio.css.js';
import { RANGE_FIELD_CSS } from './fields/range.css.js';
import { COLOR_FIELD_CSS } from './fields/color.css.js';
import { DATE_FIELD_CSS } from './fields/date.css.js';
import { LINK_FIELD_CSS } from './fields/link.css.js';
import { IMAGE_FIELD_CSS } from './fields/image.css.js';
import { WYSIWYG_FIELD_CSS } from './fields/wysiwyg.css.js';
import { REPEATER_FIELD_CSS } from './fields/repeater.css.js';
import { TABS_FIELD_CSS } from './fields/tabs.css.js';
import { OEMBED_FIELD_CSS } from './fields/oembed.css.js';
import { FILE_FIELD_CSS } from './fields/file.css.js';
import { FLEXIBLE_FIELD_CSS } from './fields/flexible.css.js';
import { GROUP_FIELD_CSS } from './fields/group.css.js';

// Import Component Styles
import { COLLAPSIBLE_CSS } from './components/collapsible.css.js';

// Import Utility Styles
import { RESPONSIVE_CSS } from './utils/responsive.css.js';

/**
 * Combined CSS string with all styles
 */
export const FIELDS_CSS = `/**
 * Global Styles for @slabs/fields
 * Base styles for all field types
 */

${CSS_VARIABLES}

${FIELD_CONTAINER_CSS}

${FIELD_LABEL_CSS}

${FIELD_INPUT_CSS}

${FIELD_DESCRIPTION_CSS}

${FIELD_ERROR_CSS}

/* Specific Input Types */

${TEXT_FIELD_CSS}

${TEXTAREA_FIELD_CSS}

${NUMBER_FIELD_CSS}

${SELECT_FIELD_CSS}

${CHECKBOX_FIELD_CSS}

${BOOLEAN_FIELD_CSS}

${RADIO_FIELD_CSS}

${RANGE_FIELD_CSS}

${COLOR_FIELD_CSS}

${DATE_FIELD_CSS}

${LINK_FIELD_CSS}

${IMAGE_FIELD_CSS}

${COLLAPSIBLE_CSS}

${WYSIWYG_FIELD_CSS}

${REPEATER_FIELD_CSS}

${TABS_FIELD_CSS}

${OEMBED_FIELD_CSS}

${FILE_FIELD_CSS}

${FLEXIBLE_FIELD_CSS}

${GROUP_FIELD_CSS}

${RESPONSIVE_CSS}
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