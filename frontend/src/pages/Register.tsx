import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import { register, confirmSignUp, resendConfirmationCode, clearError } from '../features/auth/slices/authSlice';
import { AppDispatch, RootState } from '../store';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RegisterCard = styled(Card)`
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

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.light};
  }
`;

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, isLoading, error, needsConfirmation, userToConfirm } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  
  // Local validation errors
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Determine if we're in confirmation mode
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);
  
  // Initialize from location state (e.g., coming from login with needsConfirmation)
  useEffect(() => {
    const state = location.state as { needsConfirmation?: boolean; username?: string } | null;
    
    if (state?.needsConfirmation) {
      setIsConfirmationMode(true);
      if (state.username) {
        setUsername(state.username);
      }
    } else if (needsConfirmation) {
      setIsConfirmationMode(true);
      if (userToConfirm) {
        setUsername(userToConfirm);
      }
    }
    
    // Clear any errors when component mounts
    return () => {
      dispatch(clearError());
    };
  }, [location, needsConfirmation, userToConfirm, dispatch]);
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = (): boolean => {
    setValidationError(null);
    
    if (isConfirmationMode) {
      if (!username) {
        setValidationError('Username is required');
        return false;
      }
      if (!confirmationCode) {
        setValidationError('Confirmation code is required');
        return false;
      }
      return true;
    }
    
    if (!username) {
      setValidationError('Username is required');
      return false;
    }
    if (!email) {
      setValidationError('Email is required');
      return false;
    }
    if (!password) {
      setValidationError('Password is required');
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isConfirmationMode) {
      dispatch(confirmSignUp({ username, confirmationCode }));
    } else {
      dispatch(register({ username, email, password }));
    }
  };
  
  const handleResendCode = () => {
    if (username) {
      dispatch(resendConfirmationCode(username));
    } else {
      setValidationError('Username is required to resend code');
    }
  };
  
  const toggleMode = () => {
    setIsConfirmationMode(!isConfirmationMode);
    setValidationError(null);
  };
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={20} />
      
      <RegisterCard title="" variant="frosted" elevation="high">
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isConfirmationMode ? 'Confirm Registration' : 'Create Account'}
        </Title>
        
        <Form onSubmit={handleSubmit}>
          {isConfirmationMode ? (
            // Confirmation Form
            <>
              <FormField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={userToConfirm !== null}
              />
              
              <FormField
                label="Confirmation Code"
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Enter confirmation code from email"
                required
              />
              
              <ResendButton type="button" onClick={handleResendCode}>
                Resend confirmation code
              </ResendButton>
            </>
          ) : (
            // Registration Form
            <>
              <FormField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
              
              <FormField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              
              <FormField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              
              <FormField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </>
          )}
          
          {(validationError || error) && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {validationError || error}
            </ErrorMessage>
          )}
          
          <ButtonContainer>
            <Button type="submit" fullWidth size="large" disabled={isLoading}>
              {isLoading
                ? isConfirmationMode ? 'Confirming...' : 'Registering...'
                : isConfirmationMode ? 'Confirm' : 'Register'}
            </Button>
          </ButtonContainer>
        </Form>
        
        <StyledLink to="#" onClick={toggleMode}>
          {isConfirmationMode ? 'Need to register?' : 'Already have a code?'}
        </StyledLink>
        
        <StyledLink to="/login">Already have an account? Login</StyledLink>
      </RegisterCard>
    </PageContainer>
  );
};

export default Register;