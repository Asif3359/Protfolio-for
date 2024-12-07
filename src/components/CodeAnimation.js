'use client';
import { useEffect, useRef } from 'react';

export default function CodeAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;
    
    const binary = '10';
    let particles = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 2,
        text: binary[Math.floor(Math.random() * binary.length)]
      });
    }
    
    function animate() {
      // Create semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0066ff';
      ctx.font = '12px monospace';
      
      particles.forEach(particle => {
        ctx.fillText(particle.text, particle.x, particle.y);
        particle.y += particle.speed;
        
        // Reset particle position when it goes off screen
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      // Cleanup
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute opacity-20 dark:opacity-40 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
} 