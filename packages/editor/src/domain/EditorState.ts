/**
 * EditorState - Domain Entity
 *
 * Manages the state of the editor (dirty, loading, error).
 * This is a pure domain entity with no dependencies on infrastructure.
 */
export class EditorState {
  private dirty = false;
  private loading = false;
  private error: Error | null = null;

  /**
   * Mark the editor content as modified (unsaved changes)
   */
  markDirty(): void {
    this.dirty = true;
  }

  /**
   * Mark the editor content as saved (no unsaved changes)
   */
  markClean(): void {
    this.dirty = false;
  }

  /**
   * Check if editor has unsaved changes
   */
  isDirty(): boolean {
    return this.dirty;
  }

  /**
   * Start loading state (save/load operation in progress)
   */
  startLoading(): void {
    this.loading = true;
  }

  /**
   * Stop loading state (operation completed)
   */
  stopLoading(): void {
    this.loading = false;
  }

  /**
   * Check if editor is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Set an error state
   */
  setError(error: Error): void {
    this.error = error;
  }

  /**
   * Clear the error state
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Get the current error (if any)
   */
  getError(): Error | null {
    return this.error;
  }

  /**
   * Check if editor has an error
   */
  hasError(): boolean {
    return this.error !== null;
  }
}
