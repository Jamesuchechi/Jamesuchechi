'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="min-h-screen"
      >
        {/* Cinematic Wipe Overlay (Optional: can be added for extra wow factor) */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          exit={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{ originX: 0 }}
          className="fixed inset-0 z-[9999] bg-black pointer-events-none"
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
