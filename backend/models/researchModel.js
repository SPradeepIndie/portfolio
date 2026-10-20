/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const researchModel = {
  // Get all research items
  getAll: async () => {
    const result = await query(
      'SELECT * FROM research WHERE is_hidden = false ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get all research including hidden (for admin)
  getAllAdmin: async () => {
    const result = await query(
      'SELECT * FROM research ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get research item by ID
  getById: async (id) => {
    const result = await query('SELECT * FROM research WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create research item
  create: async (data) => {
    const {
      title,
      abstract,
      content = '',
      author,
      status = 'Ongoing',
      category = 'Computer Science',
      tags = [],
      pdf_url = null,
      featured = false,
      is_hidden = false,
    } = data;

    const result = await query(
      `INSERT INTO research (
        title, abstract, content, author, status, category, tags, pdf_url, featured, is_hidden
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [title, abstract, content, author, status, category, tags, pdf_url, featured, is_hidden]
    );

    return result.rows[0];
  },

  // Update research item
  update: async (id, data) => {
    const {
      title,
      abstract,
      content,
      author,
      status,
      category,
      tags,
      pdf_url,
      featured,
      is_hidden,
    } = data;

    const result = await query(
      `UPDATE research SET
        title = COALESCE($1, title),
        abstract = COALESCE($2, abstract),
        content = COALESCE($3, content),
        author = COALESCE($4, author),
        status = COALESCE($5, status),
        category = COALESCE($6, category),
        tags = COALESCE($7, tags),
        pdf_url = COALESCE($8, pdf_url),
        featured = COALESCE($9, featured),
        is_hidden = COALESCE($10, is_hidden),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *`,
      [title, abstract, content, author, status, category, tags, pdf_url, featured, is_hidden, id]
    );

    return result.rows[0];
  },

  // Delete research item
  delete: async (id) => {
    const result = await query('DELETE FROM research WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
