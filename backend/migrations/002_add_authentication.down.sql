-- Migration 002 Rollback: Add Authentication and PDF Upload Tables
-- Rollback authentication and PDF upload schema

-- Drop indexes first
DROP INDEX IF EXISTS idx_uploaded_pdfs_created_at;
DROP INDEX IF EXISTS idx_refresh_tokens_expires_at;
DROP INDEX IF EXISTS idx_refresh_tokens_token_hash;
DROP INDEX IF EXISTS idx_refresh_tokens_user_id;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS uploaded_pdfs;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
