import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '../components/animations/VideoBackground';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import { fetchHistory, fetchHistorySummary } from '../features/history/slices/historySlice';
import { AppDispatch, RootState } from '../store';
import { AnalysisResult } from '../types/models';

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
  max-width: 800px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SelectFilter = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background.elevated};
  }
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const HistoryItem = styled(Card)`
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ItemSource = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borders.radius.pill};
`;

const ItemContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TextSample = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Timestamp = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SentimentTag = styled.span<{ sentiment: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  background-color: ${({ sentiment, theme }) => 
    sentiment === 'POSITIVE' ? theme.colors.sentiment.positive :
    sentiment === 'NEGATIVE' ? theme.colors.sentiment.negative :
    sentiment === 'MIXED' ? theme.colors.sentiment.mixed :
    theme.colors.sentiment.neutral
  };
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PaginationButton = styled(Button)`
  min-width: 40px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  grid-column: 1 / -1;
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const History: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { items, isLoading, error, totalPages, currentPage, lastEvaluatedKey } = useSelector(
    (state: RootState) => state.history
  );
  
  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState<AnalysisResult[]>([]);
  
  // Load history on mount
  useEffect(() => {
    dispatch(fetchHistory({ limit: 20 }));
    dispatch(fetchHistorySummary());
  }, [dispatch]);
  
  // Apply filters when items or filters change
  useEffect(() => {
    if (!items) return;
    
    let result = [...items];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(item => {
        // Handle potentially undefined text_sample
        const textToSearch = item.text_sample || item.text;
        return textToSearch.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply sentiment filter
    if (sentimentFilter !== 'all') {
      result = result.filter(item => 
        item.sentiment.toLowerCase() === sentimentFilter.toLowerCase()
      );
    }
    
    // Apply source filter
    if (sourceFilter !== 'all' && sourceFilter) {
      result = result.filter(item => 
        item.source && item.source.toLowerCase() === sourceFilter.toLowerCase()
      );
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, sentimentFilter, sourceFilter]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === currentPage + 1 && lastEvaluatedKey) {
      dispatch(fetchHistory({ limit: 20, lastKey: lastEvaluatedKey }));
    } else if (page === 1) {
      dispatch(fetchHistory({ limit: 20 }));
    }
  };
  
  // Handle item click to view analysis details
  const handleItemClick = (item: AnalysisResult) => {
    // This would ideally navigate to a details page for the analysis
    // For now, we'll simulate by navigating back to the analysis page
    navigate(`/analyze/${item.analysis_id}`);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Format sentiment for display
  const formatSentiment = (sentiment: string) => {
    return sentiment.charAt(0) + sentiment.slice(1).toLowerCase();
  };
  
  return (
    <PageContainer>
      <VideoBackground type="particles" intensity={20} />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analysis History
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Review your past sentiment analyses and track trends over time.
        </Subtitle>
      </Header>
      
      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder="Search by text content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <SelectFilter
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="neutral">Neutral</option>
          <option value="mixed">Mixed</option>
        </SelectFilter>
        
        <SelectFilter
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="all">All Sources</option>
          <option value="direct_input">Direct Input</option>
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
        </SelectFilter>
      </FiltersContainer>
      
      {isLoading && <p>Loading history...</p>}
      
      {error && <p>Error: {error}</p>}
      
      {!isLoading && !error && (
        <>
          {filteredItems.length > 0 ? (
            <HistoryGrid>
              {filteredItems.map((item) => (
                <HistoryItem
                  key={item.analysis_id}
                  elevation="medium"
                  variant="gradient"
                  onClick={() => handleItemClick(item)}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ItemHeader>
                    <ItemTitle>Analysis #{item.analysis_id.slice(-6)}</ItemTitle>
                    {item.source && <ItemSource>{item.source}</ItemSource>}
                  </ItemHeader>
                  
                  <ItemContent>
                    <TextSample>"{item.text_sample || item.text.substring(0, 100)}..."</TextSample>
                  </ItemContent>
                  
                  <ItemFooter>
                    <Timestamp>{formatTimestamp(item.timestamp)}</Timestamp>
                    <SentimentTag sentiment={item.sentiment}>
                      {formatSentiment(item.sentiment)}
                    </SentimentTag>
                  </ItemFooter>
                </HistoryItem>
              ))}
            </HistoryGrid>
          ) : (
            <EmptyState>
              <EmptyStateTitle>No analyses found</EmptyStateTitle>
              <EmptyStateText>
                {searchTerm || sentimentFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'You haven\'t performed any analyses yet'}
              </EmptyStateText>
              <Button onClick={() => navigate('/analyze')} size="large">
                Perform New Analysis
              </Button>
            </EmptyState>
          )}
          
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                variant="outlined"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
              >
                First
              </PaginationButton>
              
              <PaginationButton
                variant="outlined"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Prev
              </PaginationButton>
              
              <PaginationButton variant="primary" disabled>
                {currentPage}
              </PaginationButton>
              
              <PaginationButton
                variant="outlined"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!lastEvaluatedKey || isLoading}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default History;