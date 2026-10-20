/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

// Create the foundational theme settings
import type { ThemeOptions } from '@mui/material/styles'

export const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
      lineHeight: 1.5,
    },
  },
  spacing: (factor: number) => `${0.5 * factor}rem`, // 8px base spacing
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.4s ease, color 0.4s ease',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#8b5cf6',
            borderRadius: '4px',
          },
        },
        '::selection': {
          backgroundColor: '#00f2fe',
          color: '#000',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 'clamp(1rem, 4vw, 2rem)',
          paddingRight: 'clamp(1rem, 4vw, 2rem)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
          padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
          height: 'auto',
          padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 0.75rem)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 40px 0 rgba(0, 0, 0, 0.2)',
          }
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 20,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 15, 29, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: theme.palette.mode === 'dark' 
            ? '1px solid rgba(0, 240, 255, 0.22)' 
            : '1px solid rgba(14, 165, 233, 0.2)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.15)'
            : '0 20px 45px -10px rgba(0, 0, 0, 0.15), 0 0 25px rgba(14, 165, 233, 0.1)',
          backgroundImage: 'none',
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '1.35rem',
          letterSpacing: '-0.01em',
          padding: '20px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused': {
            boxShadow: theme.palette.mode === 'dark'
              ? '0 0 0 3px rgba(0, 240, 255, 0.2)'
              : '0 0 0 3px rgba(14, 165, 233, 0.2)',
          },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: () => ({
          borderRadius: 12,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontWeight: 500,
        }),
        standardSuccess: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 78, 59, 0.85)' : 'rgba(209, 250, 229, 0.95)',
          color: theme.palette.mode === 'dark' ? '#6ee7b7' : '#065f46',
          border: '1px solid rgba(16, 185, 129, 0.4)',
        }),
        standardError: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(127, 29, 29, 0.85)' : 'rgba(254, 226, 226, 0.95)',
          color: theme.palette.mode === 'dark' ? '#fca5a5' : '#991b1b',
          border: '1px solid rgba(239, 68, 68, 0.4)',
        }),
        standardWarning: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(120, 53, 15, 0.85)' : 'rgba(254, 243, 199, 0.95)',
          color: theme.palette.mode === 'dark' ? '#fcd34d' : '#92400e',
          border: '1px solid rgba(245, 158, 11, 0.4)',
        }),
        standardInfo: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(12, 74, 110, 0.85)' : 'rgba(224, 242, 254, 0.95)',
          color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#075985',
          border: '1px solid rgba(14, 165, 233, 0.4)',
        }),
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.03)',
    '0px 3px 1px -2px rgba(0,0,0,0.06),0px 2px 2px 0px rgba(0,0,0,0.04),0px 1px 5px 0px rgba(0,0,0,0.03)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.03)',
    '0px 2px 4px -1px rgba(0,0,0,0.06),0px 4px 5px 0px rgba(0,0,0,0.04),0px 1px 10px 0px rgba(0,0,0,0.03)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.04),0px 1px 14px 0px rgba(0,0,0,0.03)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 6px 10px 0px rgba(0,0,0,0.04),0px 1px 18px 0px rgba(0,0,0,0.03)',
    '0px 4px 5px -2px rgba(0,0,0,0.06),0px 7px 10px 1px rgba(0,0,0,0.04),0px 2px 16px 1px rgba(0,0,0,0.03)',
    '0px 5px 5px -3px rgba(0,0,0,0.06),0px 8px 10px 1px rgba(0,0,0,0.04),0px 3px 14px 2px rgba(0,0,0,0.03)',
    '0px 5px 6px -3px rgba(0,0,0,0.06),0px 9px 12px 1px rgba(0,0,0,0.04),0px 3px 16px 2px rgba(0,0,0,0.03)',
    '0px 6px 6px -3px rgba(0,0,0,0.06),0px 10px 14px 1px rgba(0,0,0,0.04),0px 4px 18px 3px rgba(0,0,0,0.03)',
    '0px 6px 7px -4px rgba(0,0,0,0.06),0px 11px 15px 1px rgba(0,0,0,0.04),0px 4px 20px 3px rgba(0,0,0,0.03)',
    '0px 7px 8px -4px rgba(0,0,0,0.06),0px 12px 17px 2px rgba(0,0,0,0.04),0px 5px 22px 4px rgba(0,0,0,0.03)',
    '0px 7px 8px -4px rgba(0,0,0,0.06),0px 13px 19px 2px rgba(0,0,0,0.04),0px 5px 24px 4px rgba(0,0,0,0.03)',
    '0px 7px 9px -4px rgba(0,0,0,0.06),0px 14px 21px 2px rgba(0,0,0,0.04),0px 5px 26px 4px rgba(0,0,0,0.03)',
    '0px 8px 9px -5px rgba(0,0,0,0.06),0px 15px 22px 2px rgba(0,0,0,0.04),0px 6px 28px 5px rgba(0,0,0,0.03)',
    '0px 8px 10px -5px rgba(0,0,0,0.06),0px 16px 24px 2px rgba(0,0,0,0.04),0px 6px 30px 5px rgba(0,0,0,0.03)',
    '0px 8px 11px -5px rgba(0,0,0,0.06),0px 17px 26px 2px rgba(0,0,0,0.04),0px 6px 32px 5px rgba(0,0,0,0.03)',
    '0px 9px 11px -5px rgba(0,0,0,0.06),0px 18px 28px 2px rgba(0,0,0,0.04),0px 7px 34px 6px rgba(0,0,0,0.03)',
    '0px 9px 12px -6px rgba(0,0,0,0.06),0px 19px 29px 2px rgba(0,0,0,0.04),0px 7px 36px 6px rgba(0,0,0,0.03)',
    '0px 10px 13px -6px rgba(0,0,0,0.06),0px 20px 31px 3px rgba(0,0,0,0.04),0px 8px 38px 7px rgba(0,0,0,0.03)',
    '0px 10px 13px -6px rgba(0,0,0,0.06),0px 21px 33px 3px rgba(0,0,0,0.04),0px 8px 40px 7px rgba(0,0,0,0.03)',
    '0px 10px 14px -6px rgba(0,0,0,0.06),0px 22px 35px 3px rgba(0,0,0,0.04),0px 8px 42px 7px rgba(0,0,0,0.03)',
    '0px 11px 14px -7px rgba(0,0,0,0.06),0px 23px 36px 3px rgba(0,0,0,0.04),0px 9px 44px 8px rgba(0,0,0,0.03)',
    '0px 11px 15px -7px rgba(0,0,0,0.06),0px 24px 38px 3px rgba(0,0,0,0.04),0px 9px 46px 8px rgba(0,0,0,0.03)',
  ],
}
