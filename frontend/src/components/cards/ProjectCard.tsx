/**
 * Copyright (C) 2024 Your Name
 * All rights reserved.
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Stack,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import { ProjectTimelineBar } from './ProjectTimelineBar';
import type { Project } from '../../services/api';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [openDetails, setOpenDetails] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Planning':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
    <BaseCard
      title={project.title}
      description={project.description}
      image={project.image}
      featured={featured}
      category={project.category}
      tags={project.technologies}
      metadata={[
        {
          icon: <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: formatDate(project.createdAt),
        },
        {
          icon: <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: project.category,
        },
      ]}
      actions={
        <>
          <Box>
            <Tooltip title="View Code">
              <IconButton
                component="a"
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ mr: 1 }}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            
            {project.demo && (
              <Tooltip title="Live Demo">
                <IconButton
                  component="a"
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenDetails(true)}
            sx={{
              minWidth: 'auto',
              fontSize: '0.8rem',
            }}
          >
            Details
          </Button>
        </>
      }
    >
      <Box sx={{ mb: 2 }}>
        <Chip
          label={project.status}
          size="small"
          color={getStatusColor(project.status)}
          sx={{ mb: 1 }}
        />
      </Box>

    </BaseCard>
      
      {/* Project Details Styled Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1, position: 'relative' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip
              label={project.category}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.75rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}
            />
            <Chip
              label={project.status}
              size="small"
              color={getStatusColor(project.status)}
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Stack>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.4rem', sm: '1.75rem' },
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 20%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              pr: 4,
            }}
          >
            {project.title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setOpenDetails(false)}
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          {/* Description Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Project Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {project.description}
            </Typography>
          </Box>
          
          {/* Tech Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Technology Stack
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.technologies.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderColor: 'rgba(0, 240, 255, 0.3)',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 240, 255, 0.04)',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Project Timeline Bar with Milestones */}
          <Box sx={{ mb: 3, pt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Project Timeline & Progress
            </Typography>
            <ProjectTimelineBar
              startDate={project.startDate || project.createdAt}
              endDate={project.endDate}
              timeline={project.timeline}
              status={project.status}
            />
          </Box>

          {/* Metadata Quick Ribbon */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Category
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {project.category}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Status
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {project.status}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Created
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDate(project.createdAt)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {project.github && (
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo
              </Button>
            )}
            {project.demo && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LaunchIcon />}
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Button>
            )}
          </Box>
          <Button onClick={() => setOpenDetails(false)} variant="text" color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProjectCard;
