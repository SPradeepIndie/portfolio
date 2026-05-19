# Portfolio Backend - Azure Blob Storage Setup

This document explains how to set up Azure Blob Storage for PDF file uploads in the portfolio backend.

## Overview

The application now uses Azure Blob Storage for storing PDF files instead of local filesystem storage. This provides:
- Scalable cloud storage
- Secure SAS-token based uploads
- Direct upload from frontend to blob storage
- No file size limitations on the backend

## Architecture

### Upload Flow

1. **Frontend** requests an upload URL from the backend via `POST /api/blogs/upload-url/request`
2. **Backend** generates a SAS-signed upload URL valid for 1 hour
3. **Backend** returns the SAS URL and blob name to the frontend
4. **Frontend** uploads the PDF directly to Azure Blob Storage using the SAS URL
5. **Frontend** saves the blob URL reference in the database via `POST /api/blogs/:id/upload-pdf`

### Storage Structure

- **Container**: `portfolio-pdfs` (configurable via `AZURE_BLOB_CONTAINER_NAME`)
- **Blob Names**: `{filename}-{timestamp}-{randomId}.pdf`
- **Access**: SAS tokens with limited permissions and expiration times

## Setup Instructions

### 1. Create Azure Storage Account

```bash
# Create a storage account
az storage account create \
  --name "portfoliostorage" \
  --resource-group "your-resource-group" \
  --location "eastus" \
  --sku "Standard_LRS"

# Create a blob container
az storage container create \
  --name "portfolio-pdfs" \
  --account-name "portfoliostorage"
```

### 2. Get Storage Credentials

```bash
# Get the connection string
az storage account show-connection-string \
  --name "portfoliostorage" \
  --resource-group "your-resource-group"

# Get the account key
az storage account keys list \
  --account-name "portfoliostorage" \
  --resource-group "your-resource-group"
```

### 3. Configure Environment Variables

Create or update `.env` in the backend root:

```env
# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=portfoliostorage;AccountKey=YOUR_ACCOUNT_KEY;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_KEY=YOUR_ACCOUNT_KEY
AZURE_BLOB_CONTAINER_NAME=portfolio-pdfs
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

## API Endpoints

### Request Upload URL

**POST** `/api/blogs/upload-url/request`

**Headers**: 
- `Authorization: Bearer {accessToken}`

**Body**:
```json
{
  "filename": "my-blog-post.pdf"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://portfoliostorage.blob.core.windows.net/portfolio-pdfs/my-blog-post-1234567890-abc123.pdf?sv=2021-06-08&sig=...",
    "blobName": "my-blog-post-1234567890-abc123.pdf",
    "expiresIn": 3600
  }
}
```

### Upload PDF Reference

**POST** `/api/blogs/{blogId}/upload-pdf`

**Headers**: 
- `Authorization: Bearer {accessToken}`

**Body**:
```json
{
  "pdf_url": "https://portfoliostorage.blob.core.windows.net/portfolio-pdfs/my-blog-post-1234567890-abc123.pdf"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Blog Post",
    "pdf_path": "https://portfoliostorage.blob.core.windows.net/portfolio-pdfs/my-blog-post-1234567890-abc123.pdf",
    ...
  },
  "message": "PDF reference saved successfully"
}
```

## Frontend Usage

```typescript
import { apiService } from '@/services/api'

// 1. Request upload URL
const { uploadUrl, blobName } = await apiService.requestPdfUploadUrl(file.name)

// 2. Upload directly to blob storage
await apiService.uploadPdfToBlob(uploadUrl, file)

// 3. Save reference in database (optional, for tracking)
const blobUrl = uploadUrl.split('?')[0]
await apiService.savePdfReference(blogId, blobUrl)
```

## SAS Token Details

### Upload Tokens
- **Permissions**: `racwd` (read, add, create, write, delete)
- **Expiration**: 1 hour
- **Usage**: Backend generates new token for each upload request

### Read Tokens
- **Permissions**: `r` (read only)
- **Expiration**: 30 days
- **Usage**: For viewing PDFs with temporary access

## Security Considerations

1. **SAS Tokens**: Tokens are generated server-side and never exposed to client
2. **Container Access**: Container should be private (not publicly accessible)
3. **CORS**: Configure CORS on blob storage container to allow frontend uploads:

```bash
az storage cors add \
  --account-name "portfoliostorage" \
  --services b \
  --methods GET POST PUT DELETE \
  --origins "https://your-domain.com" \
  --allowed-headers "*" \
  --exposed-headers "*"
```

## Database Schema

The existing `pdf_path` column in the `blogs` table now stores the full blob URL:

```sql
-- Before (local path):
UPDATE blogs SET pdf_path = '/uploads/blogs/my-blog-1234567890.pdf'

-- After (blob URL):
UPDATE blogs SET pdf_path = 'https://portfoliostorage.blob.core.windows.net/portfolio-pdfs/my-blog-post-1234567890-abc123.pdf'
```

## Troubleshooting

### "Azure Storage credentials not configured"
- Ensure `AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_ACCOUNT_KEY` are set in `.env`
- Verify the values are correct in Azure Portal

### "Failed to generate upload URL"
- Check that the storage account and container exist
- Verify account key has proper permissions

### Upload fails with 403 Forbidden
- Ensure SAS token hasn't expired (tokens are valid for 1 hour)
- Check that blob storage CORS settings allow uploads

### PDF URL returns 404
- Verify the blob still exists in the container
- Check that the URL path is correct (container name, blob name)

## Cost Optimization

- Monitor blob storage usage in Azure Portal
- Set up lifecycle policies to archive old PDFs
- Consider using Archive tier for old blog PDFs:

```bash
az storage account blob-service-properties update \
  --account-name "portfoliostorage" \
  --enable-delete-retention true \
  --delete-retention-days 30
```

## Migration from Local Storage

If migrating from local filesystem storage:

1. Export existing PDFs from `/uploads/blogs/`
2. Upload them to blob container
3. Update database with blob URLs:

```sql
UPDATE blogs 
SET pdf_path = CONCAT(
  'https://portfoliostorage.blob.core.windows.net/portfolio-pdfs/',
  SUBSTRING(pdf_path, POSITION('/' FROM REVERSE(pdf_path)) + 1)
)
WHERE pdf_path IS NOT NULL;
```

4. Clean up local storage once migration is complete
