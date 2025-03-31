import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { AnalysisResult } from '../../types/models';

interface SentimentChartProps {
  data: AnalysisResult[];
  type?: 'pie' | 'bar' | 'line';
  height?: number;
  width?: number;
  showLegend?: boolean;
  className?: string;
}

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 200px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borders.radius.md};
  overflow: hidden;
  position: relative;
`;

const NoDataMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const SentimentChart: React.FC<SentimentChartProps> = ({
  data,
  type = 'pie',
  height = 300,
  width = 400,
  showLegend = true,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Render chart when data or dimensions change
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    
    // Clear any existing chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create the appropriate chart based on type
    switch (type) {
      case 'pie':
        createPieChart();
        break;
      case 'bar':
        createBarChart();
        break;
      case 'line':
        createLineChart();
        break;
      default:
        createPieChart();
    }
  }, [data, type, height, width]);
  
  // Create a pie chart showing sentiment distribution
  const createPieChart = () => {
    const svg = d3.select(svgRef.current);
    
    // Set dimensions
    const chartWidth = width;
    const chartHeight = height;
    const radius = Math.min(chartWidth, chartHeight) / 2 * 0.8;
    
    // Create group for the pie chart
    const g = svg
      .append('g')
      .attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2})`);
    
    // Calculate sentiment distribution
    const sentimentCounts = {
      POSITIVE: 0,
      NEGATIVE: 0,
      NEUTRAL: 0,
      MIXED: 0
    };
    
    data.forEach(item => {
      sentimentCounts[item.sentiment]++;
    });
    
    // Convert to array format for D3
    const pieData = Object.entries(sentimentCounts)
      .filter(([_, count]) => count > 0)
      .map(([sentiment, count]) => ({ sentiment, count }));
    
    // Create pie layout
    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(radius * 0.5) // Use donut chart style
      .outerRadius(radius);
    
    // Color scale for sentiments
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'])
      .range(['#00897b', '#d32f2f', '#757575', '#ff6f00']);
    
    // Draw pie slices
    const arcs = g.selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.sentiment) as string)
      .attr('stroke', 'rgba(0, 0, 0, 0.2)')
      .attr('stroke-width', 1)
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
    
    // Add percentage labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => {
        const percent = Math.round((d.data.count / data.length) * 100);
        return percent >= 5 ? `${percent}%` : '';
      });
    
    // Add a legend if requested
    if (showLegend) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${chartWidth - 100}, 20)`);
      
      const legendItems = [
        { label: 'Positive', color: '#00897b' },
        { label: 'Negative', color: '#d32f2f' },
        { label: 'Neutral', color: '#757575' },
        { label: 'Mixed', color: '#ff6f00' }
      ];
      
      legendItems.forEach((item, i) => {
        const legendItem = legend
          .append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        legendItem
          .append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('fill', item.color);
        
        legendItem
          .append('text')
          .attr('x', 20)
          .attr('y', 10)
          .attr('text-anchor', 'start')
          .attr('fill', '#b0bec5')
          .style('font-size', '12px')
          .text(item.label);
      });
    }
    
    // Add title to center
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Sentiment Distribution');
  };
  
  // Create a bar chart showing sentiment scores
  const createBarChart = () => {
    const svg = d3.select(svgRef.current);
    
    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create group for the chart
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Prepare data - we'll use the recent items with timestamps
    const chartData = data.slice(0, 10).reverse();
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(chartData.map((_, i) => i.toString()))
      .range([0, chartWidth])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([chartHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((_, i) => `Item ${i + 1}`);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d * 100}%`);
    
    // Draw axes
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('fill', '#b0bec5');
    
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#b0bec5');
    
    // Color scale for sentiments
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'])
      .range(['#00897b', '#d32f2f', '#757575', '#ff6f00']);
    
    // Draw bars for positive scores
    g.selectAll('.bar-positive')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-positive')
      .attr('x', (d, i) => xScale(i.toString()) as number)
      .attr('y', d => yScale(d.sentiment_scores.Positive))
      .attr('width', xScale.bandwidth() / 4)
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Positive))
      .attr('fill', colorScale('POSITIVE') as string)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.sentiment_scores.Positive))
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Positive));
    
    // Draw bars for negative scores
    g.selectAll('.bar-negative')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-negative')
      .attr('x', (d, i) => (xScale(i.toString()) as number) + xScale.bandwidth() / 4)
      .attr('y', d => yScale(d.sentiment_scores.Negative))
      .attr('width', xScale.bandwidth() / 4)
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Negative))
      .attr('fill', colorScale('NEGATIVE') as string)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.sentiment_scores.Negative))
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Negative));
    
    // Draw bars for neutral scores
    g.selectAll('.bar-neutral')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-neutral')
      .attr('x', (d, i) => (xScale(i.toString()) as number) + 2 * xScale.bandwidth() / 4)
      .attr('y', d => yScale(d.sentiment_scores.Neutral))
      .attr('width', xScale.bandwidth() / 4)
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Neutral))
      .attr('fill', colorScale('NEUTRAL') as string)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.sentiment_scores.Neutral))
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Neutral));
    
    // Draw bars for mixed scores
    g.selectAll('.bar-mixed')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'bar-mixed')
      .attr('x', (d, i) => (xScale(i.toString()) as number) + 3 * xScale.bandwidth() / 4)
      .attr('y', d => yScale(d.sentiment_scores.Mixed))
      .attr('width', xScale.bandwidth() / 4)
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Mixed))
      .attr('fill', colorScale('MIXED') as string)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.sentiment_scores.Mixed))
      .attr('height', d => chartHeight - yScale(d.sentiment_scores.Mixed));
    
    // Add a legend if requested
    if (showLegend) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${chartWidth - 60}, 20)`);
      
      const legendItems = [
        { label: 'Pos', color: '#00897b' },
        { label: 'Neg', color: '#d32f2f' },
        { label: 'Neu', color: '#757575' },
        { label: 'Mix', color: '#ff6f00' }
      ];
      
      legendItems.forEach((item, i) => {
        const legendItem = legend
          .append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        legendItem
          .append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', item.color);
        
        legendItem
          .append('text')
          .attr('x', 15)
          .attr('y', 8)
          .attr('text-anchor', 'start')
          .attr('fill', '#b0bec5')
          .style('font-size', '10px')
          .text(item.label);
      });
    }
  };
  
  // Create a line chart showing sentiment trend over time
  const createLineChart = () => {
    const svg = d3.select(svgRef.current);
    
    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create group for the chart
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Prepare data - sort by timestamp
    const chartData = [...data]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-10); // Last 10 items
    
    // Create scales
    const xScale = d3.scalePoint()
      .domain(chartData.map((_, i) => i.toString()))
      .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([chartHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((_, i) => {
        const date = new Date(chartData[i].timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d * 100}%`);
    
    // Draw axes
    g.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#b0bec5');
    
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#b0bec5');
    
    // Create line generators
    const createLine = (scoreAccessor: (d: AnalysisResult) => number) => {
      return d3.line<AnalysisResult>()
        .x((_, i) => xScale(i.toString()) as number)
        .y(d => yScale(scoreAccessor(d)))
        .curve(d3.curveMonotoneX);
    };
    
    // Draw positive line
    const positiveLine = createLine(d => d.sentiment_scores.Positive);
    const positiveLineChart = g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#00897b')
      .attr('stroke-width', 2)
      .attr('d', positiveLine);
    
    // Animate the line drawing
    const positiveLength = positiveLineChart.node()?.getTotalLength() || 0;
    positiveLineChart
      .attr('stroke-dasharray', positiveLength)
      .attr('stroke-dashoffset', positiveLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
    
    // Draw negative line
    const negativeLine = createLine(d => d.sentiment_scores.Negative);
    const negativeLineChart = g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#d32f2f')
      .attr('stroke-width', 2)
      .attr('d', negativeLine);
    
    // Animate the line drawing
    const negativeLength = negativeLineChart.node()?.getTotalLength() || 0;
    negativeLineChart
      .attr('stroke-dasharray', negativeLength)
      .attr('stroke-dashoffset', negativeLength)
      .transition()
      .duration(1000)
      .delay(200)
      .attr('stroke-dashoffset', 0);
    
    // Add a legend if requested
    if (showLegend) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${chartWidth - 80}, 20)`);
      
      const legendItems = [
        { label: 'Positive', color: '#00897b' },
        { label: 'Negative', color: '#d32f2f' },
      ];
      
      legendItems.forEach((item, i) => {
        const legendItem = legend
          .append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        legendItem
          .append('line')
          .attr('x1', 0)
          .attr('y1', 5)
          .attr('x2', 15)
          .attr('y2', 5)
          .attr('stroke', item.color)
          .attr('stroke-width', 2);
        
        legendItem
          .append('text')
          .attr('x', 20)
          .attr('y', 9)
          .attr('text-anchor', 'start')
          .attr('fill', '#b0bec5')
          .style('font-size', '12px')
          .text(item.label);
      });
    }
  };
  
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <ChartContainer className={className}>
        <NoDataMessage>No data available for visualization</NoDataMessage>
      </ChartContainer>
    );
  }
  
  return (
    <ChartContainer className={className}>
      <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} />
    </ChartContainer>
  );
};

export default SentimentChart;