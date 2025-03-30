import React from 'react';
import styled from 'styled-components';

interface KeyPhraseTagProps {
  text: string;
  score?: number; // Optional score between 0 and 1 representing importance
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isSelected?: boolean;
  color?: string;
  className?: string;
}

interface TagProps {
  size: 'sm' | 'md' | 'lg';
  score?: number;
  isSelected?: boolean;
  color?: string;
  isClickable: boolean;
}

const TagContainer = styled.div<TagProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing.xxs} ${props.theme.spacing.xs}`;
      case 'lg': return `${props.theme.spacing.sm} ${props.theme.spacing.md}`;
      default: return `${props.theme.spacing.xs} ${props.theme.spacing.sm}`;
    }
  }};
  margin: ${props => props.theme.spacing.xs};
  background-color: ${props => {
    if (props.isSelected) {
      return props.theme.colors.primary.main;
    }
    
    if (props.color) {
      return props.color;
    }
    
    // If score is provided, use it to determine opacity
    const baseColor = props.theme.colors.primary.light;
    const opacity = props.score !== undefined ? 0.3 + (props.score * 0.7) : 1;
    
    // Extract RGB components and add alpha
    const rgbMatch = baseColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const hexMatch = baseColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;
    } else if (hexMatch) {
      const r = parseInt(hexMatch[1], 16);
      const g = parseInt(hexMatch[2], 16);
      const b = parseInt(hexMatch[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    return baseColor;
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.typography.fontSizes.sm;
      case 'lg': return props.theme.typography.fontSizes.lg;
      default: return props.theme.typography.fontSizes.md;
    }
  }};
  font-weight: ${props => {
    // If score is provided, use it to determine font weight
    if (props.score !== undefined) {
      // Map score from 0-1 to a range between normal and bold
      const normalWeight = props.theme.typography.fontWeights.normal;
      const boldWeight = props.theme.typography.fontWeights.bold;
      return normalWeight + Math.round((boldWeight - normalWeight) * props.score);
    }
    return props.theme.typography.fontWeights.medium;
  }};
  color: ${props => props.isSelected ? props.theme.colors.primary.contrastText : props.theme.colors.text.primary};
  transition: all 0.2s ease;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    transform: ${props => props.isClickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isClickable ? props.theme.shadows.sm : 'none'};
  }
  
  &:active {
    transform: ${props => props.isClickable ? 'translateY(0)' : 'none'};
  }
`;

const KeyPhraseTag: React.FC<KeyPhraseTagProps> = ({
  text,
  score,
  size = 'md',
  onClick,
  isSelected = false,
  color,
  className,
}) => {
  return (
    <TagContainer
      size={size}
      score={score}
      isSelected={isSelected}
      color={color}
      isClickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {text}
    </TagContainer>
  );
};

export default KeyPhraseTag;