import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface TextToSpeechPlayerProps {
  audioUrl: string;
  text?: string;
  isLoading?: boolean;
  onPlaybackComplete?: () => void;
  className?: string;
}

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PlayButton = styled.button<{ isPlaying: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme, isPlaying }) => 
    isPlaying ? theme.colors.secondary.main : theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    background-color: ${({ theme, isPlaying }) => 
      isPlaying ? theme.colors.secondary.dark : theme.colors.primary.dark};
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.disabled};
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProgressContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div<{ width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  transition: width 0.1s linear;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const VolumeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: ${({ theme }) => theme.spacing.xs};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 80px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borders.radius.full};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary.main};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary.main};
    cursor: pointer;
    border: none;
  }
`;

const TextPreview = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
  max-height: 120px;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  
  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid ${({ theme }) => theme.colors.background.secondary};
    border-top-color: ${({ theme }) => theme.colors.primary.main};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TextToSpeechPlayer: React.FC<TextToSpeechPlayerProps> = ({
  audioUrl,
  text,
  isLoading = false,
  onPlaybackComplete,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // Set initial volume
    audio.volume = volume / 100;
    
    // Event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (onPlaybackComplete) {
        onPlaybackComplete();
      }
    });
    
    // Cleanup event listeners
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [audioUrl, onPlaybackComplete, volume]);
  
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const percentage = (x / bounds.width) * 100;
    
    // Set progress visually
    setProgress(percentage);
    
    // Update audio time
    const newTime = (percentage / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  return (
    <PlayerContainer className={className}>
      <PlayerControls>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <PlayButton 
            isPlaying={isPlaying} 
            onClick={togglePlayback}
            disabled={!audioUrl}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="currentColor"/>
                <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 11.9999V8.43989C4 4.01989 7.13 2.2099 10.96 4.4199L14.05 6.1999L17.14 7.9799C20.97 10.1899 20.97 13.8099 17.14 16.0199L14.05 17.7999L10.96 19.5799C7.13 21.7899 4 19.9799 4 15.5599V11.9999Z" fill="currentColor"/>
              </svg>
            )}
          </PlayButton>
        )}
        
        <ProgressContainer>
          <ProgressBar onClick={handleProgressBarClick}>
            <ProgressFill width={progress} />
          </ProgressBar>
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>
        </ProgressContainer>
        
        <VolumeContainer>
          <VolumeIcon>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.0003 16.7498C17.8403 16.7498 17.6903 16.7098 17.5503 16.6198C17.2203 16.4098 17.1003 15.9998 17.3103 15.6698C18.9203 13.0798 18.9203 9.91984 17.3103 7.32984C17.1003 6.99984 17.2203 6.58984 17.5503 6.37984C17.8803 6.16984 18.2903 6.28984 18.5003 6.61984C20.4103 9.66984 20.4103 13.3298 18.5003 16.3798C18.3603 16.6098 18.1803 16.7498 18.0003 16.7498Z" fill="currentColor"/>
              <path d="M19.83 19.2499C19.67 19.2499 19.51 19.1999 19.38 19.1099C19.06 18.8999 18.94 18.4899 19.15 18.1599C22.06 13.7999 22.06 9.1999 19.15 4.8399C18.94 4.5099 19.06 4.0999 19.38 3.8899C19.71 3.6799 20.12 3.7999 20.33 4.1199C23.65 9.0599 23.65 14.9399 20.33 19.8799C20.19 19.1099 20.01 19.2499 19.83 19.2499Z" fill="currentColor"/>
              <path d="M15.0003 22.7498H14.9703C13.1903 22.7498 11.6603 21.2198 11.6603 19.4398V4.5998C11.6603 2.8098 13.1903 1.2798 14.9703 1.2798C15.8203 1.2798 16.6303 1.6098 17.2303 2.2098C17.8303 2.8098 18.1603 3.6298 18.1603 4.4698V19.5198C18.1603 21.3098 16.7903 22.7498 15.0003 22.7498ZM14.9703 2.7998C13.9803 2.7998 13.1803 3.6098 13.1803 4.5998V19.4398C13.1803 20.4298 13.9903 21.2498 14.9803 21.2498H15.0103C15.9503 21.2398 16.6703 20.4598 16.6703 19.5198V4.4698C16.6703 3.9998 16.4903 3.5398 16.1703 3.2198C15.8403 2.8998 15.4103 2.7998 14.9703 2.7998Z" fill="currentColor"/>
              <path d="M5.82 19.3996H2C1.59 19.3996 1.25 19.0596 1.25 18.6496V5.34961C1.25 4.93961 1.59 4.59961 2 4.59961H5.82C8.76 4.59961 9.5 7.73961 9.5 12.0196C9.5 16.2796 8.76 19.3996 5.82 19.3996ZM2.75 17.8996H5.82C7.64 17.8996 8 15.3696 8 12.0196C8 8.67961 7.64 6.09961 5.82 6.09961H2.75V17.8996Z" fill="currentColor"/>
            </svg>
          </VolumeIcon>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeContainer>
      </PlayerControls>
      
      {text && <TextPreview>{text}</TextPreview>}
    </PlayerContainer>
  );
};

export default TextToSpeechPlayer;