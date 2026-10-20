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
  Chip,
  IconButton,
  Snackbar,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Autocomplete,
  createFilterOptions,
  type Theme,
} from '@mui/material'
import {
  CloudUpload,
  Delete,
  Edit,
  Description,
  Work,
  Add,
  RemoveCircleOutline,
  Science,
} from '@mui/icons-material'
import { apiService } from '../../services/api'
import type { Project, TimelineEvent, ResearchItem } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { SettingsDialog } from './SettingsDialog'
import { FEATURES } from '../../config/features'

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
  is_hidden?: boolean
}

const filter = createFilterOptions<string>();

const PROJECT_STATUS_OPTIONS = [
  'Initiated',
  'Planning',
  'In Progress',
  'Under Review',
  'Beta Testing',
  'Completed',
  'On Hold',
  'Archived',
];

const RESEARCH_STATUS_OPTIONS = [
  'Ongoing',
  'In Review',
  'Under Peer Review',
  'Published',
  'Preprint',
  'Working Paper',
];

const dateInputSx = {
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: (theme: Theme) => (theme.palette.mode === 'dark' ? 'invert(1)' : 'invert(0)'),
    cursor: 'pointer',
    opacity: 0.8,
  },
};

export const PostManagementPage = () => {
  const { isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [researchList, setResearchList] = useState<ResearchItem[]>([])
  const [systemCategories, setSystemCategories] = useState<{ id: number; name: string; entity_type: string }[]>([])
  const [systemTags, setSystemTags] = useState<{ id: number; name: string; entity_type: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'research'>('blogs')
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Blog form state
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: [] as string[],
    featured: false,
    is_hidden: false,
  })
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null)
  const [blogPdfFile, setBlogPdfFile] = useState<File | null>(null)

  // Project form state
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    github: '',
    demo: '',
    image: '',
    category: '',
    featured: false,
    status: 'Completed',
    startDate: '',
    endDate: '',
    timeline: [] as TimelineEvent[],
    is_hidden: false,
  })
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)

  // Research form state
  const [researchDialogOpen, setResearchDialogOpen] = useState(false)
  const [researchForm, setResearchForm] = useState({
    title: '',
    abstract: '',
    content: '',
    author: '',
    status: 'Ongoing',
    category: 'Computer Science',
    tags: [] as string[],
    featured: false,
    is_hidden: false,
  })
  const [editingResearchId, setEditingResearchId] = useState<number | null>(null)
  const [researchPdfFile, setResearchPdfFile] = useState<File | null>(null)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'blog' | 'pdf' | 'project' | 'research' | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [blogsData, projectsData, researchData, settingsData] = await Promise.all([
        apiService.getBlogs().catch(() => []),
        apiService.getProjects().catch(() => []),
        apiService.getResearch(true).catch(() => []),
        apiService.getSettings().catch(() => ({ categories: [], tags: [] })),
      ])
      setBlogs(blogsData)
      setProjects(projectsData)
      setResearchList(researchData)
      setSystemCategories(settingsData.categories || [])
      setSystemTags(settingsData.tags || [])
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load your posts and files')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to persist dynamically added categories
  const ensureCategory = async (name: string, entity_type: string) => {
    const trimmed = name?.trim();
    if (!trimmed) return;
    const exists = systemCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      try {
        const created = await apiService.createCategory({ name: trimmed, entity_type });
        if (created) setSystemCategories(prev => [...prev, created]);
      } catch (err) {
        console.warn('Could not auto-save category:', err);
      }
    }
  };

  // Helper to persist dynamically added tags
  const ensureTags = async (tagsArr: string[], entity_type: string) => {
    for (const tag of tagsArr) {
      const trimmed = tag?.trim();
      if (!trimmed) continue;
      const exists = systemTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        try {
          const created = await apiService.createTag({ name: trimmed, entity_type });
          if (created) setSystemTags(prev => [...prev, created]);
        } catch (err) {
          console.warn('Could not auto-save tag:', err);
        }
      }
    }
  };

  // Helpers for timeline duration parsing & calculation
  const parseDurationVal = (d?: string) => {
    if (!d) return '';
    const match = d.match(/^(\d+)/);
    return match ? match[1] : '';
  };

  const parseDurationUnit = (d?: string) => {
    if (!d) return 'Days';
    if (d.toLowerCase().includes('year')) return 'Years';
    if (d.toLowerCase().includes('month')) return 'Months';
    if (d.toLowerCase().includes('week')) return 'Weeks';
    return 'Days';
  };

  const calculateDurationBetween = (start?: string, end?: string): string => {
    if (!start || !end) return '';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return '';
    const diffDays = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
    if (diffDays >= 365) {
      const yrs = Math.round(diffDays / 365);
      return `${yrs} Year${yrs > 1 ? 's' : ''}`;
    }
    if (diffDays >= 60) {
      const mos = Math.round(diffDays / 30);
      return `${mos} Month${mos > 1 ? 's' : ''}`;
    }
    if (diffDays >= 14) {
      const wks = Math.round(diffDays / 7);
      return `${wks} Week${wks > 1 ? 's' : ''}`;
    }
    return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
  };

  // Blog handlers
  const handleOpenBlogDialog = (blog?: BlogPost) => {
    if (blog) {
      setBlogForm({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author || '',
        category: blog.category,
        tags: Array.isArray(blog.tags) ? blog.tags : [],
        featured: blog.featured,
        is_hidden: blog.is_hidden || false,
      })
      setEditingBlogId(blog.id)
    } else {
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        tags: [],
        featured: false,
        is_hidden: false,
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

    if (FEATURES.ENABLE_PDF_UPLOAD) {
      if (!blogForm.content && !blogPdfFile) {
        setError('Either content or a PDF file must be provided')
        return
      }
    } else {
      if (!blogForm.content) {
        setError('Content is required')
        return
      }
    }

    try {
      setMessage(null)
      setError(null)

      let finalPdfUrl = editingBlogId ? blogs.find(b => b.id === editingBlogId)?.pdf_path : undefined;

      if (FEATURES.ENABLE_PDF_UPLOAD && blogPdfFile) {
        const uploadedPdf = await apiService.uploadPdf(blogPdfFile);
        finalPdfUrl = uploadedPdf.file_path;
      }

      // Ensure newly added category or tags are persisted
      if (blogForm.category) await ensureCategory(blogForm.category, 'blog');
      if (blogForm.tags && blogForm.tags.length > 0) await ensureTags(blogForm.tags, 'blog');

      const payload = {
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        author: blogForm.author,
        category: blogForm.category,
        tags: blogForm.tags,
        featured: blogForm.featured,
        is_hidden: blogForm.is_hidden,
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
        technologies: Array.isArray(project.technologies) ? project.technologies : [],
        github: project.github || '',
        demo: project.demo || '',
        image: project.image || '',
        category: project.category || '',
        featured: project.featured,
        status: project.status || 'Completed',
        startDate: project.startDate || project.start_date || '',
        endDate: project.endDate || project.end_date || '',
        timeline: project.timeline || [],
        is_hidden: project.is_hidden || false,
      })
      setEditingProjectId(project.id)
    } else {
      setProjectForm({
        title: '',
        description: '',
        technologies: [],
        github: '',
        demo: '',
        image: '',
        category: '',
        featured: false,
        status: 'Completed',
        startDate: '',
        endDate: '',
        timeline: [],
        is_hidden: false,
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

      // Ensure newly added category or technologies are persisted
      if (projectForm.category) await ensureCategory(projectForm.category, 'project');
      if (projectForm.technologies && projectForm.technologies.length > 0) {
        await ensureTags(projectForm.technologies, 'project');
      }

      const payload = {
        ...projectForm,
        status: projectForm.status as Project['status'],
        technologies: projectForm.technologies,
        startDate: projectForm.startDate || undefined,
        endDate: projectForm.endDate || undefined,
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

  // Research handlers
  const handleOpenResearchDialog = (item?: ResearchItem) => {
    if (item) {
      setResearchForm({
        title: item.title,
        abstract: item.abstract,
        content: item.content || '',
        author: item.author,
        status: item.status || 'Ongoing',
        category: item.category || 'Computer Science',
        tags: Array.isArray(item.tags) ? item.tags : [],
        featured: item.featured,
        is_hidden: item.is_hidden || false,
      })
      setEditingResearchId(item.id)
    } else {
      setResearchForm({
        title: '',
        abstract: '',
        content: '',
        author: '',
        status: 'Ongoing',
        category: 'Computer Science',
        tags: [],
        featured: false,
        is_hidden: false,
      })
      setEditingResearchId(null)
    }
    setResearchPdfFile(null)
    setResearchDialogOpen(true)
  }

  const handleCloseResearchDialog = () => {
    setResearchDialogOpen(false)
    setEditingResearchId(null)
  }

  const handleSaveResearch = async () => {
    if (!researchForm.title || !researchForm.abstract || !researchForm.author) {
      setError('Title, abstract, and author are required')
      return
    }

    try {
      setMessage(null)
      setError(null)

      let finalPdfUrl = editingResearchId
        ? researchList.find((r) => r.id === editingResearchId)?.pdf_url
        : undefined

      if (researchPdfFile) {
        const uploadedPdf = await apiService.uploadPdf(researchPdfFile)
        finalPdfUrl = uploadedPdf.file_path
      }

      // Ensure newly added category or tags are persisted
      if (researchForm.category) await ensureCategory(researchForm.category, 'research');
      if (researchForm.tags && researchForm.tags.length > 0) {
        await ensureTags(researchForm.tags, 'research');
      }

      const payload = {
        title: researchForm.title,
        abstract: researchForm.abstract,
        content: researchForm.content,
        author: researchForm.author,
        status: researchForm.status,
        category: researchForm.category,
        tags: researchForm.tags,
        featured: researchForm.featured,
        is_hidden: researchForm.is_hidden,
        pdf_url: finalPdfUrl,
      }

      if (editingResearchId) {
        await apiService.updateResearch(editingResearchId, payload)
        setMessage('Research publication updated successfully')
      } else {
        await apiService.createResearch(payload)
        setMessage('Research publication created successfully')
      }

      handleCloseResearchDialog()
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save research publication')
    }
  }

  // Delete handlers
  const handleOpenDeleteDialog = (type: 'blog' | 'pdf' | 'project' | 'research', id: number) => {
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
      } else if (deleteType === 'research') {
        await apiService.deleteResearch(deleteId)
        setMessage('Research publication deleted successfully')
      } else {
        if (!FEATURES.ENABLE_PDF_UPLOAD) {
          setError('PDF operations are disabled')
          return
        }
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
              {FEATURES.ENABLE_PDF_UPLOAD 
                ? 'Upload and manage your blog posts and PDF files' 
                : 'Manage your blog posts and projects'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />



        {/* Tab buttons */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant={activeTab === 'blogs' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('blogs')}
              startIcon={<Description />}
            >
              Blogs ({blogs.length})
            </Button>
            <Button
              variant={activeTab === 'projects' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('projects')}
              startIcon={<Work />}
            >
              Projects ({projects.length})
            </Button>
            <Button
              variant={activeTab === 'research' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('research')}
              startIcon={<Science />}
            >
              Research ({researchList.length})
            </Button>
          </Stack>
          <Button variant="outlined" onClick={() => setSettingsOpen(true)}>
            Manage Tags & Categories
          </Button>
        </Box>
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
                      {(!blog.pdf_path || !FEATURES.ENABLE_PDF_UPLOAD) && (
                        <IconButton
                          size="small"
                          onClick={() => handleOpenBlogDialog(blog)}
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
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

      {/* Research Tab */}
      {activeTab === 'research' && (
        <Box>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Science />}
                onClick={() => handleOpenResearchDialog()}
                fullWidth
              >
                Create New Research Publication
              </Button>
            </CardContent>
          </Card>

          {researchList.length === 0 ? (
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No research publications yet. Click above to add your first research manuscript!</Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {researchList.map((item) => (
                <Box key={item.id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        {item.abstract}
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={item.status} size="small" color="primary" />
                        <Chip label={item.category} size="small" variant="outlined" />
                        {item.pdf_url && (
                          <Chip label="PDF Attached" size="small" color="secondary" variant="outlined" />
                        )}
                        {item.featured && (
                          <Chip label="Featured" size="small" color="success" />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {item.tags?.map((tag, index) => (
                          <Chip key={index} label={`#${tag}`} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenResearchDialog(item)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog('research', item.id)}
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
      <Dialog open={blogDialogOpen} onClose={handleCloseBlogDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingBlogId ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={blogForm.title}
              onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
            />
            <TextField
              label="Excerpt"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={blogForm.excerpt}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
            />
            <TextField
              label="Content"
              fullWidth
              size="small"
              multiline
              rows={4}
              value={blogForm.content}
              onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
              helperText="You can use Markdown for styling (e.g., **bold**, # Heading, [link](url))"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Author"
                fullWidth
                size="small"
                value={blogForm.author}
                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
              />

              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={systemCategories.filter(c => c.entity_type === 'blog').map(c => c.name)}
                value={blogForm.category}
                onChange={(_, newValue) => {
                  const clean = typeof newValue === 'string' ? newValue.replace(/^\+ Add "(.*)"$/, '$1') : '';
                  setBlogForm({ ...blogForm, category: clean || '' });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                  if (inputValue.trim() !== '' && !isExisting) {
                    filtered.push(`+ Add "${inputValue.trim()}"`);
                  }
                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" placeholder="Select or type to create" size="small" />
                )}
              />
            </Stack>

            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={systemTags.filter(t => t.entity_type === 'blog').map(t => t.name)}
              value={blogForm.tags}
              onChange={(_, newValue) => {
                const cleaned = newValue.map(v => typeof v === 'string' ? v.replace(/^\+ Add "(.*)"$/, '$1') : v);
                setBlogForm({ ...blogForm, tags: cleaned });
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                if (inputValue.trim() !== '' && !isExisting) {
                  filtered.push(`+ Add "${inputValue.trim()}"`);
                }
                return filtered;
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} variant="outlined" label={option} size="small" {...tagProps} />;
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Search or type new tag..." size="small" />
              )}
            />

            {FEATURES.ENABLE_PDF_UPLOAD && (
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
                  <Button variant="outlined" component="span" size="small" fullWidth>
                    {blogPdfFile ? blogPdfFile.name : 'Select PDF (Optional)'}
                  </Button>
                </label>
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={blogForm.is_hidden}
                  onChange={(e) => setBlogForm({ ...blogForm, is_hidden: e.target.checked })}
                  color="primary"
                />
              }
              label="Hide Post"
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
      <Dialog open={projectDialogOpen} onClose={handleCloseProjectDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingProjectId ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />

            {/* Overall Project Start & End Dates */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Project Start Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={dateInputSx}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
              />
              <TextField
                label="Project End Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={dateInputSx}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
              />
            </Stack>

            {/* Category and Creatable Status */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={systemCategories.filter(c => c.entity_type === 'project').map(c => c.name)}
                value={projectForm.category}
                onChange={(_, newValue) => {
                  const clean = typeof newValue === 'string' ? newValue.replace(/^\+ Add "(.*)"$/, '$1') : '';
                  setProjectForm({ ...projectForm, category: clean || '' });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                  if (inputValue.trim() !== '' && !isExisting) {
                    filtered.push(`+ Add "${inputValue.trim()}"`);
                  }
                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" placeholder="Select or type new category" size="small" />
                )}
              />

              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={PROJECT_STATUS_OPTIONS}
                value={projectForm.status}
                onChange={(_, newValue) => {
                  const clean = typeof newValue === 'string' ? newValue.replace(/^\+ Add "(.*)"$/, '$1') : '';
                  setProjectForm({ ...projectForm, status: clean || '' });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                  if (inputValue.trim() !== '' && !isExisting) {
                    filtered.push(`+ Add "${inputValue.trim()}"`);
                  }
                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Status" placeholder="Select or type custom status" size="small" />
                )}
              />
            </Stack>

            {/* Technologies with Creatable Autocomplete */}
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={systemTags.filter(t => t.entity_type === 'project').map(t => t.name)}
              value={projectForm.technologies}
              onChange={(_, newValue) => {
                const cleaned = newValue.map(v => typeof v === 'string' ? v.replace(/^\+ Add "(.*)"$/, '$1') : v);
                setProjectForm({ ...projectForm, technologies: cleaned });
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                if (inputValue.trim() !== '' && !isExisting) {
                  filtered.push(`+ Add "${inputValue.trim()}"`);
                }
                return filtered;
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} variant="outlined" label={option} size="small" {...tagProps} />;
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Technologies & Frameworks" placeholder="Search or add technology..." size="small" />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="GitHub Link"
                fullWidth
                size="small"
                value={projectForm.github}
                onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
              />
              <TextField
                label="Demo Link"
                fullWidth
                size="small"
                value={projectForm.demo}
                onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
              />
            </Stack>

            <TextField
              label="Image URL"
              fullWidth
              size="small"
              value={projectForm.image}
              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={projectForm.is_hidden}
                  onChange={(e) => setProjectForm({ ...projectForm, is_hidden: e.target.checked })}
                  color="primary"
                />
              }
              label="Hide Project"
            />
            
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Timeline Milestones & Slots</Typography>
              {projectForm.timeline.map((event, index) => (
                <Card variant="outlined" sx={{ p: 2, mb: 2 }} key={index}>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Start Date"
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        sx={dateInputSx}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        value={event.startTime}
                        onChange={(e) => {
                          const newTimeline = [...projectForm.timeline];
                          const newStartTime = e.target.value;
                          newTimeline[index].startTime = newStartTime;
                          const autoDur = calculateDurationBetween(newStartTime, newTimeline[index].endTime);
                          if (autoDur) newTimeline[index].duration = autoDur;
                          setProjectForm({ ...projectForm, timeline: newTimeline });
                        }}
                        fullWidth
                      />
                      <TextField
                        label="End Date"
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        sx={dateInputSx}
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                        value={event.endTime}
                        onChange={(e) => {
                          const newTimeline = [...projectForm.timeline];
                          const newEndTime = e.target.value;
                          newTimeline[index].endTime = newEndTime;
                          const autoDur = calculateDurationBetween(newTimeline[index].startTime, newEndTime);
                          if (autoDur) newTimeline[index].duration = autoDur;
                          setProjectForm({ ...projectForm, timeline: newTimeline });
                        }}
                        fullWidth
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: '45%' } }}>
                        <TextField
                          label="Duration"
                          size="small"
                          type="number"
                          inputProps={{ min: 1 }}
                          value={parseDurationVal(event.duration)}
                          onChange={(e) => {
                            const val = e.target.value;
                            const unit = parseDurationUnit(event.duration);
                            const newTimeline = [...projectForm.timeline];
                            newTimeline[index].duration = val ? `${val} ${val === '1' ? unit.replace(/s$/, '') : unit}` : '';
                            setProjectForm({ ...projectForm, timeline: newTimeline });
                          }}
                          sx={{ flex: 1 }}
                        />
                        <FormControl size="small" sx={{ width: 110 }}>
                          <InputLabel>Unit</InputLabel>
                          <Select
                            value={parseDurationUnit(event.duration)}
                            label="Unit"
                            onChange={(e) => {
                              const val = parseDurationVal(event.duration) || '1';
                              const unit = e.target.value;
                              const newTimeline = [...projectForm.timeline];
                              newTimeline[index].duration = `${val} ${val === '1' ? unit.replace(/s$/, '') : unit}`;
                              setProjectForm({ ...projectForm, timeline: newTimeline });
                            }}
                          >
                            <MenuItem value="Days">Days</MenuItem>
                            <MenuItem value="Weeks">Weeks</MenuItem>
                            <MenuItem value="Months">Months</MenuItem>
                            <MenuItem value="Years">Years</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TextField
                        label="Milestone Description"
                        size="small"
                        value={event.description}
                        onChange={(e) => {
                          const newTimeline = [...projectForm.timeline];
                          newTimeline[index].description = e.target.value;
                          setProjectForm({ ...projectForm, timeline: newTimeline });
                        }}
                        fullWidth
                      />
                      <IconButton color="error" onClick={() => {
                        const newTimeline = projectForm.timeline.filter((_, i) => i !== index);
                        setProjectForm({ ...projectForm, timeline: newTimeline });
                      }}>
                        <RemoveCircleOutline />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Card>
              ))}
              <Button startIcon={<Add />} variant="outlined" size="small" onClick={() => {
                setProjectForm({
                  ...projectForm,
                  timeline: [...projectForm.timeline, { startTime: '', endTime: '', duration: '', description: '' }]
                })
              }}>
                Add Milestone / Timeline Slot
              </Button>
            </Box>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {editingProjectId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Research Dialog */}
      <Dialog open={researchDialogOpen} onClose={handleCloseResearchDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingResearchId ? 'Edit Research Publication' : 'Create New Research Publication'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Research Title"
              fullWidth
              size="small"
              value={researchForm.title}
              onChange={(e) => setResearchForm({ ...researchForm, title: e.target.value })}
              required
            />
            <TextField
              label="Abstract / Executive Summary"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={researchForm.abstract}
              onChange={(e) => setResearchForm({ ...researchForm, abstract: e.target.value })}
              required
            />
            <TextField
              label="Full Methodology / Paper Content"
              fullWidth
              size="small"
              multiline
              rows={5}
              value={researchForm.content}
              onChange={(e) => setResearchForm({ ...researchForm, content: e.target.value })}
              helperText="Markdown supported (headings, equations, citations, links)"
            />

            <TextField
              label="Author(s)"
              fullWidth
              size="small"
              value={researchForm.author}
              onChange={(e) => setResearchForm({ ...researchForm, author: e.target.value })}
              required
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={RESEARCH_STATUS_OPTIONS}
                value={researchForm.status}
                onChange={(_, newValue) => {
                  const clean = typeof newValue === 'string' ? newValue.replace(/^\+ Add "(.*)"$/, '$1') : '';
                  setResearchForm({ ...researchForm, status: clean || '' });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                  if (inputValue.trim() !== '' && !isExisting) {
                    filtered.push(`+ Add "${inputValue.trim()}"`);
                  }
                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Research Status" placeholder="Select or type status" size="small" />
                )}
              />

              <Autocomplete
                freeSolo
                size="small"
                fullWidth
                options={systemCategories.filter(c => c.entity_type === 'research').map(c => c.name)}
                value={researchForm.category}
                onChange={(_, newValue) => {
                  const clean = typeof newValue === 'string' ? newValue.replace(/^\+ Add "(.*)"$/, '$1') : '';
                  setResearchForm({ ...researchForm, category: clean || '' });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                  if (inputValue.trim() !== '' && !isExisting) {
                    filtered.push(`+ Add "${inputValue.trim()}"`);
                  }
                  return filtered;
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Domain / Category" placeholder="Select or type category" size="small" />
                )}
              />
            </Stack>

            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={systemTags.filter(t => t.entity_type === 'research').map(t => t.name)}
              value={researchForm.tags}
              onChange={(_, newValue) => {
                const cleaned = newValue.map(v => typeof v === 'string' ? v.replace(/^\+ Add "(.*)"$/, '$1') : v);
                setResearchForm({ ...researchForm, tags: cleaned });
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
                if (inputValue.trim() !== '' && !isExisting) {
                  filtered.push(`+ Add "${inputValue.trim()}"`);
                }
                return filtered;
              }}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} variant="outlined" label={option} size="small" {...tagProps} />;
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Search or type new tag..." size="small" />
              )}
            />

            {/* Direct Research Manuscript / PDF Upload */}
            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Attach Research Paper / PDF Documentation (Vercel Blob)
              </Typography>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResearchPdfFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
                id="research-pdf-input"
              />
              <label htmlFor="research-pdf-input">
                <Button variant="outlined" component="span" size="small" startIcon={<CloudUpload />} fullWidth>
                  {researchPdfFile ? researchPdfFile.name : 'Choose PDF Manuscript File'}
                </Button>
              </label>
            </Box>

            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={researchForm.featured}
                    onChange={(e) => setResearchForm({ ...researchForm, featured: e.target.checked })}
                  />
                }
                label="Featured Publication"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={researchForm.is_hidden}
                    onChange={(e) => setResearchForm({ ...researchForm, is_hidden: e.target.checked })}
                  />
                }
                label="Hide Publication"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResearchDialog}>Cancel</Button>
          <Button onClick={handleSaveResearch} variant="contained" color="secondary">
            {editingResearchId ? 'Update Publication' : 'Publish Research'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType === 'blog' ? 'blog post' : deleteType === 'project' ? 'project' : deleteType === 'research' ? 'research publication' : 'PDF file'}? This
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
      
      <Snackbar open={!!message} autoHideDuration={6000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Container>
  )
}
