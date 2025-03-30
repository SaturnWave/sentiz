import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalProps } from '../../types/components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled(motion.div)<{ size: 'small' | 'medium' | 'large' | 'fullscreen' }>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  border: 1px solid rgba(100, 255, 218, 0.1);
  
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          width: 400px;
          max-width: 90%;
        `;
      case 'large':
        return css`
          width: 800px;
          max-width: 90%;
        `;
      case 'fullscreen':
        return css`
          width: 90%;
          height: 90%;
          max-width: 1200px;
        `;
      default: // medium
        return css`
          width: 600px;
          max-width: 90%;
        `;
    }
  }}
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.3);
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  children,
  className,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Handle clicking outside modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (
      closeOnClickOutside &&
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };
  
  // Animation variants for Framer Motion
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  
  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 30,
      } 
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      y: 20, 
      transition: { 
        duration: 0.2 
      } 
    },
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={handleOverlayClick}
        >
          <ModalContainer
            ref={modalContentRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            size={size}
            className={className}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                {title && <ModalTitle>{title}</ModalTitle>}
                {showCloseButton && (
                  <CloseButton onClick={onClose} aria-label="Close modal">
                    ×
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            <ModalContent>{children}</ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;