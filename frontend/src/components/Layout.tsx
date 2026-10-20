/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React from 'react';
import { Box, useTheme, keyframes } from '@mui/material';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const floatTop = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(40px, 30px) scale(1.1);
    opacity: 1;
  }
`;

const floatBottom = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-30px, -40px) scale(1.08);
    opacity: 0.95;
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: isDark ? '#070a13' : '#f8fafc',
        color: 'text.primary',
        transition: 'background-color 0.4s ease',
        overflowX: 'hidden',
      }}
    >
      {/* Dynamic Ambient Background Canvas */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Top-Left Glowing Ambient Orb (Neon Cyan) */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: { xs: 350, sm: 600, md: 800 },
            height: { xs: 350, sm: 600, md: 800 },
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(0, 240, 255, 0.16) 0%, rgba(0, 240, 255, 0.04) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0.03) 50%, transparent 70%)',
            filter: 'blur(70px)',
            animation: `${floatTop} 16s ease-in-out infinite`,
          }}
        />

        {/* Bottom-Right Glowing Ambient Orb (Violet / Magenta) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: { xs: 400, sm: 650, md: 850 },
            height: { xs: 400, sm: 650, md: 850 },
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(138, 43, 226, 0.14) 0%, rgba(138, 43, 226, 0.03) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.02) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animation: `${floatBottom} 20s ease-in-out infinite`,
          }}
        />

        {/* Center Accent Pulse Orb */}
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, sm: 500, md: 700 },
            height: { xs: 300, sm: 500, md: 700 },
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, rgba(138, 43, 226, 0.04) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, rgba(139, 92, 246, 0.03) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Tech Blueprint Dot Matrix Grid Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: isDark
              ? 'radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px)'
              : 'radial-gradient(rgba(14, 165, 233, 0.12) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            opacity: isDark ? 0.75 : 0.6,
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 100%)',
          }}
        />
      </Box>

      {/* Main App Content */}
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
