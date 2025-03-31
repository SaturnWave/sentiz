import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { toggleSidebar } from '../../features/ui/slices/uiSlice';
import { logout } from '../../features/auth/slices/authSlice';
import { NAV_ITEMS } from '../../routes/routes';
import Button from '../atoms/Button';

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndices.navigation};
  backdrop-filter: blur(10px);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const LogoIcon = styled.span`
  font-size: 1.5rem;
  margin-right: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary.main : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ isActive }) => (isActive ? 1 : 0)});
    height: 2px;
    width: 60%;
    background-color: ${({ theme }) => theme.colors.primary.main};
    transition: transform 0.2s ease;
  }
  
  &:hover::after {
    transform: translateX(-50%) scaleX(1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div<{ initials: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.secondary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary.contrastText};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary.dark};
  }
`;

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 200px;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: hidden;
`;

const UserMenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  
  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user || !user.username) return '?';
    
    const parts = user.username.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <NavbarContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MobileMenuButton onClick={handleSidebarToggle}>
          ☰
        </MobileMenuButton>
        
        <Logo to="/dashboard">
          <LogoIcon>📊</LogoIcon>
          <span>SentimentScope</span>
        </Logo>
      </div>
      
      <NavLinks>
        {NAV_ITEMS.filter(item => item.showInNav).map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            isActive={location.pathname === item.path}
          >
            {item.navLabel || item.title}
          </NavLink>
        ))}
      </NavLinks>
      
      <UserSection>
        {isAuthenticated ? (
          <>
            <UserAvatar 
              initials={getUserInitials()}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {getUserInitials()}
            </UserAvatar>
            
            {isUserMenuOpen && (
              <UserMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <UserMenuItem as={Link} to="/settings">
                  Settings
                </UserMenuItem>
                <UserMenuItem onClick={handleLogout}>
                  Logout
                </UserMenuItem>
              </UserMenu>
            )}
          </>
        ) : (
          <>
            <Button 
              as={Link} 
              to="/login"
              variant="outlined"
              size="small"
            >
              Login
            </Button>
            <Button 
              as={Link} 
              to="/register"
              size="small"
            >
              Register
            </Button>
          </>
        )}
      </UserSection>
    </NavbarContainer>
  );
};

export default Navbar;