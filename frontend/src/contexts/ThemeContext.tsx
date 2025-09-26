import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { getThemeById, Theme as CustomTheme } from '@/themes';

interface ThemeContextType {
  currentTheme: CustomTheme;
  setCurrentTheme: (themeId: string) => void;
  applyTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultThemeId = 'reshift-default' 
}) => {
  const [currentTheme, setCurrentThemeState] = useState<CustomTheme>(
    getThemeById(defaultThemeId) || getThemeById('reshift-default')!
  );

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('selectedTheme');
    if (savedThemeId) {
      const theme = getThemeById(savedThemeId);
      if (theme) {
        setCurrentThemeState(theme);
      }
    }
  }, []);

  const setCurrentTheme = (themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentThemeState(theme);
      localStorage.setItem('selectedTheme', themeId);
    }
  };

  const applyTheme = (theme: CustomTheme) => {
    setCurrentThemeState(theme);
    localStorage.setItem('selectedTheme', theme.id);
  };

  // Create MUI theme based on custom theme
  const muiTheme = createTheme({
    palette: {
      mode: currentTheme.category === 'dark' ? 'dark' : 'light',
      primary: {
        main: currentTheme.colors.primary,
        light: currentTheme.colors.primary + '20',
        dark: currentTheme.colors.primary + '80',
      },
      secondary: {
        main: currentTheme.colors.secondary,
        light: currentTheme.colors.secondary + '20',
        dark: currentTheme.colors.secondary + '80',
      },
      error: {
        main: currentTheme.colors.error,
      },
      warning: {
        main: currentTheme.colors.warning,
      },
      info: {
        main: currentTheme.colors.info,
      },
      success: {
        main: currentTheme.colors.success,
      },
      background: {
        default: currentTheme.colors.base,
        paper: currentTheme.colors.base,
      },
      text: {
        primary: currentTheme.colors.neutral,
        secondary: currentTheme.colors.secondary,
      },
    },
    typography: {
      fontFamily: currentTheme.fonts.body,
      h1: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 700,
      },
      h2: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 600,
      },
      h3: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 600,
      },
      h4: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 500,
      },
      h5: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 500,
      },
      h6: {
        fontFamily: currentTheme.fonts.heading,
        fontWeight: 500,
      },
      body1: {
        fontFamily: currentTheme.fonts.body,
      },
      body2: {
        fontFamily: currentTheme.fonts.body,
      },
      button: {
        fontFamily: currentTheme.fonts.body,
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
    },
  });

  // Apply CSS custom properties for DaisyUI compatibility
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', currentTheme.colors.primary);
    root.style.setProperty('--secondary', currentTheme.colors.secondary);
    root.style.setProperty('--accent', currentTheme.colors.accent);
    root.style.setProperty('--neutral', currentTheme.colors.neutral);
    root.style.setProperty('--base-100', currentTheme.colors.base);
    root.style.setProperty('--base-200', currentTheme.colors.base + '20');
    root.style.setProperty('--base-300', currentTheme.colors.base + '40');
    root.style.setProperty('--info', currentTheme.colors.info);
    root.style.setProperty('--success', currentTheme.colors.success);
    root.style.setProperty('--warning', currentTheme.colors.warning);
    root.style.setProperty('--error', currentTheme.colors.error);
    
    // Apply theme class to body for DaisyUI
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme.id}`);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    setCurrentTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
