'use client';
import { useEffect, useRef, useCallback } from 'react';

/**
 * SectionTransition
 *
 * Drop-in wrapper for each portfolio section. Fires a canvas-painted
 * exit transition when the section scrolls out of view.
 *
 * Props
 * ─────
 * id          scroll anchor id (replaces the inner section id)
 * transition  'windowShade' | 'flipFold' | 'splitOpen' | 'pagePeel' | 'pixelDissolve'
 * bgHex       hex colour of THIS section background (canvas fill colour)
 * className   extra classes
 * style       extra inline styles
 * children    section content
 */

const DURATION = 880;

function paintWindowShade(ctx, W, H, t) {
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  ctx.clearRect(0, 0, W, H);
  const edgeH = 26, sideW = 22;
  ctx.fillStyle = 'rgba(0,0,0,0.13)';
  ctx.fillRect(0, 0, W, edgeH);
  ctx.fillRect(0, H - edgeH, W, edgeH);
  ctx.fillRect(0, 0, sideW, H);
  ctx.fillRect(W - sideW, 0, sideW, H);
  ctx.strokeStyle = 'rgba(0,0,0,0.09)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(sideW, H / 2); ctx.lineTo(W - sideW, H / 2);
  ctx.moveTo(W / 2, edgeH); ctx.lineTo(W / 2, H - edgeH);
  ctx.stroke();
  const hx = W / 2 - 22, hy = H - edgeH + 10;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.roundRect(hx, hy, 44, 7, 3.5); ctx.fill();
  ctx.globalAlpha = Math.max(0, 1 - ease * 1.4);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

function paintFlipFold(ctx, W, H, t, direction) {
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  ctx.clearRect(0, 0, W, H);
  const goDown = direction === 'down';
  const angle = ease * Math.PI / 2;
  const shadowOpacity = Math.sin(angle) * 0.4;
  const lineY = goDown ? H * ease : H * (1 - ease);
  ctx.save();
  const grad = ctx.createLinearGradient(0, lineY - 16, 0, lineY + 4);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.7, `rgba(0,0,0,${shadowOpacity})`);
  grad.addColorStop(1, `rgba(0,0,0,${shadowOpacity * 0.3})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, lineY - 16, W, 20);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = ease * 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function paintSplitOpen(ctx, W, H, t, bg) {
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  ctx.clearRect(0, 0, W, H);
  const half = H / 2;
  const offset = ease * (half + 30);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, half); ctx.clip();
  ctx.fillStyle = bg;
  ctx.fillRect(0, -offset, W, half);
  const tg = ctx.createLinearGradient(0, half - offset - 10, 0, half - offset);
  tg.addColorStop(0, 'rgba(0,0,0,0)');
  tg.addColorStop(1, `rgba(0,0,0,${0.22 * ease})`);
  ctx.fillStyle = tg; ctx.fillRect(0, half - offset - 10, W, 10);
  ctx.restore();
  ctx.save();
  ctx.beginPath(); ctx.rect(0, half, W, half); ctx.clip();
  ctx.fillStyle = bg;
  ctx.fillRect(0, half + offset, W, half);
  const bg2 = ctx.createLinearGradient(0, half + offset, 0, half + offset + 10);
  bg2.addColorStop(0, `rgba(0,0,0,${0.22 * ease})`);
  bg2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bg2; ctx.fillRect(0, half + offset, W, 10);
  ctx.restore();
}

function paintPagePeel(ctx, W, H, t, bg) {
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  ctx.clearRect(0, 0, W, H);
  const peelX = W * (1 - ease);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(peelX, 0);
  ctx.quadraticCurveTo(peelX + 22 * ease, H * 0.5, peelX, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  const foldW = W * ease * 0.10 + 2;
  const foldGrad = ctx.createLinearGradient(peelX, 0, peelX + foldW, 0);
  foldGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
  foldGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = foldGrad;
  ctx.fillRect(peelX, 0, foldW, H);
}

function paintPixelDissolve(ctx, W, H, t, bg, cells) {
  ctx.clearRect(0, 0, W, H);
  cells.forEach(cell => {
    const ct = Math.max(0, Math.min(1, (t - cell.delay * 0.65) / 0.35));
    if (ct < 1) {
      ctx.globalAlpha = 1 - ct;
      ctx.fillStyle = bg;
      ctx.fillRect(cell.x, cell.y, cell.w + 1, cell.h + 1);
    }
  });
  ctx.globalAlpha = 1;
}

export default function SectionTransition({
  id,
  transition = 'pixelDissolve',
  bgHex = '#ffffff',
  className = '',
  style = {},
  children,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const firedRef = useRef(false);
  const directionRef = useRef('down');
  const cellsRef = useRef(null);

  useEffect(() => {
    const cols = 32, rows = 22;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const cw = Math.ceil(W / cols), ch = Math.ceil(H / rows);
    const cells = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells.push({ x: c * cw, y: r * ch, w: cw, h: ch, delay: Math.random() });
    cellsRef.current = cells;
  }, []);

  const fireTransition = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    const dir = directionRef.current;
    const bg = bgHex;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / DURATION);
      switch (transition) {
        case 'windowShade':   paintWindowShade(ctx, canvas.width, canvas.height, t); break;
        case 'flipFold':      paintFlipFold(ctx, canvas.width, canvas.height, t, dir); break;
        case 'splitOpen':     paintSplitOpen(ctx, canvas.width, canvas.height, t, bg); break;
        case 'pagePeel':      paintPagePeel(ctx, canvas.width, canvas.height, t, bg); break;
        case 'pixelDissolve': paintPixelDissolve(ctx, canvas.width, canvas.height, t, bg, cellsRef.current || []); break;
      }
      if (t < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animRef.current = null;
      }
    }
    animRef.current = requestAnimationFrame(frame);
  }, [transition, bgHex]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !firedRef.current) {
            const rect = entry.boundingClientRect;
            directionRef.current = rect.top < 0 ? 'up' : 'down';
            firedRef.current = true;
            fireTransition();
            setTimeout(() => { firedRef.current = false; }, DURATION + 150);
          }
        });
      },
      { threshold: 0.02 }
    );
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [fireTransition]);

  return (
    <div
      ref={wrapperRef}
      id={id}
      data-transition-section={transition}
      className={`relative ${className}`}
      style={style}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 block"
      />
    </div>
  );
}