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
  if (!req.file) {
    throw new AppError('No PDF file provided', 400);
  }

  const title = req.body.title || req.file.originalname;
  const file_path = `/uploads/pdfs/${req.file.filename}`;

  const record = await pdfModel.create({
    title,
    original_name: req.file.originalname,
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

  const absolutePath = path.join(__dirname, '..', record.file_path.replace(/^\//, ''));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  res.json({
    success: true,
    message: 'PDF deleted successfully',
  });
});
