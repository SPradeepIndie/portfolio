/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import {
  Button,
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Visibility as ViewsIcon,
  FavoriteBorder as LikeIcon,
  Share as ShareIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import type { Blog } from '../../services/api';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

function BlogCard({ blog, featured = false }: BlogCardProps) {
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
    <BaseCard
      title={blog.title}
      description={blog.excerpt}
      image={blog.image}
      featured={featured}
      category={blog.category}
      tags={blog.tags}
      sx={{
        borderColor: featured ? 'secondary.main' : 'divider',
      }}
      metadata={[
        {
          icon: <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: blog.readTime,
        },
        {
          icon: <ViewsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: blog.views.toLocaleString(),
        },
        {
          icon: <LikeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />,
          text: blog.likes.toString(),
        },
      ]}
      actions={
        <>
          <Button
            variant="contained"
            size="small"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
            onClick={() => {
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
        </>
      }
    >
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
    </BaseCard>
  );
}

export default BlogCard;
