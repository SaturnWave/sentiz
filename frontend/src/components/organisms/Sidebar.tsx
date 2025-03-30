import React from 'react';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ isCollapsed }) => (isCollapsed ? '64px' : '240px')};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.navigation};
  overflow-x: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(${({ isCollapsed }) => (isCollapsed ? '-100%' : '0')});
    width: 240px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  overflow: hidden;
  white-space: nowrap;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  background-color: rgba(100, 255, 218, 0.1);
  color: ${({ theme }) => theme.colors.primary.main};
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 24px;
  height: 24px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: rotate(180deg);
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.div<{ isCollapsed: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ theme }) => theme.spacing.sm};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  height: ${({ isCollapsed }) => (isCollapsed ? 0 : 'auto')};
`;

const NavLink = styled(RouterNavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme, isCollapsed }) => 
    isCollapsed 
      ? theme.spacing.sm
      : `${theme.spacing.sm} ${theme.spacing.md}`
  };
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  transition: background-color 0.2s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
  
  &.active {
    background-color: rgba(100, 255, 218, 0.1);
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: ${({ theme }) => theme.colors.primary.main};
    }
  }
`;

const LinkIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const LinkText = styled.div<{ isCollapsed: boolean }>`
  white-space: nowrap;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterText = styled.div<{ isCollapsed: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  white-space: nowrap;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

// Icons as SVG components for simplicity
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const AnalysisIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4V16H20V4Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 16L8 12L12 16L16 8L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 20H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BatchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M17 7V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V7M17 7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TTSIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C9.79086 15 8 13.2091 8 11V5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V11C16 13.2091 14.2091 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19V19.01M12 15C12 12 15 12 15 9.5C15 7.5 13.5 6 12 6C10.5 6 9.5 7 9 8M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FeedbackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8H17M7 12H11M3 20.2895V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15C21 16.1046 20.1046 17 19 17H7.96125C7.35368 17 6.77906 17.2762 6.39951 17.7506L4.06852 20.6643C3.71421 21.1072 3 20.8567 3 20.2895Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  className,
}) => {
  return (
    <SidebarContainer isCollapsed={isCollapsed} className={className}>
      <SidebarHeader>
        <LogoContainer isCollapsed={isCollapsed}>
          <LogoIcon>C</LogoIcon>
          <LogoText>
            CloudML
            <LogoSubtitle>Text Analysis</LogoSubtitle>
          </LogoText>
        </LogoContainer>
        <CollapseButton onClick={onToggleCollapse} aria-label="Toggle sidebar">
          <ChevronLeft />
        </CollapseButton>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSection>
          <SectionTitle isCollapsed={isCollapsed}>Main</SectionTitle>
          <NavLink to="/dashboard" isCollapsed={isCollapsed}>
            <LinkIcon><DashboardIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Dashboard</LinkText>
          </NavLink>
          <NavLink to="/analysis" isCollapsed={isCollapsed}>
            <LinkIcon><AnalysisIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Text Analysis</LinkText>
          </NavLink>
          <NavLink to="/batch" isCollapsed={isCollapsed}>
            <LinkIcon><BatchIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Batch Processing</LinkText>
          </NavLink>
          <NavLink to="/tts" isCollapsed={isCollapsed}>
            <LinkIcon><TTSIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Text to Speech</LinkText>
          </NavLink>
          <NavLink to="/history" isCollapsed={isCollapsed}>
            <LinkIcon><HistoryIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>History</LinkText>
          </NavLink>
        </SidebarSection>
        
        <SidebarSection>
          <SectionTitle isCollapsed={isCollapsed}>Settings</SectionTitle>
          <NavLink to="/settings" isCollapsed={isCollapsed}>
            <LinkIcon><SettingsIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Settings</LinkText>
          </NavLink>
          <NavLink to="/help" isCollapsed={isCollapsed}>
            <LinkIcon><HelpIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Help</LinkText>
          </NavLink>
          <NavLink to="/feedback" isCollapsed={isCollapsed}>
            <LinkIcon><FeedbackIcon /></LinkIcon>
            <LinkText isCollapsed={isCollapsed}>Feedback</LinkText>
          </NavLink>
        </SidebarSection>
      </SidebarContent>
      
      <SidebarFooter>
        <FooterText isCollapsed={isCollapsed}>
          © {new Date().getFullYear()} CloudML
        </FooterText>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;