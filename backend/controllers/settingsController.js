/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as settingsService from '../services/settingsService.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', settingsService.getSettings);

router.post('/categories', authenticateToken, authorizeRoles('admin', 'user'), settingsService.createCategory);
router.delete('/categories/:id', authenticateToken, authorizeRoles('admin', 'user'), settingsService.deleteCategory);

router.post('/tags', authenticateToken, authorizeRoles('admin', 'user'), settingsService.createTag);
router.delete('/tags/:id', authenticateToken, authorizeRoles('admin', 'user'), settingsService.deleteTag);

export default router;
