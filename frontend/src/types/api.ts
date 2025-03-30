// API request and response types
import { AnalysisResult, BatchJob, SentimentScores, KeyPhrase, SentimentType } from './models';

// Auth API types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    userId: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  userToConfirm: string;
  success: boolean;
  message: string;
}

export interface ConfirmationRequest {
  username: string;
  confirmation_code: string;
}

export interface ConfirmationResponse {
  success: boolean;
  message: string;
}

// Analysis API types
export interface AnalysisRequest {
  text: string;
  source?: string;
  user_id?: string;
}

export interface AnalysisResponse extends AnalysisResult {}

export interface GetAnalysisRequest {
  analysis_id: string;
  user_id?: string;
}

// Batch processing API types
export interface BatchUploadRequest {
  filename: string;
  contentType: string;
  userId?: string;
}

export interface BatchUploadResponse {
  url: string;
  key: string;
  fields?: Record<string, string>;
  bucket: string;
}

export interface BatchStartRequest {
  jobId: string;
  s3Key: string;
  filename: string;
  userId?: string;
}

export interface BatchStartResponse {
  job: BatchJob;
  message: string;
}

export interface BatchStatusRequest {
  jobId: string;
  userId?: string;
}

export interface BatchStatusResponse {
  job: BatchJob;
}

export interface BatchResultsRequest {
  jobId: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface BatchResultsResponse {
  results: Array<{
    id: string;
    text: string;
    sentiment: SentimentType;
    sentiment_scores: SentimentScores;
    key_phrases: KeyPhrase[];
  }>;
  total: number;
  processed: number;
  job: BatchJob;
}

// Text-to-Speech API types
export interface TextToSpeechRequest {
  analysis_id: string;
  user_id?: string;
  voice?: string;
}

export interface TextToSpeechResponse {
  audio_url: string;
  expires_in?: number;
}

// History API types
export interface HistoryRequest {
  user_id?: string;
  limit?: number;
  lastKey?: string;
}

export interface HistoryResponse {
  items: AnalysisResult[];
  lastEvaluatedKey: string | null;
}

export interface HistorySummaryRequest {
  user_id?: string;
}

export interface HistorySummaryResponse {
  total_analyses: number;
  recent_analyses_preview: AnalysisResult[];
}

// Error response structure
export interface ErrorResponse {
  error: string;
  status?: number;
  details?: any;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}