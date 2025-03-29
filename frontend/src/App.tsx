import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimationProvider } from './contexts/AnimationContext';
import { VideoProvider } from './contexts/VideoContext';
import AppRoutes from './routes';
import { GlobalStyle } from './styles/globalStyles';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AnimationProvider>
            <VideoProvider>
              <GlobalStyle />
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