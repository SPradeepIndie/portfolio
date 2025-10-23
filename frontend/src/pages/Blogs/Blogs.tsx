/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Stack,
  InputBase,
  Paper,
  IconButton,
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import type { Blog } from '../../services/api';
import BlogCard from '../../components/BlogCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blogs-tabpanel-${index}`}
      aria-labelledby={`blogs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Featured', 
    'Frontend Development',
    'Backend Development',
    'Programming Languages',
    'Database',
    'Web Design',
    'DevOps'
  ];

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await apiService.getBlogs();
      setBlogs(blogData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredBlogs = (category: string) => {
    let filtered = blogs;
    
    if (category !== 'All') {
      if (category === 'Featured') {
        filtered = blogs.filter(blog => blog.featured);
      } else {
        filtered = blogs.filter(blog => blog.category === category);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query)) ||
        blog.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1 
      }}
    >
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            color="primary"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: { xs: 600, md: 700 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            My Blog
          </Typography>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchBlogs}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Stack>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: { xs: 1.6, md: 1.7 },
            textAlign: { xs: 'center', sm: 'left' },
            maxWidth: 'md',
            mb: 3
          }}
        >
          Welcome to my technical blog! Here I share insights about software development,
          new technologies, coding best practices, and my journey as a software engineer.
        </Typography>

        {/* Search Bar */}
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 400,
            mb: 3
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <IconButton
              type="button"
              sx={{ p: '10px' }}
              aria-label="clear"
              onClick={clearSearch}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Paper>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBlogs}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {blogs.length > 0 && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="blog categories"
            >
              {categories.map((category, index) => (
                <Tab
                  key={category}
                  label={`${category} ${category === 'All' ? `(${getFilteredBlogs(category).length})` : 
                    category === 'Featured' ? `(${blogs.filter(p => p.featured).length})` :
                    `(${blogs.filter(p => p.category === category).length})`}`}
                  id={`blogs-tab-${index}`}
                  aria-controls={`blogs-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>

          {categories.map((category, index) => (
            <TabPanel key={category} value={tabValue} index={index}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                  },
                  gap: { xs: 2, md: 3 }
                }}
              >
                {getFilteredBlogs(category).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} featured={blog.featured} />
                ))}
              </Box>

              {getFilteredBlogs(category).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchQuery 
                      ? `No blogs found matching "${searchQuery}"${category !== 'All' ? ` in "${category}"` : ''}`
                      : `No blogs found in "${category}"`
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery 
                      ? 'Try different search terms or browse all categories.'
                      : 'Check back later for new articles in this category.'
                    }
                  </Typography>
                </Box>
              )}
            </TabPanel>
          ))}
        </>
      )}

      {blogs.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Articles will be displayed here once they are published.
          </Typography>
          <Button variant="contained" onClick={fetchBlogs}>
            Check Again
          </Button>
        </Box>
      )}
    </Container>
  );
};
