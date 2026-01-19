/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as portfolioService from '../services/portfolioService.js';

const router = express.Router();

// Public route (used by frontend)
router.get('/', portfolioService.getPortfolio);

export default router;
