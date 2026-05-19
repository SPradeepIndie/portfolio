# Migration Setup

The backend uses `db-migrate` with PostgreSQL for versioned schema changes.

## Current setup

- `db-migrate` and `db-migrate-pg` are installed in the backend.
- Migration scripts are defined in `backend/package.json`.
- Migrations are versioned and applied manually, not at runtime.
- Production migrations are meant to run through CI/CD.

## Files involved

- `backend/migrations/`
- `backend/database.json`
- `backend/.dbmigraterc`

## Common commands

```bash
cd backend
npm run migrate:up
npm run migrate:status
```

## Notes

- Keep new migrations small and reversible.
- Do not run migrations from `server.js`.
- See `backend/migrations/README.md` for the full migration file structure.
