/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as contactService from '../services/contactService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (used by frontend)
router.get('/info', contactService.getContactInfo);
router.post('/', contactService.submitContactForm);

// Private routes (manual data management via Postman)
router.put('/info', authenticateToken, contactService.updateContactInfo);
router.get('/messages', authenticateToken, contactService.getAllMessages);
router.get('/messages/:id', authenticateToken, contactService.getMessageById);
router.delete('/messages/:id', authenticateToken, contactService.deleteMessage);

export default router;
