  /*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

export const useThemeMode = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeProvider')
  }
  return context
}
