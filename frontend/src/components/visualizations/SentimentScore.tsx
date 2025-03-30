import React from 'react';
import styled from 'styled-components';

interface SentimentScoreProps {
  score: number;
  label?: string;
  showValue?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ScoreContainer = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ size }) => (size === 'small' ? '60px' : size === 'large' ? '120px' : '90px')};
`;

const ScoreIndicator = styled.div<{ score: number; size: string }>`
  width: 100%;
  height: ${({ size }) => (size === 'small' ? '6px' : size === 'large' ? '12px' : '8px')};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.sentiment.negative} 0%,
    ${({ theme }) => theme.colors.sentiment.mixed} 50%,
    ${({ theme }) => theme.colors.sentiment.positive} 100%
  );
  position: relative;
  overflow: hidden;
`;

const ScoreMarker = styled.div<{ position: string; size: string }>`
  position: absolute;
  width: ${({ size }) => (size === 'small' ? '12px' : size === 'large' ? '24px' : '16px')};
  height: ${({ size }) => (size === 'small' ? '12px' : size === 'large' ? '24px' : '16px')};
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${({ theme }) => theme.colors.background.primary};
  left: ${({ position }) => position};
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: left 0.5s ${({ theme }) => theme.animations.easings.easeInOut};
`;

const ScoreLabel = styled.div<{ size: string }>`
  font-size: ${({ theme, size }) => 
    size === 'small' ? theme.typography.fontSizes.xs : 
    size === 'large' ? theme.typography.fontSizes.md : 
    theme.typography.fontSizes.sm
  };
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-align: center;
`;

const ScoreValue = styled.div<{ score: number; size: string }>`
  font-size: ${({ theme, size }) => 
    size === 'small' ? theme.typography.fontSizes.sm : 
    size === 'large' ? theme.typography.fontSizes.lg : 
    theme.typography.fontSizes.md
  };
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ score, theme }) => {
    if (score < 0.3) return theme.colors.sentiment.negative;
    if (score < 0.6) return theme.colors.sentiment.mixed;
    return theme.colors.sentiment.positive;
  }};
`;

const SentimentScore: React.FC<SentimentScoreProps> = ({
  score,
  label = 'Sentiment',
  showValue = true,
  size = 'medium',
  className,
}) => {
  // Ensure score is between 0 and 1
  const normalizedScore = Math.max(0, Math.min(1, score));
  
  // Calculate the position for the marker (as a percentage)
  const position = `${normalizedScore * 100}%`;
  
  return (
    <ScoreContainer size={size} className={className}>
      {label && <ScoreLabel size={size}>{label}</ScoreLabel>}
      <ScoreIndicator score={normalizedScore} size={size}>
        <ScoreMarker position={position} size={size} />
      </ScoreIndicator>
      {showValue && (
        <ScoreValue score={normalizedScore} size={size}>
          {(normalizedScore * 100).toFixed(0)}%
        </ScoreValue>
      )}
    </ScoreContainer>
  );
};

export default SentimentScore;