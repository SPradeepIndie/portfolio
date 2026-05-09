import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
  Stack,
} from '@mui/material'
import { ArrowForward, Login as LoginIcon, Security, SwapHoriz } from '@mui/icons-material'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/user'
  const successMessage = (location.state as { message?: string } | null)?.message
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 4, md: 8 },
        background: (theme) => `
          radial-gradient(circle at top left, ${theme.palette.primary.main}22 0%, transparent 35%),
          radial-gradient(circle at bottom right, ${theme.palette.secondary.main}22 0%, transparent 32%),
          linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)
        `,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 3,
                color: 'secondary.main',
                fontWeight: 700,
              }}
            >
              Secure Access
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: '2.4rem', sm: '3rem', md: '4rem' },
                fontWeight: 800,
                lineHeight: 1.05,
                mt: 1,
                mb: 2,
              }}
            >
              Sign in to manage your portfolio space.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                maxWidth: 520,
                mb: 3,
              }}
            >
              Use your accout to manage the portfolio content
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/user"
                variant="outlined"
                endIcon={<ArrowForward />}
              >
                Go to User Page
              </Button>
              <Button
                component={Link}
                to="/"
                variant="text"
                endIcon={<SwapHoriz />}
              >
                Back to Home
              </Button>
            </Stack>
          </Box>

          <Card
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <LoginIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in with your portfolio account.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  endIcon={<Security />}
                  sx={{ py: 1.4 }}
                >
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="text"
                  color="secondary"
                  fullWidth
                >
                  Don’t have an account? Sign up
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}
