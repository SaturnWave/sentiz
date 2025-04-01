import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface KeyPhraseTagProps {
  text: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

const TagContainer = styled(motion.div)<{ 
  score?: number; 
  isSelected?: boolean;
  isClickable: boolean;
  size?: string;
  color?: string;
}>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme, size }) => {
    switch(size) {
      case 'sm': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg': return `${theme.spacing.sm} ${theme.spacing.md}`;
      default: return `${theme.spacing.xs} ${theme.spacing.sm}`;
    }
  }};
  margin: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  background-color: ${({ score = 0.5, isSelected, theme, color }) => {
    if (color) return color;
    
    // Higher score = more saturated color
    const baseColor = theme.colors.primary.main;
    // If highlighted, use a higher opacity
    const opacity = isSelected ? 0.3 : 0.15;
    // Increase opacity based on score
    const adjustedOpacity = opacity + (score * 0.3);
    return `${baseColor}${Math.round(adjustedOpacity * 255).toString(16).padStart(2, '0')}`;
  }};
  font-size: ${({ size, theme }) => {
    switch(size) {
      case 'sm': return theme.typography.fontSizes.sm;
      case 'lg': return theme.typography.fontSizes.lg;
      default: return theme.typography.fontSizes.md;
    }
  }};
  font-weight: ${({ score = 0.5, theme }) => {
    // Higher score = bolder text
    return score > 0.7 
      ? theme.typography.fontWeights.bold 
      : score > 0.4 
        ? theme.typography.fontWeights.medium 
        : theme.typography.fontWeights.regular;
  }};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: ${({ isClickable }) => isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: ${({ isClickable }) => isClickable ? 'scale(1.05)' : 'none'};
    background-color: ${({ score = 0.5, isSelected, isClickable, theme, color }) => {
      if (!isClickable) return '';
      if (color) return color;
      
      const baseColor = theme.colors.primary.main;
      const opacity = isSelected ? 0.4 : 0.25;
      const adjustedOpacity = opacity + (score * 0.3);
      return `${baseColor}${Math.round(adjustedOpacity * 255).toString(16).padStart(2, '0')}`;
    }};
  }
`;

const ScoreBadge = styled.span<{ score?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ score = 0.5, theme }) => {
    return score > 0.7 
      ? theme.colors.primary.main 
      : theme.colors.primary.dark;
  }};
  color: ${({ theme }) => theme.colors.primary.contrastText};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const KeyPhraseTag: React.FC<KeyPhraseTagProps> = ({
  text,
  score,
  size = 'md',
  color,
  onClick,
  isSelected = false,
  className,
}) => {
  // Animation variants
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
  };
  
  // Only show score badge if score is provided
  const showScoreBadge = score !== undefined;
  
  // Format score for display (as percentage)
  const displayScore = score !== undefined ? Math.round(score * 100) : 0;
  
  return (
    <TagContainer
      score={score}
      isSelected={isSelected}
      isClickable={!!onClick}
      size={size}
      color={color}
      onClick={onClick}
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={onClick ? "hover" : undefined}
      transition={{ duration: 0.2 }}
    >
      {text}
      {showScoreBadge && (
        <ScoreBadge score={score}>
          {displayScore}
        </ScoreBadge>
      )}
    </TagContainer>
  );
};

export default KeyPhraseTag;