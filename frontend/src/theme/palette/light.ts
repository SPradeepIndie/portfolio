/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import type { PaletteOptions } from '@mui/material/styles'

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2563eb', // Blue primary
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ec4899', // Pink secondary for contrast
    light: '#f472b6',
    dark: '#be185d',
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#1a202c',
    secondary: '#4a5568',
  },
  grey: {
    100: '#f7fafc',
    200: '#edf2f7',
    300: '#e2e8f0',
    400: '#cbd5e0',
    500: '#a0aec0',
    600: '#718096',
    700: '#4a5568',
    800: '#2d3748',
    900: '#1a202c',
  },
}
