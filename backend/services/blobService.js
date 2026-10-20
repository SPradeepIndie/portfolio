/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { del } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';

/**
 * Handle Vercel Blob client upload token generation and callback
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const handleBlobUpload = async (req, res) => {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          tokenPayload: JSON.stringify({ userId: req.user?.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('PDF uploaded successfully to Vercel Blob:', blob.url);
      },
    });

    return res.json(jsonResponse);
  } catch (error) {
    console.error('Error handling Vercel Blob upload:', error);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a blob from Vercel Blob storage
 * @param {string} blobUrl - Full URL of the blob to delete
 * @returns {Promise<void>}
 */
export const deleteBlob = async (blobUrl) => {
  if (!blobUrl || !blobUrl.includes('vercel-storage.com')) {
    return;
  }

  try {
    await del(blobUrl);
    console.log('Deleted blob from Vercel storage:', blobUrl);
  } catch (error) {
    console.warn('Notice: Error or blob not found during deletion:', error.message);
  }
};

/**
 * Generate a unique blob name for a PDF
 * @param {string} originalFileName - Original filename
 * @returns {string} - Unique blob name
 */
export const generateBlobName = (originalFileName) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = originalFileName.split('.').pop() || 'pdf';
  const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-${timestamp}-${randomId}.${ext}`;
};

/**
 * Get blob URL directly
 * @param {string} blobNameOrUrl - Name or URL of the blob
 * @returns {string} - Direct blob URL
 */
export const getBlobUrl = (blobNameOrUrl) => {
  return blobNameOrUrl || '';
};
