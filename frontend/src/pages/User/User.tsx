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
  Verified,
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'

export const UserPage = () => {
  const { user, logout, refreshSession, updateProfile, accessToken, refreshToken, isLoading } = useAuth()
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
      maxWidth="lg"
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
          gap: { xs: 3, md: 4 },
          alignItems: 'start',
        }}
      >
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
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
                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                  User Area
                </Typography>
                <Typography color="text.secondary">
                  Manage your account and session tokens.
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Account Status
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={user?.is_active ? 'Active' : 'Inactive'}
                    color={user?.is_active ? 'success' : 'default'}
                    variant="outlined"
                  />
                  <Chip
                    label={user?.role ?? 'user'}
                    color="secondary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Box>

              <TextField label="Full Name" value={fullName} onChange={(event) => setFullName(event.target.value)} fullWidth />
              <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                helperText="Leave empty to keep the current password"
                fullWidth
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                  {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
                </Button>
              </Stack>

              <Button
                variant="text"
                color="error"
                onClick={logout}
                startIcon={<Logout />}
                sx={{ alignSelf: 'flex-start' }}
              >
                Logout
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Session Details
            </Typography>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Access Token
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>
                  {accessToken ? `${accessToken.slice(0, 18)}...${accessToken.slice(-10)}` : 'No access token loaded'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Refresh Token
                </Typography>
                <Typography sx={{ wordBreak: 'break-all' }}>
                  {refreshToken ? `${refreshToken.slice(0, 18)}...${refreshToken.slice(-10)}` : 'No refresh token stored'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Profile
                </Typography>
                <Typography>
                  {user?.full_name ?? 'No profile loaded'}
                </Typography>
                <Typography color="text.secondary">
                  {user?.email ?? 'Log in to load account details'}
                </Typography>
              </Box>
              <Alert severity="info" icon={<Verified />}>
                The refresh token is stored locally for session persistence, while the access token is
                used automatically for protected API calls.
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
