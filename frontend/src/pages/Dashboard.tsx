import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import SentimentGauge from '../components/visualizations/SentimentGauge';
import { RootState } from '../store';
import { fetchRecentAnalyses } from '../features/history/slices/historySlice';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const ActionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 300px;
  justify-content: space-between;
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recentAnalyses, totalAnalyses } = useSelector((state: RootState) => state.history);
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    dispatch(fetchRecentAnalyses());
  }, [dispatch]);
  
  // Calculate average sentiment
  const averageSentiment = recentAnalyses.length > 0
    ? Math.round(recentAnalyses.reduce((sum, analysis) => {
        return sum + (analysis.sentimentScores.Positive * 100);
      }, 0) / recentAnalyses.length)
    : 0;
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={30} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Social Media Sentiment Analyzer
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Monitor and analyze sentiment trends across your social media channels
        </Subtitle>
      </Header>
      
      <StatsContainer>
        <StatCard title="Total Analyses">
          <StatValue>{totalAnalyses}</StatValue>
          <StatLabel>Analyses performed</StatLabel>
        </StatCard>
        
        <StatCard title="Average Sentiment">
          <StatValue>{averageSentiment}%</StatValue>
          <StatLabel>Positive sentiment</StatLabel>
        </StatCard>
        
        <StatCard title="Sources">
          <StatValue>4</StatValue>
          <StatLabel>Social platforms</StatLabel>
        </StatCard>
        
        <StatCard title="Text Analyzed">
          <StatValue>12.4K</StatValue>
          <StatLabel>Words processed</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <Grid>
        <ActionCard 
          title="New Analysis" 
          variant="gradient"
          elevation="high"
        >
          <CardIcon>📊</CardIcon>
          <CardText>
            Analyze the sentiment of social media posts, comments, reviews, or any text content.
          </CardText>
          <Button 
            onClick={() => navigate('/analyze')}
            size="large"
            fullWidth
          >
            Start New Analysis
          </Button>
        </ActionCard>
        
        <ActionCard 
          title="Batch Processing" 
          variant="gradient"
          elevation="high"
        >
          <CardIcon>📁</CardIcon>
          <CardText>
            Upload a CSV file with multiple texts to analyze them all at once.
          </CardText>
          <Button 
            onClick={() => navigate('/batch')}
            size="large"
            variant="outlined"
            fullWidth
          >
            Upload Batch File
          </Button>
        </ActionCard>
        
        <ActionCard 
          title="Analysis History" 
          variant="gradient"
          elevation="high"
        >
          <CardIcon>📈</CardIcon>
          <CardText>
            View your past analyses, track sentiment trends, and export reports.
          </CardText>
          <Button 
            onClick={() => navigate('/history')}
            size="large"
            variant="outlined"
            fullWidth
          >
            View History
          </Button>
        </ActionCard>
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;