/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  useTheme,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Email,
  Phone,
  LinkedIn,
  GitHub,
  Send,
  Close,
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface ContactInfo {
  email: string
  phone: string
  linkedin: string
  github: string
}

interface EmailForm {
  name: string
  email: string
  subject: string
  message: string
}

const defaultContactInfo: ContactInfo = {
  email: 'sanjayapadeepnet@gmail.com',
  phone: '',
  linkedin: '',
  github: '',
}

export const Footer = () => {
  const theme = useTheme()
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailForm, setEmailForm] = useState<EmailForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)

  useEffect(() => {
    apiService.getPortfolio().then(data => {
      if (data?.contact) {
        setContactInfo({
          email: data.contact.email || defaultContactInfo.email,
          phone: data.contact.phone || '',
          linkedin: data.contact.linkedin || '',
          github: data.contact.github || '',
        })
      }
    }).catch(console.error)
  }, [])

  const handleEmailDialogOpen = () => setEmailDialogOpen(true)
  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false)
    setEmailForm({ name: '', email: '', subject: '', message: '' })
  }

  const handleFormChange = (field: keyof EmailForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    severity: 'success' | 'error' | 'warning' | 'info'
    message: string
  }>({
    open: false,
    severity: 'success',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = async () => {
    setIsSending(true)
    try {
      const fullMessage = emailForm.subject
        ? `Subject: ${emailForm.subject}\n\n${emailForm.message}`
        : emailForm.message

      // 1. Save to database so inquiry is never lost
      await apiService.sendContact({
        name: emailForm.name,
        email: emailForm.email,
        message: fullMessage,
      })

      // 2. Open mailto cleanly via location.href without blank tabs
      const subject = encodeURIComponent(emailForm.subject || 'Portfolio Inquiry')
      const body = encodeURIComponent(
        `Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\nMessage:\n${emailForm.message}`
      )
      const mailtoLink = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
      window.location.href = mailtoLink

      handleEmailDialogClose()
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Inquiry saved successfully! Email client launched to deliver your message.',
      })
    } catch (err) {
      console.error('Contact error:', err)
      // Fallback: still launch mailto
      const subject = encodeURIComponent(emailForm.subject || 'Portfolio Inquiry')
      const body = encodeURIComponent(
        `Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\nMessage:\n${emailForm.message}`
      )
      window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
      handleEmailDialogClose()
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Could not reach server database, but your direct mail client has been opened as fallback.',
      })
    } finally {
      setIsSending(false)
    }
  }

  const isFormValid = emailForm.name && emailForm.email && emailForm.subject && emailForm.message

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 3, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          {/* Social Links and about */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              mb: { xs: 3, sm: 0 },
              maxWidth: { xs: '100%', sm: 340 },
              flex: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1, md: 1.5 }}
              sx={{
                justifyContent: { xs: 'center', sm: 'flex-start' },
                flexWrap: 'wrap',
                gap: { xs: 1, md: 1.5 },
                mb: 2,
              }}
            >
              <IconButton
                component="a"
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  p: 1,
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LinkedIn sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
              <IconButton
                component="a"
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  p: 1,
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <GitHub sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' },
                lineHeight: { xs: 1.5, md: 1.6 },
                maxWidth: 320,
              }}
            >
              Built with React, TypeScript, and Material-UI.
              Showcasing modern web development practices with
              responsive design and clean architecture.
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-end' },
              maxWidth: { xs: '100%', sm: 340 },
              flex: 1,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: { xs: 2, md: 3 },
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              Get In Touch
            </Typography>
            <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}
              >
                <Email color="secondary" sx={{ flexShrink: 0 }} />
                <Link
                  href={`mailto:${contactInfo.email}`}
                  color="inherit"
                  underline="hover"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    wordBreak: 'break-word',
                  }}
                >
                  {contactInfo.email}
                </Link>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}
              >
                <Phone color="secondary" sx={{ flexShrink: 0 }} />
                <Link
                  href={`tel:${contactInfo.phone}`}
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  {contactInfo.phone}
                </Link>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Send />}
                onClick={handleEmailDialogOpen}
                size="small"
                sx={{
                  mt: { xs: 2, md: 3 },
                  alignSelf: { xs: 'center', sm: 'flex-start' },
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 0.5, md: 0.75 },
                  minWidth: 0,
                }}
              >
                Send Email
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright & Katta signature */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src="/logo.jpg"
            alt="Katta Signature"
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: `1px solid ${theme.palette.divider}`,
              filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.4))',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Katta. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Email Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleEmailDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Send Me an Email
          <IconButton
            aria-label="close"
            onClick={handleEmailDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Your Name"
              fullWidth
              variant="outlined"
              value={emailForm.name}
              onChange={handleFormChange('name')}
              required
            />
            <TextField
              label="Your Email"
              type="email"
              fullWidth
              variant="outlined"
              value={emailForm.email}
              onChange={handleFormChange('email')}
              required
            />
            <TextField
              label="Subject"
              fullWidth
              variant="outlined"
              value={emailForm.subject}
              onChange={handleFormChange('subject')}
              required
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={emailForm.message}
              onChange={handleFormChange('message')}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmailDialogClose} disabled={isSending}>Cancel</Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            color="secondary"
            disabled={!isFormValid || isSending}
            startIcon={<Send />}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dynamic Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
