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
  Work,
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import type { Project } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

interface BlogPost {
  author: string
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured: boolean
  pdf_path?: string
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
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blogs' | 'pdfs' | 'projects'>('blogs')

  // Blog form state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    featured: false,
  })
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)
  const [blogPdfFile, setBlogPdfFile] = useState<File | null>(null)

  // Project form state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    github: '',
    demo: '',
    image: '',
    category: '',
    featured: false,
    status: 'Completed',
    timeline: '',
  })
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)

  // PDF upload state
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'blog' | 'pdf' | 'project' | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [blogsData, pdfsData, projectsData] = await Promise.all([
        apiService.getBlogs().catch(() => []),
        apiService.getUploadedPdfs().catch(() => []),
        apiService.getProjects().catch(() => []),
      ])
      setBlogs(blogsData)
      setPdfs(pdfsData)
      setProjects(projectsData)
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
        author: blog.author || '',
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
        author: '',
        category: '',
        tags: '',
        featured: false,
      })
      setEditingBlogId(null)
    }
    setBlogPdfFile(null)
    setBlogDialogOpen(true)
  }

  const handleCloseBlogDialog = () => {
    setBlogDialogOpen(false)
    setEditingBlogId(null)
  }

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.excerpt || !blogForm.author) {
      setError('Title, excerpt, and author are required')
      return
    }

    if (!blogForm.content && !blogPdfFile) {
      setError('Either content or a PDF file must be provided')
      return
    }

    try {
      setMessage(null)
      setError(null)

      let finalPdfUrl = editingBlogId ? blogs.find(b => b.id === editingBlogId)?.pdf_path : undefined;

      if (blogPdfFile) {
        // Upload the PDF
        const { uploadUrl } = await apiService.requestPdfUploadUrl(blogPdfFile.name);
        await apiService.uploadPdfToBlob(uploadUrl, blogPdfFile);
        finalPdfUrl = uploadUrl.split('?')[0];
      }

      const payload = {
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        author: blogForm.author,
        category: blogForm.category,
        tags: blogForm.tags.split(',').map((tag) => tag.trim()),
        featured: blogForm.featured,
        pdf_url: finalPdfUrl,
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


  // Project handlers
  const handleOpenProjectDialog = (project?: Project) => {
    if (project) {
      setProjectForm({
        title: project.title,
        description: project.description,
        technologies: project.technologies ? project.technologies.join(', ') : '',
        github: project.github || '',
        demo: project.demo || '',
        image: project.image || '',
        category: project.category || '',
        featured: project.featured,
        status: project.status || 'Completed',
        timeline: project.timeline || '',
      })
      setEditingProjectId(project.id)
    } else {
      setProjectForm({
        title: '',
        description: '',
        technologies: '',
        github: '',
        demo: '',
        image: '',
        category: '',
        featured: false,
        status: 'Completed',
        timeline: '',
      })
      setEditingProjectId(null)
    }
    setProjectDialogOpen(true)
  }

  const handleCloseProjectDialog = () => {
    setProjectDialogOpen(false)
    setEditingProjectId(null)
  }

  const handleSaveProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      setError('Please fill in title and description')
      return
    }

    try {
      setMessage(null)
      setError(null)

      const payload = {
        ...projectForm,
        status: projectForm.status as 'Completed' | 'In Progress' | 'Planning',
        technologies: projectForm.technologies ? projectForm.technologies.split(',').map((tag) => tag.trim()) : [],
      }

      if (editingProjectId) {
        await apiService.updateProject(editingProjectId, payload)
        setMessage('Project updated successfully')
      } else {
        await apiService.createProject(payload)
        setMessage('Project created successfully')
      }

      handleCloseProjectDialog()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
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
  const handleOpenDeleteDialog = (type: 'blog' | 'pdf' | 'project', id: number) => {
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
      } else if (deleteType === 'project') {
        await apiService.deleteProject(deleteId)
        setMessage('Project deleted successfully')
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
          <Button
            variant={activeTab === 'projects' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('projects')}
            startIcon={<Work />}
          >
            Projects ({projects.length})
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


      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <Box>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => handleOpenProjectDialog()}
                fullWidth
              >
                Create New Project
              </Button>
            </CardContent>
          </Card>

          {projects.length === 0 ? (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No projects yet</Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {projects.map((project) => (
                <Box key={project.id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {project.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        {project.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {project.featured && (
                          <Chip label="Featured" size="small" color="primary" sx={{ mr: 1 }} />
                        )}
                        <Chip label={project.category} size="small" variant="outlined" />
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenProjectDialog(project)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog('project', project.id)}
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
              label="Author"
              fullWidth
              value={blogForm.author}
              onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
            />

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Or upload a PDF for this blog post
              </Typography>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setBlogPdfFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
                id="blog-pdf-input"
              />
              <label htmlFor="blog-pdf-input">
                <Button variant="outlined" component="span" fullWidth>
                  {blogPdfFile ? blogPdfFile.name : 'Select PDF (Optional)'}
                </Button>
              </label>
            </Box>

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


      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={handleCloseProjectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProjectId ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />
            <TextField
              label="Technologies (comma separated)"
              fullWidth
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
            />
            <TextField
              label="GitHub Link"
              fullWidth
              value={projectForm.github}
              onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
            />
            <TextField
              label="Demo Link"
              fullWidth
              value={projectForm.demo}
              onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
            />
            <TextField
              label="Image URL"
              fullWidth
              value={projectForm.image}
              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              value={projectForm.category}
              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
            />
            <TextField
              label="Status"
              fullWidth
              value={projectForm.status}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
            />
            <TextField
              label="Timeline (Optional)"
              fullWidth
              value={projectForm.timeline}
              onChange={(e) => setProjectForm({ ...projectForm, timeline: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {editingProjectId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType === 'blog' ? 'blog post' : deleteType === 'project' ? 'project' : 'PDF file'}? This
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
