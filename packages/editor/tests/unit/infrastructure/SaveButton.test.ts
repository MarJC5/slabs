import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveButton } from '../../../src/infrastructure/components/SaveButton';
import type { SaveButtonConfig } from '../../../src/infrastructure/components/SaveButton';

describe('SaveButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('should render button with icon', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl?.innerHTML).toContain('svg');
    });

    it('should apply correct position class', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-left',
        onClick
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).toContain('slabs-save-button--top-left');
    });

    it('should apply different position classes', () => {
      const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ];

      positions.forEach(position => {
        const button = new SaveButton({
          icon: 'check',
          position,
          onClick: vi.fn()
        });

        const tempContainer = document.createElement('div');
        button.render(tempContainer);

        const buttonEl = tempContainer.querySelector('button');
        expect(buttonEl?.className).toContain(`slabs-save-button--${position}`);
      });
    });

    it('should set aria-label', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick,
        ariaLabel: 'Save changes'
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Save changes');
    });

    it('should use default aria-label if not provided', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Save');
    });

    it('should handle custom SVG icon', () => {
      const customSvg = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="5"/></svg>';
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: customSvg,
        position: 'top-right',
        onClick
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.innerHTML).toContain('circle');
    });
  });

  describe('onClick', () => {
    it('should call onClick when button is clicked', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      buttonEl?.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      button.setLoading(true);

      const buttonEl = container.querySelector('button');
      buttonEl?.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('setLoading', () => {
    it('should disable button when loading', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      button.setLoading(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(true);
    });

    it('should enable button when not loading', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      button.setLoading(true);
      button.setLoading(false);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(false);
    });

    it('should add loading class when loading', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      button.setLoading(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).toContain('slabs-save-button--loading');
    });

    it('should remove loading class when not loading', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      button.setLoading(true);
      button.setLoading(false);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).not.toContain('slabs-save-button--loading');
    });
  });

  describe('destroy', () => {
    it('should remove button from DOM', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);
      expect(container.querySelector('button')).toBeTruthy();

      button.destroy();
      expect(container.querySelector('button')).toBeFalsy();
    });

    it('should be safe to call multiple times', () => {
      const onClick = vi.fn();
      const button = new SaveButton({
        icon: 'check',
        position: 'top-right',
        onClick
      });

      button.render(container);

      expect(() => {
        button.destroy();
        button.destroy();
      }).not.toThrow();
    });
  });
});
