/**
 * Persistence Strategy Implementations
 *
 * Concrete implementations of the PersistenceStrategy interface
 */

import type { PersistenceStrategy } from './types';

/**
 * LocalStorage Persistence Strategy
 *
 * Saves editor content to browser localStorage
 */
export class LocalStoragePersistence implements PersistenceStrategy {
  constructor(private key: string) {}

  async save(data: any, _context?: any): Promise<void> {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${error}`);
    }
  }

  async load(_context?: any): Promise<any> {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (error) {
      // Return null for invalid JSON or other errors
      return null;
    }
  }
}

/**
 * API Fetch Persistence Strategy
 *
 * Saves editor content to a REST API endpoint
 */
export class ApiFetchPersistence implements PersistenceStrategy {
  constructor(private baseUrl: string) {}

  async save(data: any, context?: any): Promise<void> {
    const url = `${this.baseUrl}/${context?.id}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async load(context?: any): Promise<any> {
    const url = `${this.baseUrl}/${context?.id}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
