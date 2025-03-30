// Video service for handling background video effects

// Particle effect options
export interface ParticleOptions {
  count: number;
  color: string[];
  speed: number;
  size: number[];
  opacity: number[];
}

// Wave effect options
export interface WaveOptions {
  count: number;
  color: string[];
  speed: number;
  amplitude: number;
  frequency: number;
}

// Gradient effect options
export interface GradientOptions {
  colors: string[];
  speed: number;
  angle: number;
}

// Video service
export const videoService = {
  // Default particle options
  getDefaultParticleOptions: (theme: any): ParticleOptions => {
    return {
      count: 50,
      color: [
        theme.colors.primary.main,
        theme.colors.primary.light,
        theme.colors.secondary.main,
        theme.colors.secondary.light,
      ],
      speed: 0.5,
      size: [1, 3],
      opacity: [0.1, 0.5],
    };
  },
  
  // Default wave options
  getDefaultWaveOptions: (theme: any): WaveOptions => {
    return {
      count: 3,
      color: [
        theme.colors.primary.main,
        theme.colors.primary.light,
        theme.colors.secondary.main,
      ],
      speed: 0.2,
      amplitude: 50,
      frequency: 0.01,
    };
  },
  
  // Default gradient options
  getDefaultGradientOptions: (theme: any): GradientOptions => {
    return {
      colors: [
        theme.colors.background.primary,
        theme.colors.primary.dark,
        theme.colors.background.primary,
      ],
      speed: 0.001,
      angle: 45,
    };
  },
  
  // Create particle system
  createParticleSystem: (canvas: HTMLCanvasElement, options: ParticleOptions): (() => void) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    
    const particles: any[] = [];
    
    // Create particles
    for (let i = 0; i < options.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: options.size[0] + Math.random() * (options.size[1] - options.size[0]),
        color: options.color[Math.floor(Math.random() * options.color.length)],
        speedX: (Math.random() - 0.5) * options.speed,
        speedY: (Math.random() - 0.5) * options.speed,
        opacity: options.opacity[0] + Math.random() * (options.opacity[1] - options.opacity[0]),
      });
    }
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationId);
    };
  },
  
  // Create wave system
  createWaveSystem: (canvas: HTMLCanvasElement, options: WaveOptions): (() => void) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    
    const waves: any[] = [];
    
    // Create waves
    for (let i = 0; i < options.count; i++) {
      waves.push({
        color: options.color[i % options.color.length],
        speed: options.speed * (i + 1) / options.count,
        amplitude: options.amplitude * (i + 1) / options.count,
        frequency: options.frequency * (i + 1) / options.count,
        offset: Math.random() * Math.PI * 2,
      });
    }
    
    // Animation loop
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude + canvas.height / 2;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        ctx.fillStyle = wave.color;
        ctx.globalAlpha = 0.2 / options.count * (options.count - index);
        ctx.fill();
      });
      
      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationId);
    };
  },
  
  // Create gradient system
  createGradientSystem: (canvas: HTMLCanvasElement, options: GradientOptions): (() => void) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};
    
    // Animation loop
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const angle = options.angle + time * options.speed * 360;
      const radians = angle * Math.PI / 180;
      
      // Calculate gradient coordinates
      const x1 = canvas.width / 2 - Math.cos(radians) * canvas.width;
      const y1 = canvas.height / 2 - Math.sin(radians) * canvas.height;
      const x2 = canvas.width / 2 + Math.cos(radians) * canvas.width;
      const y2 = canvas.height / 2 + Math.sin(radians) * canvas.height;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      
      options.colors.forEach((color, index) => {
        gradient.addColorStop(index / (options.colors.length - 1), color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.001;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationId);
    };
  },
};