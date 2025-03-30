import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  thickness?: number;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SpinnerContainer = styled.div<{ size: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => 
    size === 'small' ? '24px' : 
    size === 'large' ? '64px' : '40px'
  };
  height: ${({ size }) => 
    size === 'small' ? '24px' : 
    size === 'large' ? '64px' : '40px'
  };
`;

const Spinner = styled.div<{ 
  size: string; 
  color: string; 
  thickness: number; 
}>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${({ thickness }) => thickness}px solid rgba(100, 255, 218, 0.2);
  border-top-color: ${({ color }) => color};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div<{ size: string }>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme, size }) => 
    size === 'small' ? theme.typography.fontSizes.sm : 
    size === 'large' ? theme.typography.fontSizes.lg : 
    theme.typography.fontSizes.md
  };
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  thickness = 3,
  className,
}) => {
  const spinnerColor = color || '${({ theme }) => theme.colors.primary.main}';
  
  return (
    <SpinnerWrapper className={className}>
      <SpinnerContainer size={size}>
        <Spinner 
          size={size} 
          color={spinnerColor} 
          thickness={
            size === 'small' ? thickness : 
            size === 'large' ? thickness * 2 : 
            thickness
          } 
        />
      </SpinnerContainer>
    </SpinnerWrapper>
  );
};

export const LoadingIndicator: React.FC<LoadingSpinnerProps & { text?: string }> = ({
  size = 'medium',
  color,
  thickness,
  text = 'Loading...',
  className,
}) => {
  return (
    <SpinnerWrapper className={className}>
      <SpinnerContainer size={size}>
        <Spinner 
          size={size} 
          color={color || '${({ theme }) => theme.colors.primary.main}'} 
          thickness={
            size === 'small' ? thickness || 2 : 
            size === 'large' ? thickness || 6 : 
            thickness || 3
          } 
        />
      </SpinnerContainer>
      {text && <LoadingText size={size}>{text}</LoadingText>}
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;