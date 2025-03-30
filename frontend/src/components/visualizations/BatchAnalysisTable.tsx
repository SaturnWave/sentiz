import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TablePagination,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon, 
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  RemoveRedEye as ViewIcon
} from '@mui/icons-material';

// Types
interface BatchJob {
  id: string;
  filename: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  recordsProcessed?: number;
  totalRecords?: number;
  resultUrl?: string;
}

interface BatchAnalysisTableProps {
  batchJobs: BatchJob[];
  onRefresh: () => void;
  onDownload: (jobId: string) => void;
  onViewResults: (jobId: string) => void;
  isLoading?: boolean;
}

// Styled Components
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StyledTable = styled(Table)`
  min-width: 750px;
`;

const HeaderCell = styled(TableCell)`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
`;

const StatusChip = styled(Chip)<{ status: 'processing' | 'completed' | 'failed' }>`
  background-color: ${({ theme, status }) => 
    status === 'completed' 
      ? theme.colors.success.light 
      : status === 'processing' 
      ? theme.colors.warning.light 
      : theme.colors.error.light};
  color: ${({ theme, status }) => 
    status === 'completed' 
      ? theme.colors.success.dark 
      : status === 'processing' 
      ? theme.colors.warning.dark 
      : theme.colors.error.dark};
`;

const ProgressIndicator = styled.div`
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.full};
  width: 100%;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Progress = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.borders.radius.full};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RefreshButton = styled(IconButton)`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  align-self: flex-end;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const BatchAnalysisTable: React.FC<BatchAnalysisTableProps> = ({
  batchJobs,
  onRefresh,
  onDownload,
  onViewResults,
  isLoading = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the progress percentage for processing jobs
  const getProgressPercentage = (job: BatchJob) => {
    if (job.status === 'completed') return 100;
    if (job.status === 'failed') return 0;
    if (!job.recordsProcessed || !job.totalRecords) return 0;
    
    return Math.round((job.recordsProcessed / job.totalRecords) * 100);
  };

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <LoadingOverlay>
          <CircularProgress />
        </LoadingOverlay>
      )}
      
      <RefreshButton 
        onClick={onRefresh}
        disabled={isLoading}
        color="primary"
        size="small"
        aria-label="Refresh batch jobs list"
      >
        <RefreshIcon />
      </RefreshButton>
      
      <TableContainer>
        <StyledTable aria-label="batch analysis jobs table">
          <TableHead>
            <TableRow>
              <HeaderCell>Job ID</HeaderCell>
              <HeaderCell>Filename</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Created At</HeaderCell>
              <HeaderCell>Completed At</HeaderCell>
              <HeaderCell>Progress</HeaderCell>
              <HeaderCell align="right">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {batchJobs.length > 0 ? (
              batchJobs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job) => (
                  <TableRow key={job.id}>
                    <TableCell component="th" scope="row">
                      {job.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{job.filename}</TableCell>
                    <TableCell>
                      <StatusChip
                        status={job.status}
                        label={job.status}
                        size="small"
                        icon={
                          job.status === 'completed' ? (
                            <CheckIcon fontSize="small" />
                          ) : job.status === 'failed' ? (
                            <CloseIcon fontSize="small" />
                          ) : null
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(job.createdAt), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {job.completedAt
                        ? format(new Date(job.completedAt), 'MMM d, yyyy HH:mm')
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {job.status === 'processing' && job.recordsProcessed && job.totalRecords ? (
                        <>
                          <div>
                            {job.recordsProcessed} / {job.totalRecords} records
                          </div>
                          <ProgressIndicator>
                            <Progress width={getProgressPercentage(job)} />
                          </ProgressIndicator>
                        </>
                      ) : job.status === 'completed' ? (
                        <>
                          <div>
                            {job.totalRecords} records processed
                          </div>
                          <ProgressIndicator>
                            <Progress width={100} />
                          </ProgressIndicator>
                        </>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <ActionButtonsContainer>
                        {job.status === 'completed' && (
                          <>
                            <Tooltip title="View results">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onViewResults(job.id)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download results">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onDownload(job.id)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </ActionButtonsContainer>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState>
                    <p>No batch jobs found</p>
                    <p>Upload a CSV file to start batch processing</p>
                  </EmptyState>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </StyledTable>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={batchJobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

// Add missing CircularProgress component
import { CircularProgress } from '@mui/material';

export default BatchAnalysisTable;