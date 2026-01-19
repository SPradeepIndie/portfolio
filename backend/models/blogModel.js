/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const blogModel = {
  // Get all blogs
  getAll: async () => {
    const result = await query(
      'SELECT * FROM blogs ORDER BY published_at DESC'
    );
    return result.rows;
  },

  // Get blog by ID
  getById: async (id) => {
    const result = await query('SELECT * FROM blogs WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Get featured blogs
  getFeatured: async () => {
    const result = await query(
      'SELECT * FROM blogs WHERE featured = true ORDER BY published_at DESC'
    );
    return result.rows;
  },

  // Get blogs by category
  getByCategory: async (category) => {
    const result = await query(
      'SELECT * FROM blogs WHERE category = $1 ORDER BY published_at DESC',
      [category]
    );
    return result.rows;
  },

  // Get blogs by tag
  getByTag: async (tag) => {
    const result = await query(
      'SELECT * FROM blogs WHERE $1 = ANY(tags) ORDER BY published_at DESC',
      [tag]
    );
    return result.rows;
  },

  // Create new blog
  create: async (blogData) => {
    const {
      title,
      excerpt,
      content,
      pdf_path,
      author,
      read_time,
      tags,
      featured,
      image,
      category,
    } = blogData;

    const result = await query(
      `INSERT INTO blogs (title, excerpt, content, pdf_path, author, read_time, tags, featured, image, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, excerpt, content, pdf_path, author, read_time, tags, featured, image, category]
    );
    return result.rows[0];
  },

  // Update blog
  update: async (id, blogData) => {
    const {
      title,
      excerpt,
      content,
      pdf_path,
      author,
      read_time,
      tags,
      featured,
      image,
      category,
    } = blogData;

    const result = await query(
      `UPDATE blogs 
       SET title = $1, excerpt = $2, content = $3, pdf_path = $4, author = $5,
           read_time = $6, tags = $7, featured = $8, image = $9, category = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [title, excerpt, content, pdf_path, author, read_time, tags, featured, image, category, id]
    );
    return result.rows[0];
  },

  // Update blog PDF path only
  updatePdfPath: async (id, pdf_path) => {
    const result = await query(
      `UPDATE blogs 
       SET pdf_path = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [pdf_path, id]
    );
    return result.rows[0];
  },

  // Increment views
  incrementViews: async (id) => {
    const result = await query(
      'UPDATE blogs SET views = views + 1 WHERE id = $1 RETURNING views',
      [id]
    );
    return result.rows[0];
  },

  // Increment likes
  incrementLikes: async (id) => {
    const result = await query(
      'UPDATE blogs SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [id]
    );
    return result.rows[0];
  },

  // Delete blog
  delete: async (id) => {
    const result = await query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
