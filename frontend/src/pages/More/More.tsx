/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { Container, Typography, Box, Chip } from '@mui/material'

export const MorePage: React.FC = () => {
  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL',
    'Material-UI', 'Express.js', 'Docker', 'AWS', 'Git', 'Jest'
  ]

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3, md: 4 },
        flex: 1 
      }}
    >
      <Box sx={{ maxWidth: 'md', mx: { xs: 0, md: 'auto' } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          color="primary"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            fontWeight: { xs: 600, md: 700 },
            mb: { xs: 2, md: 3 },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          More About Me
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: { xs: 1.6, md: 1.7 },
            mb: { xs: 4, md: 5 },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Here you can learn more about my background, skills, experience, and interests
          beyond just my projects and blog posts.
        </Typography>
        
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            color="secondary"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
              fontWeight: { xs: 500, md: 600 },
              mb: { xs: 2, md: 3 },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Technical Skills
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 1, md: 1.5 },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              mt: 2
            }}
          >
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="outlined"
                color="primary"
                sx={{ 
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  height: { xs: 32, md: 36 },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>
        </Box>
        
        <Typography 
          variant="h6" 
          color="secondary" 
          sx={{ 
            mt: { xs: 5, md: 7 },
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            textAlign: { xs: 'center', sm: 'left' },
            fontStyle: 'italic'
          }}
        >
          Coming Soon: Resume, certifications, and more personal insights!
        </Typography>
      </Box>
    </Container>
  )
}
