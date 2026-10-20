/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React from 'react';
import { Box, Typography, Tooltip, Stack, Chip, useTheme } from '@mui/material';
import { CheckCircle as CheckIcon, RadioButtonUnchecked as CircleIcon } from '@mui/icons-material';
import type { TimelineEvent } from '../../services/api';

interface ProjectTimelineBarProps {
  startDate?: string;
  endDate?: string;
  timeline?: TimelineEvent[];
  status?: string;
}

export const ProjectTimelineBar: React.FC<ProjectTimelineBarProps> = ({
  startDate,
  endDate,
  timeline = [],
  status,
}) => {
  const theme = useTheme();

  // Helper to parse dates safely
  const parseDate = (d?: string): number | null => {
    if (!d) return null;
    const timestamp = Date.parse(d);
    return isNaN(timestamp) ? null : timestamp;
  };

  const formatDate = (dateNum: number) => {
    return new Date(dateNum).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Collect all available date timestamps
  const parsedDates: number[] = [];
  const startTs = parseDate(startDate);
  const endTs = parseDate(endDate);

  if (startTs) parsedDates.push(startTs);
  if (endTs) parsedDates.push(endTs);

  timeline.forEach((item) => {
    const s = parseDate(item.startTime);
    const e = parseDate(item.endTime);
    if (s) parsedDates.push(s);
    if (e) parsedDates.push(e);
  });

  // If no valid dates at all, show structured events
  if (parsedDates.length === 0) {
    if (timeline.length === 0) return null;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Milestones
        </Typography>
        <Stack spacing={1}>
          {timeline.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {item.startTime} {item.endTime ? ` - ${item.endTime}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {item.duration}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  // Calculate project boundary start and end
  let minTime = startTs ?? Math.min(...parsedDates);
  let maxTime = endTs ?? Math.max(...parsedDates);

  if (minTime === maxTime) {
    // Add 30 days span for single date projects
    maxTime = minTime + 30 * 24 * 60 * 60 * 1000;
  } else if (minTime > maxTime) {
    const temp = minTime;
    minTime = maxTime;
    maxTime = temp;
  }

  const todayTime = Date.now();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.round((maxTime - minTime) / MS_PER_DAY));
  const elapsedDays = Math.round((todayTime - minTime) / MS_PER_DAY);

  // Calculate fill percentage up to today
  let fillPercent = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  if (status?.toLowerCase() === 'completed') {
    fillPercent = 100;
  }

  const isTodayInsideSpan = todayTime >= minTime && todayTime <= maxTime;

  return (
    <Box sx={{ width: '100%', my: 3 }}>
      {/* Header Info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 1,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Timeline Span
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatDate(minTime)} → {formatDate(maxTime)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            size="small"
            label={`${totalDays} Days Total`}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
          <Chip
            size="small"
            color="primary"
            label={status?.toLowerCase() === 'completed' ? '100% Completed' : `${Math.round(fillPercent)}% Elapsed`}
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          />
        </Stack>
      </Box>

      {/* The Timeline Progress Bar */}
      <Box sx={{ position: 'relative', py: 4, px: 1 }}>
        {/* Base Track */}
        <Box
          sx={{
            position: 'relative',
            height: 14,
            width: '100%',
            borderRadius: 7,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
            overflow: 'visible',
          }}
        >
          {/* Active Fill Bar (fills until current date) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${fillPercent}%`,
              borderRadius: 7,
              background: 'linear-gradient(90deg, #00f2fe 0%, #8b5cf6 100%)',
              boxShadow: '0 0 14px rgba(0, 242, 254, 0.55)',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Today Indicator Line & Beacon */}
          {isTodayInsideSpan && status?.toLowerCase() !== 'completed' && (
            <Box
              sx={{
                position: 'absolute',
                left: `${fillPercent}%`,
                top: -18,
                bottom: -18,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 4,
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                  bgcolor: '#00f2fe',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 8px rgba(0, 242, 254, 0.6)',
                  mb: 0.5,
                }}
              >
                TODAY
              </Box>
              <Box
                sx={{
                  width: 2,
                  flex: 1,
                  bgcolor: '#00f2fe',
                  boxShadow: '0 0 8px #00f2fe',
                }}
              />
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#ffffff',
                  border: '2px solid #00f2fe',
                  boxShadow: '0 0 10px #00f2fe',
                }}
              />
            </Box>
          )}

          {/* Milestone Nodes Placed Along the Bar */}
          {timeline.map((event, idx) => {
            const eventTime = parseDate(event.startTime);
            if (!eventTime) return null;

            const offset = Math.min(100, Math.max(0, ((eventTime - minTime) / (maxTime - minTime)) * 100));
            const isCompleted = eventTime <= todayTime || status?.toLowerCase() === 'completed';

            return (
              <Tooltip
                key={idx}
                arrow
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {event.description || `Milestone ${idx + 1}`}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {formatDate(eventTime)} {event.duration ? `(${event.duration})` : ''}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isCompleted ? '#34d399' : '#f59e0b' }}>
                      {isCompleted ? '✓ Passed / Completed' : '○ Upcoming Milestone'}
                    </Typography>
                  </Box>
                }
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: `${offset}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#00f2fe' : (theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff'),
                      border: `2.5px solid ${isCompleted ? '#ffffff' : '#8b5cf6'}`,
                      boxShadow: isCompleted
                        ? '0 0 10px rgba(0, 242, 254, 0.8)'
                        : '0 0 8px rgba(139, 92, 246, 0.4)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.3)',
                        boxShadow: '0 0 16px rgba(0, 242, 254, 1)',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#000000' : '#8b5cf6',
                      }}
                    />
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* Milestones Card Breakdown */}
      {timeline.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
            Milestones & Key Deliverables ({timeline.length})
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 1.5,
            }}
          >
            {timeline.map((event, idx) => {
              const eventTime = parseDate(event.startTime);
              const isCompleted = eventTime ? (eventTime <= todayTime || status?.toLowerCase() === 'completed') : false;

              return (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isCompleted ? 'rgba(0, 242, 254, 0.25)' : 'divider',
                    bgcolor: (th) => th.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ mt: 0.3, color: isCompleted ? '#00f2fe' : 'text.disabled' }}>
                    {isCompleted ? <CheckIcon fontSize="small" /> : <CircleIcon fontSize="small" />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                      {event.description || `Milestone ${idx + 1}`}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {eventTime ? formatDate(eventTime) : event.startTime}
                      </Typography>
                      {event.duration && (
                        <Chip
                          label={event.duration}
                          size="small"
                          sx={{ height: 18, fontSize: '0.68rem', fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};
