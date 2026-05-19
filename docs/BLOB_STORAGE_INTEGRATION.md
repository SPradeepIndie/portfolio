# Azure Blob Storage Integration - Summary

## What Changed

The portfolio application now uses **Azure Blob Storage** for storing and retrieving PDF files instead of local filesystem storage.

### Files Modified

**Backend:**
- `backend/controllers/blogController.js` - Removed multer middleware, added blob upload endpoint
- `backend/services/blogService.js` - Updated to use blob URLs instead of local paths
- `backend/package.json` - Added `@azure/storage-blob` dependency
- `backend/.env.example` - Added Azure Storage configuration template

**New Files:**
- `backend/services/blobService.js` - Azure Blob Storage operations (SAS URL generation, blob management)
- `backend/BLOB_STORAGE_SETUP.md` - Complete setup and configuration guide

**Frontend:**
- `frontend/src/services/api.ts` - Added blob upload methods
- `frontend/src/pages/PostManagement/PostManagement.tsx` - Updated PDF upload flow to use Azure Blob Storage
- `frontend/BLOB_STORAGE_UPLOAD.md` - Frontend integration guide

### Files No Longer Used

- `backend/middleware/upload.js` - Multer file upload middleware (still exists but not used)
- Local `/uploads/blogs/` directory - Replaced by cloud storage

## Architecture Overview

```
User Uploads PDF
       │
       ├─→ Frontend
       │       │
       │       ├─→ (1) Request Upload URL
       │       │        ↓
       │       │   Backend generates SAS-signed URL
       │       │        ↓
       │       ├─← Returns: { uploadUrl, blobName, expiresIn }
       │       │
       │       ├─→ (2) Upload PDF directly to Azure Blob Storage
       │       │        using SAS URL (no backend involved)
       │       │
       │       ├─→ (3) Save blob URL reference in database
       │       │        ↓
       │       │   Backend saves blob URL to `blogs.pdf_path`
       │       │
       │       └─← Upload complete
       │
       └─→ Users can access PDF via blob URL
           (embedded or as download link)
```

## Key Features

✅ **Direct Upload** - Frontend uploads directly to blob storage (faster, less backend load)  
✅ **Secure** - SAS tokens are server-generated with limited permissions  
✅ **Scalable** - Cloud storage handles any file size  
✅ **Time-limited** - Upload tokens expire after 1 hour  
✅ **Reference Tracking** - Backend stores blob URL in database  
✅ **Easy Migration** - Existing `pdf_path` column reused  

## Quick Start

### 1. Backend Setup

```bash
# Install dependencies
cd backend
npm install

# Copy .env.example and configure
cp .env.example .env

# Edit .env with Azure Storage credentials
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_ACCOUNT_KEY=your-account-key
AZURE_BLOB_CONTAINER_NAME=portfolio-pdfs
```

### 2. Create Azure Storage Account

```bash
# Create storage account (if not already created)
az storage account create \
  --name "portfoliostorage" \
  --resource-group "your-resource-group" \
  --location "eastus"

# Create container
az storage container create \
  --name "portfolio-pdfs" \
  --account-name "portfoliostorage"

# Get connection string
az storage account show-connection-string \
  --name "portfoliostorage" \
  --resource-group "your-resource-group"
```

### 3. Frontend Usage

The upload flow is now:

```typescript
// 1. Request upload URL
const { uploadUrl } = await apiService.requestPdfUploadUrl(filename)

// 2. Upload to blob storage
await apiService.uploadPdfToBlob(uploadUrl, file)

// 3. Save reference (optional)
const blobUrl = uploadUrl.split('?')[0]
```

### 4. Testing

```bash
# Backend syntax check
cd backend
npm test

# Start backend
npm run dev

# Frontend development
cd ../frontend
npm run dev
```

## API Endpoints

### New Endpoints

**POST /api/blogs/upload-url/request**
- Request an upload URL for a PDF
- Returns: `{ uploadUrl, blobName, expiresIn }`

**POST /api/blogs/:id/upload-pdf**
- Save blob URL reference in database
- Body: `{ pdf_url: "https://..." }`
- Returns: Updated blog object

### Modified Endpoints

**POST /api/blogs** - Now accepts optional `pdf_url` parameter (no file upload)
**PUT /api/blogs/:id** - Now accepts optional `pdf_url` parameter

## Environment Variables

Required for production:

```env
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_STORAGE_ACCOUNT_KEY=...
AZURE_BLOB_CONTAINER_NAME=portfolio-pdfs
```

## Security

- **SAS Tokens**: Generated server-side, expire after 1 hour
- **Permissions**: Limited to upload only (not download/delete)
- **CORS**: Configure on storage account if needed
- **HTTPS Only**: All connections use HTTPS
- **No Public Access**: Container remains private

## Cost Implications

- **Storage**: ~$0.021 per GB/month (Azure Blob Storage Standard tier)
- **Transactions**: ~$0.0004 per 10,000 transactions
- **Data Transfer**: Free within same region, charged for egress
- **Estimated**: Small portfolio (50 blogs with 500KB PDFs) = ~$0.50/month

## Troubleshooting

### "Azure Storage credentials not configured"
→ Check `AZURE_STORAGE_CONNECTION_STRING` and `AZURE_STORAGE_ACCOUNT_KEY` in .env

### "Failed to generate upload URL"
→ Verify storage account and container exist in Azure Portal

### "Upload failed: 403 Forbidden"
→ SAS token may have expired, request a new one

### "Failed to save PDF reference"
→ Check backend logs, verify blog ID is correct

## Next Steps

1. ✅ Backend modified for blob storage
2. ✅ Frontend upload flow updated
3. ✅ Documentation created
4. ⏭️ Deploy to production
5. ⏭️ Optionally migrate existing PDFs from local storage to blob

## Documentation Files

- `backend/BLOB_STORAGE_SETUP.md` - Complete backend setup guide
- `frontend/BLOB_STORAGE_UPLOAD.md` - Frontend integration guide
- `backend/.env.example` - Environment variables template

## Rollback (if needed)

To revert to local file storage:

1. Restore `backend/middleware/upload.js` usage in controller
2. Revert `backend/services/blogService.js` to use local file paths
3. Remove `@azure/storage-blob` from package.json
4. Update frontend to use FormData multipart upload

Note: Existing blob URLs in `blogs.pdf_path` would need manual migration back.
