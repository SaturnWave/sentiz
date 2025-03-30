import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { store, persistor } from './store';
import AppRoutes from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimationProvider } from './contexts/AnimationContext';
import { VideoProvider } from './contexts/VideoContext';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './config/amplify';

// Configure Amplify
Amplify.configure(amplifyConfig);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AnimationProvider>
            <VideoProvider>
              <Router>
                <AppRoutes />
              </Router>
            </VideoProvider>
          </AnimationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;