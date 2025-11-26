import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ViewToggle } from '../../../src/infrastructure/components/ViewToggle';

describe('ViewToggle', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('render', () => {
    it('should render both view and edit buttons', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });

    it('should apply correct CSS classes to container', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const toggleContainer = container.querySelector('.slabs-view-toggle');
      expect(toggleContainer).not.toBeNull();
    });

    it('should render view button with eye icon', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const viewButton = container.querySelector('.slabs-view-toggle__view');
      expect(viewButton).not.toBeNull();
      expect(viewButton?.innerHTML).toBeTruthy();
      expect(viewButton?.innerHTML.length).toBeGreaterThan(0);
    });

    it('should render edit button with pencil icon', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const editButton = container.querySelector('.slabs-view-toggle__edit');
      expect(editButton).not.toBeNull();
      expect(editButton?.innerHTML).toBeTruthy();
      expect(editButton?.innerHTML.length).toBeGreaterThan(0);
    });

    it('should set aria-label on view button', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const viewButton = container.querySelector('.slabs-view-toggle__view');
      expect(viewButton?.getAttribute('aria-label')).toBe('View');
    });

    it('should set aria-label on edit button', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const editButton = container.querySelector('.slabs-view-toggle__edit');
      expect(editButton?.getAttribute('aria-label')).toBe('Edit');
    });

    it('should apply custom position class', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn(),
        position: 'top-left'
      });

      toggle.render(container);

      const toggleContainer = container.querySelector('.slabs-view-toggle--top-left');
      expect(toggleContainer).not.toBeNull();
    });

    it('should default to bottom-left position', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const toggleContainer = container.querySelector('.slabs-view-toggle--bottom-left');
      expect(toggleContainer).not.toBeNull();
    });
  });

  describe('view button interaction', () => {
    it('should navigate to viewUrl when view button is clicked', () => {
      const viewUrl = 'https://example.com/view';
      const toggle = new ViewToggle({
        viewUrl,
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const viewButton = container.querySelector('.slabs-view-toggle__view') as HTMLButtonElement;

      // Mock window.location.href
      let capturedHref = '';
      const locationMock = {
        get href() {
          return capturedHref;
        },
        set href(value: string) {
          capturedHref = value;
        }
      };

      Object.defineProperty(window, 'location', {
        value: locationMock,
        writable: true,
        configurable: true
      });

      viewButton.click();

      expect(capturedHref).toBe(viewUrl);
    });

    it('should not be disabled by default', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const viewButton = container.querySelector('.slabs-view-toggle__view') as HTMLButtonElement;
      expect(viewButton.disabled).toBe(false);
    });
  });

  describe('edit button interaction', () => {
    it('should call onEditClick when edit button is clicked', () => {
      const onEditClick = vi.fn();
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick
      });

      toggle.render(container);

      const editButton = container.querySelector('.slabs-view-toggle__edit') as HTMLButtonElement;
      editButton.click();

      expect(onEditClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onEditClick if button is disabled', () => {
      const onEditClick = vi.fn();
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick
      });

      toggle.render(container);

      const editButton = container.querySelector('.slabs-view-toggle__edit') as HTMLButtonElement;
      editButton.disabled = true;
      editButton.click();

      expect(onEditClick).not.toHaveBeenCalled();
    });
  });

  describe('setMode', () => {
    it('should highlight view button in view mode', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);
      toggle.setMode('view');

      const viewButton = container.querySelector('.slabs-view-toggle__view');
      expect(viewButton?.classList.contains('slabs-view-toggle__button--active')).toBe(true);
    });

    it('should highlight edit button in edit mode', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);
      toggle.setMode('edit');

      const editButton = container.querySelector('.slabs-view-toggle__edit');
      expect(editButton?.classList.contains('slabs-view-toggle__button--active')).toBe(true);
    });

    it('should remove highlight from view button when switching to edit', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);
      toggle.setMode('view');
      toggle.setMode('edit');

      const viewButton = container.querySelector('.slabs-view-toggle__view');
      expect(viewButton?.classList.contains('slabs-view-toggle__button--active')).toBe(false);
    });

    it('should remove highlight from edit button when switching to view', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);
      toggle.setMode('edit');
      toggle.setMode('view');

      const editButton = container.querySelector('.slabs-view-toggle__edit');
      expect(editButton?.classList.contains('slabs-view-toggle__button--active')).toBe(false);
    });

    it('should default to edit mode on initial render', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      const editButton = container.querySelector('.slabs-view-toggle__edit');
      expect(editButton?.classList.contains('slabs-view-toggle__button--active')).toBe(true);
    });
  });

  describe('destroy', () => {
    it('should remove element from DOM', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      expect(container.querySelector('.slabs-view-toggle')).not.toBeNull();

      toggle.destroy();

      expect(container.querySelector('.slabs-view-toggle')).toBeNull();
    });

    it('should be safe to call multiple times', () => {
      const toggle = new ViewToggle({
        viewUrl: 'https://example.com/view',
        onEditClick: vi.fn()
      });

      toggle.render(container);

      expect(() => {
        toggle.destroy();
        toggle.destroy();
      }).not.toThrow();
    });
  });
});
