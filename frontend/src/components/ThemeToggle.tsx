/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useThemeMode } from '../hooks/useTheme'

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg)',
            backgroundColor: 'action.hover',
          },
        }}
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  )
}
