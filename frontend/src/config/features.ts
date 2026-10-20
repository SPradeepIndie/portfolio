/**
 * Feature Flags Configuration
 * Set ENABLE_PDF_UPLOAD to true to re-enable PDF upload and blob management in the UI.
 * Set to false to disable PDF upload controls and avoid external blob storage calls.
 */
export const FEATURES = {
  ENABLE_PDF_UPLOAD: false,
} as const;
