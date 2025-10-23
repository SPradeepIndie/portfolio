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
  Twitter,
  Send,
  Close,
} from '@mui/icons-material'
import { useState } from 'react'

interface ContactInfo {
  email: string
  phone: string
  linkedin: string
  github: string
  twitter: string
}

interface EmailForm {
  name: string
  email: string
  subject: string
  message: string
}

const contactInfo: ContactInfo = {
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  linkedin: 'https://linkedin.com/in/yourprofile',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
}

export const Footer: React.FC = () => {
  const theme = useTheme()
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [emailForm, setEmailForm] = useState<EmailForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

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

  const handleSendEmail = () => {
    // In a real app, you would send this to your backend API
    console.log('Sending email:', emailForm)
    
    // Create mailto link for now
    const subject = encodeURIComponent(emailForm.subject)
    const body = encodeURIComponent(
      `Name: ${emailForm.name}\nEmail: ${emailForm.email}\n\nMessage:\n${emailForm.message}`
    )
    const mailtoLink = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
    
    window.open(mailtoLink, '_blank')
    
    handleEmailDialogClose()
    setSnackbarOpen(true)
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
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 3, sm: 4, md: 6 },
            alignItems: 'start',
          }}
        >
          {/* Contact Information */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: { xs: 2, md: 3 }
              }}
            >
              Get In Touch
            </Typography>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1.5}
                sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
              >
                <Email color="secondary" sx={{ flexShrink: 0 }} />
                <Link
                  href={`mailto:${contactInfo.email}`}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {contactInfo.email}
                </Link>
              </Box>
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1.5}
                sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
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
                sx={{ 
                  mt: { xs: 2, md: 3 }, 
                  alignSelf: 'flex-start',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1, md: 1.5 }
                }}
              >
                Send Email
              </Button>
            </Stack>
          </Box>

          {/* Social Links */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: { xs: 2, md: 3 }
              }}
            >
              Connect With Me
            </Typography>
            <Stack 
              direction="row" 
              spacing={{ xs: 1, md: 1.5 }}
              sx={{ 
                justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                flexWrap: 'wrap',
                gap: { xs: 1, md: 1.5 }
              }}
            >
              <IconButton
                component="a"
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  p: { xs: 1, md: 1.5 },
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
                  p: { xs: 1, md: 1.5 },
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <GitHub sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
              <IconButton
                component="a"
                href={contactInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  p: { xs: 1, md: 1.5 },
                  '&:hover': {
                    color: theme.palette.secondary.main,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Twitter sx={{ fontSize: { xs: 24, md: 28 } }} />
              </IconButton>
            </Stack>
          </Box>

          {/* Quick Info */}
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom 
              color="primary"
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: { xs: 2, md: 3 }
              }}
            >
              About This Portfolio
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', md: '1rem' },
                lineHeight: { xs: 1.5, md: 1.6 }
              }}
            >
              Built with React, TypeScript, and Material-UI. 
              Showcasing modern web development practices with 
              responsive design and clean architecture.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} My Portfolio. All rights reserved.
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
          <Button onClick={handleEmailDialogClose}>Cancel</Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            color="secondary"
            disabled={!isFormValid}
            startIcon={<Send />}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Email client opened! Please send your message.
        </Alert>
      </Snackbar>
    </Box>
  )
}
