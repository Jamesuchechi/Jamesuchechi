'use client';
import { useState, useEffect } from 'react';
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

  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => setAbout(data))
      .catch(err => console.error('Error fetching about for hero:', err));
  }, []);

  const monthLabel = now.toLocaleString('en-US', { month: 'short' });
  const yearLabel = String(now.getFullYear()).slice(-2);

  const getAvailabilityConfig = () => {
    const status = about?.availabilityStatus || 'available';
    switch (status) {
      case 'open':
        return {
          text: `Available ${monthLabel}'${yearLabel}`,
          color: 'bg-green-500'
        };
      case 'busy':
        return {
          text: `Currently busy ${monthLabel}'${yearLabel}`,
          color: 'bg-red-500'
        };
      default:
        return {
          text: `Available ${monthLabel}'${yearLabel}`,
          color: 'bg-green-500'
        };
    }
  };

  const avail = getAvailabilityConfig();

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
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#07090c] text-white px-6 sm:px-12 flex items-center justify-center pt-24"
    >
      {/* ── Dynamic Background Layer ── */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(120,171,255,0.15),transparent_70%)] blur-3xl"></div>
        <div className="absolute -bottom-52 -right-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,185,129,0.1),transparent_70%)] blur-3xl"></div>
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url("${noiseDataUrl}")` }}
        ></div>
      </div>

      {/* ── Interactive Elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Rotating SVG Ellipses */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{
            transform: `translate(-50%, -50%) translate(${pointer.x * 12}px, ${pointer.y * 10}px)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 400 400" className="h-full w-full">
            <ellipse cx="200" cy="200" rx="180" ry="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <ellipse cx="200" cy="200" rx="185" ry="115" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </svg>
        </motion.div>

        {/* Floating Blurred Spheres (Interactive) */}
        <motion.div
          className="absolute h-44 w-44 rounded-full border border-white/10 bg-white/5 blur-[2px]"
          style={{ left: '10%', top: '20%', x: pointer.x * 30, y: pointer.y * 20 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-64 w-64 rounded-full border border-sky-400/10 bg-sky-400/5 blur-[1px]"
          style={{ left: '70%', top: '15%', x: pointer.x * -40, y: pointer.y * 30 }}
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-48 w-48 rounded-full border border-amber-400/10 bg-amber-400/5"
          style={{ left: '15%', top: '70%', x: pointer.x * 20, y: pointer.y * -30 }}
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute h-32 w-32 rounded-full border border-white/5 bg-white/5"
          style={{ left: '80%', top: '75%', x: pointer.x * -15, y: pointer.y * -15 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <motion.div variants={containerMotion} initial="hidden" animate="show">
          {/* Availability Badge */}
          <motion.div
            variants={itemMotion}
            className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/5 pl-2 pr-6 py-2 mb-12 backdrop-blur-xl group cursor-default transition-all hover:bg-white/10"
          >
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center p-2 overflow-hidden relative">
              <span className={`absolute inset-0 ${avail.color} opacity-20 animate-ping rounded-full`}></span>
              <span className={`h-2 w-2 ${avail.color} rounded-full relative z-10`}></span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-white/60">{avail.text}</span>
          </motion.div>

          {/* Main Heading (Restored Animations) */}
          <motion.h1
            variants={itemMotion}
            className="text-7xl sm:text-8xl md:text-[8xl] lg:text-[13rem] font-black tracking-tighter mb-8 leading-[0.75] uppercase"
          >
            <motion.span 
              className="block overflow-hidden"
              animate={{ 
                color: ['#FFFFFF', '#FF3B00', '#00E5FF', '#FF0099', '#AAFF00', '#FFFFFF'],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            >
              JAMES
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent opacity-90"
              style={{ backgroundSize: '200% auto' }}
              animate={{ 
                backgroundPosition: ['0% center', '200% center'],
                backgroundImage: [
                  'linear-gradient(to right, #FFFFFF, #FF3B00, #00E5FF, #FFFFFF)',
                  'linear-gradient(to right, #00E5FF, #FFFFFF, #FF0099, #00E5FF)',
                  'linear-gradient(to right, #FF0099, #FFFFFF, #AAFF00, #FF0099)',
                ]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              UCHECHI
            </motion.span>
          </motion.h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mt-12">
            {/* Description / Mission */}
            <motion.p
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { 
                  opacity: 1, 
                  x: 0, 
                  transition: { duration: 1, delay: 0.8, ease: "easeOut" } 
                }
              }}
              className="text-2xl sm:text-3xl md:text-5xl text-white font-medium max-w-4xl leading-[1.1] italic tracking-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              I build <span className="text-white/40">polished</span>, intuitive, and <span className="text-white">thoughtful</span> digital experiences that <span className="text-white">leave a mark</span>.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemMotion} className="flex gap-4 shrink-0">
              <a
                href="#works"
                className="group inline-flex items-center gap-6 rounded-full bg-white text-black px-14 py-6 text-sm font-mono font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_25px_50px_-12px_rgba(255,255,255,0.4)]"
              >
                Portfolio
                <FiArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-6 rounded-full border-2 border-white/20 bg-white/5 text-white px-14 py-6 text-sm font-mono font-black uppercase tracking-[0.3em] backdrop-blur-xl hover:bg-white/10 transition-all font-bold"
              >
                Let&apos;s Talk
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
