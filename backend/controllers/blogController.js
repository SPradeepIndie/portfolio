/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as blogService from '../services/blogService.js';
import { authenticateToken } from '../middleware/auth.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(300, 600), blogService.getAllBlogs);
router.get('/featured', cacheControl(300, 600), blogService.getFeaturedBlogs);
router.get('/category/:category', cacheControl(300, 600), blogService.getBlogsByCategory);
router.get('/tag/:tag', cacheControl(300, 600), blogService.getBlogsByTag);
router.get('/:id', cacheControl(300, 600), blogService.getBlogById);
router.post('/:id/like', blogService.likeBlog);

// PDF upload endpoints - now using Azure Blob Storage
router.post('/upload-url/request', authenticateToken, blogService.getUploadUrl);
router.post('/', authenticateToken, blogService.createBlog);
router.put('/:id', authenticateToken, blogService.updateBlog);
router.post('/:id/upload-pdf', authenticateToken, blogService.uploadBlogPdf);
router.delete('/:id', authenticateToken, blogService.deleteBlog);

export default router;
