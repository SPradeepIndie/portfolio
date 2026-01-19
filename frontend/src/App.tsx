/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeMode } from './hooks/useTheme'
import { lightTheme, darkTheme } from './theme'
import { Layout } from './components/Layout'
import { HomePage, ProjectsPage, BlogsPage, MorePage } from './pages'
import './App.css'

function App() {
  const { mode } = useThemeMode()
  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/more" element={<MorePage />} />
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  color: theme.palette.text.primary 
                }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </MuiThemeProvider>
  )
}

export default App
