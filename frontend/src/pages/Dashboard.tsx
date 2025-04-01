import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentAnalysis, selectAnalysisHistory } from '../features/analysis/slices/analysisSlice';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import { AnalysisResult, SentimentType } from '../types/models';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentActivitySection = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RecentItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecentItem = styled(Card)`
  cursor: pointer;
`;

const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ItemSentiment = styled.span<{ sentiment: string }>`
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
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TextSample = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ActionsSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recentAnalyses = useSelector(selectAnalysisHistory) as unknown as AnalysisResult[];
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    positiveCount: 0,
    negativeCount: 0,
  });
  
  useEffect(() => {
    dispatch(fetchRecentAnalysis(5) as any);
  }, [dispatch]);
  
  useEffect(() => {
    if (recentAnalyses && recentAnalyses.length > 0) {
      const positiveCount = recentAnalyses.filter(item => item.sentiment === 'POSITIVE').length;
      const negativeCount = recentAnalyses.filter(item => item.sentiment === 'NEGATIVE').length;
      
      setStats({
        totalAnalyses: recentAnalyses.length,
        positiveCount,
        negativeCount,
      });
    }
  }, [recentAnalyses]);
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const formatSentiment = (sentiment: SentimentType) => {
    return sentiment.charAt(0) + sentiment.slice(1).toLowerCase();
  };
  
  const handleAnalysisClick = (analysis: AnalysisResult) => {
    navigate(`/analysis/${analysis.analysis_id}`);
  };
  
  return (
    <DashboardContainer>
      <WelcomeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Welcome to SentimentScope AI</Title>
        <Subtitle>
          Analyze text sentiment, extract key phrases, and gain valuable insights from your content.
        </Subtitle>
      </WelcomeSection>
      
      <StatsGrid>
        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatValue>{stats.totalAnalyses}</StatValue>
          <StatLabel>Total Analyses</StatLabel>
        </StatCard>
        
        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatValue>{stats.positiveCount}</StatValue>
          <StatLabel>Positive Results</StatLabel>
        </StatCard>
        
        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatValue>{stats.negativeCount}</StatValue>
          <StatLabel>Negative Results</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <RecentActivitySection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SectionTitle>Recent Analyses</SectionTitle>
        
        {recentAnalyses && recentAnalyses.length > 0 ? (
          <RecentItemsGrid>
            {recentAnalyses.map((analysis) => (
              <RecentItem
                key={analysis.analysis_id}
                onClick={() => handleAnalysisClick(analysis)}
                elevation="low"
                variant="default"
                animate={false}
              >
                <ItemTitle>Analysis #{analysis.id.slice(0, 8)}</ItemTitle>
                <ItemSentiment sentiment={analysis.sentiment}>
                  {formatSentiment(analysis.sentiment)}
                </ItemSentiment>
                <TextSample>
                  "{analysis.text_sample || analysis.text.slice(0, 100)}..."
                </TextSample>
                <ItemMeta>
                  <span>Source: {analysis.source}</span>
                  <span>{formatTimestamp(analysis.timestamp)}</span>
                </ItemMeta>
              </RecentItem>
            ))}
          </RecentItemsGrid>
        ) : (
          <Card>
            <p>No recent analyses found. Start by analyzing some text!</p>
          </Card>
        )}
      </RecentActivitySection>
      
      <ActionsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          variant="primary"
          size="large"
          onClick={() => navigate('/analyze')}
        >
          New Analysis
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/history')}
        >
          View All Results
        </Button>
        
        <Button
          variant="secondary"
          size="large"
          onClick={() => navigate('/batch')}
        >
          Batch Analysis
        </Button>
      </ActionsSection>
    </DashboardContainer>
  );
};

export default Dashboard;