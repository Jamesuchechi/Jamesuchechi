'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Magnet from '@/components/reactbits/Magnet';
import DecryptedText from '@/components/reactbits/DecryptedText';

const CATEGORY_SPEEDS = [24, 30, 20, 26, 22, 32]; // seconds per loop

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedIndex, setPausedIndex] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setSkills(arr);

        // Group by category
        const grouped = arr.reduce((acc, skill) => {
          const cat = skill.category || 'Core Technologies';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(skill.name);
          return acc;
        }, {});

        setSkillCategories(
          Object.entries(grouped).map(([title, skills]) => ({ title, skills }))
        );
      })
      .catch(() => {
        setSkills([]);
        setSkillCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-[#06070a] text-white py-24 sm:py-32 overflow-hidden relative border-t border-white/[0.06]">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          {/* Cyber Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <DecryptedText
              text="TECHNICAL ARSENAL // CORE CAPABILITIES"
              speed={30}
              animateOn="view"
              className="text-[10px] font-mono tracking-[0.2em] text-cyan-300 uppercase font-semibold"
            />
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black mb-3 text-white/50 tracking-tight uppercase">
            DEVELOPER
          </h2>
          <motion.h2
            animate={{
              textShadow: [
                '0 0 10px rgba(0,229,255,0.15)',
                '0 0 35px rgba(0,229,255,0.4)',
                '0 0 15px rgba(0,229,255,0.2)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-3 text-white tracking-tight uppercase"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ENGINEER
          </motion.h2>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white/50 tracking-tight uppercase">
            CREATOR /
          </h2>
        </motion.div>

        {/* Skills tickers */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto mb-4" />
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Compiling tech stack...</p>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-white/40 font-mono">No skills loaded.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {skillCategories.map((category, catIndex) => {
              const speed = CATEGORY_SPEEDS[catIndex % CATEGORY_SPEEDS.length];
              const direction = catIndex % 2 === 0 ? 1 : -1; // alternate L↔R

              const doubled = [...category.skills, ...category.skills, ...category.skills];

              return (
                <div key={category.title} className="group">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                    <motion.h3
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="text-lg sm:text-xl font-bold font-mono text-white/80 tracking-wider uppercase"
                    >
                      {category.title}
                    </motion.h3>
                  </div>

                  {/* Overflow mask */}
                  <div
                    className="relative overflow-hidden py-3"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                    }}
                    onMouseEnter={() => setPausedIndex(catIndex)}
                    onMouseLeave={() => setPausedIndex(null)}
                  >
                    <motion.div
                      className="flex gap-4 sm:gap-6 whitespace-nowrap w-max"
                      animate={
                        reducedMotion || pausedIndex === catIndex
                          ? {}
                          : {
                              x: direction === 1 ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
                            }
                      }
                      transition={
                        reducedMotion || pausedIndex === catIndex
                          ? {}
                          : {
                              duration: speed,
                              ease: 'linear',
                              repeat: Infinity,
                              repeatType: 'loop',
                            }
                      }
                    >
                      {doubled.map((skill, skillIndex) => (
                        <Magnet key={`${skill}-${skillIndex}`} padding={30} magnetStrength={2.5}>
                          <div className="group/chip relative px-5 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer shadow-sm backdrop-blur-sm select-none">
                            <span className="font-mono text-sm sm:text-base font-semibold text-white/60 group-hover/chip:text-white transition-colors flex items-center gap-2">
                              <span className="text-cyan-400/60 group-hover/chip:text-cyan-400 font-bold">#</span>
                              {skill}
                            </span>
                          </div>
                        </Magnet>
                      ))}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}