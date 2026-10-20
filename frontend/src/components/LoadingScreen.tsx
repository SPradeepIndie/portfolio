/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 25px rgba(0, 240, 255, 0.45), 0 0 50px rgba(138, 43, 226, 0.25);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 240, 255, 0.7), 0 0 80px rgba(138, 43, 226, 0.45);
    transform: scale(1.03);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading Katta...' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0a0d14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <Box
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(138, 43, 226, 0.08) 50%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Center Spinner & Logo Container */}
      <Box
        sx={{
          position: 'relative',
          width: 140,
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer Circular Spinner Ring */}
        <Box
          component="svg"
          viewBox="0 0 100 100"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: `${spin} 1.6s linear infinite`,
          }}
        >
          <defs>
            <linearGradient id="kattaLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#8a2be2" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.5"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#kattaLoaderGrad)"
            strokeWidth="4"
            strokeDasharray="210"
            strokeDashoffset="60"
            strokeLinecap="round"
          />
        </Box>

        {/* Inner Logo */}
        <Box
          component="img"
          src="/logo.jpg"
          alt="Katta"
          sx={{
            width: 86,
            height: 86,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(0, 240, 255, 0.4)',
            animation: `${pulseGlow} 2.4s ease-in-out infinite`,
            zIndex: 1,
            backgroundColor: '#000000',
          }}
        />
      </Box>

      {/* Brand Title and Status */}
      <Typography
        variant="h6"
        sx={{
          mt: 4,
          fontWeight: 800,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontSize: '1.1rem',
          background: 'linear-gradient(90deg, #00f0ff 0%, #ffffff 50%, #8a2be2 100%)',
          backgroundSize: '200% 100%',
          animation: `${shimmer} 3s linear infinite`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        KATTA
      </Typography>

      <Typography
        variant="caption"
        sx={{
          mt: 1,
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};
