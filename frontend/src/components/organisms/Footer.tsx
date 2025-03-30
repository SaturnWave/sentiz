import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FooterSectionTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  &::after {
    content: '↗';
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    text-align: center;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer className={className}>
      <FooterContent>
        <FooterSection>
          <FooterSectionTitle>CloudML</FooterSectionTitle>
          <FooterText>
            Advanced cloud-based text analysis platform leveraging AWS
            services to provide intelligent insights from your text data.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Quick Links</FooterSectionTitle>
          <FooterLinkList>
            <FooterLinkItem>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/analysis">Text Analysis</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/batch">Batch Processing</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/tts">Text to Speech</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/history">History</FooterLink>
            </FooterLinkItem>
          </FooterLinkList>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Resources</FooterSectionTitle>
          <FooterLinkList>
            <FooterLinkItem>
              <FooterLink to="/help">Help Center</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/documentation">API Documentation</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <ExternalLink href="https://aws.amazon.com/comprehend/" target="_blank" rel="noopener noreferrer">
                AWS Comprehend
              </ExternalLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <ExternalLink href="https://aws.amazon.com/polly/" target="_blank" rel="noopener noreferrer">
                AWS Polly
              </ExternalLink>
            </FooterLinkItem>
          </FooterLinkList>
        </FooterSection>
        
        <FooterSection>
          <FooterSectionTitle>Contact</FooterSectionTitle>
          <ContactInfo>
            <FooterText>Feel free to reach out with any questions.</FooterText>
            <FooterText>Email: support@cloudml-example.com</FooterText>
            <FooterLink to="/contact">Contact Form</FooterLink>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
      
      <BottomBar>
        <div>© {currentYear} CloudML. All rights reserved.</div>
        
        <SocialLinks>
          <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.489C9.34 21.579 9.52 21.279 9.52 21.019C9.52 20.789 9.51 20.078 9.51 19.258C7 19.748 6.35 18.688 6.15 18.108C6.037 17.808 5.55 16.958 5.15 16.728C4.82 16.548 4.32 16.058 5.14 16.048C5.9 16.038 6.45 16.778 6.65 17.088C7.55 18.378 8.995 18.148 9.56 17.888C9.65 17.248 9.92 16.818 10.22 16.578C8.05 16.338 5.78 15.508 5.78 11.718C5.78 10.638 6.15 9.748 6.67 9.058C6.57 8.808 6.24 7.738 6.77 6.308C6.77 6.308 7.61 6.048 9.52 7.398C10.32 7.178 11.17 7.068 12.02 7.068C12.87 7.068 13.72 7.178 14.52 7.398C16.43 6.038 17.27 6.308 17.27 6.308C17.8 7.738 17.47 8.808 17.37 9.058C17.89 9.748 18.26 10.628 18.26 11.718C18.26 15.518 15.98 16.338 13.81 16.578C14.18 16.878 14.51 17.458 14.51 18.378C14.51 19.698 14.5 20.688 14.5 21.018C14.5 21.278 14.68 21.588 15.18 21.488C19.135 20.165 22 16.418 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
            </svg>
          </SocialLink>
          <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 3.00029C22.0424 3.67577 20.9821 4.1934 19.86 4.53029C19.2577 3.8378 18.4573 3.34698 17.567 3.12422C16.6767 2.90146 15.7395 2.95749 14.8821 3.28474C14.0247 3.612 13.2884 4.19469 12.773 4.95401C12.2575 5.71332 11.9877 6.61263 12 7.53029V8.53029C10.2426 8.57586 8.50127 8.18583 6.93101 7.39574C5.36074 6.60566 4.01032 5.43868 3 4.00029C3 4.00029 -1 13.0003 8 17.0003C5.94053 18.3983 3.48716 19.0992 1 19.0003C10 24.0003 21 19.0003 21 7.50029C20.9991 7.22174 20.9723 6.94388 20.92 6.67029C21.9406 5.66378 22.6608 4.39322 23 3.00029Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SocialLink>
          <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </SocialLink>
        </SocialLinks>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;