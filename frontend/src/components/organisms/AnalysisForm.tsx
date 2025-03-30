import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import { FEATURES, FEATURE_LABELS } from '../../config/features';

interface AnalysisFormProps {
  text: string;
  source: string;
  onTextChange: (text: string) => void;
  onSourceChange: (source: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const SourceSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.1);
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CharacterCount = styled.div<{ isNearLimit: boolean; isOverLimit: boolean }>`
  text-align: right;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ isNearLimit, isOverLimit, theme }) =>
    isOverLimit
      ? '#f44336'
      : isNearLimit
      ? '#ff9800'
      : theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled(motion.div)`
  color: #f44336;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const AnalysisForm: React.FC<AnalysisFormProps> = ({
  text,
  source,
  onTextChange,
  onSourceChange,
  onSubmit,
  isLoading,
  error,
}) => {
  const [characterCount, setCharacterCount] = useState(0);
  const maxLength = FEATURES.MAX_TEXT_LENGTH;
  
  // Update character count
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);
  
  // Check if near or over the limit
  const isNearLimit = characterCount > maxLength * 0.8 && characterCount <= maxLength;
  const isOverLimit = characterCount > maxLength;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isOverLimit) return;
    onSubmit();
  };
  
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };
  
  // Handle source change
  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSourceChange(e.target.value);
  };
  
  // Get available sources from features config
  const availableSources = Object.entries(FEATURES.SOURCES)
    .filter(([_, enabled]) => enabled)
    .map(([sourceKey]) => ({
      value: sourceKey.toLowerCase(),
      label: FEATURE_LABELS.SOURCES[sourceKey as keyof typeof FEATURE_LABELS.SOURCES],
    }));
  
  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text to analyze sentiment (e.g., a social media post, comment, or review)"
          maxLength={maxLength * 1.1} // Allow a bit over max for better UX, but warn
          disabled={isLoading}
        />
        <CharacterCount isNearLimit={isNearLimit} isOverLimit={isOverLimit}>
          {characterCount}/{maxLength} characters {isOverLimit ? '(too long)' : ''}
        </CharacterCount>
      </div>
      
      <div>
        <label htmlFor="source">Source</label>
        <SourceSelect
          id="source"
          value={source}
          onChange={handleSourceChange}
          disabled={isLoading}
        >
          {availableSources.map((src) => (
            <option key={src.value} value={src.value}>
              {src.label}
            </option>
          ))}
        </SourceSelect>
      </div>
      
      {error && (
        <ErrorMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </ErrorMessage>
      )}
      
      <ButtonContainer>
        <Button
          type="submit"
          fullWidth
          size="large"
          disabled={isLoading || !text.trim() || isOverLimit}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
        </Button>
      </ButtonContainer>
    </Form>
  );
};

export default AnalysisForm;