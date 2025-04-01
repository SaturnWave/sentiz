import React from 'react';
import styled, { css } from 'styled-components';
import { ButtonProps, ButtonVariant, ButtonSize } from '../../types/components';

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.animations.durations.normal} ${({ theme }) => theme.animations.easings.easeOut};
  text-decoration: none;
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSizes.sm};
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSizes.lg};
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSizes.md};
        `;
    }
  }}
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.primary.light}, ${theme.colors.primary.main});
          color: ${theme.colors.primary.contrastText};
          border: none;
          
          &:hover {
            background: linear-gradient(135deg, ${theme.colors.primary.main}, ${theme.colors.primary.dark});
            box-shadow: 0 4px 8px rgba(0, 191, 165, 0.3);
            transform: translateY(-2px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 191, 165, 0.3);
          }
        `;
      case 'secondary':
        return css`
          background: linear-gradient(135deg, ${theme.colors.secondary.light}, ${theme.colors.secondary.main});
          color: ${theme.colors.secondary.contrastText};
          border: none;
          
          &:hover {
            background: linear-gradient(135deg, ${theme.colors.secondary.main}, ${theme.colors.secondary.dark});
            box-shadow: 0 4px 8px rgba(106, 27, 154, 0.3);
            transform: translateY(-2px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(106, 27, 154, 0.3);
          }
        `;
      case 'outlined':
        return css`
          background: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};
          
          &:hover {
            background: rgba(0, 191, 165, 0.05);
            box-shadow: 0 2px 4px rgba(0, 191, 165, 0.1);
            transform: translateY(-2px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: none;
          }
        `;
      case 'text':
        return css`
          background: transparent;
          color: ${theme.colors.primary.main};
          border: none;
          
          &:hover {
            background: rgba(0, 191, 165, 0.05);
            transform: translateY(-2px);
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
    }
  }}
  
  &:disabled {
    background: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.background.elevated};
  }
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  className,
  children,
  as,
  to,
  type = 'button',
  style,
  ...restProps
}, ref) => {
  const Component = as || StyledButton;
  
  return (
    <StyledButton
      as={Component}
      to={to}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type}
      style={style}
      ref={ref}
      {...restProps}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;