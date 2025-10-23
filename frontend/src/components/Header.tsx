/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

interface NavigationItem {
  label: string
  path: string
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'More', path: '/more' },
]

export const Header: React.FC = () => {
  const theme = useTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const NavigationButton: React.FC<{ item: NavigationItem }> = ({ item }) => (
    <Button
      component={Link}
      to={item.path}
      sx={{
        color: 'inherit',
        textTransform: 'none',
        fontWeight: isActivePath(item.path) ? 600 : 400,
        position: 'relative',
        mx: { xs: 0.5, md: 1 },
        px: { xs: 2, md: 3 },
        py: { xs: 1, md: 1.5 },
        fontSize: { xs: '0.875rem', md: '1rem' },
        '&::after': isActivePath(item.path)
          ? {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 1,
            }
          : {},
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 1,
            opacity: 0.5,
          },
        },
      }}
    >
      {item.label}
    </Button>
  )

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 56, sm: 64, md: 72 },
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
          }}
        >
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
              flexShrink: 0,
              mr: { xs: 2, sm: 4 },
              '&:hover': {
                color: theme.palette.secondary.main,
              },
              transition: 'color 0.3s ease',
            }}
          >
            Portfolio
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box 
              sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center',
                maxWidth: 'md',
                mx: 'auto',
              }}
            >
              {navigationItems.map((item) => (
                <NavigationButton key={item.path} item={item} />
              ))}
            </Box>
          )}

          {/* Right side - Theme Toggle and Mobile Menu */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexShrink: 0,
            gap: { xs: 0.5, sm: 1 }
          }}>
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ 
                  p: { xs: 1, sm: 1.5 },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          id="mobile-menu"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
            }
          }}
        >
          {navigationItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMenuClose}
              sx={{
                fontWeight: isActivePath(item.path) ? 600 : 400,
                color: isActivePath(item.path)
                  ? theme.palette.secondary.main
                  : theme.palette.text.primary,
                minHeight: 48,
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </AppBar>
  )
}
