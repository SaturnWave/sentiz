import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VideoBackground from '../animations/VideoBackground';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

interface AnalysisTemplateProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`;

const AnalysisTemplate: React.FC<AnalysisTemplateProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={30} />
      <Navbar />
      
      <MainContent>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </Title>
          
          {subtitle && (
            <Subtitle
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </Subtitle>
          )}
        </Header>
        
        {children}
      </MainContent>
      
      <Footer />
    </PageContainer>
  );
};

export default AnalysisTemplate;