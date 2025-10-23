/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

// Create complete themes by mixing foundation + colors
// barrel file for themes

import { createTheme } from '@mui/material/styles'
import { baseTheme } from './baseTheme'
import { lightPalette, darkPalette } from './palette'

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
  // components
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
  // components
})

export { lightTheme as default }
