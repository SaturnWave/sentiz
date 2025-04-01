import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../../types/models';
import SentimentGauge from '../visualizations/SentimentGauge';
import KeyPhraseCloud from '../visualizations/KeyPhraseCloud';

interface ResultsVisualizationProps {
  result: AnalysisResult;
  isTextToSpeechPlaying: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SentimentSummary = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SentimentLabel = styled.div<{ sentiment: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ sentiment, theme }) => 
    sentiment === 'POSITIVE' ? theme.colors.sentiment.positive :
    sentiment === 'NEGATIVE' ? theme.colors.sentiment.negative :
    sentiment === 'MIXED' ? theme.colors.sentiment.mixed :
    theme.colors.sentiment.neutral
  };
`;

const TextSample = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const VisualizationsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AudioStatusIndicator = styled.div<{ isPlaying: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ isPlaying, theme }) => 
    isPlaying ? theme.colors.primary.main : theme.colors.text.secondary
  };
`;

const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({
  result,
  isTextToSpeechPlaying,
}) => {
  // Capitalize first letter of sentiment
  const formatSentiment = (sentiment: string) => {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Container>
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle>Overall Sentiment</SectionTitle>
        <SentimentSummary>
          <SentimentLabel sentiment={result.sentiment}>
            {formatSentiment(result.sentiment)}
          </SentimentLabel>
          
          {isTextToSpeechPlaying && (
            <AudioStatusIndicator isPlaying={isTextToSpeechPlaying}>
              <span>🔊</span>
              <span>Audio playing...</span>
            </AudioStatusIndicator>
          )}
        </SentimentSummary>
        
        <TextSample>"{result.text_sample || result.text.substring(0, 200)}"</TextSample>
        
        <MetaInfo>
          <MetaItem>
            <span>Source:</span>
            <strong>{result.source || 'Direct Input'}</strong>
          </MetaItem>
          <MetaItem>
            <span>Text Length:</span>
            <strong>{result.text.length} characters</strong>
          </MetaItem>
          <MetaItem>
            <span>Analyzed:</span>
            <strong>{formatTimestamp(result.timestamp)}</strong>
          </MetaItem>
        </MetaInfo>
      </Section>
      
      <VisualizationsContainer>
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionTitle>Sentiment Breakdown</SectionTitle>
          <SentimentGauge 
            positive={result.sentiment_scores.Positive} 
            negative={result.sentiment_scores.Negative}
            neutral={result.sentiment_scores.Neutral}
            mixed={result.sentiment_scores.Mixed}
          />
        </Section>
        
        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionTitle>Key Phrases</SectionTitle>
          <KeyPhraseCloud phrases={result.key_phrases} />
        </Section>
      </VisualizationsContainer>
    </Container>
  );
};

export default ResultsVisualization;