/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  CloudUpload,
  Delete,
  Edit,
  Download,
  Description,
  PictureAsPdf,
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured: boolean
  created_at?: string
  updated_at?: string
}

interface PdfFile {
  id: number
  filename: string
  file_path: string
  file_size: number
  uploaded_at: string
}

export const PostManagementPage = () => {
  const { isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blogs' | 'pdfs'>('blogs')

  // Blog form state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured: false,
  })
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)

  // PDF upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'blog' | 'pdf' | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [blogsData, pdfsData] = await Promise.all([
        apiService.getBlogs().catch(() => []),
        apiService.getUploadedPdfs().catch(() => []),
      ])
      setBlogs(blogsData)
      setPdfs(pdfsData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load your posts and files')
    } finally {
      setIsLoading(false)
    }
  }

  // Blog handlers
  const handleOpenBlogDialog = (blog?: BlogPost) => {
    if (blog) {
      setBlogForm({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        category: blog.category,
        tags: blog.tags.join(', '),
        featured: blog.featured,
      })
      setEditingBlogId(blog.id)
    } else {
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        featured: false,
      })
      setEditingBlogId(null)
    }
    setBlogDialogOpen(true)
  }

  const handleCloseBlogDialog = () => {
    setBlogDialogOpen(false)
    setEditingBlogId(null)
  }

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setMessage(null)
      setError(null)

      const payload = {
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map((tag) => tag.trim()),
        featured: blogForm.featured,
      }

      if (editingBlogId) {
        await apiService.updateBlog(editingBlogId, payload)
        setMessage('Blog updated successfully')
      } else {
        await apiService.createBlog(payload)
        setMessage('Blog created successfully')
      }

      handleCloseBlogDialog()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog')
    }
  }

  // PDF handlers
  const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file')
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setPdfFile(file)
      setError(null)
    }
  }

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file')
      return
    }

    try {
      setIsUploadingPdf(true)
      setMessage(null)
      setError(null)

      // Upload PDF via backend endpoint (simpler & server-managed)
      await apiService.uploadPdf(pdfFile)
      setMessage('PDF uploaded successfully')
      setPdfFile(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF')
    } finally {
      setIsUploadingPdf(false)
    }
  }

  // Delete handlers
  const handleOpenDeleteDialog = (type: 'blog' | 'pdf', id: number) => {
    setDeleteType(type)
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteType || !deleteId) return

    try {
      setMessage(null)
      setError(null)

      if (deleteType === 'blog') {
        await apiService.deleteBlog(deleteId)
        setMessage('Blog deleted successfully')
      } else {
        await apiService.deletePdf(deleteId)
        setMessage('PDF deleted successfully')
      }

      setDeleteDialogOpen(false)
      setDeleteType(null)
      setDeleteId(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
        <Alert severity="warning">Please log in to access post management</Alert>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
            }}
          >
            <CloudUpload fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              Post Management
            </Typography>
            <Typography color="text.secondary">
              Upload and manage your blog posts and PDF files
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tab buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant={activeTab === 'blogs' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('blogs')}
            startIcon={<Description />}
          >
            Blogs ({blogs.length})
          </Button>
          <Button
            variant={activeTab === 'pdfs' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('pdfs')}
            startIcon={<PictureAsPdf />}
          >
            PDFs ({pdfs.length})
          </Button>
        </Stack>
      </Box>

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <Box>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => handleOpenBlogDialog()}
                fullWidth
              >
                Create New Blog Post
              </Button>
            </CardContent>
          </Card>

          {blogs.length === 0 ? (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No blog posts yet</Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {blogs.map((blog) => (
                <Box key={blog.id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {blog.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        {blog.excerpt}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {blog.featured && (
                          <Chip label="Featured" size="small" color="primary" sx={{ mr: 1 }} />
                        )}
                        <Chip label={blog.category} size="small" variant="outlined" />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {blog.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenBlogDialog(blog)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog('blog', blog.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* PDFs Tab */}
      {activeTab === 'pdfs' && (
        <Box>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfFileChange}
                    style={{ display: 'none' }}
                    id="pdf-input"
                  />
                  <label htmlFor="pdf-input" style={{ width: '100%' }}>
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      fullWidth
                    >
                      Select PDF File
                    </Button>
                  </label>
                </Box>
                {pdfFile && (
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2">{pdfFile.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(pdfFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  onClick={handleUploadPdf}
                  disabled={!pdfFile || isUploadingPdf}
                  fullWidth
                >
                  {isUploadingPdf ? 'Uploading...' : 'Upload PDF'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {pdfs.length === 0 ? (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No PDF files uploaded yet</Typography>
              </CardContent>
            </Card>
          ) : (
            <List>
              {pdfs.map((pdf) => (
                <Paper key={pdf.id} sx={{ mb: 1 }}>
                  <ListItem>
                    <PictureAsPdf sx={{ mr: 2, color: 'error.main' }} />
                    <ListItemText
                      primary={pdf.filename}
                      secondary={`${(pdf.file_size / 1024).toFixed(2)} KB • ${new Date(pdf.uploaded_at).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        href={pdf.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenDeleteDialog('pdf', pdf.id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Blog Dialog */}
      <Dialog open={blogDialogOpen} onClose={handleCloseBlogDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBlogId ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
            />
            <TextField
              label="Excerpt"
              fullWidth
              multiline
              rows={2}
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              value={blogForm.category}
              onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={blogForm.tags}
              onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlogDialog}>Cancel</Button>
          <Button onClick={handleSaveBlog} variant="contained">
            {editingBlogId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType === 'blog' ? 'blog post' : 'PDF file'}? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
