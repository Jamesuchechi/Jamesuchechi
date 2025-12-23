'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

export default function Hero() {
  const [now, setNow] = useState(() => new Date());
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setPointer({ x, y });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const monthLabel = now.toLocaleString('en-US', { month: 'short' });
  const yearLabel = String(now.getFullYear()).slice(-2);
  const noiseDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E";
  const containerMotion = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  const itemMotion = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#07090c] text-white px-6 sm:px-12"
    >
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(120,171,255,0.25),transparent_70%)] blur-2xl"></div>
        <div className="absolute -bottom-52 -right-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,185,129,0.2),transparent_70%)] blur-3xl"></div>
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute inset-0 opacity-15 mix-blend-soft-light [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_1px,transparent_1px,transparent_2px)]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url("${noiseDataUrl}")` }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{
            transform: `translate(-50%, -50%) translate(${pointer.x * 8}px, ${pointer.y * 6}px)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <ellipse
              cx="200"
              cy="200"
              rx="160"
              ry="95"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="165"
              ry="100"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute h-24 w-24 rounded-full border border-white/15 bg-white/5 blur-[1px]"
          style={{
            left: '12%',
            top: '18%',
            transform: `translate(${pointer.x * 18}px, ${pointer.y * 12}px)`,
          }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-40 w-40 rounded-full border border-sky-200/20 bg-sky-200/5"
          style={{
            left: '68%',
            top: '16%',
            transform: `translate(${pointer.x * -22}px, ${pointer.y * 18}px)`,
          }}
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-28 w-28 rounded-full border border-amber-200/20 bg-amber-200/10"
          style={{
            left: '18%',
            top: '68%',
            transform: `translate(${pointer.x * 14}px, ${pointer.y * -16}px)`,
          }}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-16 w-16 rounded-full border border-white/10 bg-white/5"
          style={{
            left: '78%',
            top: '70%',
            transform: `translate(${pointer.x * -10}px, ${pointer.y * -10}px)`,
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute left-[8%] top-[40%] h-44 w-44 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,220,165,0.85), rgba(255,164,92,0.55) 45%, rgba(80,30,0,0.35) 70%, rgba(0,0,0,0) 72%)',
            boxShadow: '0 0 120px rgba(255,173,97,0.35)',
            transform: `translate(${pointer.x * 12}px, ${pointer.y * 8}px)`,
          }}
        >
          <div className="absolute right-5 top-6 h-7 w-7 rounded-full bg-white/40 blur-[2px]"></div>
          <div className="absolute -right-5 bottom-10 h-8 w-8 rounded-full bg-white/15"></div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="max-w-7xl w-full">
        <motion.div variants={containerMotion} initial="hidden" animate="show">
          {/* Availability Badge */}
          <motion.div
            variants={itemMotion}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 mb-8 backdrop-blur"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm">Available for work {monthLabel}&apos;{yearLabel}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemMotion}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight mb-6"
          >
            JAMES
            <span className="block bg-gradient-to-r from-white via-sky-100 to-amber-100 bg-clip-text text-transparent">
              UCHECHI
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemMotion}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-10"
          >
            Open to job opportunities worldwide. Passionate about building polished, intuitive, 
            and thoughtful digital experiences that leave a mark.
          </motion.p>

          {/* CTA Button */}
          <motion.a
            href="#contact"
            variants={itemMotion}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/90 text-black px-8 py-4 text-base sm:text-lg font-medium shadow-[0_20px_60px_-20px_rgba(255,255,255,0.5)] hover:translate-y-0.5 hover:bg-white transition-all"
          >
            CONTACT <FiArrowUpRight />
          </motion.a>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
