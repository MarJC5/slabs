import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StatusAlert } from '../../../src/infrastructure/components/StatusAlert';
import type { Notification } from '../../../src/domain/types';

describe('StatusAlert', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('render', () => {
    it('should render alert container', () => {
      const alert = new StatusAlert();

      alert.render(container);

      const alertElement = container.querySelector('.slabs-alert');
      expect(alertElement).not.toBeNull();
    });

    it('should apply fixed position class', () => {
      const alert = new StatusAlert();

      alert.render(container);

      const alertElement = container.querySelector('.slabs-alert--fixed');
      expect(alertElement).not.toBeNull();
    });

    it('should be hidden by default', () => {
      const alert = new StatusAlert();

      alert.render(container);

      const alertElement = container.querySelector('.slabs-alert') as HTMLElement;
      expect(alertElement.style.display).toBe('none');
    });
  });

  describe('show', () => {
    it('should display success notification', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '1',
        type: 'success',
        message: 'Saved successfully'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert') as HTMLElement;
      expect(alertElement.style.display).not.toBe('none');
    });

    it('should display error notification', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '2',
        type: 'error',
        message: 'Failed to save'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert') as HTMLElement;
      expect(alertElement.style.display).not.toBe('none');
    });

    it('should display info notification', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '3',
        type: 'info',
        message: 'Loading...'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert') as HTMLElement;
      expect(alertElement.style.display).not.toBe('none');
    });

    it('should apply success type class', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '1',
        type: 'success',
        message: 'Saved successfully'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert--success');
      expect(alertElement).not.toBeNull();
    });

    it('should apply error type class', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '2',
        type: 'error',
        message: 'Failed to save'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert--error');
      expect(alertElement).not.toBeNull();
    });

    it('should apply info type class', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '3',
        type: 'info',
        message: 'Loading...'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert--info');
      expect(alertElement).not.toBeNull();
    });

    it('should display notification message', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '1',
        type: 'success',
        message: 'Data saved'
      };

      alert.show(notification);

      const messageElement = container.querySelector('.slabs-alert__message');
      expect(messageElement?.textContent).toBe('Data saved');
    });


    it('should replace previous notification type class', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const successNotification: Notification = {
        id: '1',
        type: 'success',
        message: 'Success'
      };

      alert.show(successNotification);
      expect(container.querySelector('.slabs-alert--success')).not.toBeNull();

      const errorNotification: Notification = {
        id: '2',
        type: 'error',
        message: 'Error'
      };

      alert.show(errorNotification);
      expect(container.querySelector('.slabs-alert--success')).toBeNull();
      expect(container.querySelector('.slabs-alert--error')).not.toBeNull();
    });

    it('should update message when showing new notification', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification1: Notification = {
        id: '1',
        type: 'success',
        message: 'First message'
      };

      alert.show(notification1);

      const messageElement = container.querySelector('.slabs-alert__message');
      expect(messageElement?.textContent).toBe('First message');

      const notification2: Notification = {
        id: '2',
        type: 'info',
        message: 'Second message'
      };

      alert.show(notification2);
      expect(messageElement?.textContent).toBe('Second message');
    });
  });

  describe('hide', () => {
    it('should hide the alert', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '1',
        type: 'success',
        message: 'Success'
      };

      alert.show(notification);

      const alertElement = container.querySelector('.slabs-alert') as HTMLElement;
      expect(alertElement.style.display).not.toBe('none');

      alert.hide();
      expect(alertElement.style.display).toBe('none');
    });

    it('should be safe to call when already hidden', () => {
      const alert = new StatusAlert();
      alert.render(container);

      expect(() => {
        alert.hide();
        alert.hide();
      }).not.toThrow();
    });

    it('should remove all type classes when hiding', () => {
      const alert = new StatusAlert();
      alert.render(container);

      const notification: Notification = {
        id: '1',
        type: 'success',
        message: 'Success'
      };

      alert.show(notification);
      alert.hide();

      expect(container.querySelector('.slabs-alert--success')).toBeNull();
      expect(container.querySelector('.slabs-alert--error')).toBeNull();
      expect(container.querySelector('.slabs-alert--info')).toBeNull();
    });
  });

  describe('destroy', () => {
    it('should remove element from DOM', () => {
      const alert = new StatusAlert();
      alert.render(container);

      expect(container.querySelector('.slabs-alert')).not.toBeNull();

      alert.destroy();

      expect(container.querySelector('.slabs-alert')).toBeNull();
    });

    it('should be safe to call multiple times', () => {
      const alert = new StatusAlert();
      alert.render(container);

      expect(() => {
        alert.destroy();
        alert.destroy();
      }).not.toThrow();
    });
  });

});
