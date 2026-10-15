'use client';
import { useRef, useEffect, useCallback } from 'react';

export default function ClickSpark({
  children,
  sparkColor = '#00E5FF',
  sparkSize = 10,
  sparkRadius = 25,
  sparkCount = 8,
  duration = 450,
  extraScale = 1.0,
  className = '',
  ...props
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  const createSparks = useCallback((x, y) => {
    const now = performance.now();
    const newSparks = [];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (2 * Math.PI * i) / sparkCount + (Math.random() - 0.5) * 0.4;
      newSparks.push({
        x,
        y,
        angle,
        startTime: now,
      });
    }

    sparksRef.current.push(...newSparks);
  }, [sparkCount]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createSparks(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (now) => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentDist = easeOut * sparkRadius * extraScale;
        const lineLen = (1 - progress) * sparkSize;

        const startX = spark.x + Math.cos(spark.angle) * currentDist;
        const startY = spark.y + Math.sin(spark.angle) * currentDist;

        const endX = spark.x + Math.cos(spark.angle) * (currentDist + lineLen);
        const endY = spark.y + Math.sin(spark.angle) * (currentDist + lineLen);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 1 - progress;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, duration, extraScale]);

  return (
    <div
      onClick={handleClick}
      className={`relative ${className}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-50 overflow-hidden"
      />
      {children}
    </div>
  );
}
