/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as projectService from '../services/projectService.js';

const router = express.Router();

// Public routes (used by frontend)
router.get('/', projectService.getAllProjects);
router.get('/featured', projectService.getFeaturedProjects);
router.get('/category/:category', projectService.getProjectsByCategory);
router.get('/:id', projectService.getProjectById);

// Private routes (manual data management via Postman)
router.post('/', projectService.createProject);
router.put('/:id', projectService.updateProject);
router.delete('/:id', projectService.deleteProject);

export default router;
