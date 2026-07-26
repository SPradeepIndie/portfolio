/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import type { Blog } from '../../services/api';

export const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await apiService.getBlog(parseInt(id, 10));
        if (data) {
          setBlog(data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Blog not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/blogs')}>
          Back to Blogs
        </Button>
      </Container>
    );
  }

  // Use pdf_path if it exists (for PDF blogs), or pdf_url if the API returns that
  const pdfUrl = blog.pdf_path || blog.pdf_url;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/blogs')}
        sx={{ mb: 4 }}
      >
        Back to Blogs
      </Button>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {blog.title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 24, height: 24 }}>
              <PersonIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary">
              {blog.author}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            • {formatDate(blog.publishedAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            • <TimeIcon sx={{ fontSize: 16, mr: 0.5, ml: 1 }} /> {blog.readTime}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          <Chip label={blog.category} color="primary" />
          {blog.tags.map((tag, idx) => (
            <Chip key={idx} label={tag} variant="outlined" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {pdfUrl ? (
        <Box sx={{ height: '80vh', width: '100%', bgcolor: '#f5f5f5', borderRadius: 2, overflow: 'hidden' }}>
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            title={blog.title}
            style={{ border: 'none' }}
          />
        </Box>
      ) : (
        <Box sx={{ typography: 'body1', lineHeight: 1.8 }}>
          {blog.content.split('\\n').map((paragraph, idx) => (
            <Typography key={idx} paragraph>
              {paragraph}
            </Typography>
          ))}
        </Box>
      )}
    </Container>
  );
};
