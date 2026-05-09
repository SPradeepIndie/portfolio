# Database Migration Setup Complete ✅

This document summarizes the db-migrate setup for the Portfolio Backend.

## What Was Installed

✅ **db-migrate** (v0.11.14) - Migration management tool (Flyway equivalent for npm)  
✅ **db-migrate-pg** (v1.5.2) - PostgreSQL driver for db-migrate  
✅ **Migration files** - 2 versioned migrations created  
✅ **Configuration** - `.dbmigraterc` and `database.json` configured  
✅ **NPM scripts** - 5 migration commands added to package.json

## Files Created/Modified

### New Files
```
backend/
├── migrations/
│   ├── 001_initial_portfolio.up.sql      # Initial schema (projects, blogs, etc.)
│   ├── 001_initial_portfolio.down.sql    # Rollback migration
│   ├── 002_add_authentication.up.sql     # Auth & PDF upload tables
│   ├── 002_add_authentication.down.sql   # Rollback migration
│   └── README.md                         # Migration guide & documentation
├── database.json                         # db-migrate configuration
└── .dbmigraterc                         # db-migrate runtime config
```

### Modified Files
```
backend/package.json (added 5 npm scripts)
```

## Quick Start

### 1. Set Up PostgreSQL Database

```bash
# Create database and user
psql -U postgres

CREATE USER portfolio_user WITH PASSWORD 'portfolio_pass';
CREATE DATABASE portfolio OWNER portfolio_user;
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
\q
```

### 2. Run Migrations

```bash
cd backend
npm run migrate:up
```

### 3. Verify

```bash
npm run migrate:status
```

## NPM Migration Commands

| Command | Description |
|---------|-------------|
| `npm run migrate:up` | Apply all pending migrations |
| `npm run migrate:down` | Rollback last migration |
| `npm run migrate:reset` | Rollback all migrations |
| `npm run migrate:status` | Show migration history and status |
| `npm run migrate:create -- --name "description"` | Create new migration |

## Current Migrations

### 001_initial_portfolio
- Creates portfolio tables: projects, blogs, experience, contact_info, contact_messages
- Adds 5 performance indexes
- **Status**: Ready to apply

### 002_add_authentication
- Creates auth tables: users, refresh_tokens, uploaded_pdfs
- Adds 6 performance indexes
- **Status**: Ready to apply

## Configuration Details

**Default Development Environment:**
```json
{
  "dev": {
    "driver": "pg",
    "host": "localhost",
    "port": 5432,
    "database": "portfolio",
    "user": "portfolio_user",
    "password": "portfolio_pass"
  }
}
```

**Production Environment:**
Override defaults with environment variables:
```bash
DB_HOST=prod-host.com
DB_PORT=5432
DB_NAME=portfolio_prod
DB_USER=prod_user
DB_PASSWORD=prod_pass
npm run migrate:up -- --env prod
```

## How Migrations Work

1. **Versioning**: Each migration has an up (.up.sql) and down (.down.sql) file
   - `NNN` = Sequential version number (001, 002, 003...)
   - Example: `001_initial_portfolio.up.sql` and `001_initial_portfolio.down.sql`

2. **Tracking**: Applied migrations are recorded in the `migrations` table
   - Prevents re-running the same migration
   - Tracks execution order

3. **Manual Control**: Migrations are applied manually (not automatic)
   - Development: Run `npm run migrate:up` when needed
   - Production: DBA reviews and executes migrations

## Adding New Migrations

### Method 1: Create with CLI (easiest)
```bash
npm run migrate:create -- --name "add_column_to_users"
```
This generates:
- `NNN_add_column_to_users.up.sql`
- `NNN_add_column_to_users.down.sql`

### Method 2: Manual Files
1. Create `NNN_description.up.sql` with forward migration
2. Create `NNN_description.down.sql` with rollback

### Example Migration

**NNN_add_column_to_users.up.sql**
```sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
CREATE INDEX idx_users_phone ON users(phone_number);
```

**NNN_add_column_to_users.down.sql**
```sql
DROP INDEX IF EXISTS idx_users_phone;
ALTER TABLE users DROP COLUMN phone_number;
```

## Troubleshooting

### "connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL is not running. Start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Docker
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=portfolio_user \
  -e POSTGRES_PASSWORD=portfolio_pass \
  -e POSTGRES_DB=portfolio \
  postgres:15
```

### "role portfolio_user does not exist"
Create the user first:
```bash
psql -U postgres -c "CREATE USER portfolio_user WITH PASSWORD 'portfolio_pass';"
psql -U postgres -c "CREATE DATABASE portfolio OWNER portfolio_user;"
```

### "permission denied" error
Grant privileges:
```bash
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;"
```

### Want to Reset Everything?
```bash
npm run migrate:reset    # Rollback all migrations
npm run migrate:up       # Reapply all migrations
```

## Integration with Express Server

The Express server (`server.js`) does NOT auto-run migrations. This is intentional for safety.

To integrate migrations into your server startup:

**backend/server.js**
```javascript
// Optional: Add pre-startup migration check
import db from './config/db.js';

const runMigrationsOnStartup = false; // Set to true to auto-migrate

if (runMigrationsOnStartup) {
  exec('npm run migrate:up', (err, stdout, stderr) => {
    if (err) {
      console.error('Migration failed:', err);
      process.exit(1);
    }
    console.log('Migrations applied successfully');
  });
}
```

## Best Practices

✅ **Do:**
- Write descriptive migration names
- Always provide rollback (.down.sql) files
- Test migrations in development first
- Document schema changes in migration files
- Use indexes for query performance
- Keep migrations small and focused

❌ **Don't:**
- Modify migration files after applying to production
- Forget to test rollbacks
- Leave sensitive data in migration files
- Mix structural and data changes
- Skip writing .down.sql files

## Documentation

Full migration guide: [backend/migrations/README.md](./migrations/README.md)

## Next Steps

1. ✅ Set up PostgreSQL database (see Quick Start)
2. ✅ Run `npm run migrate:up` to apply migrations
3. ✅ Start server: `npm run dev`
4. ✅ Add new migrations as needed

---

**Setup Date:** May 9, 2026  
**Migration Version:** db-migrate 0.11.14  
**Database:** PostgreSQL  
**Status:** ✅ Ready for development
