import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  thickness?: number;
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

// Keyframes for spinner rotation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Keyframes for opacity pulse
const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

// Root container (used for fullScreen mode)
const Container = styled.div<{ fullScreen: boolean }>`
  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    backdrop-filter: blur(3px);
  `}
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// Spinner wrapper
const SpinnerWrapper = styled.div<{ size: string }>`
  width: ${({ size }) => 
    size === 'small' ? '24px' : 
    size === 'large' ? '64px' : '40px'};
  height: ${({ size }) => 
    size === 'small' ? '24px' : 
    size === 'large' ? '64px' : '40px'};
  position: relative;
`;

// Spinner element
const Spinner = styled.div<{ 
  size: string; 
  color: string; 
  thickness: number; 
}>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: ${({ thickness }) => thickness}px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${({ color }) => color};
  animation: ${rotate} 1s infinite linear;
`;

// Message text
const Message = styled.div<{ size: string }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ size, theme }) => 
    size === 'small' ? theme.typography.fontSizes.sm : 
    size === 'large' ? theme.typography.fontSizes.lg : 
    theme.typography.fontSizes.md};
  animation: ${pulse} 1.5s infinite ease-in-out;
  max-width: 80%;
  text-align: center;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  thickness = 3,
  message,
  fullScreen = false,
  className,
}) => {
  return (
    <Container fullScreen={fullScreen} className={className}>
      <SpinnerWrapper size={size}>
        <Spinner 
          size={size} 
          color={color || '#64ffda'} 
          thickness={
            size === 'small' ? thickness : 
            size === 'large' ? thickness * 2 : 
            thickness
          } 
        />
      </SpinnerWrapper>
      {message && <Message size={size}>{message}</Message>}
    </Container>
  );
};

export default LoadingSpinner;