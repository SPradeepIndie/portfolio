/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const pdfModel = {
  create: async (pdfData) => {
    const { title, original_name, file_path, uploaded_by, file_hash } = pdfData;

    const result = await query(
      `INSERT INTO uploaded_pdfs (title, original_name, file_path, uploaded_by, file_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, original_name, file_path, uploaded_by, created_at`,
      [title, original_name, file_path, uploaded_by, file_hash]
    );

    return result.rows[0];
  },

  getAll: async () => {
    const result = await query(
      `SELECT p.id, p.title, p.original_name, p.file_path, p.uploaded_by, p.created_at,
              u.full_name as uploaded_by_name, u.email as uploaded_by_email
       FROM uploaded_pdfs p
       LEFT JOIN users u ON u.id = p.uploaded_by
       WHERE p.is_deleted = FALSE
       ORDER BY p.created_at DESC`
    );

    return result.rows;
  },

  deleteById: async (id) => {
    const result = await query(
      `UPDATE uploaded_pdfs SET is_deleted = TRUE
       WHERE id = $1 AND is_deleted = FALSE
       RETURNING id, title, original_name, file_path, uploaded_by, created_at`,
      [id]
    );

    return result.rows[0];
  },
};
