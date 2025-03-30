import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

interface SentimentDataPoint {
  date: Date | string;
  positive: number;
  negative: number;
  neutral: number;
  overall?: number; // Optional overall sentiment score
}

interface SentimentChartProps {
  data: SentimentDataPoint[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  timeFormat?: string; // e.g. '%Y-%m-%d', '%H:%M', etc.
  className?: string;
}

const ChartContainer = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: relative;
`;

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${({ color }) => color};
    margin-right: 5px;
    border-radius: 2px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  display: none;
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  pointer-events: none;
  z-index: 10;
`;

const TooltipTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TooltipRow = styled.div<{ color: string }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  
  span:first-child {
    margin-right: 10px;
    position: relative;
    padding-left: 15px;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      background-color: ${({ color }) => color};
      border-radius: 2px;
    }
  }
`;

const SentimentChart: React.FC<SentimentChartProps> = ({
  data,
  width = 600,
  height = 300,
  showLegend = true,
  timeFormat = '%b %d',
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Colors for different sentiment categories
  const colors = {
    positive: '#4caf50', // Green
    neutral: '#ffca28',  // Yellow
    negative: '#f44336', // Red
    overall: '#2196f3',  // Blue
  };
  
  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;
    
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Process dates if they're strings
    const processedData = data.map(d => ({
      ...d,
      date: d.date instanceof Date ? d.date : new Date(d.date)
    }));
    
    // Sort data by date
    processedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Set up scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.timeFormat(timeFormat) as any);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d * 100}%`);
    
    // Add axes to chart
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);
    
    g.append('g')
      .call(yAxis);
    
    // Create line generators
    const createLine = (accessor: (d: SentimentDataPoint) => number) => {
      return d3.line<SentimentDataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(accessor(d)))
        .curve(d3.curveMonotoneX);
    };
    
    // Add line paths
    const sentimentTypes = [
      { key: 'positive', label: 'Positive' },
      { key: 'neutral', label: 'Neutral' },
      { key: 'negative', label: 'Negative' },
    ];

    if (processedData[0].overall !== undefined) {
      sentimentTypes.push({ key: 'overall', label: 'Overall' });
    }
    
    sentimentTypes.forEach(type => {
      if (processedData[0][type.key] !== undefined) {
        g.append('path')
          .datum(processedData)
          .attr('fill', 'none')
          .attr('stroke', colors[type.key])
          .attr('stroke-width', type.key === 'overall' ? 3 : 2)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', createLine(d => d[type.key]));
      }
    });
    
    // Create a tooltip
    const tooltip = tooltipRef.current;
    
    if (tooltip) {
      // Create overlay for mouse events
      const overlay = g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');
      
      // Create a vertical line for the tooltip
      const tooltipLine = g.append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .style('opacity', 0);
      
      // Add circles for data points
      const circles = sentimentTypes.map(type => {
        return g.append('circle')
          .attr('r', 4)
          .attr('fill', colors[type.key])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('opacity', 0);
      });
      
      // Mouse events
      overlay
        .on('mousemove', (event) => {
          const [xPos] = d3.pointer(event);
          const xDate = xScale.invert(xPos);
          
          // Find closest data point
          const bisect = d3.bisector((d: SentimentDataPoint) => d.date).left;
          const index = bisect(processedData, xDate, 1);
          const dataPoint = processedData[index - 1];
          
          if (!dataPoint) return;
          
          // Update tooltip position
          tooltip.style.display = 'block';
          tooltip.style.left = `${event.offsetX + 15}px`;
          tooltip.style.top = `${event.offsetY - 20}px`;
          
          // Update tooltip content
          const formattedDate = d3.timeFormat(timeFormat)(dataPoint.date);
          
          tooltip.innerHTML = `
            <div class="tooltip-title">${formattedDate}</div>
            ${sentimentTypes.map(type => {
              if (dataPoint[type.key] !== undefined) {
                return `
                  <div class="tooltip-row" style="--color: ${colors[type.key]}">
                    <span>${type.label}</span>
                    <span>${Math.round(dataPoint[type.key] * 100)}%</span>
                  </div>
                `;
              }
              return '';
            }).join('')}
          `;
          
          // Update tooltip line
          tooltipLine
            .attr('x1', xScale(dataPoint.date))
            .attr('x2', xScale(dataPoint.date))
            .style('opacity', 1);
          
          // Update circles
          sentimentTypes.forEach((type, i) => {
            if (dataPoint[type.key] !== undefined) {
              circles[i]
                .attr('cx', xScale(dataPoint.date))
                .attr('cy', yScale(dataPoint[type.key]))
                .style('opacity', 1);
            }
          });
        })
        .on('mouseleave', () => {
          tooltip.style.display = 'none';
          tooltipLine.style('opacity', 0);
          circles.forEach(circle => circle.style('opacity', 0));
        });
    }
    
  }, [data, width, height, timeFormat]);
  
  return (
    <div className={className}>
      <ChartContainer width={width} height={height}>
        <svg ref={svgRef} width={width} height={height}></svg>
        <Tooltip ref={tooltipRef} />
      </ChartContainer>
      
      {showLegend && (
        <LegendContainer>
          <LegendItem color={colors.positive}>Positive</LegendItem>
          <LegendItem color={colors.neutral}>Neutral</LegendItem>
          <LegendItem color={colors.negative}>Negative</LegendItem>
          {data.length > 0 && data[0].overall !== undefined && (
            <LegendItem color={colors.overall}>Overall</LegendItem>
          )}
        </LegendContainer>
      )}
    </div>
  );
};

export default SentimentChart;