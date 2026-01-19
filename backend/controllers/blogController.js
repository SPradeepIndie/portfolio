/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as blogService from '../services/blogService.js';
import { upload, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes (used by frontend)
router.get('/', blogService.getAllBlogs);
router.get('/featured', blogService.getFeaturedBlogs);
router.get('/category/:category', blogService.getBlogsByCategory);
router.get('/tag/:tag', blogService.getBlogsByTag);
router.get('/:id', blogService.getBlogById);
router.post('/:id/like', blogService.likeBlog);

// Private routes (manual data management via Postman)
router.post('/', upload.single('pdf'), handleUploadError, blogService.createBlog);
router.put('/:id', upload.single('pdf'), handleUploadError, blogService.updateBlog);
router.post('/:id/upload-pdf', upload.single('pdf'), handleUploadError, blogService.uploadBlogPdf);
router.delete('/:id', blogService.deleteBlog);

export default router;
