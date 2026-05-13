
import React, { useEffect, useRef } from 'react';

const TetrisBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    const blocks: { x: number; y: number; size: number; speed: number; color: string }[] = [];
    const colors = ['#00f3ff', '#ff00e0', '#ffcc00', '#4a0e6b'];
    
    for (let i = 0; i < 30; i++) {
      blocks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 15 + Math.random() * 20,
        speed: 0.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
      
      for (const block of blocks) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.size, block.size);
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(block.x, block.y, block.size, block.size);
        
        block.y += block.speed;
        if (block.y > canvas.height) {
          block.y = -block.size;
          block.x = Math.random() * canvas.width;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default TetrisBackground;