import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface SentimentScoreProps {
  score: number; // Score between 0 and 1
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
  className?: string;
}

// Container for the score gauge
const GaugeContainer = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => 
    size === 'small' ? '60px' : 
    size === 'large' ? '120px' : '90px'};
  height: ${({ size }) => 
    size === 'small' ? '60px' : 
    size === 'large' ? '120px' : '90px'};
  position: relative;
`;

// Main gauge circle
const GaugeCircle = styled.div<{ size: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

// Filled portion of the gauge
const GaugeFill = styled(motion.div)<{ 
  score: number; 
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ sentiment, theme }) => {
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
  border-radius: 0 0 100px 100px;
`;

// Score text value
const ScoreText = styled.div<{ size: string; sentiment: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ size }) => 
    size === 'small' ? '14px' : 
    size === 'large' ? '28px' : '20px'};
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

// Sentiment label
const SentimentLabel = styled.div<{ size: string; sentiment: string }>`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ size }) => 
    size === 'small' ? '12px' : 
    size === 'large' ? '16px' : '14px'};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
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

const SentimentScore: React.FC<SentimentScoreProps> = ({
  score,
  sentiment,
  size = 'medium',
  showValue = true,
  className,
}) => {
  // Format score as percentage
  const scorePercentage = Math.round(score * 100);
  
  // Format sentiment for display
  const formatSentiment = (sentiment: string): string => {
    return sentiment.charAt(0) + sentiment.slice(1).toLowerCase();
  };
  
  // Calculate height based on score
  const fillHeight = `${scorePercentage}%`;
  
  return (
    <div className={className}>
      <GaugeContainer size={size}>
        <GaugeCircle size={size}>
          <GaugeFill
            score={score}
            sentiment={sentiment}
            initial={{ height: '0%' }}
            animate={{ height: fillHeight }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {showValue && (
            <ScoreText size={size} sentiment={sentiment}>
              {scorePercentage}%
            </ScoreText>
          )}
        </GaugeCircle>
      </GaugeContainer>
      <SentimentLabel size={size} sentiment={sentiment}>
        {formatSentiment(sentiment)}
      </SentimentLabel>
    </div>
  );
};

export default SentimentScore;