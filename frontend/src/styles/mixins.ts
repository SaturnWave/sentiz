import { css } from 'styled-components';
import { Theme } from '../types/theme';

/**
 * Mixins for styled-components to help with common CSS patterns
 */

/**
 * Flexbox mixin for centering items
 */
export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

/**
 * Flexbox mixin for column layout
 */
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

/**
 * Absolute positioning to fill parent
 */
export const absoluteFill = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/**
 * CSS for truncating text with ellipsis
 */
export const textTruncate = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Hide element but keep it accessible for screen readers
 */
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

/**
 * Media query for mobile devices
 */
export const mobile = (content: any) => css`
  @media (max-width: ${({ theme }: { theme: Theme }) => theme.breakpoints.sm}) {
    ${content}
  }
`;

/**
 * Media query for tablet devices
 */
export const tablet = (content: any) => css`
  @media (min-width: ${({ theme }: { theme: Theme }) => theme.breakpoints.sm}) and 
         (max-width: ${({ theme }: { theme: Theme }) => theme.breakpoints.md}) {
    ${content}
  }
`;

/**
 * Media query for desktop devices
 */
export const desktop = (content: any) => css`
  @media (min-width: ${({ theme }: { theme: Theme }) => theme.breakpoints.md}) {
    ${content}
  }
`;

/**
 * Media query for large desktop devices
 */
export const largeDesktop = (content: any) => css`
  @media (min-width: ${({ theme }: { theme: Theme }) => theme.breakpoints.lg}) {
    ${content}
  }
`;

/**
 * Media query for dark mode
 */
export const darkMode = (content: any) => css`
  @media (prefers-color-scheme: dark) {
    ${content}
  }
`;

/**
 * Media query for light mode
 */
export const lightMode = (content: any) => css`
  @media (prefers-color-scheme: light) {
    ${content}
  }
`;

/**
 * Media query for reduced motion preference
 */
export const reducedMotion = (content: any) => css`
  @media (prefers-reduced-motion: reduce) {
    ${content}
  }
`;

/**
 * CSS for custom scrollbar
 */
export const customScrollbar = (width = '8px', thumbColor?: string, trackColor?: string) => css`
  &::-webkit-scrollbar {
    width: ${width};
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme, trackColor: propTrackColor }: { theme: Theme; trackColor?: string }) => 
      propTrackColor || trackColor || theme.colors.background.primary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme, thumbColor: propThumbColor }: { theme: Theme; thumbColor?: string }) => 
      propThumbColor || thumbColor || theme.colors.background.elevated};
    border-radius: ${({ theme }: { theme: Theme }) => theme.borders.radius.pill};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }: { theme: Theme }) => theme.colors.primary.dark};
  }
`;

/**
 * CSS for glass-like frosted background effect
 */
export const glassEffect = (opacity = 0.7) => css`
  background-color: ${({ theme }: { theme: Theme }) => `rgba(26, 26, 46, ${opacity})`};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

/**
 * CSS for box shadow with theme colors
 */
export const boxShadow = (elevation: 'sm' | 'md' | 'lg' | 'xl' = 'md') => css`
  box-shadow: ${({ theme }: { theme: Theme }) => theme.shadows[elevation]};
`;

/**
 * CSS for gradient border
 */
export const gradientBorder = (width = '1px', opacity = 0.2) => css`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: ${width};
    background: linear-gradient(
      135deg,
      ${({ theme }: { theme: Theme }) => `${theme.colors.primary.main}${Math.round(opacity * 255).toString(16)}`},
      ${({ theme }: { theme: Theme }) => `${theme.colors.secondary.main}${Math.round(opacity * 255).toString(16)}`}
    );
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
    pointer-events: none;
  }
`;

/**
 * CSS for scaling animation on hover
 */
export const hoverScale = (scale = 1.05, duration = '0.3s') => css`
  transition: transform ${duration} ease;
  
  &:hover {
    transform: scale(${scale});
  }
`;

/**
 * CSS for floating animation
 */
export const floatingAnimation = (duration = '3s', distance = '10px') => css`
  @keyframes floating {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(${distance});
    }
    100% {
      transform: translateY(0);
    }
  }
  
  animation: floating ${duration} ease-in-out infinite;
`;

/**
 * CSS for text gradient
 */
export const textGradient = () => css`
  background: linear-gradient(
    135deg,
    ${({ theme }: { theme: Theme }) => theme.colors.primary.light},
    ${({ theme }: { theme: Theme }) => theme.colors.primary.main}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

/**
 * CSS for responsive font size
 */
export const responsiveFontSize = (
  minSize: string,
  maxSize: string,
  minWidth = '320px',
  maxWidth = '1200px'
) => css`
  font-size: ${minSize};
  
  @media screen and (min-width: ${minWidth}) {
    font-size: calc(${minSize} + (${parseFloat(maxSize)} - ${parseFloat(minSize)}) * 
      ((100vw - ${minWidth}) / (${parseFloat(maxWidth)} - ${parseFloat(minWidth)})));
  }
  
  @media screen and (min-width: ${maxWidth}) {
    font-size: ${maxSize};
  }
`;3