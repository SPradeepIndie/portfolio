/**
 * Copyright (C) 2024 Your Name
 * All rights reserved.
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Launch as LaunchIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import type { Project } from '../services/api';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        border: featured ? 2 : 1,
        borderColor: featured ? 'primary.main' : 'divider',
        position: 'relative',
      }}
    >
      {featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          Featured
        </Box>
      )}

      <CardMedia
        component="img"
        height="200"
        image={project.image}
        alt={project.title}
        sx={{
          objectFit: 'cover',
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.title}
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
            lineHeight: 1.5,
          }}
        >
          {project.description}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(project.createdAt)}
          </Typography>
          <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
          <Typography variant="caption" color="text.secondary">
            {project.category}
          </Typography>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={project.status}
            size="small"
            color={getStatusColor(project.status)}
            sx={{ mb: 1 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Technologies:
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {project.technologies.slice(0, 4).map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />
            ))}
            {project.technologies.length > 4 && (
              <Chip
                label={`+${project.technologies.length - 4}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  color: 'text.secondary',
                }}
              />
            )}
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
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
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
