import React from 'react';
import styled from 'styled-components';
import SentimentGauge from '../visualizations/SentimentGauge';
import KeyPhraseCloud from '../visualizations/KeyPhraseCloud';

interface Entity {
  id: string;
  text: string;
  type: string;
  score?: number;
}

interface KeyPhrase {
  text: string;
  score?: number;
}

interface SentimentScores {
  positive: number;
  negative: number;
  neutral: number;
  mixed?: number;
}

interface AnalysisSummaryProps {
  text?: string;
  sentiment?: SentimentScores;
  sentimentScore?: number;
  keyPhrases?: KeyPhrase[];
  entities?: Entity[];
  isLoading?: boolean;
  analysisDate?: Date;
  onKeyPhraseClick?: (phrase: KeyPhrase) => void;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SentimentSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const EntitySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EntityCard = styled.div<{ entityType: string }>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-left: 3px solid ${({ entityType, theme }) => {
    switch (entityType.toLowerCase()) {
      case 'person':
        return theme.colors.primary.main;
      case 'location':
        return theme.colors.sentiment.positive;
      case 'organization':
        return theme.colors.sentiment.mixed;
      case 'date':
        return theme.colors.secondary.main;
      default:
        return theme.colors.sentiment.neutral;
    }
  }};
`;

const EntityType = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EntityText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TextSample = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  max-height: 100px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DateText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: right;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  text-align: center;
`;

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  text,
  sentiment,
  sentimentScore = 0.5,
  keyPhrases = [],
  entities = [],
  isLoading = false,
  analysisDate,
  onKeyPhraseClick,
  className,
}) => {
  if (isLoading) {
    return (
      <Container className={className}>
        <EmptyState>Loading analysis results...</EmptyState>
      </Container>
    );
  }

  if (!sentiment && keyPhrases.length === 0 && entities.length === 0) {
    return (
      <Container className={className}>
        <EmptyState>No analysis results available</EmptyState>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <Title>Analysis Summary</Title>
      
      {text && (
        <Section>
          <SectionTitle>Analyzed Text</SectionTitle>
          <TextSample>
            {text.length > 300 ? `${text.substring(0, 300)}...` : text}
          </TextSample>
        </Section>
      )}
      
      {sentiment && (
        <Section>
          <SectionTitle>Sentiment Analysis</SectionTitle>
          <SentimentSection>
            <SentimentGauge score={sentimentScore} size="large" />
          </SentimentSection>
        </Section>
      )}
      
      {keyPhrases.length > 0 && (
        <Section>
          <SectionTitle>Key Phrases</SectionTitle>
          <KeyPhraseCloud
            phrases={keyPhrases}
            maxItems={20}
            onPhraseClick={onKeyPhraseClick}
          />
        </Section>
      )}
      
      {entities.length > 0 && (
        <Section>
          <SectionTitle>Entities</SectionTitle>
          <EntitySection>
            {entities.slice(0, 6).map((entity) => (
              <EntityCard key={entity.id} entityType={entity.type}>
                <EntityType>{entity.type}</EntityType>
                <EntityText>{entity.text}</EntityText>
              </EntityCard>
            ))}
          </EntitySection>
        </Section>
      )}
      
      {analysisDate && (
        <DateText>
          Analyzed on: {analysisDate.toLocaleDateString()} at {analysisDate.toLocaleTimeString()}
        </DateText>
      )}
    </Container>
  );
};

export default AnalysisSummary;