/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as researchService from '../services/researchService.js';
import { authenticateToken } from '../middleware/auth.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(60, 120), researchService.getAllResearch);
router.get('/:id', cacheControl(60, 120), researchService.getResearchById);
router.post('/', authenticateToken, researchService.createResearch);
router.put('/:id', authenticateToken, researchService.updateResearch);
router.delete('/:id', authenticateToken, researchService.deleteResearch);

export default router;
