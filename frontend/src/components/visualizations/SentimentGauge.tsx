import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

interface SentimentGaugeProps {
  score: number; // Score between -1 and 1
  size?: number;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
}

const GaugeContainer = styled.div`
  position: relative;
  width: ${props => props.size || 200}px;
  height: ${props => (props.size || 200) * 0.65}px;
  margin: 0 auto;
`;

const ScoreText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const Label = styled.div`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  score,
  size = 200,
  showValue = true,
  label,
  animated = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const normalizedScore = Math.max(-1, Math.min(1, score)); // Ensure score is between -1 and 1
  
  // Map sentiment score to a color
  const getColor = (score: number) => {
    if (score < -0.6) return '#c62828'; // Very negative - deep red
    if (score < -0.2) return '#ef6c00'; // Negative - orange
    if (score < 0.2) return '#ffca28'; // Neutral - yellow
    if (score < 0.6) return '#8bc34a'; // Positive - light green
    return '#2e7d32'; // Very positive - deep green
  };
  
  // Format score for display
  const formatScore = (score: number) => {
    // Convert to percentage and round
    const percentage = Math.round((score + 1) * 50);
    return percentage;
  };
  
  // Map score to gauge position
  const mapScoreToAngle = (score: number) => {
    // Map score from [-1, 1] to [0, 180] degrees
    return (score + 1) * 90;
  };
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const width = size;
    const height = size * 0.65;
    const radius = Math.min(width, height) * 0.8;
    const centerX = width / 2;
    const centerY = height * 0.9;
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Create gauge background
    const arcGenerator = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
    
    // Create background arc
    svg.append('path')
      .attr('d', arcGenerator as any)
      .attr('fill', '#e0e0e0')
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Create gradient for gauge
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gauge-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0);
    
    // Add gradient stops
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#c62828'); // Very negative
    gradient.append('stop').attr('offset', '25%').attr('stop-color', '#ef6c00'); // Negative
    gradient.append('stop').attr('offset', '50%').attr('stop-color', '#ffca28'); // Neutral
    gradient.append('stop').attr('offset', '75%').attr('stop-color', '#8bc34a'); // Positive
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#2e7d32'); // Very positive
    
    // Create colored arc for score
    const scoreArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (Math.PI * (normalizedScore + 1) / 2));
    
    // Add colored arc
    svg.append('path')
      .attr('d', scoreArc as any)
      .attr('fill', 'url(#gauge-gradient)')
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Add needle
    const needleLength = radius * 0.8;
    const needleRadius = 5;
    const targetAngle = (-90 + mapScoreToAngle(normalizedScore)) * (Math.PI / 180);
    
    // Starting angle (either from the previous position or centered)
    const startAngle = animated ? -Math.PI / 2 : targetAngle;
    
    // Create needle
    const needle = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Add needle circle
    needle.append('circle')
      .attr('r', needleRadius * 2)
      .attr('fill', '#666');
    
    // Add needle pointer
    needle.append('path')
      .attr('d', `M0,${-needleRadius} L${-needleRadius},0 L0,${needleLength} L${needleRadius},0 Z`)
      .attr('fill', '#666')
      .attr('transform', `rotate(${startAngle * (180 / Math.PI)})`);
    
    // Animate the needle if animated is true
    if (animated) {
      needle.select('path')
        .transition()
        .duration(1000)
        .attrTween('transform', () => {
          return function(t: number) {
            const interpolatedAngle = d3.interpolate(startAngle, targetAngle)(t);
            return `rotate(${interpolatedAngle * (180 / Math.PI)})`;
          };
        });
    }
    
    // Add tick marks
    const ticks = [-1, -0.5, 0, 0.5, 1];
    const tickLength = radius * 0.1;
    
    ticks.forEach(tick => {
      const angle = (-90 + mapScoreToAngle(tick)) * (Math.PI / 180);
      const tickStart = radius * 0.6;
      const tickEnd = radius * 0.6 - tickLength;
      
      const x1 = Math.cos(angle) * tickStart;
      const y1 = Math.sin(angle) * tickStart;
      const x2 = Math.cos(angle) * tickEnd;
      const y2 = Math.sin(angle) * tickEnd;
      
      svg.append('line')
        .attr('x1', centerX + x1)
        .attr('y1', centerY + y1)
        .attr('x2', centerX + x2)
        .attr('y2', centerY + y2)
        .attr('stroke', '#666')
        .attr('stroke-width', 2);
      
      // Add tick labels
      const labelRadius = tickEnd - 15;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      
      svg.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#666')
        .text(() => {
          if (tick === -1) return 'Negative';
          if (tick === 0) return 'Neutral';
          if (tick === 1) return 'Positive';
          return '';
        });
    });
    
  }, [normalizedScore, size, animated]);
  
  return (
    <div>
      <GaugeContainer size={size}>
        <svg ref={svgRef} width={size} height={size * 0.65}></svg>
        {showValue && (
          <ScoreText>
            {formatScore(normalizedScore)}%
          </ScoreText>
        )}
      </GaugeContainer>
      {label && <Label>{label}</Label>}
    </div>
  );
};

export default SentimentGauge;