import { createGlobalStyle } from 'styled-components';
import { Theme } from '../types/theme';

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap');
  
  /* Reset styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  
  /* Base styles */
  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
  
  h4 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }
  
  h5 {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }
  
  h6 {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }
  
  p {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary.light};
      text-decoration: underline;
    }
  }
  
  /* Form elements */
  input, textarea, select, button {
    font-family: ${({ theme }) => theme.typography.fontFamily};
  }
  
  button {
    cursor: pointer;
  }
  
  /* Lists */
  ul, ol {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    padding-left: ${({ theme }) => theme.spacing.lg};
    
    li {
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
  }
  
  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.primary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background.elevated};
    border-radius: ${({ theme }) => theme.borders.radius.pill};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
  }
  
  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary.main}50; /* 50% opacity */
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  /* Code blocks */
  code {
    font-family: 'Roboto Mono', monospace;
    background-color: ${({ theme }) => theme.colors.background.elevated};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borders.radius.sm};
    font-size: 0.9em;
  }
  
  pre {
    font-family: 'Roboto Mono', monospace;
    background-color: ${({ theme }) => theme.colors.background.elevated};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borders.radius.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    code {
      padding: 0;
      background-color: transparent;
    }
  }
  
  /* Utility classes */
  .text-center {
    text-align: center;
  }
  
  .text-left {
    text-align: left;
  }
  
  .text-right {
    text-align: right;
  }
  
  .mb-0 {
    margin-bottom: 0;
  }
  
  .mt-0 {
    margin-top: 0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;