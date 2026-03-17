'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

export default function OSWindow({
  id, title = 'window', icon,
  initialX = 80, initialY = 60,
  initialW = 420, initialH = 320,
  zIndex = 10,
  onFocus, onClose,
  children, desktopRef,
}) {
  const winRef    = useRef(null);
  const posRef    = useRef({ x: initialX, y: initialY });
  const sizeRef   = useRef({ w: initialW, h: initialH });
  const dragRef   = useRef(null);
  const resizeRef = useRef(null);

  const [pos,       setPos]       = useState({ x: initialX, y: initialY });
  const [size,      setSize]      = useState({ w: initialW, h: initialH });
  const [minimised, setMinimised] = useState(false);

  useEffect(() => { posRef.current  = pos;  }, [pos]);
  useEffect(() => { sizeRef.current = size; }, [size]);

  const clampPos = useCallback((x, y) => {
    if (!desktopRef?.current) return { x, y };
    const { width: dw, height: dh } = desktopRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(x, dw - 80)),
      y: Math.max(0, Math.min(y, dh - 40)),
    };
  }, [desktopRef]);

  const onTitleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocus?.(id);
    dragRef.current = {
      startMouseX: e.clientX, startMouseY: e.clientY,
      startWinX: posRef.current.x, startWinY: posRef.current.y,
    };
    const onMove = (me) => {
      if (!dragRef.current) return;
      const clamped = clampPos(
        dragRef.current.startWinX + me.clientX - dragRef.current.startMouseX,
        dragRef.current.startWinY + me.clientY - dragRef.current.startMouseY,
      );
      setPos(clamped);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [id, onFocus, clampPos]);

  const onResizeMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = {
      startMouseX: e.clientX, startMouseY: e.clientY,
      startW: sizeRef.current.w, startH: sizeRef.current.h,
    };
    const onMove = (me) => {
      if (!resizeRef.current) return;
      setSize({
        w: Math.max(260, resizeRef.current.startW + me.clientX - resizeRef.current.startMouseX),
        h: Math.max(180, resizeRef.current.startH + me.clientY - resizeRef.current.startMouseY),
      });
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  return (
    <motion.div
      ref={winRef}
      initial={{ opacity: 0, scale: 0.88, y: 12 }}
      animate={minimised
        ? { opacity: 0, scale: 0.7, y: 20, pointerEvents: 'none' }
        : { opacity: 1, scale: 1,   y: 0,  pointerEvents: 'auto' }
      }
      exit={{ opacity: 0, scale: 0.85, y: 10 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      onMouseDown={() => onFocus?.(id)}
      style={{
        position: 'absolute', left: pos.x, top: pos.y,
        width: size.w, height: size.h, zIndex,
        display: 'flex', flexDirection: 'column',
        background: '#111318',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: '10px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.05)',
        userSelect: 'none',
      }}
    >
      {/* Titlebar */}
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          height: '36px', flexShrink: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 12px', gap: '8px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          cursor: 'grab',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {[
            { color: '#ff5f57', fn: () => onClose?.(id),             label: 'Close'    },
            { color: '#febc2e', fn: () => setMinimised(v => !v),     label: 'Minimise' },
            { color: '#28c840', fn: null,                             label: 'Full size'},
          ].map(({ color, fn, label }) => (
            <button key={label}
              onMouseDown={e => e.stopPropagation()}
              onClick={fn || undefined}
              aria-label={label}
              style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: color, border: 'none',
                cursor: fn ? 'pointer' : 'default',
                padding: 0, flexShrink: 0,
                opacity: fn ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        {icon && <span style={{ fontSize: '13px', flexShrink: 0 }}>{icon}</span>}
        <span style={{
          flex: 1, textAlign: 'center', fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-mono, monospace)',
          letterSpacing: '0.03em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: 'text' }}>
        {children}
      </div>

      {/* SE resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        style={{ position: 'absolute', bottom: 0, right: 0, width: '18px', height: '18px', cursor: 'se-resize', zIndex: 1 }}
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M6 16 L16 6 M10 16 L16 10 M14 16 L16 14"
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    </motion.div>
  );
}