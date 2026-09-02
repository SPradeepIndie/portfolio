/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const settingsModel = {
  // Categories
  getAllCategories: async () => {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    return result.rows;
  },
  createCategory: async ({ name, entity_type }) => {
    const result = await query(
      'INSERT INTO categories (name, entity_type) VALUES ($1, $2) RETURNING *',
      [name, entity_type]
    );
    return result.rows[0];
  },
  deleteCategory: async (id) => {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  // Tags
  getAllTags: async () => {
    const result = await query('SELECT * FROM tags ORDER BY name ASC');
    return result.rows;
  },
  createTag: async ({ name, entity_type }) => {
    const result = await query(
      'INSERT INTO tags (name, entity_type) VALUES ($1, $2) RETURNING *',
      [name, entity_type]
    );
    return result.rows[0];
  },
  deleteTag: async (id) => {
    const result = await query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
