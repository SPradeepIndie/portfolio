/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { blogModel } from '../models/blogModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.getAll();
  
  res.json({
    success: true,
    data: blogs,
    total: blogs.length
  });
});

/**
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Public
 */
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await blogModel.getById(req.params.id);
  
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }
  
  // Increment views
  await blogModel.incrementViews(req.params.id);
  
  res.json({
    success: true,
    data: blog
  });
});

/**
 * @desc    Get featured blogs
 * @route   GET /api/blogs/featured
 * @access  Public
 */
export const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.getFeatured();
  
  res.json({
    success: true,
    data: blogs,
    total: blogs.length
  });
});

/**
 * @desc    Get blogs by category
 * @route   GET /api/blogs/category/:category
 * @access  Public
 */
export const getBlogsByCategory = asyncHandler(async (req, res) => {
  const blogs = await blogModel.getByCategory(req.params.category);
  
  res.json({
    success: true,
    data: blogs,
    total: blogs.length
  });
});

/**
 * @desc    Get blogs by tag
 * @route   GET /api/blogs/tag/:tag
 * @access  Public
 */
export const getBlogsByTag = asyncHandler(async (req, res) => {
  const blogs = await blogModel.getByTag(req.params.tag);
  
  res.json({
    success: true,
    data: blogs,
    total: blogs.length
  });
});

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private (manual via Postman)
 */
export const createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, author } = req.body;
  
  if (!title || !excerpt || !content || !author) {
    throw new AppError('Title, excerpt, content, and author are required', 400);
  }
  
  const blogData = {
    ...req.body,
    tags: Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags || '[]'),
    featured: req.body.featured === 'true' || req.body.featured === true,
    pdf_path: req.file ? `/uploads/blogs/${req.file.filename}` : null
  };
  
  const blog = await blogModel.create(blogData);
  
  res.status(201).json({
    success: true,
    data: blog
  });
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private (manual via Postman)
 */
export const updateBlog = asyncHandler(async (req, res) => {
  const blogData = {
    ...req.body,
    tags: Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags || '[]'),
    featured: req.body.featured === 'true' || req.body.featured === true,
  };
  
  // If new PDF uploaded, update path
  if (req.file) {
    blogData.pdf_path = `/uploads/blogs/${req.file.filename}`;
  }
  
  const blog = await blogModel.update(req.params.id, blogData);
  
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }
  
  res.json({
    success: true,
    data: blog
  });
});

/**
 * @desc    Upload PDF to existing blog
 * @route   POST /api/blogs/:id/upload-pdf
 * @access  Private (manual via Postman)
 */
export const uploadBlogPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No PDF file provided', 400);
  }
  
  const pdf_path = `/uploads/blogs/${req.file.filename}`;
  const blog = await blogModel.updatePdfPath(req.params.id, pdf_path);
  
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }
  
  res.json({
    success: true,
    data: blog,
    message: 'PDF uploaded successfully'
  });
});

/**
 * @desc    Increment blog likes
 * @route   POST /api/blogs/:id/like
 * @access  Public
 */
export const likeBlog = asyncHandler(async (req, res) => {
  const result = await blogModel.incrementLikes(req.params.id);
  
  res.json({
    success: true,
    likes: result.likes
  });
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private (manual via Postman)
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await blogModel.delete(req.params.id);
  
  if (!blog) {
    throw new AppError('Blog not found', 404);
  }
  
  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});
