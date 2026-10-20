/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { researchModel } from '../models/researchModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all research items (public or admin)
 * @route   GET /api/research
 * @access  Public
 */
export const getAllResearch = asyncHandler(async (req, res) => {
  const isAdmin = req.query.admin === 'true';
  const research = isAdmin ? await researchModel.getAllAdmin() : await researchModel.getAll();

  res.json({
    success: true,
    data: research,
    total: research.length,
  });
});

/**
 * @desc    Get research item by ID
 * @route   GET /api/research/:id
 * @access  Public
 */
export const getResearchById = asyncHandler(async (req, res) => {
  const item = await researchModel.getById(req.params.id);

  if (!item) {
    throw new AppError('Research publication not found', 404);
  }

  res.json({
    success: true,
    data: item,
  });
});

/**
 * @desc    Create new research publication
 * @route   POST /api/research
 * @access  Private
 */
export const createResearch = asyncHandler(async (req, res) => {
  const { title, abstract, author } = req.body;

  if (!title || !abstract || !author) {
    throw new AppError('Title, abstract, and author are required', 400);
  }

  const newResearch = await researchModel.create(req.body);

  res.status(201).json({
    success: true,
    data: newResearch,
    message: 'Research publication created successfully',
  });
});

/**
 * @desc    Update research publication
 * @route   PUT /api/research/:id
 * @access  Private
 */
export const updateResearch = asyncHandler(async (req, res) => {
  const existing = await researchModel.getById(req.params.id);

  if (!existing) {
    throw new AppError('Research publication not found', 404);
  }

  const updatedResearch = await researchModel.update(req.params.id, req.body);

  res.json({
    success: true,
    data: updatedResearch,
    message: 'Research publication updated successfully',
  });
});

/**
 * @desc    Delete research publication
 * @route   DELETE /api/research/:id
 * @access  Private
 */
export const deleteResearch = asyncHandler(async (req, res) => {
  const existing = await researchModel.getById(req.params.id);

  if (!existing) {
    throw new AppError('Research publication not found', 404);
  }

  await researchModel.delete(req.params.id);

  res.json({
    success: true,
    message: 'Research publication deleted successfully',
  });
});
