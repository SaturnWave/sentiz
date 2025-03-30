import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface SentimentItem {
  id: string;
  label: string;
  positive: number;
  negative: number;
  neutral: number;
  mixed?: number;
}

interface SentimentChartProps {
  data: SentimentItem[];
  showLegend?: boolean;
  height?: number;
  className?: string;
}

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const Legend = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendColor = styled.span<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const LegendLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ChartContent = styled.div<{ height: number }>`
  display: flex;
  height: ${({ height }) => `${height}px`};
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  flex: 1;
`;

const BarsContainer = styled.div`
  display: flex;
  width: 40px;
  height: 100%;
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
`;

const Bar = styled(motion.div)<{ color: string }>`
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
`;

const BarLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const SentimentChart: React.FC<SentimentChartProps> = ({
  data,
  showLegend = true,
  height = 300,
  className,
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer className={className}>
        <EmptyState>No sentiment data available</EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader>
        <ChartTitle>Sentiment Analysis</ChartTitle>
        {showLegend && (
          <Legend>
            <LegendItem>
              <LegendColor color={({ theme }) => theme.colors.sentiment.positive} />
              <LegendLabel>Positive</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendColor color={({ theme }) => theme.colors.sentiment.negative} />
              <LegendLabel>Negative</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendColor color={({ theme }) => theme.colors.sentiment.neutral} />
              <LegendLabel>Neutral</LegendLabel>
            </LegendItem>
            <LegendItem>
              <LegendColor color={({ theme }) => theme.colors.sentiment.mixed} />
              <LegendLabel>Mixed</LegendLabel>
            </LegendItem>
          </Legend>
        )}
      </ChartHeader>

      <ChartContent height={height}>
        {data.map((item) => (
          <BarGroup key={item.id}>
            <BarsContainer>
              <Bar
                color={({ theme }) => theme.colors.sentiment.positive}
                initial={{ height: 0 }}
                animate={{ height: `${item.positive * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <Bar
                color={({ theme }) => theme.colors.sentiment.negative}
                initial={{ height: 0 }}
                animate={{ height: `${item.negative * 100}%`, y: `-${item.positive * 100}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ transform: `translateY(-${item.positive * 100}%)` }}
              />
              <Bar
                color={({ theme }) => theme.colors.sentiment.neutral}
                initial={{ height: 0 }}
                animate={{ 
                  height: `${item.neutral * 100}%`, 
                  y: `-${(item.positive + item.negative) * 100}%` 
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transform: `translateY(-${(item.positive + item.negative) * 100}%)` }}
              />
              {item.mixed !== undefined && (
                <Bar
                  color={({ theme }) => theme.colors.sentiment.mixed}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${item.mixed * 100}%`, 
                    y: `-${(item.positive + item.negative + item.neutral) * 100}%` 
                  }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ 
                    transform: `translateY(-${(item.positive + item.negative + item.neutral) * 100}%)` 
                  }}
                />
              )}
            </BarsContainer>
            <BarLabel>{item.label}</BarLabel>
          </BarGroup>
        ))}
      </ChartContent>
    </ChartContainer>
  );
};

export default SentimentChart;