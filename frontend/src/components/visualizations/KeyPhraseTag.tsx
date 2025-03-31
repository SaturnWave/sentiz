import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface KeyPhraseTagProps {
  text: string;
  score: number;
  onClick?: () => void;
  highlighted?: boolean;
  className?: string;
}

const TagContainer = styled(motion.div)<{ 
  score: number; 
  isHighlighted: boolean;
  isClickable: boolean;
}>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  margin: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  background-color: ${({ score, isHighlighted, theme }) => {
    // Higher score = more saturated color
    const baseColor = theme.colors.primary.main;
    // If highlighted, use a higher opacity
    const opacity = isHighlighted ? 0.3 : 0.15;
    // Increase opacity based on score
    const adjustedOpacity = opacity + (score * 0.3);
    return `${baseColor}${Math.round(adjustedOpacity * 255).toString(16).padStart(2, '0')}`;
  }};
  font-size: ${({ score, theme }) => {
    // Higher score = larger font
    const baseSize = parseFloat(theme.typography.fontSizes.sm);
    const maxIncrease = 0.2; // Maximum 20% increase
    const increase = score * maxIncrease;
    return `${baseSize * (1 + increase)}rem`;
  }};
  font-weight: ${({ score, theme }) => {
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
    background-color: ${({ score, isHighlighted, isClickable, theme }) => {
      if (!isClickable) return '';
      
      const baseColor = theme.colors.primary.main;
      const opacity = isHighlighted ? 0.4 : 0.25;
      const adjustedOpacity = opacity + (score * 0.3);
      return `${baseColor}${Math.round(adjustedOpacity * 255).toString(16).padStart(2, '0')}`;
    }};
  }
`;

const ScoreBadge = styled.span<{ score: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ score, theme }) => {
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
  onClick,
  highlighted = false,
  className,
}) => {
  // Animation variants
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
  };
  
  // Format score for display (as percentage)
  const displayScore = Math.round(score * 100);
  
  return (
    <TagContainer
      score={score}
      isHighlighted={highlighted}
      isClickable={!!onClick}
      onClick={onClick}
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={onClick ? "hover" : undefined}
      transition={{ duration: 0.2 }}
    >
      {text}
      <ScoreBadge score={score}>
        {displayScore}
      </ScoreBadge>
    </TagContainer>
  );
};

export default KeyPhraseTag;