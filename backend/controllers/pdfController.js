/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as pdfService from '../services/pdfService.js';
import { authenticateToken } from '../middleware/auth.js';
// import { pdfUpload, handlePdfUploadError } from '../middleware/pdfUpload.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', pdfService.getUploadedPdfs);
router.post('/upload-url/request', pdfService.getUploadUrl);
router.post('/upload', pdfService.uploadPdf);
router.delete('/:id', pdfService.deleteUploadedPdf);

export default router;
