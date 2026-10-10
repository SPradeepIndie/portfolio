/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as projectService from '../services/projectService.js';
import { authenticateToken } from '../middleware/auth.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

// Public routes (used by frontend) with Edge CDN caching
router.get('/', cacheControl(300, 600), projectService.getAllProjects);
router.get('/featured', cacheControl(300, 600), projectService.getFeaturedProjects);
router.get('/category/:category', cacheControl(300, 600), projectService.getProjectsByCategory);
router.get('/:id', cacheControl(300, 600), projectService.getProjectById);

// Private routes (manual data management via Postman)
router.post('/', authenticateToken, projectService.createProject);
router.put('/:id', authenticateToken, projectService.updateProject);
router.delete('/:id', authenticateToken, projectService.deleteProject);

export default router;
