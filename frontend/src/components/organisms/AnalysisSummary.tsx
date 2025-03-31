import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Card from '../molecules/Card';
import SentimentScore from '../visualizations/SentimentScore';
import KeyPhraseCloud from '../visualizations/KeyPhraseCloud';
import TextToSpeech from './TextToSpeech';
import Button from '../atoms/Button';
import { AnalysisResult } from '../../types/models';
import { formatTimestamp } from '../../utils/formatting';

interface AnalysisSummaryProps {
  result: AnalysisResult;
  showText?: boolean;
  showTts?: boolean;
  onNewAnalysis?: () => void;
  className?: string;
}

const Container = styled(Card)`
  width: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const Metadata = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const MetaIcon = styled.span`
  font-size: 1rem;
`;

const SourceTag = styled.div<{ source: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const ContentSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const TextContent = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  max-height: 200px;
  overflow-y: auto;
`;

const SentimentSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SentimentScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  min-width: 120px;
`;

const SentimentScores = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  min-width: 100px;
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ScoreValue = styled.div<{ sentiment: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ sentiment, theme }) => {
    switch (sentiment) {
      case 'POSITIVE':
        return theme.colors.sentiment.positive;
      case 'NEGATIVE':
        return theme.colors.sentiment.negative;
      case 'MIXED':
        return theme.colors.sentiment.mixed;
      default:
        return theme.colors.sentiment.neutral;
    }
  }};
`;

const KeyPhrasesSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TTSSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  result,
  showText = true,
  showTts = true,
  onNewAnalysis,
  className,
}) => {
  // Format metadata for display
  const formattedTimestamp = formatTimestamp(result.timestamp);
  const textLength = result.text_length;
  const sourceDisplay = result.source.charAt(0).toUpperCase() + result.source.slice(1);
  
  // Format sentiment for display
  const formatSentiment = (sentiment: string): string => {
    return sentiment.charAt(0) + sentiment.slice(1).toLowerCase();
  };
  
  return (
    <Container
      title=""
      elevation="medium"
      variant="gradient"
      className={className}
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <HeaderLeft>
          <Title>Analysis Results</Title>
          <Metadata>
            <MetaItem>
              <MetaIcon>🕒</MetaIcon>
              <span>{formattedTimestamp}</span>
            </MetaItem>
            <MetaItem>
              <MetaIcon>📝</MetaIcon>
              <span>{textLength} characters</span>
            </MetaItem>
            <MetaItem>
              <SourceTag source={result.source}>
                {sourceDisplay}
              </SourceTag>
            </MetaItem>
          </Metadata>
        </HeaderLeft>
        <HeaderRight>
          <ButtonsContainer>
            {onNewAnalysis && (
              <Button 
                onClick={onNewAnalysis}
                variant="outlined"
                size="small"
              >
                New Analysis
              </Button>
            )}
          </ButtonsContainer>
        </HeaderRight>
      </Header>
      
      {showText && (
        <ContentSection>
          <SectionTitle>Analyzed Text</SectionTitle>
          <TextContent>
            {result.text_sample}
          </TextContent>
        </ContentSection>
      )}
      
      <SentimentSection>
        <SentimentScoreContainer>
          <SentimentScore 
            score={result.sentiment_scores[result.sentiment.charAt(0) + result.sentiment.slice(1).toLowerCase() as keyof typeof result.sentiment_scores]}
            sentiment={result.sentiment}
            size="large"
          />
        </SentimentScoreContainer>
        
        <SentimentScores>
          <ScoreItem>
            <ScoreLabel>Positive</ScoreLabel>
            <ScoreValue sentiment="POSITIVE">
              {Math.round(result.sentiment_scores.Positive * 100)}%
            </ScoreValue>
          </ScoreItem>
          <ScoreItem>
            <ScoreLabel>Negative</ScoreLabel>
            <ScoreValue sentiment="NEGATIVE">
              {Math.round(result.sentiment_scores.Negative * 100)}%
            </ScoreValue>
          </ScoreItem>
          <ScoreItem>
            <ScoreLabel>Neutral</ScoreLabel>
            <ScoreValue sentiment="NEUTRAL">
              {Math.round(result.sentiment_scores.Neutral * 100)}%
            </ScoreValue>
          </ScoreItem>
          <ScoreItem>
            <ScoreLabel>Mixed</ScoreLabel>
            <ScoreValue sentiment="MIXED">
              {Math.round(result.sentiment_scores.Mixed * 100)}%
            </ScoreValue>
          </ScoreItem>
        </SentimentScores>
      </SentimentSection>
      
      <KeyPhrasesSection>
        <SectionTitle>Key Phrases</SectionTitle>
        <KeyPhraseCloud keyPhrases={result.key_phrases} />
      </KeyPhrasesSection>
      
      {showTts && (
        <TTSSection>
          <SectionTitle>Text-to-Speech</SectionTitle>
          <TextToSpeech 
            analysisId={result.analysis_id}
            text={result.text_sample}
          />
        </TTSSection>
      )}
    </Container>
  );
};

export default AnalysisSummary;