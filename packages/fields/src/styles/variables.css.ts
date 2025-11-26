/**
 * CSS Variables / Design Tokens for @slabs/fields
 * Single source of truth for all design values
 * Using OKLCH color space for perceptual uniformity and wide gamut support
 * Aligned with Editor.js color palette
 */

export const CSS_VARIABLES = `
:root {
  /* ========================================
     Editor.js Color Palette (OKLCH)
     ======================================== */

  /* Selection Colors */
  --editorjs-selection: oklch(94.5% 0.025 232);      /* #e1f2ff */
  --editorjs-inline-selection: oklch(92% 0.03 232);  /* #d4ecff */

  /* Primary Colors */
  --editorjs-bg-light: oklch(97.3% 0 0);       /* #F8F8F8 - toolbar buttons */
  --editorjs-gray-text: oklch(52% 0.015 262);        /* #707684 - placeholders, settings */
  --editorjs-color-dark: oklch(19.5% 0.015 262);     /* #1D202B - dark text */
  --editorjs-active-icon: oklch(64% 0.12 235);       /* #388AE5 - blue icons */

  /* Borders & Lines */
  --editorjs-line-gray: oklch(94.8% 0.002 253);      /* #EFF0F1 */
  --editorjs-gray-border: oklch(82% 0.003 253 / 0.48); /* rgba(201, 201, 204, 0.48) */
  --editorjs-border: oklch(93.5% 0.002 253);         /* #E8E8EB */

  /* Shadows */
  --editorjs-shadow: 0 3px 15px -3px var(--color-shadow, rgba(13, 20, 33, .1)); /* rgba(13,20,33,0.13) */

  /* ========================================
     @slabs/fields Color System (OKLCH)
     Harmonized with Editor.js
     ======================================== */

  /* Grayscale */
  --field-color-white: oklch(100% 0 0);
  --field-color-gray-50: oklch(98.5% 0.001 253);     /* Lightest gray */
  --field-color-gray-100: var(--editorjs-line-gray); /* #EFF0F1 */
  --field-color-gray-200: oklch(93.5% 0.002 253);    /* #E8E8EB - borders */
  --field-color-gray-300: oklch(90% 0.003 253);      /* Borders */
  --field-color-gray-400: oklch(82% 0.003 253);      /* Gray border */
  --field-color-gray-500: var(--editorjs-gray-text); /* #707684 - muted text */
  --field-color-gray-600: oklch(45% 0.015 262);      /* Darker gray */
  --field-color-gray-700: oklch(30% 0.015 262);      /* Dark gray */
  --field-color-gray-900: var(--editorjs-color-dark);/* #1D202B - darkest */

  /* Semantic Colors */
  --field-color-primary: var(--editorjs-color-dark);  /* #1D202B - dark text */
  --field-color-primary-dark: var(--field-color-gray-700); /* Even darker */
  --field-color-muted: var(--editorjs-gray-text);     /* #707684 */

  --field-color-error: oklch(59% 0.18 25);            /* Red */
  --field-color-error-hover: oklch(52% 0.18 25);      /* Darker red */

  --field-color-focus: var(--field-color-gray-600);   /* Gray focus */
  --field-color-link: var(--editorjs-color-dark);     /* #1D202B - dark text */

  /* Background Colors */
  --field-bg-base: var(--field-color-white);
  --field-bg-disabled: var(--field-color-gray-200);
  --field-bg-muted: var(--editorjs-bg-light);         /* #eff2f5 */
  --field-bg-hover: var(--editorjs-bg-light);         /* #eff2f5 */
  --field-bg-selection: var(--editorjs-selection);    /* #e1f2ff */

  /* Border Colors */
  --field-border-color: var(--field-color-gray-200);         /* #E8E8EB */
  --field-border-color-secondary: var(--field-color-gray-300);
  --field-border-color-dashed: var(--field-color-gray-400);
  --field-border-color-hover: var(--field-color-gray-400);
  --field-border-color-focus: var(--field-color-primary);
  --field-border-color-error: var(--field-color-error);

  /* Shadows (OKLCH with alpha) */
  --field-shadow-sm: 0 1px 2px 0 oklch(0% 0 0 / 0.05);
  --field-shadow-md: var(--editorjs-shadow);                  /* Editor.js style */
  --field-shadow-switch: 0 1px 3px oklch(0% 0 0 / 0.2);
  --field-shadow-focus: oklch(0% 0 0 / 0.05) 0px 0px 0px 1px, var(--field-color-gray-300) 0px 0px 0px 1px inset;
  --field-shadow-focus-ring: 0 0 0 0.2rem oklch(52% 0.015 262 / 0.15);  /* Gray focus ring */
  --field-shadow-error-ring: 0 0 0 0.2rem oklch(59% 0.18 25 / 0.15);    /* Red error ring */
  --field-shadow-neutral-ring: 0 0 0 0.2rem oklch(52% 0.015 262 / 0.15); /* Gray ring */

  /* Spacing */
  --field-space-xs: 0.25rem;   /* 4px */
  --field-space-sm: 0.5rem;    /* 8px */
  --field-space-md: 0.75rem;   /* 12px */
  --field-space-lg: 1rem;      /* 16px */
  --field-space-xl: 1.5rem;    /* 24px */
  --field-space-2xl: 2rem;     /* 32px */

  /* Border Radius */
  --field-radius-xs: 0.25rem;  /* 4px */
  --field-radius-sm: 0.375rem; /* 6px */
  --field-radius-md: 0.5rem;   /* 8px */
  --field-radius-lg: 0.5rem;   /* 8px - same as md for consistency */
  --field-radius-full: 9999px; /* Circle */
  --field-radius-switch: 24px; /* Switch specific */

  /* Font Sizes */
  --field-text-xs: 0.85rem;    /* 13.6px */
  --field-text-sm: 0.875rem;   /* 14px */
  --field-text-label: 0.9rem;  /* 14.4px */
  --field-text-base: 0.95rem;  /* 15.2px */
  --field-text-lg: 1.25rem;    /* 20px */
  --field-text-xl: 1.5rem;     /* 24px */
  --field-text-2xl: 1.75rem;   /* 28px */
  --field-text-absolute: 14px; /* Absolute pixels for specific cases */
  --field-text-absolute-line: 20px; /* Line height */

  /* Font Weights */
  --field-font-normal: 400;
  --field-font-medium: 500;
  --field-font-semibold: 600;

  /* Transitions */
  --field-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --field-transition-base: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --field-transition-slow: 0.3s ease-in-out;
  --field-transition-legacy-fast: 0.15s ease-in-out;
  --field-transition-legacy-base: 0.2s ease-in-out;

  /* Input Specific */
  --field-input-padding: var(--field-space-md);
  --field-input-padding-sm: var(--field-space-sm);
  --field-input-border-width: 1px;
  --field-input-border-width-dashed: 2px;
  --field-input-radius: var(--field-radius-lg);

  /* Component Specific */
  --field-switch-width: 48px;
  --field-switch-height: 24px;
  --field-switch-slider-size: 18px;
  --field-switch-slider-offset: 3px;
  --field-switch-slider-translate: 24px;

  --field-checkbox-size: 18px;
  --field-radio-size: 18px;

  --field-color-preview-size: 60px;
  --field-color-preview-height: 40px;

  --field-image-preview-max: 300px;

  --field-toggle-size: 24px;
  --field-icon-size: 20px;

  /* Z-index layers */
  --field-z-base: 1;
  --field-z-dropdown: 10;
  --field-z-modal: 100;
}
`;