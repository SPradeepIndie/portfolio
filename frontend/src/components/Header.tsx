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
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { Menu as MenuIcon, AccountCircle, Logout, Person, CloudUpload } from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../hooks/useAuth'

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
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleLogout = async () => {
    handleUserMenuClose()
    await logout()
    navigate('/login')
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
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              flexShrink: 0,
              mr: { xs: 2, sm: 4 },
              '&:hover img': {
                transform: 'scale(1.06)',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.6)',
              },
              '&:hover .brand-text': {
                opacity: 0.9,
              },
            }}
          >
            <Box
              component="img"
              src="/logo.jpg"
              alt="Katta Logo"
              sx={{
                width: { xs: 34, sm: 40 },
                height: { xs: 34, sm: 40 },
                borderRadius: '8px',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
                objectFit: 'cover',
              }}
            />
            <Typography
              className="brand-text"
              variant="h6"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                letterSpacing: '0.03em',
                background: (th) => `linear-gradient(45deg, ${th.palette.primary.main} 20%, ${th.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.6rem' },
                transition: 'all 0.3s ease',
              }}
            >
              Katta
            </Typography>
          </Box>

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
              {isAuthenticated && (
                <NavigationButton 
                  item={{ label: 'Posts', path: '/posts' }} 
                />
              )}
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

            <IconButton
              size="large"
              aria-label="user account"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={isAuthenticated ? handleUserMenuOpen : () => navigate('/login')}
              color="inherit"
              sx={{
                p: { xs: 1, sm: 1.5 },
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isAuthenticated ? theme.palette.action.hover : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {isAuthenticated ? (
                <Avatar
                  sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}
                >
                  {(user?.full_name?.[0] || 'U').toUpperCase()}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            
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
          {isAuthenticated && (
            <MenuItem
              component={Link}
              to="/posts"
              onClick={handleMenuClose}
              sx={{
                fontWeight: isActivePath('/posts') ? 600 : 400,
                color: isActivePath('/posts')
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
              Posts
            </MenuItem>
          )}
        </Menu>

        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(userMenuAnchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
            }
          }}
        >
          <MenuItem disabled sx={{ opacity: 1, minHeight: 64 }}>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                {(user?.full_name?.[0] || 'U').toUpperCase()}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={user?.full_name || 'Guest'}
              secondary={user?.email || 'Not signed in'}
            />
          </MenuItem>
          <Divider />
          <MenuItem component={Link} to="/posts" onClick={handleUserMenuClose}>
            <ListItemIcon>
              <CloudUpload fontSize="small" />
            </ListItemIcon>
            <ListItemText>Manage Posts</ListItemText>
          </MenuItem>
          <MenuItem component={Link} to="/user" onClick={handleUserMenuClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </AppBar>
  )
}
