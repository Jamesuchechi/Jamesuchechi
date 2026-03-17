'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';



const CATEGORY_SPEEDS = [22, 28, 18, 25, 20, 30]; // seconds per loop

export default function Skills() {
  const [skills,          setSkills]          = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [reducedMotion,   setReducedMotion]   = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = e => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setSkills(arr);

        // Group by category
        const grouped = arr.reduce((acc, skill) => {
          const cat = skill.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(skill.name);
          return acc;
        }, {});

        setSkillCategories(
          Object.entries(grouped).map(([title, skills]) => ({ title, skills }))
        );
      })
      .catch(() => { setSkills([]); setSkillCategories([]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-black text-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-3 text-white/80">
            DEVELOPER
          </h2>
          <motion.h2
            animate={{
              textShadow: [
                '0 0 10px rgba(255,255,255,0.15)',
                '0 0 28px rgba(255,255,255,0.35)',
                '0 0 12px rgba(255,255,255,0.2)',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className="text-6xl md:text-8xl font-extrabold mb-3 text-white"
          >
            DESIGNER
          </motion.h2>
          <h2 className="text-5xl md:text-7xl font-bold text-white/80">
            CREATOR /
          </h2>
        </motion.div>

        {/* Skills tickers */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white/60">Loading skills...</p>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-white/40">No skills yet. Add some from the admin dashboard!</p>
          </div>
        ) : (
          <div className="space-y-14">
            {skillCategories.map((category, catIndex) => {
              const speed     = CATEGORY_SPEEDS[catIndex % CATEGORY_SPEEDS.length];
              const direction = catIndex % 2 === 0 ? 1 : -1; // alternate L↔R

              
              const doubled = [...category.skills, ...category.skills];

              return (
                <div key={category.title}>
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold mb-6 text-white/80 tracking-wide"
                  >
                    {category.title}
                  </motion.h3>

                  {/* Overflow mask */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      // fade edges
                      WebkitMaskImage:
                        'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                    }}
                  >
                    <motion.div
                      className="flex gap-6 whitespace-nowrap w-max"
                      animate={reducedMotion ? {} : {
                        x: direction === 1 ? ['0%', '-50%'] : ['-50%', '0%'],
                      }}
                      transition={reducedMotion ? {} : {
                        duration: speed,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    >
                      {doubled.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="text-4xl md:text-5xl font-semibold text-white/35 hover:text-white/70 transition-colors cursor-default select-none"
                        >
                          # {skill}
                        </span>
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