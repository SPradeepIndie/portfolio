/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */


import type { PaletteOptions } from '@mui/material/styles'

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#3b82f6', // Blue primary in dark
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f472b6', // Pink secondary for contrast
    light: '#fbbf24',
    dark: '#ec4899',
    contrastText: '#000000', // High contrast black text on pink
  },
  background: {
    default: '#0f172a', // Very dark blue-gray
    paper: '#1e293b', // Slightly lighter for cards/papers
  },
  text: {
    primary: '#f8fafc', // High contrast white for readability
    secondary: '#cbd5e0', // Slightly muted for secondary text
  },
  grey: {
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e0',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc',
  },
}
