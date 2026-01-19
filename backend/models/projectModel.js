/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const projectModel = {
  // Get all projects
  getAll: async () => {
    const result = await query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get project by ID
  getById: async (id) => {
    const result = await query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Get featured projects
  getFeatured: async () => {
    const result = await query(
      'SELECT * FROM projects WHERE featured = true ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get projects by category
  getByCategory: async (category) => {
    const result = await query(
      'SELECT * FROM projects WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows;
  },

  // Create new project
  create: async (projectData) => {
    const {
      title,
      description,
      technologies,
      github,
      demo,
      image,
      category,
      featured,
      status,
    } = projectData;

    const result = await query(
      `INSERT INTO projects (title, description, technologies, github, demo, image, category, featured, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, technologies, github, demo, image, category, featured, status]
    );
    return result.rows[0];
  },

  // Update project
  update: async (id, projectData) => {
    const {
      title,
      description,
      technologies,
      github,
      demo,
      image,
      category,
      featured,
      status,
    } = projectData;

    const result = await query(
      `UPDATE projects 
       SET title = $1, description = $2, technologies = $3, github = $4, 
           demo = $5, image = $6, category = $7, featured = $8, status = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [title, description, technologies, github, demo, image, category, featured, status, id]
    );
    return result.rows[0];
  },

  // Delete project
  delete: async (id) => {
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
