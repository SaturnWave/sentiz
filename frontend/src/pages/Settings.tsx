import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import { logout } from '../features/auth/slices/authSlice';
import { toggleDarkMode } from '../features/ui/slices/uiSlice';
import { useVideo } from '../contexts/VideoContext';
import { useAnimation } from '../contexts/AnimationContext';
import { analyticsService, EventType } from '../services/analytics';
import { AppDispatch, RootState } from '../store';

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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 3fr 2fr;
  }
`;

const SettingCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SettingSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SettingDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span<{ isChecked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ isChecked, theme }) => 
    isChecked ? theme.colors.primary.main : 'rgba(255, 255, 255, 0.2)'};
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ isChecked }) => isChecked ? 'translateX(30px)' : 'translateX(0)'};
  }
`;

const UserInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfoLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const UserInfoValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const ButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SelectInput = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  // Context hooks
  const { isEnabled: videoEnabled, toggleVideo, videoType, setVideoType, intensity, setIntensity } = useVideo();
  const { enableAnimations, setEnableAnimations, animationSpeed, setAnimationSpeed } = useAnimation();
  
  // Local state for settings that might need confirmation
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  // Handle toggle settings
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
    analyticsService.trackFeatureUsed('theme_toggle');
  };
  
  const handleToggleAnimations = () => {
    setEnableAnimations(!enableAnimations);
    analyticsService.trackFeatureUsed('animations_toggle');
  };
  
  const handleToggleVideo = () => {
    toggleVideo();
    analyticsService.trackFeatureUsed('video_background_toggle');
  };
  
  // Handle animation speed change
  const handleAnimationSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationSpeed(e.target.value as 'slow' | 'normal' | 'fast');
    analyticsService.trackFeatureUsed('animation_speed_change', { speed: e.target.value });
  };
  
  // Handle video type change
  const handleVideoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideoType(e.target.value as 'particles' | 'waves' | 'gradient' | 'none');
    analyticsService.trackFeatureUsed('video_type_change', { type: e.target.value });
  };
  
  // Handle intensity change
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntensity(Number(e.target.value));
    analyticsService.trackFeatureUsed('video_intensity_change', { intensity: e.target.value });
  };
  
  // Handle logout
  const handleLogout = () => {
    if (showConfirmLogout) {
      dispatch(logout());
      analyticsService.trackEvent(EventType.USER_LOGIN, { action: 'logout' });
    } else {
      setShowConfirmLogout(true);
    }
  };
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={20} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Settings
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Customize your experience with the Social Media Sentiment Analyzer.
        </Subtitle>
      </Header>
      
      <SettingsGrid>
        <SettingCard
          elevation="medium"
          variant="gradient"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CardTitle>Appearance</CardTitle>
          
          <SettingSection>
            <SectionTitle>Theme</SectionTitle>
            
            <SettingItem>
              <div>
                <SettingLabel>Dark Mode</SettingLabel>
                <SettingDescription>Use dark theme for the application</SettingDescription>
              </div>
              <Switch>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={handleToggleDarkMode}
                />
                <Slider isChecked={darkMode} />
              </Switch>
            </SettingItem>
          </SettingSection>
          
          <SettingSection>
            <SectionTitle>Animations</SectionTitle>
            
            <SettingItem>
              <div>
                <SettingLabel>Enable Animations</SettingLabel>
                <SettingDescription>Show animations throughout the app</SettingDescription>
              </div>
              <Switch>
                <input
                  type="checkbox"
                  checked={enableAnimations}
                  onChange={handleToggleAnimations}
                />
                <Slider isChecked={enableAnimations} />
              </Switch>
            </SettingItem>
            
            <SettingItem>
              <div>
                <SettingLabel>Animation Speed</SettingLabel>
                <SettingDescription>Adjust the speed of animations</SettingDescription>
              </div>
              <SelectInput
                value={animationSpeed}
                onChange={handleAnimationSpeedChange}
                disabled={!enableAnimations}
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </SelectInput>
            </SettingItem>
          </SettingSection>
          
          <SettingSection>
            <SectionTitle>Background Effects</SectionTitle>
            
            <SettingItem>
              <div>
                <SettingLabel>Enable Background</SettingLabel>
                <SettingDescription>Show animated background effects</SettingDescription>
              </div>
              <Switch>
                <input
                  type="checkbox"
                  checked={videoEnabled}
                  onChange={handleToggleVideo}
                />
                <Slider isChecked={videoEnabled} />
              </Switch>
            </SettingItem>
            
            <SettingItem>
              <div>
                <SettingLabel>Background Type</SettingLabel>
                <SettingDescription>Choose the style of background</SettingDescription>
              </div>
              <SelectInput
                value={videoType}
                onChange={handleVideoTypeChange}
                disabled={!videoEnabled}
              >
                <option value="particles">Particles</option>
                <option value="waves">Waves</option>
                <option value="gradient">Gradient</option>
              </SelectInput>
            </SettingItem>
            
            <SettingItem>
              <div>
                <SettingLabel>Intensity</SettingLabel>
                <SettingDescription>Adjust the intensity of background effects</SettingDescription>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={handleIntensityChange}
                  disabled={!videoEnabled}
                  style={{ width: '100px' }}
                />
                <span>{intensity}%</span>
              </div>
            </SettingItem>
          </SettingSection>
        </SettingCard>
        
        <SettingCard
          elevation="medium"
          variant="gradient"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardTitle>Account</CardTitle>
          
          {user ? (
            <>
              <SettingSection>
                <SectionTitle>User Information</SectionTitle>
                
                <UserInfoItem>
                  <UserInfoLabel>Username</UserInfoLabel>
                  <UserInfoValue>{user.username}</UserInfoValue>
                </UserInfoItem>
                
                <UserInfoItem>
                  <UserInfoLabel>Email</UserInfoLabel>
                  <UserInfoValue>{user.email}</UserInfoValue>
                </UserInfoItem>
                
                <UserInfoItem>
                  <UserInfoLabel>Account ID</UserInfoLabel>
                  <UserInfoValue>{user.userId}</UserInfoValue>
                </UserInfoItem>
              </SettingSection>
              
              <ButtonContainer>
                <Button
                  variant={showConfirmLogout ? 'secondary' : 'outlined'}
                  fullWidth
                  onClick={handleLogout}
                >
                  {showConfirmLogout ? 'Confirm Logout' : 'Logout'}
                </Button>
                
                {showConfirmLogout && (
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => setShowConfirmLogout(false)}
                    style={{ marginTop: '10px' }}
                  >
                    Cancel
                  </Button>
                )}
              </ButtonContainer>
            </>
          ) : (
            <div>
              <p>You are using the application in guest mode.</p>
              <ButtonContainer>
                <Button variant="primary" fullWidth onClick={() => window.location.href = '/login'}>
                  Login
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => window.location.href = '/register'}
                  style={{ marginTop: '10px' }}
                >
                  Create Account
                </Button>
              </ButtonContainer>
            </div>
          )}
        </SettingCard>
      </SettingsGrid>
    </PageContainer>
  );
};

export default Settings;