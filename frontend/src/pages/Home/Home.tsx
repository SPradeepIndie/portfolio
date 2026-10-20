/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  Visibility as ViewAllIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  FolderSpecial as ProjectsIcon,
  Article as ArticlesIcon,
  CloudQueue as UploadsIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Project, Blog } from '../../services/api';
import { BaseCard } from '../../components';

interface UploadedPdfItem {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

export const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [uploads, setUploads] = useState<UploadedPdfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [projectList, blogList, pdfList] = await Promise.allSettled([
          apiService.getProjects(),
          apiService.getBlogs(),
          apiService.getUploadedPdfs(),
        ]);

        if (projectList.status === 'fulfilled') {
          setProjects(projectList.value || []);
        }
        if (blogList.status === 'fulfilled') {
          setBlogs(blogList.value || []);
        }
        if (pdfList.status === 'fulfilled') {
          setUploads(pdfList.value || []);
        }
      } catch (error) {
        console.error('Failed to load home page content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Show featured projects or fallback to latest 3
  const featuredProjects = projects.filter(p => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 3) : projects.slice(0, 3);

  // Show featured blogs or fallback to latest 3
  const featuredBlogs = blogs.filter(b => b.featured);
  const displayBlogs = featuredBlogs.length > 0 ? featuredBlogs.slice(0, 3) : blogs.slice(0, 3);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <Container
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1
      }}
    >
      {/* Hero Section */}
      <Box
        textAlign="center"
        sx={{
          maxWidth: 'md',
          mx: 'auto',
          width: '100%',
          mb: { xs: 6, md: 8 },
          mt: { xs: 2, md: 4 },
          position: 'relative'
        }}
      >
        {/* Glow effect behind hero */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '150%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.18) 0%, rgba(139,92,246,0.12) 40%, rgba(0,0,0,0) 70%)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { 
              xs: '2.5rem', 
              sm: '3.5rem', 
              md: '4.25rem', 
              lg: '4.75rem' 
            },
            fontWeight: 800,
            mb: { xs: 2, md: 3 },
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 20%, ${theme.palette.secondary.main} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            filter: 'drop-shadow(0 2px 8px rgba(0,240,255,0.25))'
          }}
        >
          Katta | Tech Portfolio
        </Typography>

        <Typography
          variant="h5"
          component="p"
          sx={{
            fontSize: { 
              xs: '1.1rem', 
              sm: '1.35rem', 
              md: '1.5rem' 
            },
            mb: { xs: 2, md: 3 },
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'secondary.main',
          }}
        >
          Continuous Learner & Software Craftsman
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1.05rem', md: '1.2rem' },
            lineHeight: 1.8,
            maxWidth: { xs: '100%', sm: '85%', md: '75%' },
            mx: 'auto',
            px: { xs: 1, sm: 2 },
            mb: 4
          }}
        >
          Exploring modern web applications, scalable cloud backends, and distributed architectures. 
          Discover recent projects, technical writeups, and research publications below.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/projects"
            sx={{ minWidth: 170, py: 1.2, fontWeight: 700 }}
          >
            Explore Projects
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/blogs"
            sx={{ minWidth: 170, py: 1.2, fontWeight: 700 }}
          >
            Read Articles
          </Button>
        </Stack>
      </Box>

      {/* Metrics / Highlights Ribbon */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: { xs: 6, md: 8 },
          borderRadius: 3,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
            textAlign: 'center',
          }}
        >
          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText', mb: 1 }}>
              <ProjectsIcon fontSize="small" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {loading ? '...' : projects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Projects
            </Typography>
          </Box>

          <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText', mb: 1 }}>
              <ArticlesIcon fontSize="small" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {loading ? '...' : blogs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published Blogs
            </Typography>
          </Box>

          <Box sx={{ p: 1, gridColumn: { xs: 'span 2', sm: 'span 1' } }}>
            <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 2, bgcolor: '#00f0ff', color: '#000000', mb: 1 }}>
              <UploadsIcon fontSize="small" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {loading ? '...' : uploads.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uploaded Resources
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Projects Section */}
      {displayProjects.length > 0 && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  color="primary"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700
                  }}
                >
                  {featuredProjects.length > 0 ? 'Featured Projects' : 'Recent Projects'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Innovative systems, full-stack web applications, and architectural experiments.
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/projects')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                View All
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: { xs: 2, md: 3 },
                mb: 2
              }}
            >
              {displayProjects.map((project) => (
                <BaseCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  featured={project.featured}
                  category={project.category}
                  actions={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/projects')}
                      fullWidth
                    >
                      View Details
                    </Button>
                  }
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' }, mt: 2 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/projects')}
              >
                View All Projects
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Blogs Section */}
      {displayBlogs.length > 0 && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  color="primary"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700
                  }}
                >
                  {featuredBlogs.length > 0 ? 'Featured Articles' : 'Recent Articles'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thoughts on cloud platforms, microservices, front-end design, and developer tooling.
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ViewAllIcon />}
                onClick={() => navigate('/blogs')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                View All
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: { xs: 2, md: 3 },
                mb: 2
              }}
            >
              {displayBlogs.map((blog) => (
                <BaseCard
                  key={blog.id}
                  title={blog.title}
                  description={blog.excerpt}
                  featured={blog.featured}
                  category={blog.category}
                  actions={
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      fullWidth
                    >
                      Read More
                    </Button>
                  }
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' }, mt: 2 }}>
              <Button
                variant="outlined"
                endIcon={<ViewAllIcon />}
                onClick={() => navigate('/blogs')}
              >
                View All Articles
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Uploaded Documents / PDF Resources Section */}
      {uploads.length > 0 && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  color="primary"
                  sx={{
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    fontWeight: 700
                  }}
                >
                  Recent Publications & Uploads
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Directly hosted whitepapers, documentation, and research PDFs on Vercel Blob.
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {uploads.slice(0, 6).map((file) => (
                <Card
                  key={file.id}
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 240, 255, 0.12)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PdfIcon fontSize="small" />
                      </Box>
                      <Chip
                        label="PDF Document"
                        size="small"
                        sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                      />
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        wordBreak: 'break-word',
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {file.filename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Size: {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      component="a"
                      href={file.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                    >
                      View / Download
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};
