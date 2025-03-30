import React from 'react';
import styled from 'styled-components';

export interface KeyPhraseTagProps {
  text: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const TagContainer = styled.div<{
  score?: number;
  size: 'sm' | 'md' | 'lg';
  interactive: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'sm':
        return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      default:
        return `${theme.spacing.xs} ${theme.spacing.md}`;
    }
  }};
  margin: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme, score }) => {
    if (!score) return theme.colors.background.secondary;
    
    // Score is typically between 0 and 1, with 1 being highest confidence
    if (score > 0.8) return theme.colors.primary.light;
    if (score > 0.6) return theme.colors.primary.faded;
    if (score > 0.4) return theme.colors.background.tertiary;
    return theme.colors.background.secondary;
  }};
  color: ${({ theme, score }) => {
    if (!score) return theme.colors.text.primary;
    
    if (score > 0.8) return theme.colors.text.inverse;
    return theme.colors.text.primary;
  }};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSizes.xs;
      case 'lg':
        return theme.typography.fontSizes.md;
      default:
        return theme.typography.fontSizes.sm;
    }
  }};
  white-space: nowrap;
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'default')};
  transition: all 0.2s ease;
  user-select: none;
  font-weight: ${({ theme, score }) => 
    score && score > 0.8 
      ? theme.typography.fontWeights.medium 
      : theme.typography.fontWeights.normal
  };
  
  &:hover {
    transform: ${({ interactive }) => (interactive ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ interactive, theme }) => 
      interactive ? theme.shadows.sm : 'none'
    };
  }
`;

const ScoreBadge = styled.span<{ score?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
  background-color: ${({ theme, score }) => {
    if (!score) return theme.colors.background.tertiary;
    
    if (score > 0.8) return theme.colors.primary.main;
    if (score > 0.6) return theme.colors.primary.light;
    if (score > 0.4) return theme.colors.background.quaternary;
    return theme.colors.background.tertiary;
  }};
  color: ${({ theme, score }) => {
    if (!score) return theme.colors.text.secondary;
    
    if (score > 0.6) return theme.colors.text.inverse;
    return theme.colors.text.secondary;
  }};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  min-width: 1.5em;
  height: 1.5em;
`;

const KeyPhraseTag: React.FC<KeyPhraseTagProps> = ({
  text,
  score,
  size = 'md',
  onClick,
  className,
}) => {
  // Format score for display - show as percentage
  const formattedScore = score ? Math.round(score * 100) : undefined;

  return (
    <TagContainer
      score={score}
      size={size}
      interactive={!!onClick}
      onClick={onClick}
      className={className}
    >
      {text}
      {formattedScore && <ScoreBadge score={score}>{formattedScore}%</ScoreBadge>}
    </TagContainer>
  );
};

export default KeyPhraseTag;