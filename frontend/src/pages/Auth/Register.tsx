import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowForward, PersonAdd, Login as LoginIcon, SwapHoriz } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../../services/api'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      await apiService.register({
        full_name: fullName,
        email,
        password,
      })

      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully. Please log in.' },
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed')
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
          radial-gradient(circle at top right, ${theme.palette.secondary.main}22 0%, transparent 30%),
          radial-gradient(circle at bottom left, ${theme.palette.primary.main}22 0%, transparent 34%),
          linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)
        `,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 3,
                color: 'primary.main',
                fontWeight: 700,
              }}
            >
              Create Account
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
              Create your portfolio account.
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
              Register once, then sign in to manage your dedicated user page, refresh session
              tokens, and keep your access token flow working in the background.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                endIcon={<LoginIcon />}
              >
                Back to Login
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
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                  }}
                >
                  <PersonAdd />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Join the workspace
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create an account to continue.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  label="Full Name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  fullWidth
                  required
                />
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
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  fullWidth
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  endIcon={<ArrowForward />}
                  sx={{ py: 1.4 }}
                >
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}
