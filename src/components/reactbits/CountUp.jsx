'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

export default function CountUp({
  to = 0,
  from = 0,
  duration = 2,
  delay = 0,
  className = '',
  separator = ',',
  suffix = '',
  prefix = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [value, setValue] = useState(from);

  useEffect(() => {
    const target = Number(to);
    if (isNaN(target)) return;

    if (!isInView) {
      setValue(from);
      return;
    }

    const controls = animate(from, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // fluid easeOutExpo
      onUpdate(latest) {
        setValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, to, from, duration, delay]);

  const formatted = value.toLocaleString('en-US');
  const display = separator === ',' ? formatted : formatted.replace(/,/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
