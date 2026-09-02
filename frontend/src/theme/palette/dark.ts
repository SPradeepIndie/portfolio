/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */


import type { PaletteOptions } from '@mui/material/styles'

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#00f2fe', // Neon cyan
    light: '#4facfe',
    dark: '#00a8cc',
    contrastText: '#000000',
  },
  secondary: {
    main: '#a855f7', // Purple
    light: '#d8b4fe',
    dark: '#7e22ce',
    contrastText: '#ffffff',
  },
  background: {
    default: '#050505',
    paper: '#121212',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
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
