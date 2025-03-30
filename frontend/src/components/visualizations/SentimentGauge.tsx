import React, { useMemo } from 'react';
import styled from 'styled-components';

interface SentimentGaugeProps {
  positive: number;
  negative: number;
  neutral: number;
  mixed?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  showPercentages?: boolean;
  className?: string;
}

const GaugeContainer = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '150px';
      case 'lg': return '300px';
      default: return '220px';
    }
  }};
  margin: 0 auto;
`;

const GaugeTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-align: center;
`;

const GaugeChart = styled.div<{ size: string }>`
  position: relative;
  width: 100%;
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '75px';
      case 'lg': return '150px';
      default: return '110px';
    }
  }};
  overflow: hidden;
`;

const GaugeBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 200%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  overflow: hidden;
`;

const GaugeFill = styled.div<{ offset: number; color: string; percentage: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200%;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  clip-path: polygon(
    ${({ offset }) => `${offset}% 100%`},
    ${({ offset, percentage }) => `${offset + percentage}% 100%`},
    ${({ offset, percentage }) => `${offset + percentage / 2}% 0%`},
    ${({ offset }) => `${offset}% 100%`}
  );
`;

const GaugeNeedle = styled.div<{ rotation: number; size: string }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform-origin: bottom center;
  transform: ${({ rotation }) => `translateX(-50%) rotate(${rotation}deg)`};
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      default: return '3px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '70px';
      case 'lg': return '140px';
      default: return '105px';
    }
  }};
  background-color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ size }) => {
      switch (size) {
        case 'sm': return '10px';
        case 'lg': return '16px';
        default: return '12px';
      }
    }};
    height: ${({ size }) => {
      switch (size) {
        case 'sm': return '10px';
        case 'lg': return '16px';
        default: return '12px';
      }
    }};
    background-color: ${({ theme }) => theme.colors.text.primary};
    border-radius: 50%;
  }
`;

const GaugeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const GaugeLabel = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme, type }) => {
    switch (type) {
      case 'positive': return theme.colors.success.main;
      case 'negative': return theme.colors.error.main;
      case 'neutral': return theme.colors.text.secondary;
      case 'mixed': return theme.colors.warning.main;
      default: return theme.colors.text.primary;
    }
  }};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const GaugeDot = styled.div<{ type: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme, type }) => {
    switch (type) {
      case 'positive': return theme.colors.success.main;
      case 'negative': return theme.colors.error.main;
      case 'neutral': return theme.colors.text.secondary;
      case 'mixed': return theme.colors.warning.main;
      default: return theme.colors.text.primary;
    }
  }};
`;

const SentimentScore = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  positive,
  negative,
  neutral,
  mixed = 0,
  size = 'md',
  showLabels = true,
  showPercentages = true,
  className,
}) => {
  // Calculate the total to ensure we have percentages
  const total = useMemo(() => positive + negative + neutral + mixed, [positive, negative, neutral, mixed]);
  
  // Normalize values to percentages
  const normalizedPositive = (positive / total) * 100;
  const normalizedNegative = (negative / total) * 100;
  const normalizedNeutral = (neutral / total) * 100;
  const normalizedMixed = (mixed / total) * 100;
  
  // Calculate sentiment score (ranges from -1 to 1)
  // We'll use a simple formula here, but this could be adjusted based on specific needs
  const sentimentScore = useMemo(() => {
    return ((positive - negative) / total) * 100;
  }, [positive, negative, total]);
  
  // Calculate needle rotation (0deg is neutral, -90deg is fully negative, 90deg is fully positive)
  const needleRotation = useMemo(() => {
    return (sentimentScore / 100) * 90; // Map the -100 to 100 range to -90 to 90 degrees
  }, [sentimentScore]);
  
  return (
    <GaugeContainer size={size} className={className}>
      <GaugeTitle>Sentiment Analysis</GaugeTitle>
      
      <GaugeChart size={size}>
        <GaugeBackground>
          {/* Negative segment */}
          <GaugeFill 
            offset={0} 
            percentage={50} 
            color={`hsla(0, 100%, 50%, ${normalizedNegative / 200 + 0.1})`} 
          />
          
          {/* Neutral segment */}
          <GaugeFill 
            offset={50} 
            percentage={0.1} 
            color={`hsla(0, 0%, 60%, ${normalizedNeutral / 100 + 0.2})`} 
          />
          
          {/* Positive segment */}
          <GaugeFill 
            offset={50} 
            percentage={50} 
            color={`hsla(120, 100%, 50%, ${normalizedPositive / 200 + 0.1})`} 
          />
          
          {/* Mixed sentiment overlay if needed */}
          {mixed > 0 && (
            <GaugeFill 
              offset={25} 
              percentage={50} 
              color={`hsla(40, 100%, 50%, ${normalizedMixed / 200})`} 
            />
          )}
        </GaugeBackground>
        
        <GaugeNeedle rotation={needleRotation} size={size} />
      </GaugeChart>
      
      {showLabels && (
        <GaugeLabels>
          <GaugeLabel type="negative">
            <GaugeDot type="negative" />
            Negative
            {showPercentages && ` (${Math.round(normalizedNegative)}%)`}
          </GaugeLabel>
          
          {mixed > 0 && (
            <GaugeLabel type="mixed">
              <GaugeDot type="mixed" />
              Mixed
              {showPercentages && ` (${Math.round(normalizedMixed)}%)`}
            </GaugeLabel>
          )}
          
          <GaugeLabel type="neutral">
            <GaugeDot type="neutral" />
            Neutral
            {showPercentages && ` (${Math.round(normalizedNeutral)}%)`}
          </GaugeLabel>
          
          <GaugeLabel type="positive">
            <GaugeDot type="positive" />
            Positive
            {showPercentages && ` (${Math.round(normalizedPositive)}%)`}
          </GaugeLabel>
        </GaugeLabels>
      )}
      
      <SentimentScore>
        Score: {sentimentScore.toFixed(1)}
      </SentimentScore>
    </GaugeContainer>
  );
};

export default SentimentGauge;