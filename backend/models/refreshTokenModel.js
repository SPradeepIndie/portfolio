/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const refreshTokenModel = {
  create: async (tokenData) => {
    const { user_id, token_hash, expires_at } = tokenData;

    const result = await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, token_hash, expires_at, revoked_at, created_at`,
      [user_id, token_hash, expires_at]
    );

    return result.rows[0];
  },

  getValidByTokenHash: async (token_hash) => {
    const result = await query(
      `SELECT rt.id, rt.user_id, rt.token_hash, rt.expires_at, rt.revoked_at,
              u.id as user_id_ref, u.full_name, u.email, u.role, u.is_active
       FROM refresh_tokens rt
       INNER JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1
         AND rt.revoked_at IS NULL
         AND rt.expires_at > CURRENT_TIMESTAMP`,
      [token_hash]
    );

    return result.rows[0];
  },

  revokeByTokenHash: async (token_hash) => {
    const result = await query(
      `UPDATE refresh_tokens
       SET revoked_at = CURRENT_TIMESTAMP
       WHERE token_hash = $1
         AND revoked_at IS NULL
       RETURNING id`,
      [token_hash]
    );

    return result.rowCount > 0;
  },

  revokeAllByUserId: async (userId) => {
    await query(
      `UPDATE refresh_tokens
       SET revoked_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
         AND revoked_at IS NULL`,
      [userId]
    );
  },
};
