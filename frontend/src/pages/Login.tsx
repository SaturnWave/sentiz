import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import { login, clearError } from '../features/auth/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { FEATURES } from '../config/features';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 450px;
`;

const Title = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled(motion.div)`
  color: #f44336;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: none;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GuestModeButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, isLoading, error, needsConfirmation, userToConfirm } = useSelector(
    (state: RootState) => state.auth
  );
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const { from } = (location.state as { from?: string }) || { from: '/dashboard' };
      navigate(from, { replace: true });
    }
    
    // Redirect to confirmation if needed
    if (needsConfirmation && userToConfirm) {
      navigate('/register', { 
        state: { 
          needsConfirmation: true, 
          username: userToConfirm 
        } 
      });
    }
    
    // Clear any errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, location, needsConfirmation, userToConfirm, dispatch]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };
  
  const handleGuestMode = () => {
    // In a real app, this would use a shared guest account
    // For this example, we'll simulate a successful login
    // by navigating directly to the dashboard
    navigate('/dashboard');
  };
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={20} />
      
      <LoginCard title="" variant="frosted" elevation="high">
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Social Media Sentiment Analyzer
        </Title>
        
        <Form onSubmit={handleSubmit}>
          <FormField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          
          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          
          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
          
          <ButtonContainer>
            <Button type="submit" fullWidth size="large" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </ButtonContainer>
          
          {FEATURES.GUEST_MODE && (
            <GuestModeButton
              variant="outlined"
              fullWidth
              onClick={handleGuestMode}
              disabled={isLoading}
            >
              Continue as Guest
            </GuestModeButton>
          )}
        </Form>
        
        <StyledLink to="/register">Don't have an account? Sign up</StyledLink>
      </LoginCard>
    </PageContainer>
  );
};

export default Login;