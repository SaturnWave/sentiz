import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const LogoIcon = styled.span`
  font-size: 1.25rem;
  margin-right: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const Copyright = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo to="/dashboard">
            <LogoIcon>📊</LogoIcon>
            <span>SentimentScope</span>
          </Logo>
          <Copyright>
            © {currentYear} Social Media Sentiment Analyzer
          </Copyright>
        </FooterSection>
        
        <NavLinks>
          <NavLink to={ROUTES.DASHBOARD.path}>Dashboard</NavLink>
          <NavLink to={ROUTES.ANALYSIS.path}>Analysis</NavLink>
          <NavLink to={ROUTES.BATCH.path}>Batch Processing</NavLink>
          <NavLink to={ROUTES.HISTORY.path}>History</NavLink>
          <NavLink to={ROUTES.SETTINGS.path}>Settings</NavLink>
          <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
            API Docs
          </ExternalLink>
          <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
            Support
          </ExternalLink>
        </NavLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;