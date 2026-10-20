/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

// Create themes: foundation + colors
// barrel file for themes

import { createTheme } from '@mui/material/styles'
import { baseTheme } from './baseTheme'
import { lightPalette, darkPalette } from './palette'

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
  components: {
    ...baseTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...(typeof baseTheme.components?.MuiCssBaseline?.styleOverrides === 'object'
          ? baseTheme.components.MuiCssBaseline.styleOverrides
          : {}),
        'input[type="date"]': {
          colorScheme: 'light',
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          filter: 'invert(0)',
          opacity: 0.75,
          cursor: 'pointer',
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
  components: {
    ...baseTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...(typeof baseTheme.components?.MuiCssBaseline?.styleOverrides === 'object'
          ? baseTheme.components.MuiCssBaseline.styleOverrides
          : {}),
        'input[type="date"]': {
          colorScheme: 'dark',
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          filter: 'invert(1)',
          opacity: 0.85,
          cursor: 'pointer',
        },
      },
    },
  },
})

export { lightTheme as default }
