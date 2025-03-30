import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  onClose?: () => void;
  isVisible?: boolean;
  className?: string;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled(motion.div)<{ type: NotificationType }>`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  position: relative;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return css`
          border-left: 4px solid ${theme.colors.sentiment.positive};
          &::before {
            background-color: ${theme.colors.sentiment.positive};
          }
        `;
      case 'error':
        return css`
          border-left: 4px solid ${theme.colors.sentiment.negative};
          &::before {
            background-color: ${theme.colors.sentiment.negative};
          }
        `;
      case 'warning':
        return css`
          border-left: 4px solid ${theme.colors.sentiment.mixed};
          &::before {
            background-color: ${theme.colors.sentiment.mixed};
          }
        `;
      case 'info':
      default:
        return css`
          border-left: 4px solid ${theme.colors.primary.main};
          &::before {
            background-color: ${theme.colors.primary.main};
          }
        `;
    }
  }}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0.7;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NotificationTitle = styled.h4<{ type: NotificationType }>`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.sentiment.positive;
      case 'error':
        return theme.colors.sentiment.negative;
      case 'warning':
        return theme.colors.sentiment.mixed;
      case 'info':
      default:
        return theme.colors.primary.main;
    }
  }};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:focus {
    outline: none;
  }
`;

const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const ProgressBar = styled.div<{ duration: number; type: NotificationType }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.sentiment.positive;
      case 'error':
        return theme.colors.sentiment.negative;
      case 'warning':
        return theme.colors.sentiment.mixed;
      case 'info':
      default:
        return theme.colors.primary.main;
    }
  }};
  width: 100%;
  transform-origin: left;
  animation: shrink ${({ duration }) => duration}ms linear forwards;
  
  @keyframes shrink {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;

const getDefaultTitle = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
    default:
      return 'Information';
  }
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  title,
  duration = 5000,
  onClose,
  isVisible = true,
  className,
}) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);
  
  useEffect(() => {
    if (duration && duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, visible]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  const notificationTitle = title || getDefaultTitle(type);
  
  // Animation variants
  const variants = {
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    hidden: { 
      x: '100%', 
      opacity: 0,
      transition: { duration: 0.2 }
    },
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <NotificationContainer
          className={className}
          type={type}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
        >
          <NotificationHeader>
            <NotificationTitle type={type}>{notificationTitle}</NotificationTitle>
            <CloseButton onClick={handleClose} aria-label="Close notification">
              ×
            </CloseButton>
          </NotificationHeader>
          <NotificationMessage>{message}</NotificationMessage>
          {duration > 0 && <ProgressBar duration={duration} type={type} />}
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
};

export default Notification;

// Notification container component for managing multiple notifications
export const NotificationCenter = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: ${({ theme }) => theme.zIndices.tooltip};
  width: 400px;
  max-width: 90vw;
`;