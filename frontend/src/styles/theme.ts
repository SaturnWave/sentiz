export const baseTheme = {
    colors: {
      primary: {
        main: '#00bfa5',
        light: '#64ffda',
        dark: '#008e76',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6a1b9a',
        light: '#9c4dcc',
        dark: '#38006b',
        contrastText: '#ffffff',
      },
      background: {
        primary: '#0a0c1e',
        secondary: '#16213e',
        card: '#1a1a2e',
        elevated: '#252545',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0bec5',
        disabled: '#666666',
      },
      sentiment: {
        positive: '#00897b',
        negative: '#d32f2f',
        neutral: '#757575',
        mixed: '#ff6f00',
      },
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        xxl: '2rem',
        xxxl: '3rem',
      },
      fontWeights: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
      },
      lineHeights: {
        tight: 1.2,
        normal: 1.5,
        loose: 1.8,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borders: {
      radius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        pill: '9999px',
      },
    },
    shadows: {
      sm: '0 2px 4px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.12)',
      lg: '0 8px 16px rgba(0,0,0,0.14)',
      xl: '0 12px 24px rgba(0,0,0,0.2)',
    },
    animations: {
      durations: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easings: {
        easeOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
        easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      },
    },
    breakpoints: {
      xs: '480px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1600px',
    },
    zIndices: {
      modal: 1000,
      overlay: 900,
      dropdown: 800,
      navigation: 700,
      tooltip: 600,
      aboveContent: 100,
      content: 1,
    },
  };
  
  // Dark luxury theme extends the base theme
  export const darkLuxuryTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: {
        main: '#64ffda',
        light: '#9effff',
        dark: '#14cba8',
        contrastText: '#0a1016',
      },
      background: {
        primary: '#0a0c1e',
        secondary: '#16213e',
        card: '#1a1a2e',
        elevated: '#252545',
      },
    },
  };
  
  export type Theme = typeof baseTheme;