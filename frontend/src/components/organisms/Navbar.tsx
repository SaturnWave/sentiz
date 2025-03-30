import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
  className?: string;
}

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.navigation};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.light};
  }
`;

const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1;
`;

const LogoSubtitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
  
  &:focus {
    outline: none;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${({ active, theme }) => (active ? theme.colors.primary.main : theme.colors.text.primary)};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeights.bold : theme.typography.fontWeights.medium
  };
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  position: relative;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary.main};
    transform: scaleX(${({ active }) => (active ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary.contrastText};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.3);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.card};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: ${({ theme }) => theme.zIndices.navigation - 1};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MobileNavLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${({ active, theme }) => (active ? theme.colors.primary.main : theme.colors.text.primary)};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeights.bold : theme.typography.fontWeights.medium
  };
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const MobileLogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  color: ${({ theme }) => theme.colors.primary.main};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }
`;

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userName = '',
  onLogout,
  className,
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const getUserInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <NavContainer className={className}>
      <Logo to="/">
        <LogoText>
          CloudML
          <LogoSubtitle>Text Analysis</LogoSubtitle>
        </LogoText>
      </Logo>
      
      {isAuthenticated && (
        <>
          <NavLinks>
            <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
              Dashboard
            </NavLink>
            <NavLink to="/analysis" active={location.pathname === '/analysis'}>
              Text Analysis
            </NavLink>
            <NavLink to="/batch" active={location.pathname === '/batch'}>
              Batch Processing
            </NavLink>
            <NavLink to="/tts" active={location.pathname === '/tts'}>
              Text to Speech
            </NavLink>
            <NavLink to="/history" active={location.pathname === '/history'}>
              History
            </NavLink>
          </NavLinks>
          
          <UserSection>
            <UserInfo>
              <UserName>Hi, {userName}</UserName>
              <UserAvatar>{getUserInitials(userName)}</UserAvatar>
            </UserInfo>
            <LogoutButton onClick={onLogout}>Logout</LogoutButton>
            <MobileMenuButton onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </UserSection>
          
          <AnimatePresence>
            {isMobileMenuOpen && (
              <MobileMenu
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MobileNavLink 
                  to="/dashboard" 
                  active={location.pathname === '/dashboard'}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink 
                  to="/analysis" 
                  active={location.pathname === '/analysis'}
                  onClick={closeMobileMenu}
                >
                  Text Analysis
                </MobileNavLink>
                <MobileNavLink 
                  to="/batch" 
                  active={location.pathname === '/batch'}
                  onClick={closeMobileMenu}
                >
                  Batch Processing
                </MobileNavLink>
                <MobileNavLink 
                  to="/tts" 
                  active={location.pathname === '/tts'}
                  onClick={closeMobileMenu}
                >
                  Text to Speech
                </MobileNavLink>
                <MobileNavLink 
                  to="/history" 
                  active={location.pathname === '/history'}
                  onClick={closeMobileMenu}
                >
                  History
                </MobileNavLink>
                <MobileLogoutButton onClick={onLogout}>
                  Logout
                </MobileLogoutButton>
              </MobileMenu>
            )}
          </AnimatePresence>
        </>
      )}
      
      {!isAuthenticated && (
        <NavLinks>
          <NavLink to="/login" active={location.pathname === '/login'}>
            Login
          </NavLink>
          <NavLink to="/register" active={location.pathname === '/register'}>
            Register
          </NavLink>
        </NavLinks>
      )}
    </NavContainer>
  );
};

export default Navbar;