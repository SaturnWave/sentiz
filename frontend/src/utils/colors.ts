/**
 * Utility functions for color manipulation and transformation
 */

/**
 * Converts a hex color string to RGB object
 * @param hex Hex color (e.g., "#ff0000" or "#f00")
 * @returns RGB object or null if invalid
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Handle shorthand hex (e.g., #f00 -> #ff0000)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return null;
    }
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };
  
  /**
   * Converts RGB values to hex color string
   * @param r Red component (0-255)
   * @param g Green component (0-255)
   * @param b Blue component (0-255)
   * @returns Hex color string
   */
  export const rgbToHex = (r: number, g: number, b: number): string => {
    // Ensure values are in valid range
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    
    // Convert to hex
    return '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
  };
  
  /**
   * Converts RGB values to HSL (Hue, Saturation, Lightness)
   * @param r Red component (0-255)
   * @param g Green component (0-255)
   * @param b Blue component (0-255)
   * @returns HSL object with values in range h(0-360), s(0-100), l(0-100)
   */
  export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    // Convert RGB to [0, 1] range
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Convert to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    const lightness = Math.round(l * 100);
    
    return { h, s, l: lightness };
  };
  
  /**
   * Converts HSL values to RGB
   * @param h Hue (0-360)
   * @param s Saturation (0-100)
   * @param l Lightness (0-100)
   * @returns RGB object with values in range (0-255)
   */
  export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    // Convert to [0, 1] range
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      // Achromatic (gray)
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    // Convert to [0, 255] range
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  
  /**
   * Creates a lighter version of a color
   * @param color Hex color string
   * @param amount Amount to lighten (0-1)
   * @returns Lightened hex color string
   */
  export const lightenColor = (color: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newL = Math.min(100, l + amount * 100);
    
    const newRgb = hslToRgb(h, s, newL);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };
  
  /**
   * Creates a darker version of a color
   * @param color Hex color string
   * @param amount Amount to darken (0-1)
   * @returns Darkened hex color string
   */
  export const darkenColor = (color: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newL = Math.max(0, l - amount * 100);
    
    const newRgb = hslToRgb(h, s, newL);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };
  
  /**
   * Creates a more saturated version of a color
   * @param color Hex color string
   * @param amount Amount to increase saturation (0-1)
   * @returns Saturated hex color string
   */
  export const saturateColor = (color: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newS = Math.min(100, s + amount * 100);
    
    const newRgb = hslToRgb(h, newS, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };
  
  /**
   * Creates a less saturated version of a color
   * @param color Hex color string
   * @param amount Amount to decrease saturation (0-1)
   * @returns Desaturated hex color string
   */
  export const desaturateColor = (color: string, amount: number = 0.2): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newS = Math.max(0, s - amount * 100);
    
    const newRgb = hslToRgb(h, newS, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };
  
  /**
   * Creates a transparent version of a color
   * @param color Hex color string
   * @param alpha Alpha value (0-1)
   * @returns RGBA color string
   */
  export const transparentColor = (color: string, alpha: number = 0.5): string => {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  };
  
  /**
   * Generates a gradient color between two colors
   * @param color1 First hex color
   * @param color2 Second hex color
   * @param ratio Ratio (0-1) where 0 is color1 and 1 is color2
   * @returns Interpolated hex color
   */
  export const gradientColor = (color1: string, color2: string, ratio: number): string => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;
    
    // Limit ratio to [0, 1]
    ratio = Math.max(0, Math.min(1, ratio));
    
    // Interpolate RGB components
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
    
    return rgbToHex(r, g, b);
  };
  
  /**
   * Generates an array of colors in a gradient between two colors
   * @param color1 Starting hex color
   * @param color2 Ending hex color
   * @param steps Number of colors to generate
   * @returns Array of hex colors
   */
  export const colorPalette = (color1: string, color2: string, steps: number): string[] => {
    const palette: string[] = [];
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      palette.push(gradientColor(color1, color2, ratio));
    }
    
    return palette;
  };
  
  /**
   * Converts a hex color to a CSS color variable string
   * @param color Hex color
   * @param variableName CSS variable name (without --)
   * @returns CSS variable string
   */
  export const hexToCssVar = (color: string, variableName: string): string => {
    return `--${variableName}: ${color};`;
  };
  
  /**
   * Gets a contrasting text color (black or white) for a background color
   * @param bgColor Background hex color
   * @returns '#ffffff' or '#000000' based on contrast
   */
  export const getContrastTextColor = (bgColor: string): string => {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return '#ffffff';
    
    // Calculate luminance using perceived brightness formula
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    
    // Use white text for dark backgrounds and black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  /**
   * Generates a random hex color
   * @returns Random hex color string
   */
  export const randomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    return rgbToHex(r, g, b);
  };
  
  /**
   * Gets a specific color from a theme-based sentiment
   * @param sentiment Sentiment value ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED')
   * @param theme Theme object containing sentiment colors
   * @returns Hex color for the sentiment
   */
  export const getSentimentColor = (
    sentiment: string, 
    theme: { colors: { sentiment: Record<string, string> } }
  ): string => {
    const normalizedSentiment = sentiment.toLowerCase();
    
    if (normalizedSentiment === 'positive' && theme.colors.sentiment.positive) {
      return theme.colors.sentiment.positive;
    }
    
    if (normalizedSentiment === 'negative' && theme.colors.sentiment.negative) {
      return theme.colors.sentiment.negative;
    }
    
    if (normalizedSentiment === 'neutral' && theme.colors.sentiment.neutral) {
      return theme.colors.sentiment.neutral;
    }
    
    if (normalizedSentiment === 'mixed' && theme.colors.sentiment.mixed) {
      return theme.colors.sentiment.mixed;
    }
    
    // Default to neutral if sentiment not found
    return theme.colors.sentiment.neutral;
  };