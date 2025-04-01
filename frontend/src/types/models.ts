// Core types for the application

// Sentiment types
export type SentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

// Sentiment scores from AWS Comprehend
export interface SentimentScores {
  Positive: number;
  Negative: number;
  Neutral: number;
  Mixed: number;
}

// Key phrase from AWS Comprehend
export interface KeyPhrase {
  text: string;
  score: number;
}

// Analysis result
export interface AnalysisResult {
  id: string;
  text: string;
  text_sample?: string;
  sentiment: SentimentType;
  sentiment_scores: SentimentScores;
  key_phrases: string[];
  timestamp: string;
  analysis_id: string;
  source?: string;
}

// Batch job status
export type BatchJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Batch job model
export interface BatchJob {
  jobId: string;
  userId: string;
  status: BatchJobStatus;
  fileName: string;
  timestamp: string;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  s3InputPath: string;
  s3ResultPath?: string;
  errorMessage?: string;
}

// Batch job result
export interface BatchResult {
  id: string | number;
  text: string;
  sentiment: SentimentType;
  sentimentScores: SentimentScores;
  keyPhrases: KeyPhrase[];
  source?: string;
  timestamp: string;
}

// Batch analysis job
export interface BatchAnalysisJob {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  filename: string;
  created_at: string;
  completed_at?: string;
  records_processed?: number;
  total_records?: number;
  result_url?: string;
}

// User profile
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
  settings?: UserSettings;
}

// User settings
export interface UserSettings {
  darkMode: boolean;
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  videoBackground: boolean;
  videoType: 'particles' | 'waves' | 'gradient' | 'none';
  videoIntensity: number;
  textToSpeechVoice: string;
}

// User
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
}

// Theme-related types
export interface ThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  sentiment: {
    positive: string;
    negative: string;
    neutral: string;
    mixed: string;
  };
}

// API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Error response
export interface ApiError {
  error: string;
  status: number;
  details?: any;
}

// Analysis request type
export interface AnalysisRequest {
  text: string;
  source?: string;
  user_id?: string;
}

// Analysis response type extends the AnalysisResult for API consistency
export type AnalysisResponse = AnalysisResult;

// Batch upload response
export interface BatchUploadResponse {
  jobId: string;
  s3Key: string;
  presignedUrl: string;
}

// Batch status response
export interface BatchStatusResponse {
  job: BatchJob;
}