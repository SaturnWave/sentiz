import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'gradient' | 'frosted';
  animate?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const CardContainer = styled(motion.div)<{
  elevation: 'low' | 'medium' | 'high';
  variant: 'default' | 'gradient' | 'frosted';
}>`
  background: ${({ theme, variant }) => 
    variant === 'default'
      ? theme.colors.background.card
      : variant === 'gradient'
      ? `linear-gradient(135deg, ${theme.colors.background.card}, ${theme.colors.background.elevated})`
      : 'rgba(26, 26, 46, 0.7)'};
  
  backdrop-filter: ${({ variant }) => 
    variant === 'frosted' ? 'blur(10px)' : 'none'};
  
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  
  ${({ elevation, theme }) => {
    switch (elevation) {
      case 'low':
        return css`box-shadow: ${theme.shadows.sm};`;
      case 'medium':
        return css`box-shadow: ${theme.shadows.md};`;
      case 'high':
        return css`box-shadow: ${theme.shadows.lg};`;
    }
  }}
  
  border: 1px solid rgba(100, 255, 218, 0.1);
  
  transition: all 0.3s ${({ theme }) => theme.animations.easings.easeOut};
  
  &:hover {
    ${({ onClick }) => onClick && css`
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.shadows.xl};
      border-color: rgba(100, 255, 218, 0.3);
    `}
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const CardSubtitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`;

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  elevation = 'medium',
  variant = 'default',
  animate = true,
  onClick,
  className,
  children,
}) => {
  const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  
  return (
    <CardContainer
      elevation={elevation}
      variant={variant}
      onClick={onClick}
      className={className}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      {...(animate ? animations : {})}
    >
      {title && <CardTitle>{title}</CardTitle>}
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      {children}
    </CardContainer>
  );
};

export default Card;