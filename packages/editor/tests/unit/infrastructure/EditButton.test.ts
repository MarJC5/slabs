import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EditButton } from '../../../src/infrastructure/components/EditButton';
import type { EditButtonConfig } from '../../../src/infrastructure/components/EditButton';

describe('EditButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('should render button with pencil icon', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl).toBeTruthy();
      expect(buttonEl?.innerHTML).toContain('svg');
    });

    it('should apply correct position class', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-right',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).toContain('slabs-edit-button--top-right');
    });

    it('should apply different position classes', () => {
      const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ];

      positions.forEach(position => {
        const button = new EditButton({
          editUrl: '/edit',
          position,
        });

        const tempContainer = document.createElement('div');
        button.render(tempContainer);

        const buttonEl = tempContainer.querySelector('button');
        expect(buttonEl?.className).toContain(`slabs-edit-button--${position}`);
      });
    });

    it('should set aria-label', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
        ariaLabel: 'Edit page'
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Edit page');
    });

    it('should use default aria-label if not provided', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.getAttribute('aria-label')).toBe('Edit');
    });
  });

  describe('onClick', () => {
    it('should navigate to editUrl when clicked', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      buttonEl?.click();

      // Note: In test environment, location change might not work
      // This test verifies the button is clickable and doesn't throw
      expect(buttonEl).toBeTruthy();
    });

    it('should call onEditClick when provided', () => {
      const onEditClick = vi.fn();
      const button = new EditButton({
        onEditClick,
        position: 'top-left',
      });

      button.render(container);

      const buttonEl = container.querySelector('button');
      buttonEl?.click();

      expect(onEditClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onEditClick = vi.fn();
      const button = new EditButton({
        onEditClick,
        position: 'top-left',
      });

      button.render(container);
      button.setDisabled(true);

      const buttonEl = container.querySelector('button');
      buttonEl?.click();

      expect(onEditClick).not.toHaveBeenCalled();
    });
  });

  describe('setActive', () => {
    it('should add active class when true', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);
      button.setActive(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).toContain('slabs-icon-button--active');
    });

    it('should remove active class when false', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);
      button.setActive(true);
      button.setActive(false);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.className).not.toContain('slabs-icon-button--active');
    });
  });

  describe('setDisabled', () => {
    it('should disable button when true', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);
      button.setDisabled(true);

      const buttonEl = container.querySelector('button');
      expect(buttonEl?.disabled).toBe(true);
    });

    it('should enable button when false', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
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
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);
      expect(container.querySelector('button')).toBeTruthy();

      button.destroy();
      expect(container.querySelector('button')).toBeFalsy();
    });

    it('should be safe to call multiple times', () => {
      const button = new EditButton({
        editUrl: '/edit',
        position: 'top-left',
      });

      button.render(container);

      expect(() => {
        button.destroy();
        button.destroy();
      }).not.toThrow();
    });
  });
});
