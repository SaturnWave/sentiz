import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

interface SentimentGaugeProps {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

const GaugeContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const ScoreList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ScoreItem = styled.li<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
  }
`;

const SentimentGauge: React.FC<SentimentGaugeProps> = ({
  positive,
  negative,
  neutral,
  mixed,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Remove any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Create sentiment data
    const data = [
      { name: 'Positive', value: positive, color: '#00897b' },
      { name: 'Negative', value: negative, color: '#d32f2f' },
      { name: 'Neutral', value: neutral, color: '#757575' },
      { name: 'Mixed', value: mixed, color: '#ff6f00' },
    ];
    
    // Create pie chart
    const pie = d3
      .pie<typeof data[0]>()
      .value((d) => d.value)
      .sort(null);
    
    const arc = d3
      .arc<d3.PieArcDatum<typeof data[0]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.9);
    
    const arcs = svg
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    // Add colored arcs
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'rgba(0,0,0,0.2)')
      .attr('stroke-width', 1)
      .style('transition', 'opacity 0.3s')
      .on('mouseover', function() {
        d3.select(this).style('opacity', 0.8);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
      });
    
    // Add text labels for percentages
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text((d) => (d.data.value >= 0.05 ? `${Math.round(d.data.value * 100)}%` : ''));
    
    // Add central text showing predominant sentiment
    const predominant = data.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );
    
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .style('font-size', '14px')
      .style('fill', '#b0bec5')
      .text('Predominant');
    
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', predominant.color)
      .text(predominant.name);
    
  }, [positive, negative, neutral, mixed]);
  
  return (
    <div>
      <GaugeContainer>
        <svg ref={svgRef} width="100%" height="100%" />
      </GaugeContainer>
      
      <ScoreList>
        <ScoreItem color="#00897b">Positive: {Math.round(positive * 100)}%</ScoreItem>
        <ScoreItem color="#d32f2f">Negative: {Math.round(negative * 100)}%</ScoreItem>
        <ScoreItem color="#757575">Neutral: {Math.round(neutral * 100)}%</ScoreItem>
        <ScoreItem color="#ff6f00">Mixed: {Math.round(mixed * 100)}%</ScoreItem>
      </ScoreList>
    </div>
  );
};

export default SentimentGauge;