// Simple analytics tracking service
// In a production environment, this would connect to something like Google Analytics or similar

// Event types for tracking
export enum EventType {
    PAGE_VIEW = 'page_view',
    SENTIMENT_ANALYSIS = 'sentiment_analysis',
    TEXT_TO_SPEECH = 'text_to_speech',
    BATCH_UPLOAD = 'batch_upload',
    USER_LOGIN = 'user_login',
    USER_REGISTER = 'user_register',
    FEATURE_USED = 'feature_used',
    ERROR = 'error',
  }
  
  // Interface for event data
  interface EventData {
    [key: string]: any;
  }
  
  // Analytics service
  export const analyticsService = {
    /**
     * Track a user event
     * @param eventType The type of event to track
     * @param data Additional data to include with the event
     */
    trackEvent: (eventType: EventType, data: EventData = {}): void => {
      // In development, just log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventType, data);
        return;
      }
      
      // In production, this would send data to analytics service
      // Example: send to Google Analytics, Mixpanel, etc.
      try {
        // Placeholder for production analytics code
        
        // Add timestamp
        const eventData = {
          ...data,
          timestamp: new Date().toISOString(),
          eventType,
        };
        
        // Log to console for now
        console.log('[Analytics Event]', eventData);
        
        // Here would be code to send to analytics service
        // Example: window.gtag('event', eventType, eventData);
      } catch (error) {
        // Silently fail so it doesn't break the application
        console.error('[Analytics Error]', error);
      }
    },
    
    /**
     * Track a page view
     * @param pageName The name of the page
     * @param path The URL path
     */
    trackPageView: (pageName: string, path: string): void => {
      analyticsService.trackEvent(EventType.PAGE_VIEW, { pageName, path });
    },
    
    /**
     * Track a sentiment analysis
     * @param textLength Length of the analyzed text
     * @param source Source of the text (twitter, facebook, direct, etc.)
     * @param sentiment The detected sentiment
     */
    trackSentimentAnalysis: (textLength: number, source: string, sentiment: string): void => {
      analyticsService.trackEvent(EventType.SENTIMENT_ANALYSIS, {
        textLength,
        source,
        sentiment,
      });
    },
    
    /**
     * Track a text-to-speech conversion
     * @param textLength Length of the text converted to speech
     * @param voice Voice used for TTS
     */
    trackTextToSpeech: (textLength: number, voice: string): void => {
      analyticsService.trackEvent(EventType.TEXT_TO_SPEECH, {
        textLength,
        voice,
      });
    },
    
    /**
     * Track a batch upload
     * @param fileSize Size of the uploaded file in bytes
     * @param recordCount Number of records in the batch
     */
    trackBatchUpload: (fileSize: number, recordCount: number): void => {
      analyticsService.trackEvent(EventType.BATCH_UPLOAD, {
        fileSize,
        recordCount,
      });
    },
    
    /**
     * Track a feature used
     * @param featureName Name of the feature used
     * @param details Additional details
     */
    trackFeatureUsed: (featureName: string, details: Record<string, any> = {}): void => {
      analyticsService.trackEvent(EventType.FEATURE_USED, {
        featureName,
        ...details,
      });
    },
    
    /**
     * Track an error
     * @param errorMessage Error message
     * @param errorCode Error code
     * @param details Additional details
     */
    trackError: (errorMessage: string, errorCode?: string, details: Record<string, any> = {}): void => {
      analyticsService.trackEvent(EventType.ERROR, {
        errorMessage,
        errorCode,
        ...details,
      });
    },
  };