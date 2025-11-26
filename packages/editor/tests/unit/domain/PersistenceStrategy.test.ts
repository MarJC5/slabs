import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalStoragePersistence, ApiFetchPersistence } from '../../../src/domain/PersistenceStrategy';

describe('LocalStoragePersistence', () => {
  let persistence: LocalStoragePersistence;
  const testKey = 'test-editor-content';

  beforeEach(() => {
    persistence = new LocalStoragePersistence(testKey);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save', () => {
    it('should save data to localStorage', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };

      await persistence.save(data);

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should overwrite existing data', async () => {
      const data1 = { blocks: [{ type: 'paragraph', data: { text: 'First' } }] };
      const data2 = { blocks: [{ type: 'paragraph', data: { text: 'Second' } }] };

      await persistence.save(data1);
      await persistence.save(data2);

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(data2));
    });

    it('should handle empty data', async () => {
      const data = { blocks: [] };

      await persistence.save(data);

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(data));
    });

    it('should ignore context parameter', async () => {
      const data = { blocks: [] };
      const context = { pageId: '123' };

      await persistence.save(data, context);

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(data));
    });
  });

  describe('load', () => {
    it('should load data from localStorage', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };
      localStorage.setItem(testKey, JSON.stringify(data));

      const loaded = await persistence.load();

      expect(loaded).toEqual(data);
    });

    it('should return null when no data exists', async () => {
      const loaded = await persistence.load();

      expect(loaded).toBeNull();
    });

    it('should return null for invalid JSON', async () => {
      localStorage.setItem(testKey, 'invalid json{');

      const loaded = await persistence.load();

      expect(loaded).toBeNull();
    });

    it('should ignore context parameter', async () => {
      const data = { blocks: [] };
      localStorage.setItem(testKey, JSON.stringify(data));

      const loaded = await persistence.load({ pageId: '123' });

      expect(loaded).toEqual(data);
    });
  });
});

describe('ApiFetchPersistence', () => {
  let persistence: ApiFetchPersistence;
  const baseUrl = 'https://api.example.com/content';

  beforeEach(() => {
    persistence = new ApiFetchPersistence(baseUrl);
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('save', () => {
    it('should POST data to API', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };
      const context = { id: '123' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await persistence.save(data, context);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/123`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
    });

    it('should handle missing context id', async () => {
      const data = { blocks: [] };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await persistence.save(data);

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/undefined`,
        expect.any(Object)
      );
    });

    it('should throw on HTTP error', async () => {
      const data = { blocks: [] };
      const context = { id: '123' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(persistence.save(data, context)).rejects.toThrow('Failed to save: 500 Internal Server Error');
    });

    it('should throw on network error', async () => {
      const data = { blocks: [] };
      const context = { id: '123' };

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(persistence.save(data, context)).rejects.toThrow('Network error');
    });
  });

  describe('load', () => {
    it('should GET data from API', async () => {
      const data = { blocks: [{ type: 'paragraph', data: { text: 'Hello' } }] };
      const context = { id: '123' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => data
      });

      const loaded = await persistence.load(context);

      expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/123`);
      expect(loaded).toEqual(data);
    });

    it('should handle missing context id', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ blocks: [] })
      });

      await persistence.load();

      expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/undefined`);
    });

    it('should throw on HTTP error', async () => {
      const context = { id: '123' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(persistence.load(context)).rejects.toThrow('Failed to load: 404 Not Found');
    });

    it('should throw on network error', async () => {
      const context = { id: '123' };

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(persistence.load(context)).rejects.toThrow('Network error');
    });
  });
});
