# Frontend Architecture

This frontend is a React + TypeScript + Vite app for the portfolio site.

## Structure

- `src/pages/` contains the page-level screens.
- `src/components/` holds shared UI pieces.
- `src/services/api.ts` wraps backend requests.
- `src/context/` and `src/hooks/` handle app state and shared logic.
- `src/theme/` keeps the UI styling system.

## Current flow

- Public pages load portfolio, blog, and project data from the backend.
- Authenticated admin pages use the same API client for create, update, and delete actions.
- PDF uploads use Azure Blob Storage through the blob integration flow documented in `BLOB_STORAGE_INTEGRATION.md`.

## Key pages

- Home and content pages read data only.
- Post Management is the admin entry point for blog and PDF handling.
- Theme switching is handled through the theme context and toggle component.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Notes

- Vite handles the frontend build and dev server.
- API calls point to the backend at `http://localhost:5000` during development.
