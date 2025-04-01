import React, { createContext, useState, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeContextValue, ThemeOptions } from '../types/theme';
import { darkLuxuryTheme } from '../styles/theme';
import { GlobalStyle } from '../styles/globalStyles';

const defaultThemeOptions: ThemeOptions = {
  mode: 'dark',
  variant: 'luxury',
  highContrast: false,
  reducedMotion: false,
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: darkLuxuryTheme as Theme,
  themeOptions: defaultThemeOptions,
  setThemeOptions: () => {},
  toggleColorScheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(defaultThemeOptions);
  // Use theme directly without setter as we're not dynamically changing it yet
  const theme = darkLuxuryTheme as Theme;

  const handleThemeOptionsChange = (newOptions: Partial<ThemeOptions>) => {
    setThemeOptions(prev => ({ ...prev, ...newOptions }));
  };

  const toggleColorScheme = () => {
    setThemeOptions(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }));
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themeOptions,
        setThemeOptions: handleThemeOptionsChange,
        toggleColorScheme,
      }}
    >
      <StyledThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Export the useTheme hook
export const useTheme = () => useContext(ThemeContext);