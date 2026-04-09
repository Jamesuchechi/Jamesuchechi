'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

function EduCard({ edu, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.95, 1, 1, 0.95]);

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
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#AAFF00] mb-2">{edu.period}</p>
            <div className="h-px w-12 mb-4 bg-[#AAFF00]/50" />
            <span className="text-[9px] uppercase font-mono tracking-widest px-3 py-1 rounded-full border border-[#AAFF00]/20 text-[#AAFF00] bg-[#AAFF00]/5">
              Academic
            </span>
          </div>
        </div>

        {/* Content Card */}
        <div className="md:w-3/4 p-8 md:p-12 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5 blur-3xl rounded-full pointer-events-none bg-[#AAFF00]" />
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight uppercase italic" style={{ fontFamily: 'Georgia, serif' }}>
              {edu.degree}
            </h3>
            <p className="text-xl text-white/60 mb-8 font-medium italic" style={{ fontFamily: 'Georgia, serif' }}>
              {edu.school} {edu.location && `• ${edu.location}`}
            </p>

            <div className="space-y-6 text-white/50 leading-relaxed text-lg max-w-2xl whitespace-pre-line">
              {edu.description}
            </div>

            {edu.honors && (
              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#FF3B00] mb-4">Scholastic Honors</p>
                <div className="text-white/80 italic text-xl leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  ⭐ {edu.honors}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/education')
      .then(r => r.json())
      .then(d => setEducation(Array.isArray(d) ? d : []))
      .catch(() => setEducation([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#07090c] text-white py-32 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-32">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono tracking-[0.5em] text-[#AAFF00] uppercase mb-4"
          >
            Academic Pedigree // 05
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-6xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Scholastic <br /> Foundation
          </motion.h2>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-12 w-12 border-2 border-white/10 border-t-white rounded-full" />
          </div>
        ) : education.length === 0 ? (
          <div className="text-center py-40 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="font-mono text-white/30 italic uppercase tracking-widest">No academic records found in database.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-[12.5%] top-0 bottom-0 w-px bg-gradient-to-b from-[#AAFF00]/20 via-[#AAFF00]/5 to-transparent" />
            
            <div className="space-y-32">
              {education.map((edu, i) => (
                <EduCard key={edu.id} edu={edu} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
