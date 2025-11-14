/*
 *  Copyright © 2025 My personal.
 *
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
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Visibility as ViewsIcon,
  FavoriteBorder as LikeIcon,
  Share as ShareIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { Blog } from '../services/api';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href + `/blog/${blog.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href + `/blog/${blog.id}`);
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
        borderColor: featured ? 'secondary.main' : 'divider',
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
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
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
        image={blog.image}
        alt={blog.title}
        sx={{
          objectFit: 'cover',
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={blog.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        </Box>

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
            lineHeight: 1.3,
          }}
        >
          {blog.title}
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
          {blog.excerpt}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            <PersonIcon sx={{ fontSize: 16 }} />
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {blog.author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            • {formatDate(blog.publishedAt)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {blog.readTime}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ViewsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {blog.views.toLocaleString()}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <LikeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {blog.likes}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Tags:
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {blog.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 24,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              />
            ))}
            {blog.tags.length > 3 && (
              <Chip
                label={`+${blog.tags.length - 3}`}
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
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
          onClick={() => {
            // Navigate to blog detail page
            window.location.href = `/blog/${blog.id}`;
          }}
        >
          Read More
        </Button>

        <Box>
          <Tooltip title="Share Article">
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{ ml: 1 }}
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
