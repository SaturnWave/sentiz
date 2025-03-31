import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import { apiService } from '../../services/api';
import { analyticsService } from '../../services/analytics';

interface TextToSpeechProps {
  analysisId: string;
  text: string;
  voice?: string;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AudioContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const AudioPlayer = styled.audio`
  width: 100%;
`;

const CustomControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const PlayButton = styled(Button)<{ isPlaying: boolean }>`
  min-width: 100px;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const VolumeIcon = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const VolumeSlider = styled.input`
  appearance: none;
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.main};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.main};
    cursor: pointer;
    border: none;
  }
`;

const StatusMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const LoadingDots = styled(motion.span)`
  display: inline-block;
  
  &::after {
    content: '...';
    animation: dots 1.5s infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  analysisId,
  text,
  voice = 'Joanna',
  autoPlay = false,
  onPlayStateChange,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Fetch the audio URL when the component mounts
  useEffect(() => {
    if (analysisId) {
      fetchAudioUrl();
    }
  }, [analysisId, voice]);
  
  // Handle autoplay when audioUrl is available
  useEffect(() => {
    if (audioUrl && autoPlay && audioRef.current) {
      playAudio();
    }
  }, [audioUrl, autoPlay]);
  
  // Fetch audio URL from API
  const fetchAudioUrl = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.get(`/tts/${analysisId}`, {
        params: { voice }
      });
      
      if (response.audio_url) {
        setAudioUrl(response.audio_url);
        
        // Track successful TTS generation
        analyticsService.trackFeatureUsed('text_to_speech', {
          analysisId,
          textLength: text.length,
          voice,
        });
      } else {
        setError('Failed to generate audio.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate audio.');
      
      // Track error
      analyticsService.trackError(
        'TTS generation failed',
        'TTS_ERROR',
        { analysisId, textLength: text.length, voice }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Play audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(err => {
        console.error('Audio playback error:', err);
      });
    }
  };
  
  // Pause audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Handle audio play event
  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlayStateChange) {
      onPlayStateChange(true);
    }
  };
  
  // Handle audio pause event
  const handlePause = () => {
    setIsPlaying(false);
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
  };
  
  // Handle audio ended event
  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
  };
  
  return (
    <Container className={className}>
      {isLoading ? (
        <StatusMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Generating audio<LoadingDots />
        </StatusMessage>
      ) : error ? (
        <StatusMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </StatusMessage>
      ) : audioUrl ? (
        <AudioContainer>
          <AudioPlayer
            ref={audioRef}
            src={audioUrl}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          />
          <CustomControls>
            <PlayButton
              onClick={togglePlayPause}
              isPlaying={isPlaying}
              variant={isPlaying ? 'secondary' : 'primary'}
              size="small"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </PlayButton>
            
            <VolumeControl>
              <VolumeIcon>🔊</VolumeIcon>
              <VolumeSlider
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </VolumeControl>
          </CustomControls>
        </AudioContainer>
      ) : (
        <Button
          onClick={fetchAudioUrl}
          disabled={isLoading}
          variant="primary"
          size="small"
        >
          Generate Audio
        </Button>
      )}
    </Container>
  );
};

export default TextToSpeech;