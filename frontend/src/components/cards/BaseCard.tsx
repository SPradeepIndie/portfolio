/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Stack,
  Chip,
} from '@mui/material';

export interface BaseCardProps {
  title: string;
  description: string;
  image?: string;
  featured?: boolean;
  children?: ReactNode;
  actions?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  category?: string;
  tags?: string[];
  metadata?: Array<{
    icon: ReactNode;
    text: string;
  }>;
  sx?: object;
  imageHeight?: number | string;
}

function BaseCard({
  title,
  description,
  image,
  featured = false,
  children,
  actions,
  header,
  footer,
  category,
  tags,
  metadata,
  sx,
  imageHeight = 200,
}: BaseCardProps) {
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
        ...sx,
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

      {header}

      {image && (
        <CardMedia
          component="img"
          height={imageHeight}
          image={image}
          alt={title}
          sx={{
            objectFit: 'cover',
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {category && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={category}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          </Box>
        )}

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
          {title}
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
          {description}
        </Typography>

        {metadata && metadata.length > 0 && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {metadata.map((item, index) => (
              <Stack key={index} direction="row" spacing={0.5} alignItems="center">
                {item.icon}
                <Typography variant="caption" color="text.secondary">
                  {item.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

        {tags && tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Tags:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {tags.slice(0, 4).map((tag, index) => (
                <Chip
                  key={index}
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
              {tags.length > 4 && (
                <Chip
                  label={`+${tags.length - 4}`}
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
        )}

        {children}
      </CardContent>

      {footer}

      {actions && (
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
}

export default BaseCard;
