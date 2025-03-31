import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import { 
  getPresignedUrl, 
  startBatchJob, 
  getBatchJobStatus, 
  setUploadProgress,
  clearCurrentJob 
} from '../features/batch/slices/batchSlice';
import { apiService } from '../services/api';
import { analyticsService } from '../services/analytics';
import { AppDispatch, RootState } from '../store';
import { FEATURES } from '../config/features';

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
  max-width: 700px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const UploadCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StatusCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const UploadZone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${({ isDragging, theme }) => 
    isDragging ? theme.colors.primary.main : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ isDragging }) => 
    isDragging ? 'rgba(100, 255, 218, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background-color: rgba(100, 255, 218, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
`;

const FileName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: right;
`;

const ButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatusTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatusInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatusLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  background-color: ${({ status, theme }) => 
    status === 'COMPLETED' ? theme.colors.sentiment.positive :
    status === 'FAILED' ? theme.colors.sentiment.negative :
    status === 'PROCESSING' ? theme.colors.sentiment.mixed :
    theme.colors.sentiment.neutral
  };
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ResultsPreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm};
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }
  
  td {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.sentiment.negative};
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const Batch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    currentJob, 
    isUploading, 
    uploadProgress,
    isProcessing,
    error,
    presignedUrl 
  } = useSelector((state: RootState) => state.batch);
  
  // Local state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jobStatusInterval, setJobStatusInterval] = useState<NodeJS.Timeout | null>(null);
  const [resultsPreview, setResultsPreview] = useState<any[]>([]);
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        analyticsService.trackFeatureUsed('batch_file_selected', { 
          fileSize: file.size,
          fileType: file.type
        });
      }
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        analyticsService.trackFeatureUsed('batch_file_dropped', { 
          fileSize: file.size,
          fileType: file.type
        });
      }
    }
  };
  
  // Validate file type and size
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.includes('csv')) {
      alert('Please upload a CSV file');
      return false;
    }
    
    // Check file size
    if (file.size > FEATURES.MAX_FILE_SIZE) {
      alert(`File size exceeds the maximum limit of ${formatFileSize(FEATURES.MAX_FILE_SIZE)}`);
      return false;
    }
    
    return true;
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      // Get presigned URL
      const response = await dispatch(getPresignedUrl({
        fileName: selectedFile.name,
        contentType: selectedFile.type
      })).unwrap();
      
      if (response.url) {
        // Upload file to S3
        await apiService.uploadToS3(
          response.url,
          selectedFile,
          (progress) => dispatch(setUploadProgress(progress))
        );
        
        // Start batch job processing
        const jobId = response.key.split('/').pop()?.split('.')[0] || Date.now().toString();
        await dispatch(startBatchJob({
          jobId,
          s3Key: response.key,
          filename: selectedFile.name
        }));
        
        // Track successful upload
        analyticsService.trackBatchUpload(selectedFile.size, 0); // Record count unknown at this point
        
        // Clear selected file
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      analyticsService.trackError(
        'Batch upload failed', 
        'BATCH_UPLOAD_ERROR',
        { fileName: selectedFile.name, fileSize: selectedFile.size }
      );
    }
  };
  
  // Cancel upload
  const handleCancelUpload = () => {
    setSelectedFile(null);
  };
  
  // Format job status for display
  const formatJobStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };
  
  // Start polling for job status updates when a job is processing
  useEffect(() => {
    if (currentJob && currentJob.status === 'PROCESSING') {
      const interval = setInterval(() => {
        dispatch(getBatchJobStatus(currentJob.jobId));
      }, 3000); // Poll every 3 seconds
      
      setJobStatusInterval(interval);
    } else if (jobStatusInterval) {
      clearInterval(jobStatusInterval);
      setJobStatusInterval(null);
    }
    
    return () => {
      if (jobStatusInterval) {
        clearInterval(jobStatusInterval);
      }
    };
  }, [currentJob, dispatch]);
  
  // Load results preview when job is completed
  useEffect(() => {
    if (currentJob && currentJob.status === 'COMPLETED' && currentJob.s3ResultPath) {
      // This would typically fetch the first few results from the API
      // For this example, we'll generate some mock data
      const mockPreview = Array(5).fill(0).map((_, index) => ({
        id: index + 1,
        text: `Sample text ${index + 1}`,
        sentiment: ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'][Math.floor(Math.random() * 4)],
        score: Math.random()
      }));
      
      setResultsPreview(mockPreview);
    }
  }, [currentJob]);
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={30} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Batch Processing
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload CSV files containing multiple text entries for batch sentiment analysis.
        </Subtitle>
      </Header>
      
      <ContentContainer>
        <UploadCard
          title="Upload CSV File"
          variant="gradient"
          elevation="medium"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {!currentJob ? (
            <>
              <UploadZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <UploadIcon>📁</UploadIcon>
                <UploadText>
                  {selectedFile ? 'File selected' : 'Drop your CSV file here'}
                </UploadText>
                <UploadSubtext>
                  {selectedFile 
                    ? 'Click upload button below to begin processing' 
                    : 'or click to browse files'}
                </UploadSubtext>
                
                <HiddenInput
                  id="file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                />
                
                {selectedFile && (
                  <FileInfo>
                    <FileName>{selectedFile.name}</FileName>
                    <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                  </FileInfo>
                )}
              </UploadZone>
              
              {isUploading && (
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill progress={uploadProgress} />
                  </ProgressBar>
                  <ProgressText>{uploadProgress}% Uploaded</ProgressText>
                </ProgressContainer>
              )}
              
              {error && (
                <ErrorMessage>
                  Error: {error}
                </ErrorMessage>
              )}
              
              <ButtonContainer>
                {selectedFile && (
                  <>
                    <Button 
                      onClick={handleUpload} 
                      disabled={isUploading || isProcessing}
                      size="large"
                    >
                      {isUploading ? 'Uploading...' : 'Upload & Process'}
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      onClick={handleCancelUpload}
                      disabled={isUploading || isProcessing}
                      size="large"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </ButtonContainer>
            </>
          ) : (
            <div>
              <p>You have an active batch job in progress. View the status in the panel to the right.</p>
              <ButtonContainer>
                <Button 
                  variant="outlined" 
                  onClick={() => dispatch(clearCurrentJob())}
                  size="large"
                >
                  Start New Batch
                </Button>
              </ButtonContainer>
            </div>
          )}
        </UploadCard>
        
        <StatusCard
          title="Batch Status"
          variant="gradient"
          elevation="medium"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {currentJob ? (
            <>
              <StatusSection>
                <StatusTitle>Job Information</StatusTitle>
                <StatusInfo>
                  <StatusItem>
                    <StatusLabel>Job ID</StatusLabel>
                    <StatusValue>{currentJob.jobId}</StatusValue>
                  </StatusItem>
                  
                  <StatusItem>
                    <StatusLabel>Status</StatusLabel>
                    <StatusValue>
                      <StatusBadge status={currentJob.status}>
                        {formatJobStatus(currentJob.status)}
                      </StatusBadge>
                    </StatusValue>
                  </StatusItem>
                  
                  <StatusItem>
                    <StatusLabel>File Name</StatusLabel>
                    <StatusValue>{currentJob.fileName}</StatusValue>
                  </StatusItem>
                  
                  <StatusItem>
                    <StatusLabel>Total Records</StatusLabel>
                    <StatusValue>{currentJob.totalRecords}</StatusValue>
                  </StatusItem>
                  
                  <StatusItem>
                    <StatusLabel>Processed</StatusLabel>
                    <StatusValue>
                      {currentJob.processedRecords} / {currentJob.totalRecords}
                      {' '}
                      ({Math.round((currentJob.processedRecords / currentJob.totalRecords) * 100)}%)
                    </StatusValue>
                  </StatusItem>
                  
                  {currentJob.status === 'COMPLETED' && (
                    <>
                      <StatusItem>
                        <StatusLabel>Success</StatusLabel>
                        <StatusValue>{currentJob.successCount}</StatusValue>
                      </StatusItem>
                      
                      <StatusItem>
                        <StatusLabel>Errors</StatusLabel>
                        <StatusValue>{currentJob.errorCount}</StatusValue>
                      </StatusItem>
                    </>
                  )}
                  
                  {currentJob.status === 'FAILED' && currentJob.errorMessage && (
                    <StatusItem>
                      <StatusLabel>Error</StatusLabel>
                      <StatusValue>{currentJob.errorMessage}</StatusValue>
                    </StatusItem>
                  )}
                </StatusInfo>
              </StatusSection>
              
              {currentJob.status === 'COMPLETED' && resultsPreview.length > 0 && (
                <ResultsPreview>
                  <StatusTitle>Results Preview</StatusTitle>
                  <ResultsTable>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Text</th>
                        <th>Sentiment</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsPreview.map((result) => (
                        <tr key={result.id}>
                          <td>{result.id}</td>
                          <td>{result.text}</td>
                          <td>{result.sentiment}</td>
                          <td>{result.score.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </ResultsTable>
                  
                  <ButtonContainer>
                    <Button 
                      variant="primary"
                      size="medium"
                      onClick={() => {
                        // This would download the full results file
                        window.open(`/api/batch/download/${currentJob.jobId}`, '_blank');
                      }}
                    >
                      Download Full Results
                    </Button>
                  </ButtonContainer>
                </ResultsPreview>
              )}
              
              {currentJob.status === 'PROCESSING' && (
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill 
                      progress={Math.round((currentJob.processedRecords / currentJob.totalRecords) * 100)} 
                    />
                  </ProgressBar>
                  <ProgressText>Processing: {Math.round((currentJob.processedRecords / currentJob.totalRecords) * 100)}%</ProgressText>
                </ProgressContainer>
              )}
            </>
          ) : (
            <div>
              <p>No active batch jobs. Upload a CSV file to start processing.</p>
              
              <StatusSection>
                <StatusTitle>CSV Format Guidelines</StatusTitle>
                <StatusInfo>
                  <p>Your CSV file should contain the following columns:</p>
                  <ul>
                    <li><strong>text</strong>: The text to analyze (required)</li>
                    <li><strong>source</strong>: Source of the text (optional)</li>
                    <li><strong>id</strong>: Unique identifier (optional)</li>
                  </ul>
                  <p>First row should contain column headers.</p>
                  <p>Maximum {FEATURES.MAX_BATCH_SIZE} rows per file.</p>
                  <p>Maximum file size: {formatFileSize(FEATURES.MAX_FILE_SIZE)}</p>
                </StatusInfo>
              </StatusSection>
            </div>
          )}
        </StatusCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default Batch;