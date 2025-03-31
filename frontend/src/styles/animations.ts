import { keyframes } from 'styled-components';

/**
 * Animation utilities for styled-components and Framer Motion
 */

// Keyframes for styled-components

/**
 * Fade in animation
 */
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/**
 * Fade out animation
 */
export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

/**
 * Slide in from top animation
 */
export const slideInTop = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

/**
 * Slide in from bottom animation
 */
export const slideInBottom = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

/**
 * Slide in from left animation
 */
export const slideInLeft = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

/**
 * Slide in from right animation
 */
export const slideInRight = keyframes`
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

/**
 * Scale in animation
 */
export const scaleIn = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

/**
 * Scale out animation
 */
export const scaleOut = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.8);
    opacity: 0;
  }
`;

/**
 * Rotate animation
 */
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/**
 * Pulse animation
 */
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

/**
 * Bounce animation
 */
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

/**
 * Shimmer animation for loading states
 */
export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Framer Motion variants

/**
 * Staggered fade in animation for lists
 */
export const staggeredFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Fade in animation for list items
 */
export const fadeInItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Page transition animation
 */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

/**
 * Hover animation for cards
 */
export const cardHover = {
  rest: { scale: 1, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.03, 
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

/**
 * Animation for modal
 */
export const modalAnimation = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: { 
      duration: 0.2, 
      ease: 'easeIn',
    } 
  },
};

/**
 * Animation for accordion
 */
export const accordionAnimation = {
  closed: { height: 0, opacity: 0 },
  open: { 
    height: 'auto', 
    opacity: 1,
    transition: { 
      height: { duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.4, ease: 'easeOut' },
    }
  },
};

/**
 * Animation for tooltip
 */
export const tooltipAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.2, 
      ease: 'easeOut',
    } 
  },
};

/**
 * Animation for notification
 */
export const notificationAnimation = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { 
      duration: 0.2, 
      ease: 'easeIn',
    } 
  },
};

/**
 * Animation for sidebar
 */
export const sidebarAnimation = {
  closed: { 
    width: '70px',
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
  open: { 
    width: '250px',
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
};

/**
 * Animation for mobile menu
 */
export const mobileMenuAnimation = {
  closed: { 
    x: '-100%',
    opacity: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeIn',
    } 
  },
  open: { 
    x: 0,
    opacity: 1,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
};

/**
 * Animation for tab change
 */
export const tabAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut',
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2, 
      ease: 'easeIn',
    } 
  },
};

/**
 * Animation for button press
 */
export const buttonTap = {
  tap: { scale: 0.97 },
};

/**
 * Animation for floating elements
 */
export const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};