'use client';
import { motion } from 'framer-motion';

export default function ShinyText({
  text,
  children,
  disabled = false,
  speed = 4,
  className = '',
  shimmerWidth = 100,
  ...props
}) {
  const content = text || children;

  if (disabled) {
    return <span className={className}>{content}</span>;
  }

  return (
    <motion.span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 35%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 65%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
      }}
      animate={{
        backgroundPosition: ['100% 0', '-100% 0'],
      }}
      transition={{
        repeat: Infinity,
        duration: speed,
        ease: 'linear',
      }}
      {...props}
    >
      {content}
    </motion.span>
  );
}
