'use client';
import { useRef, useEffect } from 'react';

export default function Squares({
  direction = 'diagonal',
  speed = 0.4,
  borderColor = 'rgba(255, 255, 255, 0.05)',
  squareSize = 48,
  hoverFillColor = 'rgba(0, 229, 255, 0.15)',
  className = '',
}) {
  const canvasRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);
  const activeFades = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
        hoveredSquare.current = null;
        return;
      }

      const startX = Math.floor((mouseX - (gridOffset.current.x % squareSize)) / squareSize);
      const startY = Math.floor((mouseY - (gridOffset.current.y % squareSize)) / squareSize);

      const key = `${startX}_${startY}`;
      hoveredSquare.current = { x: startX, y: startY };
      activeFades.current.set(key, {
        x: startX,
        y: startY,
        alpha: 1.0,
      });
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Move grid based on direction and speed
      if (speed > 0) {
        switch (direction) {
          case 'right':
            gridOffset.current.x += speed;
            break;
          case 'left':
            gridOffset.current.x -= speed;
            break;
          case 'down':
            gridOffset.current.y += speed;
            break;
          case 'up':
            gridOffset.current.y -= speed;
            break;
          case 'diagonal':
          default:
            gridOffset.current.x += speed * 0.7;
            gridOffset.current.y += speed * 0.7;
            break;
        }
      }

      const offsetX = gridOffset.current.x % squareSize;
      const offsetY = gridOffset.current.y % squareSize;

      // Draw fading active squares
      activeFades.current.forEach((fade, key) => {
        const posX = fade.x * squareSize + offsetX;
        const posY = fade.y * squareSize + offsetY;

        ctx.fillStyle = hoverFillColor.replace(/[\d.]+\)$/, `${fade.alpha * 0.25})`);
        ctx.fillRect(posX, posY, squareSize, squareSize);

        fade.alpha *= 0.94;
        if (fade.alpha < 0.02) {
          activeFades.current.delete(key);
        }
      });

      // Draw grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = borderColor;
      ctx.beginPath();

      for (let x = offsetX; x <= width + squareSize; x += squareSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let y = offsetY; y <= height + squareSize; y += squareSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
