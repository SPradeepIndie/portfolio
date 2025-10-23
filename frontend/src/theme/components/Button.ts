/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { Button, styled } from '@mui/material'

export const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[2],
  transition: 'all 0.2s ease-in-out',
  
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: theme.shadows[1],
  },
  
  '&:disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
  }
}))
