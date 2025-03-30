import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { KeyPhrase } from '../../types/models';

interface KeyPhraseCloudProps {
  keyPhrases: KeyPhrase[];
}

interface TagProps {
  size: number;
  color: string;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  min-height: 150px;
`;

const Tag = styled(motion.div)<TagProps>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borders.radius.pill};
  font-size: ${({ size }) => `${Math.max(0.8, Math.min(size, 1.5))}rem`};
  display: inline-block;
  margin: 0.25rem;
  opacity: 0.9;
  cursor: default;
  transition: transform 0.3s, opacity 0.3s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const EmptyMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const KeyPhraseCloud: React.FC<KeyPhraseCloudProps> = ({ keyPhrases }) => {
  // Function to get a color based on score
  const getColor = (score: number) => {
    // Using a gradient from primary light to primary dark
    const hue = 174; // Teal base (from theme colors)
    const saturation = Math.round(score * 100);
    const lightness = Math.max(40, 70 - score * 30); // Higher score = darker
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  // Function to get a font size based on score
  const getFontSize = (score: number) => {
    // Score range is typically 0-1, scale to 0.8-1.5 for font size
    return 0.8 + score * 0.7;
  };
  
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };
  
  if (!keyPhrases || keyPhrases.length === 0) {
    return (
      <Container>
        <EmptyMessage>No key phrases detected</EmptyMessage>
      </Container>
    );
  }
  
  return (
    <Container as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      {keyPhrases.map((phrase, index) => (
        <Tag
          key={`${phrase.text}-${index}`}
          size={getFontSize(phrase.score)}
          color={getColor(phrase.score)}
          variants={itemVariants}
          title={`Relevance: ${Math.round(phrase.score * 100)}%`}
        >
          {phrase.text}
        </Tag>
      ))}
    </Container>
  );
};

export default KeyPhraseCloud;