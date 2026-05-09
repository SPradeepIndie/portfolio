/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import * as blogService from '../services/blogService.js';
import { upload, handleUploadError } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', blogService.getAllBlogs);
router.get('/featured', blogService.getFeaturedBlogs);
router.get('/category/:category', blogService.getBlogsByCategory);
router.get('/tag/:tag', blogService.getBlogsByTag);
router.get('/:id', blogService.getBlogById);
router.post('/:id/like', blogService.likeBlog);

router.post('/', authenticateToken, upload.single('pdf'), handleUploadError, blogService.createBlog);
router.put('/:id', authenticateToken, upload.single('pdf'), handleUploadError, blogService.updateBlog);
router.post('/:id/upload-pdf', authenticateToken, upload.single('pdf'), handleUploadError, blogService.uploadBlogPdf);
router.delete('/:id', authenticateToken, blogService.deleteBlog);

export default router;
