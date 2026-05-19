/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as blogService from '../services/blogService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', blogService.getAllBlogs);
router.get('/featured', blogService.getFeaturedBlogs);
router.get('/category/:category', blogService.getBlogsByCategory);
router.get('/tag/:tag', blogService.getBlogsByTag);
router.get('/:id', blogService.getBlogById);
router.post('/:id/like', blogService.likeBlog);

// PDF upload endpoints - now using Azure Blob Storage
router.post('/upload-url/request', authenticateToken, blogService.getUploadUrl);
router.post('/', authenticateToken, blogService.createBlog);
router.put('/:id', authenticateToken, blogService.updateBlog);
router.post('/:id/upload-pdf', authenticateToken, blogService.uploadBlogPdf);
router.delete('/:id', authenticateToken, blogService.deleteBlog);

export default router;
