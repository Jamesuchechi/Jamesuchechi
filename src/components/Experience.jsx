'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const TYPE_CONFIG = {
  Formal: { color: '#7B61FF', label: 'Professional' },
  Freelance: { color: '#00E5FF', label: 'Independent' },
  Volunteer: { color: '#AAFF00', label: 'Community' },
};

function ExpCard({ exp, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95]);

  const config = TYPE_CONFIG[exp.type] || TYPE_CONFIG.Formal;
  const techs = exp.technologies ? (Array.isArray(exp.technologies) ? exp.technologies : JSON.parse(exp.technologies)) : [];

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity, scale }}
      className="relative mb-24 last:mb-0"
    >
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Date / Pillar */}
        <div className="md:w-1/4 pt-2">
          <div className="sticky top-40">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">{exp.period}</p>
            <div className="h-px w-12 mb-4" style={{ background: config.color }} />
            <span 
              className="text-[9px] uppercase font-mono tracking-widest px-3 py-1 rounded-full border" 
              style={{ borderColor: `${config.color}40`, color: config.color, background: `${config.color}10` }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Content Card */}
        <div className="md:w-3/4 p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 blur-3xl rounded-full pointer-events-none" style={{ background: config.color }} />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight uppercase italic" style={{ fontFamily: 'Georgia, serif' }}>
              {exp.role}
            </h3>
            <p className="text-xl text-white/60 mb-8 font-medium italic" style={{ fontFamily: 'Georgia, serif' }}>
              @ {exp.company} {exp.location && `• ${exp.location}`}
            </p>

            <div className="space-y-6 text-white/50 leading-relaxed text-lg max-w-2xl whitespace-pre-line">
              {exp.description}
            </div>

            {exp.results && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] uppercase font-mono tracking-widest text-white/30 mb-4">Core Impact</p>
                <div className="text-white/70 italic text-xl leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {exp.results}
                </div>
              </div>
            )}

            {techs.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {techs.map((t, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-mono tracking-widest text-white/40">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(d => setExperience(Array.isArray(d) ? d : []))
      .catch(() => setExperience([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#07090c] text-white py-32 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-32">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono tracking-[0.5em] text-[#00E5FF] uppercase mb-4"
          >
            Tactical Pedigree // 04
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Digital <br /> Journey
          </motion.h2>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-12 w-12 border-2 border-white/10 border-t-white rounded-full" />
          </div>
        ) : experience.length === 0 ? (
          <div className="text-center py-40 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="font-mono text-white/30 italic uppercase tracking-widest">No records found in database.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-[12.5%] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
            
            <div className="space-y-32">
              {experience.map((exp, i) => (
                <ExpCard key={exp.id} exp={exp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
