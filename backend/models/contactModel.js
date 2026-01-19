/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { query } from '../config/db.js';

export const contactModel = {
  // Get contact info (should only have one record)
  getInfo: async () => {
    const result = await query('SELECT * FROM contact_info LIMIT 1');
    return result.rows[0];
  },

  // Update contact info
  updateInfo: async (contactData) => {
    const { name, title, bio, email, phone, linkedin, github, website, skills } = contactData;

    const result = await query(
      `UPDATE contact_info 
       SET name = $1, title = $2, bio = $3, email = $4, phone = $5,
           linkedin = $6, github = $7, website = $8, skills = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING *`,
      [name, title, bio, email, phone, linkedin, github, website, skills]
    );
    return result.rows[0];
  },

  // Save contact message from visitors
  saveMessage: async (messageData) => {
    const { name, email, message } = messageData;

    const result = await query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );
    return result.rows[0];
  },

  // Get all messages
  getAllMessages: async () => {
    const result = await query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Get message by ID
  getMessageById: async (id) => {
    const result = await query('SELECT * FROM contact_messages WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Delete message
  deleteMessage: async (id) => {
    const result = await query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};
