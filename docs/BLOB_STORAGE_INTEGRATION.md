# Azure Blob Storage Integration

The app stores PDF uploads in Azure Blob Storage. The frontend requests a short-lived SAS URL from the backend, uploads the file directly to Azure, and then stores the blob URL in the blog record when needed.

## Flow

1. Request `POST /api/blogs/upload-url/request` with a filename.
2. Upload the file directly to the returned SAS URL.
3. Save the blob URL with `POST /api/blogs/:id/upload-pdf` when a blog needs the PDF reference.

## Current code paths

- Backend SAS generation: `backend/services/blobService.js`
- Backend blog handlers: `backend/services/blogService.js`
- Frontend upload request and PUT: `frontend/src/services/api.ts`
- Post Management UI: `frontend/src/pages/PostManagement/PostManagement.tsx`

## Notes

- PDF list/delete for the admin page still uses `/api/pdfs`.
- The current Post Management upload flow does not auto-link a blog selection, so saving `pdf_path` is optional and only used when a blog ID is available.
- Required Azure env vars: `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_ACCOUNT_KEY`, `AZURE_BLOB_CONTAINER_NAME`.
