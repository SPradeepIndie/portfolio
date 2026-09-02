/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { settingsModel } from '../models/settingsModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  const [categories, tags] = await Promise.all([
    settingsModel.getAllCategories(),
    settingsModel.getAllTags(),
  ]);
  
  res.json({
    success: true,
    data: {
      categories,
      tags
    }
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.entity_type) {
    throw new AppError('name and entity_type are required', 400);
  }
  const category = await settingsModel.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await settingsModel.deleteCategory(req.params.id);
  res.json({ success: true });
});

export const createTag = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.entity_type) {
    throw new AppError('name and entity_type are required', 400);
  }
  const tag = await settingsModel.createTag(req.body);
  res.status(201).json({ success: true, data: tag });
});

export const deleteTag = asyncHandler(async (req, res) => {
  await settingsModel.deleteTag(req.params.id);
  res.json({ success: true });
});
