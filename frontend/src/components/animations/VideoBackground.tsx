import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ParticleSystem {
  particles: Particle[];
  count: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  alpha: number;
  direction: number; // In radians
}

interface VideoBackgroundProps {
  type?: 'particles' | 'waves' | 'gradient';
  intensity?: number;
  colorScheme?: 'theme' | 'custom';
  customColors?: string[];
  disabled?: boolean;
}

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.8;
  transition: opacity 0.5s ease;
`;

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  type = 'particles',
  intensity = 50,
  colorScheme = 'theme',
  customColors,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const { theme } = useTheme();
  const isPowerSavingMode = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Don't render video background if in power saving mode or disabled
  if (isPowerSavingMode || disabled) {
    return null;
  }
  
  // Setup the canvas size
  const setupCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const parent = canvas.parentElement || document.body;
    
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };
  
  // Initialize particle system
  const initParticleSystem = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const particleCount = Math.floor((intensity / 100) * 100) + 20; // 20 to 120 particles based on intensity
    
    const colors = customColors || [
      theme.colors.primary.main,
      theme.colors.primary.light,
      theme.colors.secondary.main,
      theme.colors.secondary.light,
    ];
    
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        direction: Math.random() * Math.PI * 2,
      });
    }
    
    particleSystemRef.current = {
      particles,
      count: particleCount,
    };
  };
  
  // Animation loop for particles
  const animateParticles = () => {
    if (!canvasRef.current || !particleSystemRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const system = particleSystemRef.current;
    
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each particle
    system.particles.forEach((particle) => {
      // Update position
      particle.x += Math.cos(particle.direction) * particle.speed;
      particle.y += Math.sin(particle.direction) * particle.speed;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.direction = Math.PI - particle.direction;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.direction = -particle.direction;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
    });
    
    // Request next frame
    animationRef.current = requestAnimationFrame(animateParticles);
  };
  
  // Handle window resize
  const handleResize = () => {
    setupCanvas();
    // Reinitialize particles to match new canvas size
    initParticleSystem();
  };
  
  useEffect(() => {
    // Initial setup
    setupCanvas();
    initParticleSystem();
    
    // Start animation
    animateParticles();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [type, intensity, colorScheme, customColors]);
  
  return <Canvas ref={canvasRef} />;
};

export default VideoBackground;