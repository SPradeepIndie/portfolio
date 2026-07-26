/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pdfModel } from '../models/pdfModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadPdf = asyncHandler(async (req, res) => {
  const { title, original_name, file_path, file_size } = req.body;

  if (!file_path) {
    throw new AppError('File path (PDF URL) is required', 400);
  }

  const record = await pdfModel.create({
    title: title || original_name,
    original_name: original_name,
    file_path,
    uploaded_by: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: record,
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
