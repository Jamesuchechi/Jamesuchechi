'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCode, FiX, FiGithub, FiExternalLink } from 'react-icons/fi';
import { normalizeImageUrl } from '@/lib/imageUtils';

export default function ProjectCard({ project, index, showDetailsHint = true }) {
  const [isFlipped,   setIsFlipped]   = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const isTouchRef = useRef(false);
  const hintTimer  = useRef(null);

  useEffect(() => {
    const onTouch = () => { isTouchRef.current = true; };
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  useEffect(() => {
    hintTimer.current = setTimeout(() => setHintVisible(false), 2500);
    return () => clearTimeout(hintTimer.current);
  }, []);

  const flip   = useCallback(() => setIsFlipped(true),  []);
  const unflip = useCallback(() => setIsFlipped(false), []);

  const handleFrontClick = () => { if (isTouchRef.current) flip(); };
  const handleFrontKeyDown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };

  const getTechnologies = () => {
    try {
      if (!project.technologies) return [];
      if (Array.isArray(project.technologies)) return project.technologies;
      const p = JSON.parse(project.technologies);
      return Array.isArray(p) ? p : [];
    } catch { return []; }
  };

  const technologies = getTechnologies();
  const slug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const noiseDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.15'/%3E%3C/svg%3E";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-2000 group"
      style={{ perspective: '2000px' }}
    >
      <div className="relative w-full h-96 transition-all duration-700 group-hover:scale-[0.97]" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          onMouseEnter={() => { if (!isTouchRef.current) setIsFlipped(true);  }}
          onMouseLeave={() => { if (!isTouchRef.current) setIsFlipped(false); }}
        >
          {/* ── Front Face ── */}
          <div
            className="absolute inset-0 backface-hidden cursor-pointer"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            role="button" tabIndex={0} onClick={handleFrontClick} onKeyDown={handleFrontKeyDown}
          >
            <div className="w-full h-full bg-[#f3f3f3] rounded-3xl overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-shadow">
              
              {/* Noise Overlay */}
              <div className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none opacity-20" style={{ backgroundImage: `url("${noiseDataUrl}")` }} />

              {project.imageUrl ? (
                <Image
                  src={normalizeImageUrl(project.imageUrl)}
                  alt={project.title} fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 blur-none group-hover:blur-[2px] opacity-100 group-hover:opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/5">
                  <FiCode className="text-black/5" style={{ fontSize: '8rem' }} />
                </div>
              )}

              {/* Editorial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Project Info */}
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="w-8 h-px bg-white/40" />
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/60 font-bold italic">Index // {String(index+1).padStart(2, '0')}</span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black text-white mb-4 leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                  {project.title}
                </h3>
                
                <div className="flex gap-6 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase font-bold">
                  <span>{project.category}</span>
                  <span className="text-white/20">/</span>
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Direct Link Icon (Front) */}
              <Link 
                href={`/projects/${slug}`}
                onClick={e => e.stopPropagation()}
                className="absolute top-10 right-10 z-30 h-14 w-14 bg-white rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 hover:bg-[#FF3B00] hover:text-white"
              >
                <FiArrowUpRight size={24} />
              </Link>

              {/* Bottom "View" Label */}
              <div className="absolute bottom-10 right-10 z-20 overflow-hidden hidden md:block">
                <Link 
                  href={`/projects/${slug}`}
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 group/btn"
                >
                  <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase font-bold translate-x-10 group-hover:translate-x-0 transition-transform duration-500">View Record //</span>
                  <div className="h-px w-0 group-hover:w-8 bg-[#FF3B00] transition-all duration-500" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Back Face (The Technical Folio) ── */}
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full bg-white border border-black/5 rounded-3xl p-10 md:p-14 flex flex-col justify-between shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]">
              
              {/* Close Button - Touch Only */}
              <button onClick={e => { e.stopPropagation(); unflip(); }} className="absolute right-6 top-6 md:hidden text-black/20 hover:text-black transition cursor-pointer z-50">
                <FiX size={20} />
              </button>

              <div className="relative">
                <div className="mb-10 pb-6 border-b border-black/5">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-black/30 font-bold italic mb-4 block">DESCRIPTION // FOLIO</span>
                  <h3 className="text-2xl md:text-4xl font-black text-black leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                    {project.title}
                  </h3>
                </div>

                <p className="text-black/60 text-base md:text-lg leading-relaxed font-medium mb-10 line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>
                  {project.description}
                </p>

                {technologies.length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-black/20 font-bold mb-4 block underline underline-offset-8">TECH_STACK</span>
                    <div className="flex flex-wrap gap-2">
                      {technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="font-mono text-[10px] text-black/80 font-bold border border-black/5 px-4 py-2 rounded-sm bg-black/5 tracking-wider uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="pt-10 border-t border-black/5 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${slug}`}
                  className="flex-1 bg-black text-white px-6 py-4 rounded-full text-center font-mono text-[10px] tracking-[0.3em] uppercase hover:scale-105 transition-transform"
                  onClick={e => e.stopPropagation()}
                >
                  View Details
                </Link>

                <div className="flex gap-2">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="p-4 border border-black/5 rounded-full hover:bg-black/5 transition-colors text-black/40 hover:text-black">
                      <FiExternalLink size={18} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-4 border border-black/5 rounded-full hover:bg-black/5 transition-colors text-black/40 hover:text-black">
                      <FiGithub size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
