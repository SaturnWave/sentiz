import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface Entity {
  id: string;
  text: string;
  type: string;
  score?: number;
  startIndex?: number;
  endIndex?: number;
}

interface EntityHighlighterProps {
  text: string;
  entities: Entity[];
  showTooltips?: boolean;
  onEntityClick?: (entity: Entity) => void;
  className?: string;
}

// Define entity type colors
const entityColors: Record<string, { bg: string; text: string }> = {
  PERSON: { bg: 'rgba(255, 99, 132, 0.2)', text: '#ff6384' },
  LOCATION: { bg: 'rgba(54, 162, 235, 0.2)', text: '#36a2eb' },
  ORGANIZATION: { bg: 'rgba(255, 159, 64, 0.2)', text: '#ff9f40' },
  DATE: { bg: 'rgba(75, 192, 192, 0.2)', text: '#4bc0c0' },
  QUANTITY: { bg: 'rgba(153, 102, 255, 0.2)', text: '#9966ff' },
  EVENT: { bg: 'rgba(255, 205, 86, 0.2)', text: '#ffcd56' },
  DEFAULT: { bg: 'rgba(201, 203, 207, 0.2)', text: '#c9cbcf' }
};

const TextContainer = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  margin: ${({ theme }) => theme.spacing.md} 0;
  position: relative;
`;

// Style for highlighted entities
const HighlightedEntity = styled.mark<{ entityType: string; clickable: boolean }>`
  background-color: ${({ entityType }) => 
    entityColors[entityType]?.bg || entityColors.DEFAULT.bg};
  color: inherit;
  border-bottom: 2px solid ${({ entityType }) => 
    entityColors[entityType]?.text || entityColors.DEFAULT.text};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borders.radius.sm};
  margin: 0 2px;
  cursor: ${({ clickable }) => clickable ? 'pointer' : 'default'};
  position: relative;
  
  &:hover {
    background-color: ${({ entityType }) => {
      const baseColor = entityColors[entityType]?.bg || entityColors.DEFAULT.bg;
      // Make the background slightly darker on hover
      return baseColor.replace('0.2', '0.4');
    }};
  }
`;

// Tooltip for entities
const EntityTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.background.tooltip};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borders.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  white-space: nowrap;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  z-index: 100;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.background.tooltip} transparent transparent transparent;
  }
`;

// Legend component
const EntityLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const LegendItem = styled.div<{ entityType: string }>`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const LegendColor = styled.div<{ entityType: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ entityType }) => 
    entityColors[entityType]?.text || entityColors.DEFAULT.text};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const EntityHighlighter: React.FC<EntityHighlighterProps> = ({
  text,
  entities,
  showTooltips = true,
  onEntityClick,
  className,
}) => {
  // Calculate entity positions if not provided in the entities data
  const processedEntities = useMemo(() => {
    return entities.map(entity => {
      if (entity.startIndex !== undefined && entity.endIndex !== undefined) {
        return entity;
      }
      
      // Find the entity in the text
      const startIndex = text.indexOf(entity.text);
      if (startIndex === -1) {
        return { ...entity, startIndex: -1, endIndex: -1 };
      }
      
      const endIndex = startIndex + entity.text.length;
      return { ...entity, startIndex, endIndex };
    })
    .filter(entity => entity.startIndex !== -1)
    .sort((a, b) => (a.startIndex || 0) - (b.startIndex || 0));
  }, [text, entities]);
  
  // Get unique entity types for the legend
  const entityTypes = useMemo(() => {
    const types = Array.from(new Set(processedEntities.map(entity => entity.type)));
    return types;
  }, [processedEntities]);

  // State for tooltip visibility
  const [hoveredEntityId, setHoveredEntityId] = React.useState<string | null>(null);
  
  // Function to build highlighted text
  const buildHighlightedText = () => {
    if (!processedEntities.length) {
      return text;
    }
    
    let result: JSX.Element[] = [];
    let lastEnd = 0;
    
    processedEntities.forEach((entity, index) => {
      const startIndex = entity.startIndex || 0;
      const endIndex = entity.endIndex || 0;
      
      // Add text before the entity
      if (startIndex > lastEnd) {
        result.push(
          <React.Fragment key={`text-${index}`}>
            {text.substring(lastEnd, startIndex)}
          </React.Fragment>
        );
      }
      
      // Add the highlighted entity
      result.push(
        <HighlightedEntity
          key={`entity-${entity.id}`}
          entityType={entity.type}
          clickable={!!onEntityClick}
          onClick={() => onEntityClick && onEntityClick(entity)}
          onMouseEnter={() => showTooltips && setHoveredEntityId(entity.id)}
          onMouseLeave={() => showTooltips && setHoveredEntityId(null)}
        >
          {text.substring(startIndex, endIndex)}
          {showTooltips && (
            <EntityTooltip visible={hoveredEntityId === entity.id}>
              {entity.type} {entity.score ? `(${Math.round(entity.score * 100)}%)` : ''}
            </EntityTooltip>
          )}
        </HighlightedEntity>
      );
      
      lastEnd = endIndex;
    });
    
    // Add any remaining text
    if (lastEnd < text.length) {
      result.push(
        <React.Fragment key="text-end">
          {text.substring(lastEnd)}
        </React.Fragment>
      );
    }
    
    return result;
  };
  
  return (
    <div className={className}>
      <TextContainer>
        {buildHighlightedText()}
      </TextContainer>
      
      {entityTypes.length > 0 && (
        <EntityLegend>
          {entityTypes.map(type => (
            <LegendItem key={type} entityType={type}>
              <LegendColor entityType={type} />
              {type}
            </LegendItem>
          ))}
        </EntityLegend>
      )}
    </div>
  );
};

export default EntityHighlighter;