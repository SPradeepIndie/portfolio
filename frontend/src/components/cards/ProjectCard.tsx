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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import BaseCard from './BaseCard';
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
      
      {/* Project Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            {project.title}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {project.description}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Technologies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.technologies?.map((tech, index) => (
                <Chip key={index} label={tech} size="small" />
              ))}
            </Box>
          </Box>
          
          {project.timeline && project.timeline.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Project Timeline
              </Typography>
              <Box sx={{ width: '100%', overflowX: 'auto', py: 2 }}>
                <Stepper alternativeLabel activeStep={project.timeline.length} connector={
                  <Box sx={{ height: 4, bgcolor: 'primary.main', borderRadius: 2, flex: '1 1 auto', mx: 1, mt: 1.5 }} />
                }>
                  {project.timeline.map((event, index) => (
                    <Step key={index}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'primary.main', zIndex: 1, position: 'relative' }} />
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {event.startTime} {event.endTime ? ` - ${event.endTime}` : ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {event.duration}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {event.description}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
             <Typography variant="h6" gutterBottom>
               Details
             </Typography>
             <Stack spacing={1}>
               <Typography variant="body2"><strong>Status:</strong> {project.status}</Typography>
               <Typography variant="body2"><strong>Category:</strong> {project.category}</Typography>
               <Typography variant="body2"><strong>Date:</strong> {formatDate(project.createdAt)}</Typography>
             </Stack>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            {project.github && (
              <Button
                startIcon={<GitHubIcon />}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 1 }}
              >
                GitHub
              </Button>
            )}
            {project.demo && (
              <Button
                startIcon={<LaunchIcon />}
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Button>
            )}
          </Box>
          <Button onClick={() => setOpenDetails(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProjectCard;
