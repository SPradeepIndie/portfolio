/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as userService from '../services/userService.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin'), userService.getAllUsers);
router.get('/:id', userService.getUserById);
router.post('/', authorizeRoles('admin'), userService.createUser);
router.put('/:id', userService.updateUser);
router.delete('/:id', authorizeRoles('admin'), userService.deleteUser);

export default router;
