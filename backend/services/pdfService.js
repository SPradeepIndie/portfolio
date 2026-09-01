/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import fs from 'fs';
import { query } from '../config/db.js';
import * as blobService from './blobService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { pdfModel } from '../models/pdfModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadPdf = asyncHandler(async (req, res) => {
  const { title, original_name, file_path, file_size, file_hash } = req.body;

  if (!file_path) {
    throw new AppError('File path (PDF URL) is required', 400);
  }

  const record = await pdfModel.create({
    title: title || original_name,
    original_name: original_name,
    file_path,
    uploaded_by: req.user.id,
    file_hash
  });

  res.status(201).json({
    success: true,
    data: record,
  });
});

export const getUploadUrl = asyncHandler(async (req, res) => {
  const { filename, fileHash } = req.body;

  if (!filename) {
    throw new AppError('Filename is required', 400);
  }
  
  if (fileHash) {
    // Check if file hash exists in uploaded_pdfs
    const existing = await query('SELECT file_path FROM uploaded_pdfs WHERE file_hash = $1 AND is_deleted = FALSE LIMIT 1', [fileHash]);
    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        data: {
          uploadUrl: existing.rows[0].file_path,
          blobName: existing.rows[0].file_path.split('/').pop(),
          expiresIn: 3600,
          exists: true
        }
      });
    }
  }

  // Generate unique blob name
  const blobName = blobService.generateBlobName(filename);

  // Generate SAS URL for uploading (valid for 1 hour)
  const uploadUrl = await blobService.generateUploadUrl(blobName, 1);

  res.json({
    success: true,
    data: {
      uploadUrl,
      blobName,
      expiresIn: 3600, // 1 hour in seconds
      exists: false
    },
  });
});

export const getUploadedPdfs = asyncHandler(async (req, res) => {
  const pdfs = await pdfModel.getAll();

  res.json({
    success: true,
    data: pdfs,
    total: pdfs.length,
  });
});

export const deleteUploadedPdf = asyncHandler(async (req, res) => {
  const record = await pdfModel.deleteById(req.params.id);

  if (!record) {
    throw new AppError('PDF record not found', 404);
  }

  // Since we are using Azure Blob Storage, we don't delete local files
  // If we wanted to delete the blob, we would call blobService.deleteBlob(record.file_path)

  res.json({
    success: true,
    message: 'PDF deleted successfully',
  });
});
