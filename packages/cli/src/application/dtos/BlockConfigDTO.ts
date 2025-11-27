/**
 * Data Transfer Object for block configuration result.
 * Returned after successful block creation.
 */
export interface BlockConfigDTO {
  /**
   * The created block name
   */
  blockName: string;

  /**
   * Full path to the created block directory
   */
  blockPath: string;

  /**
   * List of files that were created
   */
  createdFiles: string[];

  /**
   * Success status
   */
  success: boolean;

  /**
   * Optional message
   */
  message?: string;
}
