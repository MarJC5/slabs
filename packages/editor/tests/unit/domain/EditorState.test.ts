import { describe, it, expect, beforeEach } from 'vitest';
import { EditorState } from '../../../src/domain/EditorState';

describe('EditorState', () => {
  let state: EditorState;

  beforeEach(() => {
    state = new EditorState();
  });

  describe('dirty state', () => {
    it('should initialize with clean state', () => {
      expect(state.isDirty()).toBe(false);
    });

    it('should mark as dirty', () => {
      state.markDirty();
      expect(state.isDirty()).toBe(true);
    });

    it('should mark as clean', () => {
      state.markDirty();
      state.markClean();
      expect(state.isDirty()).toBe(false);
    });

    it('should allow multiple dirty calls', () => {
      state.markDirty();
      state.markDirty();
      expect(state.isDirty()).toBe(true);
    });

    it('should allow multiple clean calls', () => {
      state.markDirty();
      state.markClean();
      state.markClean();
      expect(state.isDirty()).toBe(false);
    });
  });

  describe('loading state', () => {
    it('should initialize with non-loading state', () => {
      expect(state.isLoading()).toBe(false);
    });

    it('should start loading', () => {
      state.startLoading();
      expect(state.isLoading()).toBe(true);
    });

    it('should stop loading', () => {
      state.startLoading();
      state.stopLoading();
      expect(state.isLoading()).toBe(false);
    });

    it('should allow multiple start loading calls', () => {
      state.startLoading();
      state.startLoading();
      expect(state.isLoading()).toBe(true);
    });

    it('should allow multiple stop loading calls', () => {
      state.startLoading();
      state.stopLoading();
      state.stopLoading();
      expect(state.isLoading()).toBe(false);
    });
  });

  describe('error state', () => {
    it('should initialize with no error', () => {
      expect(state.hasError()).toBe(false);
      expect(state.getError()).toBeNull();
    });

    it('should set error', () => {
      const error = new Error('Test error');
      state.setError(error);

      expect(state.hasError()).toBe(true);
      expect(state.getError()).toBe(error);
    });

    it('should clear error', () => {
      const error = new Error('Test error');
      state.setError(error);
      state.clearError();

      expect(state.hasError()).toBe(false);
      expect(state.getError()).toBeNull();
    });

    it('should replace existing error', () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');

      state.setError(error1);
      state.setError(error2);

      expect(state.getError()).toBe(error2);
    });

    it('should allow clearing error multiple times', () => {
      const error = new Error('Test error');
      state.setError(error);
      state.clearError();
      state.clearError();

      expect(state.hasError()).toBe(false);
    });
  });

  describe('combined state management', () => {
    it('should mark clean and clear error together', () => {
      state.markDirty();
      state.setError(new Error('Test'));

      state.markClean();
      state.clearError();

      expect(state.isDirty()).toBe(false);
      expect(state.hasError()).toBe(false);
    });

    it('should handle dirty state independently from loading', () => {
      state.markDirty();
      state.startLoading();

      expect(state.isDirty()).toBe(true);
      expect(state.isLoading()).toBe(true);

      state.markClean();
      expect(state.isLoading()).toBe(true);
    });

    it('should handle error state independently from loading', () => {
      state.setError(new Error('Test'));
      state.startLoading();

      expect(state.hasError()).toBe(true);
      expect(state.isLoading()).toBe(true);

      state.stopLoading();
      expect(state.hasError()).toBe(true);
    });

    it('should maintain all three states independently', () => {
      state.markDirty();
      state.startLoading();
      state.setError(new Error('Test'));

      expect(state.isDirty()).toBe(true);
      expect(state.isLoading()).toBe(true);
      expect(state.hasError()).toBe(true);
    });
  });
});
