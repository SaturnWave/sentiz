// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_ENDPOINT || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/api',
    ENDPOINTS: {
      ANALYZE: '/analyze',
      HISTORY: '/history',
      HISTORY_SUMMARY: '/history/summary',
      BATCH_UPLOAD: '/batch/upload',
      BATCH_STATUS: '/batch/status',
      BATCH_RESULTS: '/batch/results',
      BATCH_PRESIGN: '/batch/presign',
      TTS: '/tts',
      LOGIN: '/login',
      REGISTER: '/register',
      CONFIRM: '/confirm',
    },
    TIMEOUT: 30000, // 30 seconds
  };
  
  // Response status codes
  export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  };