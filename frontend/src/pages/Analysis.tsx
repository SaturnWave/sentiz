import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import VideoBackground from '../components/animations/VideoBackground';
import AnalysisForm from '../components/organisms/AnalysisForm';
import ResultsVisualization from '../components/organisms/ResultsVisualization';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import { analyzeSentiment, clearResult, setText, setSource } from '../features/analysis/slices/analysisSlice';
import { addToHistory } from '../features/history/slices/historySlice';
import { AppDispatch, RootState } from '../store';
import { FEATURES } from '../config/features';
import { analyticsService, EventType } from '../services/analytics';

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
  max-width: 700px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ResultsCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Analysis: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentText, source, isAnalyzing, result, error } = useSelector(
    (state: RootState) => state.analysis
  );
  
  const [textToSpeechPlaying, setTextToSpeechPlaying] = useState(false);
  
  // Handle clearing results and resetting form
  const handleReset = () => {
    dispatch(clearResult());
    dispatch(setText(''));
  };
  
  // Handle text input change
  const handleTextChange = (text: string) => {
    dispatch(setText(text));
  };
  
  // Handle source change
  const handleSourceChange = (newSource: string) => {
    dispatch(setSource(newSource));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!currentText.trim()) return;
    
    dispatch(analyzeSentiment({ text: currentText, source }))
      .unwrap()
      .then((result) => {
        // Track successful analysis
        analyticsService.trackSentimentAnalysis(
          currentText.length,
          source,
          result.sentiment
        );
        
        // Add to history
        dispatch(addToHistory(result));
      })
      .catch((error) => {
        // Track error
        analyticsService.trackError(
          'Analysis failed',
          'ANALYSIS_ERROR',
          { textLength: currentText.length, source }
        );
      });
  };
  
  // Handle text-to-speech
  const handleTextToSpeech = () => {
    if (!result) return;
    
    // Toggle playing state
    setTextToSpeechPlaying(!textToSpeechPlaying);
    
    // Track TTS usage
    analyticsService.trackFeatureUsed('text_to_speech', {
      textLength: currentText.length,
      sentiment: result.sentiment,
    });
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      setTextToSpeechPlaying(false);
    };
  }, []);
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={30} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sentiment Analysis
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Analyze text from social media posts, comments, or reviews to determine sentiment and extract key phrases.
        </Subtitle>
      </Header>
      
      <ContentContainer>
        <FormCard 
          title="Text Input" 
          variant="gradient"
          elevation="medium"
        >
          <AnalysisForm
            text={currentText}
            source={source}
            onTextChange={handleTextChange}
            onSourceChange={handleSourceChange}
            onSubmit={handleSubmit}
            isLoading={isAnalyzing}
            error={error}
          />
        </FormCard>
        
        {result ? (
          <ResultsCard
            title="Analysis Results"
            variant="gradient"
            elevation="medium"
          >
            <ResultsVisualization 
              result={result}
              isTextToSpeechPlaying={textToSpeechPlaying}
            />
            
            <ButtonContainer>
              {FEATURES.TEXT_TO_SPEECH && (
                <Button 
                  onClick={handleTextToSpeech}
                  variant={textToSpeechPlaying ? 'secondary' : 'primary'}
                >
                  {textToSpeechPlaying ? 'Stop Audio' : 'Text to Speech'}
                </Button>
              )}
              
              <Button 
                onClick={handleReset}
                variant="outlined"
              >
                New Analysis
              </Button>
            </ButtonContainer>
          </ResultsCard>
        ) : (
          <ResultsCard
            title="Results Preview"
            variant="gradient"
            elevation="medium"
          >
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Submit your text to see analysis results here.</p>
              <p>The system will analyze sentiment, extract key phrases, and provide visualizations.</p>
            </div>
          </ResultsCard>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default Analysis;