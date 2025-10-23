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
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { apiService } from '../../services/api';
import type { Project } from '../../services/api';
import ProjectCard from '../../components/ProjectCard';

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
      id={`projects-tabpanel-${index}`}
      aria-labelledby={`projects-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const categories = ['All', 'Featured', 'Full Stack', 'Frontend', 'Backend', 'Web App', 'Data Visualization'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectData = await apiService.getProjects();
      setProjects(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredProjects = (category: string) => {
    if (category === 'All') return projects;
    if (category === 'Featured') return projects.filter(project => project.featured);
    return projects.filter(project => project.category === category);
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
            My Projects
          </Typography>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchProjects}
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
            maxWidth: 'md'
          }}
        >
          Here you'll find a showcase of my latest projects and technical work.
          Each project demonstrates different skills and technologies I've mastered.
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={fetchProjects}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {projects.length > 0 && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="project categories"
            >
              {categories.map((category, index) => (
                <Tab
                  key={category}
                  label={`${category} ${category === 'All' ? `(${projects.length})` : 
                    category === 'Featured' ? `(${projects.filter(p => p.featured).length})` :
                    `(${projects.filter(p => p.category === category).length})`}`}
                  id={`projects-tab-${index}`}
                  aria-controls={`projects-tabpanel-${index}`}
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
                {getFilteredProjects(category).map((project) => (
                  <ProjectCard key={project.id} project={project} featured={project.featured} />
                ))}
              </Box>

              {getFilteredProjects(category).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No projects found in "{category}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new projects in this category.
                  </Typography>
                </Box>
              )}
            </TabPanel>
          ))}
        </>
      )}

      {projects.length === 0 && !loading && !error && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Projects will be displayed here once they are available.
          </Typography>
          <Button variant="contained" onClick={fetchProjects}>
            Check Again
          </Button>
        </Box>
      )}
    </Container>
  );
};
