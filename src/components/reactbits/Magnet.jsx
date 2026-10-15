'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function Magnet({
  children,
  className = '',
  padding = 40,
  disabled = false,
  magnetStrength = 2,
  activeTransition = { type: 'spring', damping: 15, stiffness: 150, mass: 0.1 },
  inactiveTransition = { type: 'spring', damping: 10, stiffness: 200, mass: 0.5 },
  ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  const x = useSpring(0, activeTransition);
  const y = useSpring(0, activeTransition);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;

      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        x.set(offsetX);
        y.set(offsetY);
      } else {
        setIsActive(false);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, disabled, magnetStrength, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
