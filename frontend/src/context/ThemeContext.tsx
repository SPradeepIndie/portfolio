/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import React, { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    if (savedTheme) {
      setMode(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  const value = {
    mode,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeContext }
