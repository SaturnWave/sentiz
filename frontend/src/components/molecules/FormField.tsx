import React from 'react';
import styled, { css } from 'styled-components';
import { TypographyProps, TypographyVariant } from '../../types/components';

// Helper function to get the component based on variant
const getComponent = (variant: TypographyVariant): string => {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant;
    case 'subtitle1':
    case 'subtitle2':
      return 'h6';
    case 'body1':
    case 'body2':
      return 'p';
    case 'button':
      return 'span';
    case 'caption':
      return 'span';
    case 'overline':
      return 'span';
    default:
      return 'p';
  }
};

// Common styles for all typography variants
const commonStyles = css<{
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
  align?: 'left' | 'center' | 'right';
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
}>`
  margin: 0;
  
  ${({ color, theme }) => {
    switch (color) {
      case 'primary':
        return css`color: ${theme.colors.primary.main};`;
      case 'secondary':
        return css`color: ${theme.colors.secondary.main};`;
      case 'textPrimary':
        return css`color: ${theme.colors.text.primary};`;
      case 'textSecondary':
        return css`color: ${theme.colors.text.secondary};`;
      case 'error':
        return css`color: #f44336;`;
      default:
        return '';
    }
  }}
  
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
  
  ${({ gutterBottom, theme }) =>
    gutterBottom &&
    css`
      margin-bottom: ${theme.spacing.md};
    `}
  
  ${({ noWrap }) =>
    noWrap &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  
  ${({ paragraph, theme }) =>
    paragraph &&
    css`
      margin-bottom: ${theme.spacing.md};
    `}
`;

// Styled components for each variant
const H1 = styled.h1`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

const H2 = styled.h2`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

const H3 = styled.h3`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

const H4 = styled.h4`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const H5 = styled.h5`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const H6 = styled.h6`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Subtitle1 = styled.h6`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Subtitle2 = styled.h6`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Body1 = styled.p`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Body2 = styled.p`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Button = styled.span`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Caption = styled.span`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const Overline = styled.span`
  ${commonStyles}
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Component map for rendering the correct component based on variant
const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  subtitle1: Subtitle1,
  subtitle2: Subtitle2,
  body1: Body1,
  body2: Body2,
  button: Button,
  caption: Caption,
  overline: Overline,
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color,
  align,
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
  children,
  className,
  ...props
}) => {
  // Get the component based on variant
  const Component = components[variant];
  
  return (
    <Component
      color={color}
      align={align}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      paragraph={paragraph}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;