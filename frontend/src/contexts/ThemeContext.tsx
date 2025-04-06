import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createCustomTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isSystemTheme: boolean;
  toggleSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
  isSystemTheme: true,
  toggleSystemTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });
  
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('useSystemTheme');
    return savedPreference !== null ? savedPreference === 'true' : true;
  });

  const theme = createCustomTheme(mode);

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const toggleTheme = () => {
    if (isSystemTheme) {
      // If currently using system theme, switch to manual and toggle
      setIsSystemTheme(false);
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    } else {
      // Just toggle the theme
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }
  };

  const toggleSystemTheme = () => {
    setIsSystemTheme(prev => !prev);
  };

  // Handle system theme preferences
  useEffect(() => {
    if (isSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        setMode(e.matches ? 'dark' : 'light');
      };

      // Initial setting
      handleSystemThemeChange(mediaQuery);
      
      // Listen for changes
      const mediaQueryListener = (e: MediaQueryListEvent) => handleSystemThemeChange(e);
      mediaQuery.addEventListener('change', mediaQueryListener);
      
      return () => {
        mediaQuery.removeEventListener('change', mediaQueryListener);
      };
    }
  }, [isSystemTheme]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('useSystemTheme', String(isSystemTheme));
  }, [mode, isSystemTheme]);

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      toggleTheme, 
      setThemeMode, 
      isSystemTheme, 
      toggleSystemTheme 
    }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 