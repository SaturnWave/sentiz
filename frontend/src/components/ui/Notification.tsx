import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { removeNotification } from '../../features/ui/slices/uiSlice';

// Container for all notifications
const NotificationsContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: ${({ theme }) => theme.zIndices.tooltip};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
`;

// Single notification item
const NotificationItem = styled(motion.div)<{ type: string }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return theme.colors.sentiment.positive;
      case 'error':
        return theme.colors.sentiment.negative;
      case 'warning':
        return theme.colors.sentiment.mixed;
      default:
        return theme.colors.background.elevated;
    }
  }};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  max-width: 100%;
`;

// Icon based on notification type
const NotificationIcon = styled.div<{ type: string }>`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: 1.2rem;
  
  &::before {
    content: ${({ type }) => {
      switch (type) {
        case 'success':
          return '"✓"';
        case 'error':
          return '"✕"';
        case 'warning':
          return '"⚠"';
        default:
          return '"ℹ"';
      }
    }};
  }
`;

// Content of the notification
const NotificationContent = styled.div`
  flex: 1;
`;

// Title of the notification
const NotificationTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// Message of the notification
const NotificationMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

// Close button
const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin-left: ${({ theme }) => theme.spacing.sm};
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

// Progress bar for auto-dismiss
const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  animation: shrink ${({ duration }) => duration}ms linear forwards;
  
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

const Notifications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  
  // Animation variants for notifications
  const notificationVariants = {
    initial: { opacity: 0, x: 50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 50, scale: 0.9 }
  };
  
  // Handle closing a notification
  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };
  
  // Setup auto-dismiss timers
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);
        
        // Clean up timers
        return () => {
          clearTimeout(timer);
        };
      }
    });
  }, [notifications, dispatch]);
  
  return (
    <NotificationsContainer>
      <AnimatePresence>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            layout
          >
            <NotificationIcon type={notification.type} />
            <NotificationContent>
              <NotificationTitle>
                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
              </NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContent>
            <CloseButton onClick={() => handleClose(notification.id)}>
              ×
            </CloseButton>
            {notification.duration && (
              <ProgressBar duration={notification.duration} />
            )}
          </NotificationItem>
        ))}
      </AnimatePresence>
    </NotificationsContainer>
  );
};

export default Notifications;