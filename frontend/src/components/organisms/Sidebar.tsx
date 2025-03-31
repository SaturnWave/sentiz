import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setSidebarOpen } from '../../features/ui/slices/uiSlice';
import { NAV_ITEMS } from '../../routes/routes';

const SidebarContainer = styled(motion.aside)<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '250px' : '70px')};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.navigation};
  padding-top: 60px; // Space for navbar
  overflow-y: auto;
  transition: width 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    left: ${({ isOpen }) => (isOpen ? '0' : '-250px')};
    width: 250px;
    box-shadow: ${({ isOpen, theme }) => isOpen ? theme.shadows.lg : 'none'};
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
`;

const NavLinkItem = styled(Link)<{ isActive: boolean; isSidebarCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary.main : theme.colors.text.secondary};
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  ${({ isActive, theme }) => isActive && `
    background-color: rgba(100, 255, 218, 0.05);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: ${theme.colors.primary.main};
    }
  `}
`;

const NavIcon = styled.span`
  font-size: 1.5rem;
  width: 24px;
  text-align: center;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const NavText = styled(motion.span)`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 70px;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrastText};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Map route keys to icons (would be replaced with actual icons in a real app)
const ICON_MAP: Record<string, string> = {
  dashboard: '📊',
  analysis: '🔍',
  batch: '📁',
  history: '📅',
  settings: '⚙️',
  home: '🏠',
};

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isSidebarOpen } = useSelector((state: RootState) => state.ui);
  
  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!isSidebarOpen));
  };
  
  // Filter nav items that should show in nav
  const sidebarItems = NAV_ITEMS.filter(item => item.showInNav);
  
  return (
    <SidebarContainer
      isOpen={isSidebarOpen}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToggleButton onClick={toggleSidebar}>
        {isSidebarOpen ? '◀' : '▶'}
      </ToggleButton>
      
      <NavList>
        {sidebarItems.map((item) => (
          <NavItem key={item.path}>
            <NavLinkItem
              to={item.path}
              isActive={location.pathname === item.path}
              isSidebarCollapsed={!isSidebarOpen}
            >
              <NavIcon>{ICON_MAP[item.key] || '📋'}</NavIcon>
              <AnimatePresence>
                {isSidebarOpen && (
                  <NavText
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.navLabel || item.title}
                  </NavText>
                )}
              </AnimatePresence>
            </NavLinkItem>
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;