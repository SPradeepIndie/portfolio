/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as portfolioService from '../services/portfolioService.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

// Public route (used by frontend) with Edge CDN caching
router.get('/', cacheControl(300, 600), portfolioService.getPortfolio);

export default router;
