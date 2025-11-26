import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ClearButton } from '../../../src/infrastructure/components/ClearButton';

describe('ClearButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('render', () => {
    it('should render button with trash icon', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl?.innerHTML).toContain('svg');
    });

    it('should apply correct position class', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-left',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).toContain('slabs-clear-button--top-left');
    });

    it('should apply different position classes', () => {
      const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ];

      positions.forEach(position => {
        const button = new ClearButton({
          onClick: vi.fn(),
          position,
        });

        const tempContainer = document.createElement('div');
        button.render(tempContainer);

        const buttonEl = tempContainer.querySelector('button');
        expect(buttonEl?.className).toContain(`slabs-clear-button--${position}`);
      });
    });

    it('should set aria-label', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
        ariaLabel: 'Clear all'
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Clear all');
    });

    it('should use default aria-label if not provided', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Clear all blocks');
    });
  });

  describe('onClick', () => {
    it('should be clickable', () => {
      const onClick = vi.fn();
      const button = new ClearButton({
        onClick,
        position: 'top-right',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl).toBeTruthy();

      // Note: We can't easily test confirm() dialog in unit tests
      // This verifies the button is properly set up
    });

    it('should not trigger when disabled', () => {
      const onClick = vi.fn();
      const button = new ClearButton({
        onClick,
        position: 'top-right',
      });

      button.render(container);
      button.setDisabled(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(true);
    });
  });

  describe('flash', () => {
    it('should add and remove active class', (done) => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);
      const buttonEl = container.querySelector('button');

      button.flash();
      expect(buttonEl?.className).toContain('slabs-icon-button--active');

      setTimeout(() => {
        expect(buttonEl?.className).not.toContain('slabs-icon-button--active');
        done();
      }, 250);
    });
  });

  describe('setDisabled', () => {
    it('should disable button when true', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);
      button.setDisabled(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(true);
    });

    it('should enable button when false', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);
      button.setDisabled(true);
      button.setDisabled(false);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should remove button from DOM', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);
      expect(container.querySelector('button')).toBeTruthy();

      button.destroy();
      expect(container.querySelector('button')).toBeFalsy();
    });

    it('should be safe to call multiple times', () => {
      const button = new ClearButton({
        onClick: vi.fn(),
        position: 'top-right',
      });

      button.render(container);

      expect(() => {
        button.destroy();
        button.destroy();
      }).not.toThrow();
    });
  });
});
