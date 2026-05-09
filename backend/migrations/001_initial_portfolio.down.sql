-- Migration 001 Rollback: Initial Portfolio Tables
-- Rollback the initial portfolio schema

-- Drop indexes first
DROP INDEX IF EXISTS idx_blogs_published_at;
DROP INDEX IF EXISTS idx_blogs_category;
DROP INDEX IF EXISTS idx_blogs_featured;
DROP INDEX IF EXISTS idx_projects_category;
DROP INDEX IF EXISTS idx_projects_featured;

-- Drop tables
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS contact_info;
DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS projects;
