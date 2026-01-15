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
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon,
  Visibility as ViewAllIcon 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Project, Blog } from '../../services/api';
import { BaseCard } from '../../components';

export const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [projects, blogs] = await Promise.all([
          apiService.getProjects(),
          apiService.getBlogs()
        ]);
        
        setFeaturedProjects(projects.filter(p => p.featured).slice(0, 3));
        setFeaturedBlogs(blogs.filter(b => b.featured).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <Container maxWidth="lg" 
        sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1
      }}
    >
      {/* Hero Section */}
      <Box textAlign="center"
        sx={{
          maxWidth: 'md',
          mx: 'auto',
          width: '100%',
          mb: { xs: 6, md: 8 }
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom color="primary"
          sx={{
            fontSize: { 
              xs: '2rem', 
              sm: '2.5rem', 
              md: '3rem', 
              lg: '3.5rem' 
            },
            fontWeight: { xs: 600, md: 700 },
            mb: { xs: 2, md: 3 }
          }}
        >
          Welcome to My Portfolio
        </Typography>
        <Typography variant="h5" color="text.secondary" component="p"
          sx={{
            fontSize: { 
              xs: '1.25rem', 
              sm: '1.5rem', 
              md: '1.75rem' 
            },
            mb: { xs: 3, md: 4 },
            fontWeight: { xs: 400, md: 500 }
          }}
        >
          Life Time Learner
        </Typography>
        <Typography variant="body1" color="text.secondary"
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: { xs: 1.6, md: 1.7 },
            maxWidth: { xs: '100%', sm: '80%', md: '70%' },
            mx: 'auto',
            px: { xs: 1, sm: 2 },
            mb: 4
          }}
        >
          Explore my projects, read my blogs, and get in touch!
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/projects"
            sx={{ minWidth: 160 }}
          >
            View Projects
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={Link}
            to="/blogs"
            sx={{ minWidth: 160 }}
          >
            Read Blogs
          </Button>
        </Stack>
      </Box>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                color="primary"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 600
                }}
              >
                Featured Projects
              </Typography>
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
              {featuredProjects.map((project) => (
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

            <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
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

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <>
          <Divider sx={{ mb: 4 }} />
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography
                variant="h4"
                component="h2"
                color="primary"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 600
                }}
              >
                Latest Articles
              </Typography>
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
              {featuredBlogs.map((blog) => (
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
                      onClick={() => navigate('/blogs')}
                      fullWidth
                    >
                      Read More
                    </Button>
                  }
                />
              ))}
            </Box>

            <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
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
    </Container>
  );
};
