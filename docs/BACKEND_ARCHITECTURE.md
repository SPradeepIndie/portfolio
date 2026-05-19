# Portfolio Backend Architecture

This backend uses Express + MVC + service/model layering for portfolio data, auth, and admin actions.

## Core structure

- `server.js` wires middleware, routes, Swagger, and error handling.
- `controllers/` define HTTP routes.
- `services/` hold business logic.
- `models/` run database queries.
- `middleware/` handles auth, errors, and upload concerns.

## Current flow

- Public frontend pages read portfolio content through `GET` endpoints.
- Admin and editor actions use authenticated routes in the backend.
- PDFs now use Azure Blob Storage through the blob integration doc, not local filesystem upload flow.

## Main routes

- `GET /api/health`
- `GET /api/portfolio`
- `GET /api/projects`
- `GET /api/blogs`
- `GET /api/auth/me`
- `POST /api/blogs/upload-url/request`
- `POST /api/blogs/:id/upload-pdf`
- `GET /api/pdfs`
- `DELETE /api/pdfs/:id`

## Run locally

```bash
cd backend
npm install
npm run dev
```

## Notes

- Database config comes from `.env`.
- Swagger is available at `/api/docs`.
- Azure Blob Storage details are in [BLOB_STORAGE_INTEGRATION.md](BLOB_STORAGE_INTEGRATION.md).
