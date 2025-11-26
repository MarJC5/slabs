import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PersistenceManager } from '../../../src/application/PersistenceManager';
import { EditorState } from '../../../src/domain/EditorState';
import type { PersistenceStrategy } from '../../../src/domain/types';

describe('PersistenceManager', () => {
  let manager: PersistenceManager;
  let state: EditorState;
  let mockStrategy: PersistenceStrategy;

  beforeEach(() => {
    state = new EditorState();
    mockStrategy = {
      save: vi.fn(),
      load: vi.fn()
    };
    manager = new PersistenceManager(mockStrategy, state);
  });

  describe('save', () => {
    it('should set loading state before save', async () => {
      const data = { blocks: [] };
      mockStrategy.save = vi.fn().mockImplementation(() => {
        expect(state.isLoading()).toBe(true);
        return Promise.resolve();
      });

      await manager.save(data);
    });

    it('should call strategy save with data', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };

      await manager.save(data);

      expect(mockStrategy.save).toHaveBeenCalledWith(data, undefined);
    });

    it('should call strategy save with context', async () => {
      const data = { blocks: [] };
      const context = { pageId: '123', userId: 'user-456' };

      manager = new PersistenceManager(mockStrategy, state, context);

      await manager.save(data);

      expect(mockStrategy.save).toHaveBeenCalledWith(data, context);
    });

    it('should mark state as clean after successful save', async () => {
      const data = { blocks: [] };
      state.markDirty();

      await manager.save(data);

      expect(state.isDirty()).toBe(false);
    });

    it('should clear error after successful save', async () => {
      const data = { blocks: [] };
      state.setError(new Error('Previous error'));

      await manager.save(data);

      expect(state.hasError()).toBe(false);
    });

    it('should stop loading after successful save', async () => {
      const data = { blocks: [] };

      await manager.save(data);

      expect(state.isLoading()).toBe(false);
    });

    it('should set error on save failure', async () => {
      const data = { blocks: [] };
      const error = new Error('Network error');
      mockStrategy.save = vi.fn().mockRejectedValue(error);

      await expect(manager.save(data)).rejects.toThrow('Network error');

      expect(state.hasError()).toBe(true);
      expect(state.getError()).toBe(error);
    });

    it('should stop loading on save failure', async () => {
      const data = { blocks: [] };
      mockStrategy.save = vi.fn().mockRejectedValue(new Error('Error'));

      try {
        await manager.save(data);
      } catch (e) {
        // Expected
      }

      expect(state.isLoading()).toBe(false);
    });

    it('should not mark clean on save failure', async () => {
      const data = { blocks: [] };
      state.markDirty();
      mockStrategy.save = vi.fn().mockRejectedValue(new Error('Error'));

      try {
        await manager.save(data);
      } catch (e) {
        // Expected
      }

      expect(state.isDirty()).toBe(true);
    });
  });

  describe('load', () => {
    it('should set loading state before load', async () => {
      mockStrategy.load = vi.fn().mockImplementation(() => {
        expect(state.isLoading()).toBe(true);
        return Promise.resolve({ blocks: [] });
      });

      await manager.load();
    });

    it('should call strategy load', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };
      mockStrategy.load = vi.fn().mockResolvedValue(data);

      const result = await manager.load();

      expect(mockStrategy.load).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(data);
    });

    it('should call strategy load with context', async () => {
      const data = { blocks: [] };
      const context = { pageId: '123' };

      manager = new PersistenceManager(mockStrategy, state, context);
      mockStrategy.load = vi.fn().mockResolvedValue(data);

      await manager.load();

      expect(mockStrategy.load).toHaveBeenCalledWith(context);
    });

    it('should clear error after successful load', async () => {
      const data = { blocks: [] };
      state.setError(new Error('Previous error'));
      mockStrategy.load = vi.fn().mockResolvedValue(data);

      await manager.load();

      expect(state.hasError()).toBe(false);
    });

    it('should stop loading after successful load', async () => {
      const data = { blocks: [] };
      mockStrategy.load = vi.fn().mockResolvedValue(data);

      await manager.load();

      expect(state.isLoading()).toBe(false);
    });

    it('should set error on load failure', async () => {
      const error = new Error('Network error');
      mockStrategy.load = vi.fn().mockRejectedValue(error);

      await expect(manager.load()).rejects.toThrow('Network error');

      expect(state.hasError()).toBe(true);
      expect(state.getError()).toBe(error);
    });

    it('should stop loading on load failure', async () => {
      mockStrategy.load = vi.fn().mockRejectedValue(new Error('Error'));

      try {
        await manager.load();
      } catch (e) {
        // Expected
      }

      expect(state.isLoading()).toBe(false);
    });
  });

  describe('updateContext', () => {
    it('should update context for subsequent operations', async () => {
      const data = { blocks: [] };
      const newContext = { pageId: '456', userId: 'user-789' };

      manager.updateContext(newContext);
      await manager.save(data);

      expect(mockStrategy.save).toHaveBeenCalledWith(data, newContext);
    });

    it('should merge with existing context', async () => {
      const data = { blocks: [] };
      const initialContext = { pageId: '123', userId: 'user-456' };
      const newContext = { pageId: '789' }; // Only update pageId

      manager = new PersistenceManager(mockStrategy, state, initialContext);
      manager.updateContext(newContext);
      await manager.save(data);

      expect(mockStrategy.save).toHaveBeenCalledWith(data, { pageId: '789' });
    });
  });

  describe('getState', () => {
    it('should return the EditorState instance', () => {
      const returnedState = manager.getState();
      expect(returnedState).toBe(state);
    });

    it('should return state with current loading status', () => {
      state.startLoading();
      expect(manager.getState().isLoading()).toBe(true);
    });

    it('should return state with current dirty status', () => {
      state.markDirty();
      expect(manager.getState().isDirty()).toBe(true);
    });
  });
});
