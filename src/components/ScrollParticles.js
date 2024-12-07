'use client';
import { useEffect, useRef } from 'react';

export default function ScrollParticles() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseYRef = useRef(0);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match parent container
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      const particles = [];
      const particleCount = 100;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: `hsla(${Math.random() * 60 + 200}, 70%, 60%, 0.8)`, // Blue-ish colors
        });
      }
      
      particlesRef.current = particles;
    };

    createParticles();

    // Handle scroll
    const handleScroll = () => {
      mouseYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // Update particle position based on scroll
        const scrollEffect = (mouseYRef.current % canvas.height) / canvas.height;
        particle.x += particle.speedX * (1 + scrollEffect);
        particle.y += particle.speedY * (1 + scrollEffect);

        // Wrap particles around canvas
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
} 