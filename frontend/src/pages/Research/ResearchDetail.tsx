/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Science as ScienceIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { apiService } from '../../services/api';
import type { Blog } from '../../services/api';
import ReactMarkdown from 'react-markdown';

export const ResearchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearchItem = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await apiService.getBlog(parseInt(id, 10));
        if (data) {
          setItem(data);
        } else {
          setError('Research paper not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load research item');
      } finally {
        setLoading(false);
      }
    };

    fetchResearchItem();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Research paper not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/research')}>
          Back to Research
        </Button>
      </Container>
    );
  }

  const pdfUrl = item.pdf_path || item.pdf_url;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/research')}
        sx={{ mb: 4 }}
      >
        Back to Research
      </Button>

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            icon={<ScienceIcon />}
            label="Research"
            color="primary"
            size="small"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={item.featured ? 'Published Paper' : 'Ongoing Investigation'}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          {pdfUrl && (
            <Chip
              icon={<PdfIcon />}
              label="Document Available"
              size="small"
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Stack>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.25,
            mb: 2,
          }}
        >
          {item.title}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary', mb: 3 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CalendarIcon fontSize="small" />
            <Typography variant="body2">
              {new Date(item.publishedAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Stack>
        </Stack>

        {/* Abstract callout */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 240, 255, 0.04)' : 'rgba(14, 165, 233, 0.04)',
            mb: 4,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
            Abstract / Executive Summary
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
            {item.excerpt}
          </Typography>
        </Paper>

        {/* Attached PDF Banner */}
        {pdfUrl && (
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 4,
              border: '1px solid rgba(0, 240, 255, 0.3)',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <PdfIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Full Research Manuscript & Documentation
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF format hosted directly on Vercel Blob
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              component="a"
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PDF Document
            </Button>
          </Paper>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Main Content Markdown */}
      <Box
        sx={{
          lineHeight: 1.8,
          fontSize: '1.05rem',
          '& p': { mb: 2.5 },
          '& h2': { mt: 4, mb: 2, fontWeight: 700, fontSize: '1.75rem' },
          '& h3': { mt: 3, mb: 1.5, fontWeight: 600, fontSize: '1.35rem' },
          '& ul, & ol': { pl: 3, mb: 2.5 },
          '& code': {
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'action.hover',
            fontFamily: 'monospace',
          },
        }}
      >
        <ReactMarkdown>{item.content || item.excerpt || 'Research methodology and results details...'}</ReactMarkdown>
      </Box>
    </Container>
  );
};
