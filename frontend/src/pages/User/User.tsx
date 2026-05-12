import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  AccountCircle,
  Logout,
  Refresh,
  Save,
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'

export const UserPage = () => {
  const { user, logout, refreshSession, updateProfile, isLoading } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setFullName(user?.full_name ?? '')
    setEmail(user?.email ?? '')
  }, [user])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    setError(null)

    try {
      await updateProfile({
        full_name: fullName,
        email,
        ...(password ? { password } : {}),
      })
      setPassword('')
      setMessage('Profile updated successfully.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setMessage(null)
    setError(null)

    try {
      const refreshed = await refreshSession()
      setMessage(refreshed ? 'Session refreshed successfully.' : 'No refresh token available.')
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Failed to refresh session')
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                }}
              >
                <AccountCircle fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
                  User Area
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Manage your account details and settings.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {message && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                  Account Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={user?.is_active ? 'Active' : 'Inactive'}
                    color={user?.is_active ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    label={user?.role ?? 'user'}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Profile Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {user?.full_name ?? 'No profile loaded'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email ?? 'Log in to load account details'}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <TextField
                label="Full Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                label="New Password (optional)"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                helperText="Leave empty to keep current password"
                fullWidth
                variant="outlined"
              />

              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                  startIcon={<Save />}
                  fullWidth
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  startIcon={<Refresh />}
                  fullWidth
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </Stack>

              <Button
                variant="text"
                color="error"
                onClick={logout}
                startIcon={<Logout />}
                fullWidth
              >
                Logout
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
