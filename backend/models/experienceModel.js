/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const experienceModel = {
  // Get all experience
  getAll: async () => {
    const result = await query(
      'SELECT * FROM experience ORDER BY order_index ASC, created_at DESC'
    );
    return result.rows;
  },

  // Get experience by ID
  getById: async (id) => {
    const result = await query('SELECT * FROM experience WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create new experience
  create: async (experienceData) => {
    const { company, position, duration, description, order_index } = experienceData;

    const result = await query(
      `INSERT INTO experience (company, position, duration, description, order_index)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company, position, duration, description, order_index || 0]
    );
    return result.rows[0];
  },

  // Update experience
  update: async (id, experienceData) => {
    const { company, position, duration, description, order_index } = experienceData;

    const result = await query(
      `UPDATE experience 
       SET company = $1, position = $2, duration = $3, description = $4, 
           order_index = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [company, position, duration, description, order_index, id]
    );
    return result.rows[0];
  },

  // Delete experience
  delete: async (id) => {
    const result = await query('DELETE FROM experience WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};
