import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyPhraseTag from './KeyPhraseTag';

interface KeyPhrase {
  text: string;
  score?: number; // Optional score between 0 and 1 representing importance
}

interface KeyPhraseCloudProps {
  phrases: KeyPhrase[];
  maxPhrases?: number;
  onPhraseClick?: (phrase: KeyPhrase) => void;
  colorScheme?: 'default' | 'rainbow' | 'blueGreen' | 'redBlue';
  className?: string;
}

const CloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.sm};
  max-width: 100%;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.secondary};
  font-style: italic;
`;

// Function to generate a color based on score and chosen color scheme
const getColor = (score: number, index: number, total: number, scheme: string): string => {
  // Default to theme colors if score is not provided
  if (score === undefined) return '';
  
  // Rainbow scheme
  if (scheme === 'rainbow') {
    const hue = (index / total) * 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  // Blue to Green gradient
  if (scheme === 'blueGreen') {
    // Map score from 0-1 to blue-green gradient (240° to 120° in HSL)
    const hue = 240 - (score * 120);
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  // Red to Blue gradient (for sentiment)
  if (scheme === 'redBlue') {
    // Map score from 0-1 to red-blue gradient (0° to 240° in HSL)
    const hue = score * 240;
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  // Default - no custom color
  return '';
};

// Function to determine tag size based on score
const getTagSize = (score?: number): 'sm' | 'md' | 'lg' => {
  if (score === undefined) return 'md';
  
  if (score < 0.4) return 'sm';
  if (score > 0.7) return 'lg';
  return 'md';
};

const KeyPhraseCloud: React.FC<KeyPhraseCloudProps> = ({
  phrases,
  maxPhrases = 50,
  onPhraseClick,
  colorScheme = 'default',
  className,
}) => {
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [displayPhrases, setDisplayPhrases] = useState<KeyPhrase[]>([]);
  
  useEffect(() => {
    // Sort phrases by score (if available) and limit to maxPhrases
    const sortedPhrases = [...phrases].sort((a, b) => {
      if (a.score !== undefined && b.score !== undefined) {
        return b.score - a.score; // Higher scores first
      }
      return 0;
    }).slice(0, maxPhrases);
    
    setDisplayPhrases(sortedPhrases);
  }, [phrases, maxPhrases]);
  
  const handlePhraseClick = (phrase: KeyPhrase) => {
    if (onPhraseClick) {
      onPhraseClick(phrase);
    }
    
    // Toggle selection state
    setSelectedPhrase(prevSelected => 
      prevSelected === phrase.text ? null : phrase.text
    );
  };
  
  if (!displayPhrases.length) {
    return <EmptyState>No key phrases available</EmptyState>;
  }
  
  return (
    <CloudContainer className={className}>
      {displayPhrases.map((phrase, index) => (
        <KeyPhraseTag
          key={`${phrase.text}-${index}`}
          text={phrase.text}
          score={phrase.score}
          size={getTagSize(phrase.score)}
          color={getColor(phrase.score || 0.5, index, displayPhrases.length, colorScheme)}
          onClick={onPhraseClick ? () => handlePhraseClick(phrase) : undefined}
          isSelected={selectedPhrase === phrase.text}
        />
      ))}
    </CloudContainer>
  );
};

export default KeyPhraseCloud;