/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const userModel = {
  create: async (userData) => {
    const { full_name, email, password_hash, role = 'user' } = userData;

    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role, is_active, created_at, updated_at, last_login_at`,
      [full_name, email, password_hash, role]
    );

    return result.rows[0];
  },

  getAll: async () => {
    const result = await query(
      `SELECT id, full_name, email, role, is_active, created_at, updated_at, last_login_at
       FROM users
       ORDER BY created_at DESC`
    );

    return result.rows;
  },

  getById: async (id) => {
    const result = await query(
      `SELECT id, full_name, email, role, is_active, created_at, updated_at, last_login_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  },

  getByEmail: async (email) => {
    const result = await query(
      `SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at, last_login_at
       FROM users
       WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  },

  updateById: async (id, updateData) => {
    const fields = [];
    const values = [];
    let index = 1;

    if (typeof updateData.full_name !== 'undefined') {
      fields.push(`full_name = $${index++}`);
      values.push(updateData.full_name);
    }

    if (typeof updateData.email !== 'undefined') {
      fields.push(`email = $${index++}`);
      values.push(updateData.email);
    }

    if (typeof updateData.password_hash !== 'undefined') {
      fields.push(`password_hash = $${index++}`);
      values.push(updateData.password_hash);
    }

    if (typeof updateData.role !== 'undefined') {
      fields.push(`role = $${index++}`);
      values.push(updateData.role);
    }

    if (typeof updateData.is_active !== 'undefined') {
      fields.push(`is_active = $${index++}`);
      values.push(updateData.is_active);
    }

    if (!fields.length) {
      return userModel.getById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    values.push(id);

    const result = await query(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE id = $${index}
       RETURNING id, full_name, email, role, is_active, created_at, updated_at, last_login_at`,
      values
    );

    return result.rows[0];
  },

  updateLastLogin: async (id) => {
    await query(
      `UPDATE users
       SET last_login_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
  },

  deactivateById: async (id) => {
    const result = await query(
      `UPDATE users
       SET is_active = false,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, full_name, email, role, is_active, created_at, updated_at, last_login_at`,
      [id]
    );

    return result.rows[0];
  },
};
