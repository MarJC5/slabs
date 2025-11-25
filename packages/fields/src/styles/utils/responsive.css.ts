/**
 * Responsive Utilities
 */

export const RESPONSIVE_CSS = `
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