import React from 'react';
import styled from 'styled-components';
import Input from '../atoms/Input';
import { FormFieldProps } from '../../types/components';

const FormFieldWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label<{ hasError?: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ hasError, theme }) => 
    hasError ? '#f44336' : theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? '#f44336' : 'rgba(100, 255, 218, 0.2)'};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
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
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? '#f44336' : 'rgba(100, 255, 218, 0.2)'};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? '#f44336' : theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ hasError, theme }) => 
      hasError ? 'rgba(244, 67, 54, 0.1)' : 'rgba(100, 255, 218, 0.1)'};
  }
  
  &:disabled {
    background-color: rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const Radio = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const FormField: React.FC<FormFieldProps> = ({
  label,
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
  options,
  className,
}) => {
  // Generate a unique ID if none provided
  const fieldId = id || `field-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <FormFieldWrapper className={className}>
      {label && (
        <Label htmlFor={fieldId} hasError={error}>
          {label}
          {required && <span style={{ color: '#f44336' }}> *</span>}
        </Label>
      )}
      
      {type === 'textarea' ? (
        <TextArea
          id={fieldId}
          name={name}
          value={value as string}
          onChange={onChange as any}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          hasError={error}
        />
      ) : type === 'select' ? (
        <Select
          id={fieldId}
          name={name}
          value={value as string}
          onChange={onChange as any}
          disabled={disabled}
          required={required}
          hasError={error}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === 'checkbox' ? (
        <CheckboxContainer>
          <Checkbox
            id={fieldId}
            name={name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={onChange as any}
            disabled={disabled}
            required={required}
          />
          {label}
        </CheckboxContainer>
      ) : type === 'radio' ? (
        <CheckboxContainer>
          <Radio
            id={fieldId}
            name={name}
            type="radio"
            checked={Boolean(value)}
            onChange={onChange as any}
            disabled={disabled}
            required={required}
          />
          {label}
        </CheckboxContainer>
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          error={error}
          autoComplete={type === 'password' ? 'current-password' : undefined}
        />
      )}
      
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormFieldWrapper>
  );
};

export default FormField;