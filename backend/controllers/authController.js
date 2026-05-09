/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as authService from '../services/authService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authService.register);
router.post('/login', authService.login);
router.post('/refresh', authService.refresh);
router.post('/logout', authService.logout);
router.get('/me', authenticateToken, authService.getMe);
router.put('/me', authenticateToken, authService.updateMe);

export default router;
