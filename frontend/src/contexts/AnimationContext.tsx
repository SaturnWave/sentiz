import React, { createContext, useState, useContext } from 'react';

interface AnimationContextType {
  enableAnimations: boolean;
  setEnableAnimations: (enable: boolean) => void;
  animationSpeed: 'slow' | 'normal' | 'fast';
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  getDuration: (type: 'fast' | 'normal' | 'slow') => number;
}

export const AnimationContext = createContext<AnimationContextType>({
  enableAnimations: true,
  setEnableAnimations: () => {},
  animationSpeed: 'normal',
  setAnimationSpeed: () => {},
  getDuration: () => 300,
});

export const AnimationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  
  // Helper function to get duration in milliseconds based on speed
  const getDuration = (type: 'fast' | 'normal' | 'slow'): number => {
    if (!enableAnimations) return 0;
    
    switch (animationSpeed) {
      case 'slow':
        return type === 'fast' ? 300 : type === 'normal' ? 500 : 800;
      case 'normal':
        return type === 'fast' ? 150 : type === 'normal' ? 300 : 500;
      case 'fast':
        return type === 'fast' ? 100 : type === 'normal' ? 200 : 300;
      default:
        return 300;
    }
  };
  
  return (
    <AnimationContext.Provider 
      value={{ 
        enableAnimations, 
        setEnableAnimations,
        animationSpeed,
        setAnimationSpeed,
        getDuration
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);