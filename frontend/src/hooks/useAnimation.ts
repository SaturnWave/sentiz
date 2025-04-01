import { useState, useCallback } from 'react';

interface AnimationOptions {
  delay?: number;
  duration?: number;
  easing?: string;
}

const useAnimation = (initialAnimationState = false, options: AnimationOptions = {}) => {
  const [isAnimating, setIsAnimating] = useState(initialAnimationState);
  
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);
  
  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);
  
  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);
  
  return {
    isAnimating,
    startAnimation,
    stopAnimation,
    toggleAnimation,
    options,
  };
};

export default useAnimation;