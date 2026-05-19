# Frontend - Azure Blob Storage PDF Upload

## Overview

The frontend now uploads PDFs directly to Azure Blob Storage instead of sending them to the backend. This provides:
- Faster uploads (direct to blob storage)
- Better user experience (progress tracking possible)
- Reduced backend load
- Automatic virus scanning via Defender for Blob Storage (optional)

## Upload Flow Diagram

```
┌─────────────┐
│  Frontend   │
│             │
│ 1. Select   │
│    PDF      │
└──────┬──────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      │
┌──────────────────┐          ┌──────────────▼────────┐
│      Backend     │          │   Azure Blob Storage  │
│                  │          │                       │
│ Generate SAS URL │────────▶ │  2. Upload PDF        │
│ (1 hour valid)   │          │     with SAS URL      │
└──────┬───────────┘          │                       │
       │                      └───────────────────────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      │
┌──────────────────┐                         │
│  Database        │          ┌──────────────▼────────┐
│                  │          │   Frontend            │
│ 3. Save blob URL │◀─────────│ 3. Send blob URL      │
│    reference     │          │    to save reference  │
└──────────────────┘          └───────────────────────┘
```

## Usage

### Basic Upload

```typescript
import { apiService } from '@/services/api'

// Select a PDF file from input
const file = event.target.files[0]

try {
  // Step 1: Request upload URL from backend
  const { uploadUrl, blobName } = await apiService.requestPdfUploadUrl(file.name)
  
  // Step 2: Upload PDF directly to blob storage
  await apiService.uploadPdfToBlob(uploadUrl, file)
  
  // Step 3: Save reference in database (optional)
  const blobUrl = uploadUrl.split('?')[0] // Remove SAS token
  await apiService.savePdfReference(blogId, blobUrl)
  
  console.log('Upload complete!')
} catch (error) {
  console.error('Upload failed:', error)
}
```

### With Progress Tracking

```typescript
async function uploadPdfWithProgress(file: File, onProgress: (percent: number) => void) {
  // Request upload URL
  const { uploadUrl } = await apiService.requestPdfUploadUrl(file.name)
  
  // Upload with progress tracking using XMLHttpRequest
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100
        onProgress(percentComplete)
      }
    })
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 201 || xhr.status === 200) {
        resolve(true)
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`))
      }
    })
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })
    
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob')
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  })
}

// Usage
uploadPdfWithProgress(file, (percent) => {
  console.log(`Upload progress: ${percent}%`)
})
```

## Component Integration

The `PostManagement` component handles PDF uploads:

```typescript
const handleUploadPdf = async () => {
  if (!pdfFile) {
    setError('Please select a PDF file')
    return
  }

  try {
    setIsUploadingPdf(true)
    
    // Request upload URL
    const { uploadUrl } = await apiService.requestPdfUploadUrl(pdfFile.name)
    
    // Upload to blob storage
    await apiService.uploadPdfToBlob(uploadUrl, pdfFile)
    
    // Save reference (optional)
    const blobUrl = uploadUrl.split('?')[0]
    
    setMessage('PDF uploaded successfully')
    setPdfFile(null)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Upload failed')
  } finally {
    setIsUploadingPdf(false)
  }
}
```

## Viewing PDFs

When displaying PDFs from blob storage, use the stored blob URL:

```typescript
interface Blog {
  id: number
  title: string
  pdf_path?: string // Now contains the blob URL
  // ...
}

// Display PDF link
{blog.pdf_path && (
  <a href={blog.pdf_path} target="_blank" rel="noopener noreferrer">
    Download PDF
  </a>
)}

// Or embed in iframe
{blog.pdf_path && (
  <iframe src={blog.pdf_path} width="100%" height="600px" />
)}
```

## API Methods

### Request Upload URL

```typescript
const result = await apiService.requestPdfUploadUrl(filename)
// Returns: { uploadUrl, blobName, expiresIn }
```

### Upload PDF to Blob

```typescript
await apiService.uploadPdfToBlob(uploadUrl, file)
// Uploads directly to Azure Blob Storage
// No authentication needed (SAS token in URL)
```

### Save PDF Reference

```typescript
const blog = await apiService.savePdfReference(blogId, pdf_url)
// Saves blob URL in database
// Returns updated blog object
```

## Error Handling

```typescript
try {
  const { uploadUrl } = await apiService.requestPdfUploadUrl(file.name)
  await apiService.uploadPdfToBlob(uploadUrl, file)
} catch (error) {
  if (error.message.includes('failed to request upload URL')) {
    // Backend issue - check credentials
  } else if (error.message.includes('failed to upload PDF')) {
    // Network issue or blob storage issue
  } else {
    // Unknown error
  }
}
```

## Best Practices

1. **File Validation**
   - Check file type before upload (must be PDF)
   - Validate file size client-side before requesting URL

2. **Error Recovery**
   - Retry failed uploads with exponential backoff
   - Allow users to re-select files if upload fails

3. **User Feedback**
   - Show upload progress bar
   - Display success/error messages
   - Disable upload button during upload

4. **Performance**
   - Use large file chunks for progress tracking
   - Cache upload URLs to avoid multiple requests

## Limitations

- SAS tokens expire after 1 hour (not an issue for typical uploads)
- Browser must support Fetch API or XMLHttpRequest
- CORS must be configured on storage account

## Troubleshooting

### "Upload failed: 400 Bad Request"
- Check Content-Type header
- Verify x-ms-blob-type header is set to 'BlockBlob'

### "Upload failed: 403 Forbidden"
- SAS token may have expired
- Request a new upload URL

### "Upload failed: Network Error"
- Check browser network tab
- Verify blob storage account is accessible

### "Failed to save reference"
- Backend API error - check server logs
- Verify blogId is correct

## Security Notes

- SAS tokens are server-generated and never exposed to client (except in upload URL)
- Upload tokens are read-only (can't download or delete)
- Tokens expire after 1 hour
- All uploads use HTTPS
