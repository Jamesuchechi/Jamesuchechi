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
      <div className="relative w-full h-[460px] sm:h-[490px] md:h-[500px] transition-all duration-700 group-hover:scale-[0.98]" style={{ transformStyle: 'preserve-3d' }}>
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

              {/* Mobile Inspect Hint */}
              <div className="absolute top-6 left-6 z-30 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 md:hidden pointer-events-none">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/80">Tap to inspect</span>
              </div>

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
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-20">
                <div className="flex items-center gap-3 mb-2 sm:mb-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                  <div className="w-6 sm:w-8 h-px bg-white/40" />
                  <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/60 font-bold italic">Index // {String(index+1).padStart(2, '0')}</span>
                </div>

                <Link
                  href={`/projects/${slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block group/title hover:text-[#FF3B00] transition-colors"
                >
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-2 sm:mb-4 leading-tight md:leading-none tracking-tighter break-words" style={{ fontFamily: 'Georgia, serif' }}>
                    {project.title}
                  </h3>
                </Link>
                
                <div className="flex gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/60 uppercase font-bold">
                  <span>{project.category}</span>
                  <span className="text-white/20">/</span>
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Direct Link Icon (Front) */}
              <Link 
                href={`/projects/${slug}`}
                onClick={e => e.stopPropagation()}
                className="absolute top-6 right-6 sm:top-10 sm:right-10 z-30 h-11 w-11 sm:h-14 sm:w-14 bg-white rounded-full flex items-center justify-center text-black opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-100 md:scale-50 md:group-hover:scale-100 hover:bg-[#FF3B00] hover:text-white shadow-xl"
                aria-label={`Open ${project.title} case study`}
              >
                <FiArrowUpRight size={20} className="sm:w-6 sm:h-6" />
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
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full bg-white border border-black/5 rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col justify-between shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
              
              {/* Close Button - Touch Only */}
              <button 
                onClick={e => { e.stopPropagation(); unflip(); }} 
                className="absolute right-4 top-4 sm:right-6 sm:top-6 md:hidden p-2 rounded-full bg-black/5 hover:bg-black/10 text-black/60 transition cursor-pointer z-50"
                aria-label="Close folio"
              >
                <FiX size={20} />
              </button>

              <div className="relative">
                <div className="mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-black/5">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-black/40 font-bold italic mb-2 sm:mb-4 block">DESCRIPTION // FOLIO</span>
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-black leading-tight sm:leading-none tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
                    {project.title}
                  </h3>
                </div>

                <p className="text-black/70 text-sm sm:text-base md:text-lg leading-relaxed font-medium mb-6 sm:mb-10 line-clamp-3 sm:line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>
                  {project.description}
                </p>

                {technologies.length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-black/30 font-bold mb-3 sm:mb-4 block underline underline-offset-8">TECH_STACK</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="font-mono text-[9px] sm:text-[10px] text-black/80 font-bold border border-black/5 px-3 py-1.5 rounded-sm bg-black/5 tracking-wider uppercase">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="pt-6 sm:pt-10 border-t border-black/5 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${slug}`}
                  className="flex-1 bg-black text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-full text-center font-mono text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase hover:scale-105 active:scale-95 transition-transform"
                  onClick={e => e.stopPropagation()}
                >
                  View Case Study
                </Link>

                <div className="flex gap-2">
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="p-3 sm:p-4 border border-black/10 rounded-full hover:bg-black/5 transition-colors text-black/60 hover:text-black" aria-label="Visit project site">
                      <FiExternalLink size={18} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 sm:p-4 border border-black/10 rounded-full hover:bg-black/5 transition-colors text-black/60 hover:text-black" aria-label="Visit GitHub repository">
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
