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
  Chip,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  MenuBook as BookIcon,
  Science as ScienceIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import type { Blog, ResearchItem } from '../../services/api';

interface UploadedDoc {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

export const ResearchPage: React.FC = () => {
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const tabs = ['All Research', 'Ongoing', 'Published Papers', 'Technical Docs'];

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resData, blogData, docData] = await Promise.allSettled([
        apiService.getResearch(),
        apiService.getBlogs(),
        apiService.getUploadedPdfs(),
      ]);

      if (resData.status === 'fulfilled') {
        setResearchList(resData.value || []);
      }
      if (blogData.status === 'fulfilled') {
        setBlogs(blogData.value || []);
      }
      if (docData.status === 'fulfilled') {
        setDocs(docData.value || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load research items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dedicated research items or fallback to research-tagged blogs
  const displayItems: ResearchItem[] = researchList.length > 0 
    ? researchList 
    : blogs.filter((b) => b.category?.toLowerCase() === 'research' || b.tags?.some((t) => t.toLowerCase() === 'research') || b.pdf_path || b.pdf_url).map(b => ({
        id: b.id,
        title: b.title,
        abstract: b.excerpt,
        content: b.content,
        author: b.author,
        status: (b.featured ? 'Published' : 'Ongoing') as 'Published' | 'Ongoing',
        category: b.category,
        tags: b.tags,
        pdf_url: b.pdf_path || b.pdf_url,
        featured: b.featured,
        is_hidden: b.is_hidden,
        created_at: b.publishedAt,
      }));

  const getFilteredItems = () => {
    let list = displayItems;

    if (tabValue === 1) {
      // Ongoing
      list = list.filter((b) => b.status === 'Ongoing' || !b.featured);
    } else if (tabValue === 2) {
      // Published Papers
      list = list.filter((b) => b.status === 'Published' || b.featured);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.abstract.toLowerCase().includes(q) ||
          b.tags?.some((t) => t.toLowerCase().includes(q)) ||
          b.category?.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredItems = getFilteredItems();

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
      {/* Header Banner */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1.5 }}>
          <ScienceIcon color="secondary" sx={{ fontSize: 32 }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 20%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Research & Publications
          </Typography>
        </Stack>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', fontSize: { xs: '1rem', md: '1.15rem' } }}
        >
          Ongoing scientific investigations, technical whitepapers, distributed systems experiments, and downloadable documentation.
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            p: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Search ongoing research, methodologies, papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tabLabel, idx) => (
            <Tab key={idx} label={tabLabel} sx={{ fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }} />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={fetchResearchData}>
              Retry
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      )}

      {/* Tab 3: Technical Docs directly */}
      {tabValue === 3 ? (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Directly Uploaded Documentation & Whitepapers ({docs.length})
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {docs.map((doc) => (
              <Card
                key={doc.id}
                variant="outlined"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 3,
                  p: 1,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(0, 240, 255, 0.15)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                      <PdfIcon fontSize="small" />
                    </Box>
                    <Chip label="PDF Documentation" size="small" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
                    {doc.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(doc.file_size)} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    component="a"
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    View Document
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        /* Research Articles & Papers Grid */
        <Box>
          {filteredItems.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No research publications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'Try clearing your search query.' : 'New ongoing research and papers will be published shortly.'}
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {filteredItems.map((item) => {
                const pdfUrl = item.pdf_url;
                return (
                  <Card
                    key={item.id}
                    variant="outlined"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 3,
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 36px rgba(0, 240, 255, 0.15)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Chip
                          label={item.status || (item.featured ? 'Published' : 'Ongoing Research')}
                          size="small"
                          color={item.status === 'Published' || item.featured ? 'secondary' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        />
                        {pdfUrl && (
                          <Chip
                            icon={<PdfIcon />}
                            label="PDF Attached"
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                          />
                        )}
                      </Stack>

                      <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 1.5 }}>
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                        }}
                      >
                        {item.abstract}
                      </Typography>

                      {item.tags && item.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1 }}>
                          {item.tags.slice(0, 3).map((t, tidx) => (
                            <Chip key={tidx} label={`#${t}`} size="small" sx={{ fontSize: '0.72rem' }} />
                          ))}
                        </Box>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 1, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/research/${item.id}`)}
                        fullWidth
                      >
                        Read Details
                      </Button>
                      {pdfUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          component="a"
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Doc
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};
