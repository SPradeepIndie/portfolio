/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as contactService from '../services/contactService.js';

const router = express.Router();

// Public routes (used by frontend)
router.get('/info', contactService.getContactInfo);
router.post('/', contactService.submitContactForm);

// Private routes (manual data management via Postman)
router.put('/info', contactService.updateContactInfo);
router.get('/messages', contactService.getAllMessages);
router.get('/messages/:id', contactService.getMessageById);
router.delete('/messages/:id', contactService.deleteMessage);

export default router;
