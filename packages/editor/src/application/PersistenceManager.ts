/**
 * PersistenceManager - Application Service
 *
 * Orchestrates save/load operations using a PersistenceStrategy.
 * Coordinates with EditorState to manage loading/error states.
 */

import type { PersistenceStrategy } from '../domain/types';
import type { EditorState } from '../domain/EditorState';

/**
 * PersistenceManager handles save/load operations
 * and coordinates state changes
 */
export class PersistenceManager {
  private context?: any;

  constructor(
    private strategy: PersistenceStrategy,
    private state: EditorState,
    context?: any
  ) {
    this.context = context;
  }

  /**
   * Save editor data
   * Updates state (loading, clean, error) appropriately
   */
  async save(data: any): Promise<void> {
    this.state.startLoading();

    try {
      await this.strategy.save(data, this.context);
      this.state.markClean();
      this.state.clearError();
    } catch (error) {
      this.state.setError(error as Error);
      throw error;
    } finally {
      this.state.stopLoading();
    }
  }

  /**
   * Load editor data
   * Updates state (loading, error) appropriately
   */
  async load(): Promise<any> {
    this.state.startLoading();

    try {
      const data = await this.strategy.load(this.context);
      this.state.clearError();
      return data;
    } catch (error) {
      this.state.setError(error as Error);
      throw error;
    } finally {
      this.state.stopLoading();
    }
  }

  /**
   * Update the context for subsequent operations
   * @param context - New context (e.g., updated page ID)
   */
  updateContext(context: any): void {
    this.context = context;
  }

  /**
   * Get the current EditorState
   */
  getState(): EditorState {
    return this.state;
  }
}
