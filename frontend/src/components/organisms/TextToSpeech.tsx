import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LoadingIndicator } from '../ui/LoadingSpinner';

interface TextToSpeechProps {
  text?: string;
  onSubmit?: (text: string, voice: string) => Promise<void>;
  onPlayAudio?: (audioUrl: string) => void;
  isProcessing?: boolean;
  audioUrl?: string;
  availableVoices?: Array<{ id: string; name: string; gender?: string }>;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.2);
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const VoiceSelector = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SubmitButton = styled.button<{ isProcessing: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({ theme, isProcessing }) => 
    isProcessing ? theme.colors.primary.dark : theme.colors.primary.main
  };
  color: ${({ theme }) => theme.colors.primary.contrastText};
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: ${({ isProcessing }) => (isProcessing ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background-color: ${({ theme, isProcessing }) => 
      isProcessing ? theme.colors.primary.dark : theme.colors.primary.light
    };
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.3);
  }
`;

const AudioPlayer = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const Player = styled.audio`
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const AudioWave = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  gap: 2px;
`;

const AudioBar = styled(motion.div)`
  width: 2px;
  background-color: ${({ theme }) => theme.colors.primary.contrastText};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
`;

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text = '',
  onSubmit,
  onPlayAudio,
  isProcessing = false,
  audioUrl,
  availableVoices = [],
  className,
}) => {
  const [inputText, setInputText] = useState(text);
  const [selectedVoice, setSelectedVoice] = useState(
    availableVoices.length > 0 ? availableVoices[0].id : ''
  );
  
  const handleSubmit = async () => {
    if (onSubmit && inputText.trim() && selectedVoice) {
      await onSubmit(inputText, selectedVoice);
    }
  };
  
  const handlePlayAudio = () => {
    if (onPlayAudio && audioUrl) {
      onPlayAudio(audioUrl);
    }
  };
  
  const AudioWaveAnimation = () => (
    <AudioWave>
      {[...Array(4)].map((_, i) => (
        <AudioBar
          key={i}
          initial={{ height: 5 }}
          animate={{ 
            height: [5, 12, 5],
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 0.6,
              delay: i * 0.1,
            }
          }}
        />
      ))}
    </AudioWave>
  );
  
  return (
    <Container className={className}>
      <Title>Text to Speech</Title>
      <InfoText>
        Enter the text you would like to convert to speech and select a voice.
      </InfoText>
      <TextArea
        placeholder="Type or paste your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isProcessing}
      />
      <Controls>
        <VoiceSelector
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          disabled={isProcessing || availableVoices.length === 0}
        >
          {availableVoices.length > 0 ? (
            availableVoices.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.name} {voice.gender ? `(${voice.gender})` : ''}
              </option>
            ))
          ) : (
            <option value="">No voices available</option>
          )}
        </VoiceSelector>
        <SubmitButton
          onClick={handleSubmit}
          disabled={isProcessing || !inputText.trim() || !selectedVoice}
          isProcessing={isProcessing}
        >
          {isProcessing ? (
            <>
              <LoadingIndicator size="small" text="" />
              Generating Audio...
            </>
          ) : (
            <>
              <IconWrapper>
                <AudioWaveAnimation />
              </IconWrapper>
              Generate Audio
            </>
          )}
        </SubmitButton>
      </Controls>
      
      {audioUrl ? (
        <AudioPlayer>
          <Player controls src={audioUrl} onPlay={handlePlayAudio}>
            Your browser does not support the audio element.
          </Player>
        </AudioPlayer>
      ) : !isProcessing && (
        <EmptyState>
          Generated audio will appear here
        </EmptyState>
      )}
    </Container>
  );
};

export default TextToSpeech;