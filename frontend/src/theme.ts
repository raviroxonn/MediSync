import { createTheme, alpha } from '@mui/material/styles';

export const createCustomTheme = (mode: 'light' | 'dark', accentColor: string = '#2196f3') => {
  const isLight = mode === 'light';

  // Define common transition
  const smoothTransition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Define custom shadows with the accent color
  const customShadows = {
    small: isLight 
      ? `0px 2px 4px -1px ${alpha(accentColor, 0.07)}, 0px 1px 5px 0px ${alpha(accentColor, 0.05)}`
      : `0px 2px 4px -1px ${alpha('#000', 0.15)}, 0px 1px 5px 0px ${alpha('#000', 0.12)}`,
    medium: isLight
      ? `0px 3px 5px -1px ${alpha(accentColor, 0.1)}, 0px 5px 8px ${alpha(accentColor, 0.07)}`
      : `0px 3px 5px -1px ${alpha('#000', 0.2)}, 0px 5px 8px ${alpha('#000', 0.14)}`,
    large: isLight
      ? `0px 8px 12px -3px ${alpha(accentColor, 0.1)}, 0px 12px 20px -2px ${alpha(accentColor, 0.04)}`
      : `0px 8px 12px -3px ${alpha('#000', 0.3)}, 0px 12px 20px -2px ${alpha('#000', 0.2)}`,
  };

  // Create darker and lighter versions of the accent color
  const darken = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? { 
            r: parseInt(result[1], 16), 
            g: parseInt(result[2], 16), 
            b: parseInt(result[3], 16) 
          } 
        : null;
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const darkerRgb = {
      r: Math.max(0, Math.floor(rgb.r * (1 - amount))),
      g: Math.max(0, Math.floor(rgb.g * (1 - amount))),
      b: Math.max(0, Math.floor(rgb.b * (1 - amount)))
    };
    
    return `#${darkerRgb.r.toString(16).padStart(2, '0')}${darkerRgb.g.toString(16).padStart(2, '0')}${darkerRgb.b.toString(16).padStart(2, '0')}`;
  };
  
  const lighten = (color: string, amount: number) => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? { 
            r: parseInt(result[1], 16), 
            g: parseInt(result[2], 16), 
            b: parseInt(result[3], 16) 
          } 
        : null;
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const lighterRgb = {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount))
    };
    
    return `#${lighterRgb.r.toString(16).padStart(2, '0')}${lighterRgb.g.toString(16).padStart(2, '0')}${lighterRgb.b.toString(16).padStart(2, '0')}`;
  };
  
  const accentDark = darken(accentColor, 0.15);
  const accentLight = lighten(accentColor, 0.15);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: accentColor,
        light: accentLight,
        dark: accentDark,
        contrastText: '#fff',
      },
      secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
        contrastText: '#fff',
      },
      error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
      },
      warning: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      info: {
        main: '#2196f3',
        light: '#64b5f6',
        dark: '#1976d2',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      background: {
        default: isLight ? '#f8f9fa' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.02857em',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
          },
          html: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
          },
          body: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
            transition: smoothTransition,
          },
          '#root': {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
          },
          ':focus-visible': {
            outline: `2px solid ${alpha('#2196f3', 0.5)}`,
            outlineOffset: '2px',
          },
          '::selection': {
            backgroundColor: alpha('#2196f3', 0.3),
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: customShadows.medium,
            transition: smoothTransition,
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: customShadows.large,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: smoothTransition,
          },
          elevation1: {
            boxShadow: customShadows.small,
          },
          elevation2: {
            boxShadow: customShadows.small,
          },
          elevation4: {
            boxShadow: customShadows.medium,
          },
          elevation8: {
            boxShadow: customShadows.medium,
          },
          elevation12: {
            boxShadow: customShadows.large,
          },
          elevation16: {
            boxShadow: customShadows.large,
          },
          elevation24: {
            boxShadow: customShadows.large,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            transition: smoothTransition,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: customShadows.small,
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            boxShadow: customShadows.small,
            '&:hover': {
              boxShadow: customShadows.medium,
            },
          },
          outlined: {
            '&:hover': {
              backgroundColor: alpha('#2196f3', 0.04),
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: smoothTransition,
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 2px ${alpha('#2196f3', 0.2)}`,
              },
            },
            '& .MuiInputLabel-root': {
              transition: smoothTransition,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '4px 8px',
            transition: smoothTransition,
            '&:hover': {
              backgroundColor: alpha(isLight ? '#000' : '#fff', 0.04),
            },
            '&.Mui-selected': {
              backgroundColor: alpha('#2196f3', 0.12),
              '&:hover': {
                backgroundColor: alpha('#2196f3', 0.16),
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: smoothTransition,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: customShadows.small,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backdropFilter: 'blur(8px)',
            background: alpha(mode === 'dark' ? '#000' : '#fff', 0.8),
            color: mode === 'dark' ? '#fff' : '#000',
            fontSize: '0.75rem',
            borderRadius: 4,
            boxShadow: customShadows.medium,
            transition: smoothTransition,
            maxWidth: 300,
            padding: '8px 12px',
          },
          arrow: {
            color: alpha(mode === 'dark' ? '#000' : '#fff', 0.8),
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(mode === 'dark' ? '#000' : '#000', isLight ? 0.5 : 0.7),
            backdropFilter: 'blur(4px)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: customShadows.large,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            opacity: 0.7,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            transition: smoothTransition,
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
          },
          thumb: {
            transition: smoothTransition,
          },
          track: {
            transition: smoothTransition,
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            transition: smoothTransition,
          },
        },
      },
    },
  });
};

// Maintain backward compatibility with existing code
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

export default createCustomTheme; 