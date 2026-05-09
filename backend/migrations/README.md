# Database Migrations Guide

This project uses **db-migrate** for managing database schema changes. Migrations are versioned SQL files stored in the `migrations/` directory.

## Overview

- **Tool**: db-migrate (Flyway-like for Node.js)
- **Database**: PostgreSQL
- **Directory**: `migrations/`
- **Tracking**: Automatic (migration table: `migrations`)

## Installation

Dependencies are already installed. To verify:

```bash
npm list db-migrate db-migrate-pg
```

## Configuration

- **Config file**: `.dbmigraterc` - controls migration directory and tracking table
- **Database config**: `database.json` - connection settings for dev/test/prod environments

### Default Connection Settings (Development)

By default, migrations use these credentials:

```
Host: localhost
Port: 5432
Database: portfolio
Username: portfolio_user
Password: portfolio_pass
```

To override in production, set environment variables:

```bash
DB_HOST=prod.example.com
DB_PORT=5432
DB_NAME=portfolio_prod
DB_USER=prod_user
DB_PASSWORD=prod_pass
```

Then use `--env prod` flag.

## Database Setup

Before running migrations, ensure PostgreSQL is set up:

### 1. Create database and user

```bash
# Connect to PostgreSQL
psql -U postgres

# Create user
CREATE USER portfolio_user WITH PASSWORD 'portfolio_pass';

# Create database
CREATE DATABASE portfolio OWNER portfolio_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;

# Exit
\q
```

### 2. Verify connection

```bash
psql -h localhost -U portfolio_user -d portfolio
```

## Available Commands

### Run pending migrations (apply to database)
```bash
npm run migrate:up
```

### Rollback last migration
```bash
npm run migrate:down
```

### Check migration status
```bash
npm run migrate:status
```

### Reset all migrations (rollback everything)
```bash
npm run migrate:reset
```

### Create a new migration
```bash
npm run migrate:create -- --name "add_new_column_to_users"
```

This creates two files:
- `NNN_add_new_column_to_users.up.sql` (apply migration)
- `NNN_add_new_column_to_users.down.sql` (rollback)

## Migration Workflow

### 1. Writing a New Migration

Create both UP and DOWN files:

**migrations/NNN_add_feature.up.sql**
```sql
ALTER TABLE users ADD COLUMN feature_flag BOOLEAN DEFAULT false;
```

**migrations/NNN_add_feature.down.sql**
```sql
ALTER TABLE users DROP COLUMN feature_flag;
```

### 2. Apply Migrations
```bash
npm run migrate:up
```

### 3. Rollback if Needed
```bash
npm run migrate:down
```

## Current Migrations

| File | Description |
|------|-------------|
| `001_initial_portfolio.up.sql` | Initial tables: projects, blogs, experience, contact_info, contact_messages |
| `002_add_authentication.up.sql` | Auth tables: users, refresh_tokens, uploaded_pdfs |

## First-Time Setup

1. Ensure PostgreSQL is running
2. Create database and user (see Database Setup above)
3. Run all migrations:
   ```bash
   npm run migrate:up
   ```
4. Verify:
   ```bash
   npm run migrate:status
   ```

## Notes

- Migrations are **applied once** and tracked in the `migrations` table
- Always write both `.up.sql` (apply) and `.down.sql` (rollback) files
- Use descriptive names for migrations: `NNN_what_you_changed`
- Never modify files in the `migrations/` directory after they've been applied to production
- For development, you can reset and re-apply: `npm run migrate:reset && npm run migrate:up`

## Troubleshooting

### Migrations not running?
1. Verify PostgreSQL is running: `psql -h localhost -U portfolio_user -d portfolio`
2. Check `database.json` has correct credentials
3. Run `npm run migrate:status` to see migration state

### "connect ECONNREFUSED" error?
PostgreSQL is not running or not accessible. Start PostgreSQL:
```bash
# macOS with Homebrew
brew services start postgresql

# Linux with systemd
sudo systemctl start postgresql

# Docker
docker run -d -p 5432:5432 -e POSTGRES_USER=portfolio_user -e POSTGRES_PASSWORD=portfolio_pass -e POSTGRES_DB=portfolio postgres:15
```

### Migration failed?
1. Check error message for SQL syntax issues
2. Roll back: `npm run migrate:down`
3. Fix the migration file
4. Re-run: `npm run migrate:up`

### Want to skip a migration?
Don't delete it. Mark it as manually applied in the `migrations` table:
```sql
INSERT INTO migrations (name, run_on) VALUES ('001_initial_portfolio', NOW());
```

## Migration File Naming

db-migrate uses this pattern: `NNN_description.up.sql` and `NNN_description.down.sql`

- `NNN` = Sequential number (001, 002, 003...)
- Must have both `.up.sql` and `.down.sql`
- Use lowercase with underscores for descriptions

## References

- [db-migrate docs](https://db-migrate.readthedocs.io/)
- [Flyway concepts](https://flywaydb.org/documentation/concepts/migrations)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
