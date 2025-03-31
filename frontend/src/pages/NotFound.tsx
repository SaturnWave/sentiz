import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VideoBackground from '../components/animations/VideoBackground';
import Button from '../components/atoms/Button';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 600px;
`;

const Title = styled(motion.h1)`
  font-size: 10rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
  line-height: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 6rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.lg};
`;

const Description = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={30} />
      
      <ContentWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </Title>
        
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Page Not Found
        </Subtitle>
        
        <Description
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </Description>
        
        <ButtonContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button as={Link} to="/dashboard" size="large">
            Go to Dashboard
          </Button>
          
          <Button as={Link} to="/analyze" variant="outlined" size="large">
            New Analysis
          </Button>
        </ButtonContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default NotFound;