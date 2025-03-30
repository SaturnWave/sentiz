import React, { useMemo } from 'react';
import styled from 'styled-components';
import KeyPhraseTag from './KeyPhraseTag';

export interface KeyPhraseData {
  text: string;
  score?: number;
}

interface KeyPhraseCloudProps {
  phrases: KeyPhraseData[];
  maxPhrases?: number;
  onPhraseClick?: (phrase: KeyPhraseData) => void;
  className?: string;
}

const CloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borders.radius.lg};
  background-color: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  
  svg {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const KeyPhraseCloud: React.FC<KeyPhraseCloudProps> = ({
  phrases,
  maxPhrases = 30,
  onPhraseClick,
  className,
}) => {
  // Sort phrases by score in descending order and limit by maxPhrases
  const sortedPhrases = useMemo(() => {
    return [...phrases]
      .sort((a, b) => {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        return scoreB - scoreA;
      })
      .slice(0, maxPhrases);
  }, [phrases, maxPhrases]);

  // Scale the size based on the score
  const getTagSize = (score?: number): 'sm' | 'md' | 'lg' => {
    if (!score) return 'md';
    if (score > 0.8) return 'lg';
    if (score > 0.5) return 'md';
    return 'sm';
  };

  // If no phrases are available, show an empty state
  if (!phrases.length) {
    return (
      <CloudContainer className={className}>
        <EmptyStateContainer>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7.5V16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 3V7H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L17 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <EmptyStateText>No key phrases found in the analyzed text</EmptyStateText>
        </EmptyStateContainer>
      </CloudContainer>
    );
  }

  return (
    <CloudContainer className={className}>
      {sortedPhrases.map((phrase, index) => (
        <KeyPhraseTag
          key={`${phrase.text}-${index}`}
          text={phrase.text}
          score={phrase.score}
          size={getTagSize(phrase.score)}
          onClick={onPhraseClick ? () => onPhraseClick(phrase) : undefined}
        />
      ))}
    </CloudContainer>
  );
};

export default KeyPhraseCloud;