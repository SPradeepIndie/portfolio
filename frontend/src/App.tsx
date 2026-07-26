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
import { RequireAuth } from './components/RequireAuth'
import { HomePage, ProjectsPage, BlogsPage, BlogDetail, MorePage, LoginPage, RegisterPage, UserPage, PostManagementPage } from './pages'
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/more" element={<MorePage />} />
            <Route
              path="/user"
              element={
                <RequireAuth>
                  <UserPage />
                </RequireAuth>
              }
            />
            <Route
              path="/posts"
              element={
                <RequireAuth>
                  <PostManagementPage />
                </RequireAuth>
              }
            />
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
