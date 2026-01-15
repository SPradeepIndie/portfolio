/**
 * Copyright (C) 2024 Your Name
 * All rights reserved.
 */

import {
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
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import type { Project } from '../../services/api';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
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
            startIcon={<LaunchIcon />}
            href={project.demo || project.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              minWidth: 'auto',
              fontSize: '0.8rem',
            }}
          >
            View
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
  );
}

export default ProjectCard;
