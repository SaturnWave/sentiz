import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

type VideoType = 'particles' | 'waves' | 'gradient' | 'none';

interface VideoContextType {
  videoType: VideoType;
  setVideoType: (type: VideoType) => void;
  intensity: number;
  setIntensity: (intensity: number) => void;
  isEnabled: boolean;
  toggleVideo: () => void;
}

export const VideoContext = createContext<VideoContextType>({
  videoType: 'particles',
  setVideoType: () => {},
  intensity: 50,
  setIntensity: () => {},
  isEnabled: true,
  toggleVideo: () => {},
});

export const VideoProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [videoType, setVideoType] = useState<VideoType>('particles');
  const [intensity, setIntensity] = useState<number>(50);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  
  // Turn off video effects in battery saving mode
  const isPowerSavingMode = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  useEffect(() => {
    if (isPowerSavingMode) {
      setIsEnabled(false);
    }
  }, [isPowerSavingMode]);
  
  const toggleVideo = () => setIsEnabled(prev => !prev);
  
  return (
    <VideoContext.Provider 
      value={{ 
        videoType, 
        setVideoType,
        intensity,
        setIntensity,
        isEnabled,
        toggleVideo
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);