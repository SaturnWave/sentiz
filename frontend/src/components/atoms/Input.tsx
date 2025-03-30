import React from 'react';
import styled, { css } from 'styled-components';
import { InputProps } from '../../types/components';

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledInput = styled.input<{
  hasError?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? '#f44336' : 'rgba(100, 255, 218, 0.2)'};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? '#f44336' : theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ hasError, theme }) => 
      hasError ? 'rgba(244, 67, 54, 0.1)' : 'rgba(100, 255, 218, 0.1)'};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  &:disabled {
    background-color: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
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
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  name,
  id,
  error = false,
  errorMessage,
  autoComplete,
  maxLength,
  minLength,
  pattern,
  className,
  size = 'medium',
  fullWidth = true,
}) => {
  return (
    <StyledInputWrapper className={className}>
      <StyledInput
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        hasError={error}
        size={size}
        fullWidth={fullWidth}
      />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </StyledInputWrapper>
  );
};

export default Input;