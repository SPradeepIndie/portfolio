/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { projectModel } from '../models/projectModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel.getAll();
  
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectModel.getById(req.params.id);
  
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  res.json({
    success: true,
    data: project
  });
});

/**
 * @desc    Get featured projects
 * @route   GET /api/projects/featured
 * @access  Public
 */
export const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel.getFeatured();
  
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

/**
 * @desc    Get projects by category
 * @route   GET /api/projects/category/:category
 * @access  Public
 */
export const getProjectsByCategory = asyncHandler(async (req, res) => {
  const projects = await projectModel.getByCategory(req.params.category);
  
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private (manual via Postman)
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    throw new AppError('Title and description are required', 400);
  }
  
  const project = await projectModel.create(req.body);
  
  res.status(201).json({
    success: true,
    data: project
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (manual via Postman)
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectModel.update(req.params.id, req.body);
  
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  res.json({
    success: true,
    data: project
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (manual via Postman)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await projectModel.delete(req.params.id);
  
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});
