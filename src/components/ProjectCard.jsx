'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCode, FiX, FiGithub, FiExternalLink } from 'react-icons/fi';
import { isNetlifyBlobUrl, normalizeImageUrl } from '@/lib/imageUtils';



export default function ProjectCard({ project, index, showDetailsHint = true }) {
  const [isFlipped,   setIsFlipped]   = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const isTouchRef = useRef(false);
  const hintTimer  = useRef(null);

  // ── Pointer detection (SSR-safe, no matchMedia) ───────────
  useEffect(() => {
    const onTouch = () => { isTouchRef.current = true; };
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  // ── Hint auto-hide after 2.5 s ─────────────────────────────
  useEffect(() => {
    hintTimer.current = setTimeout(() => setHintVisible(false), 2500);
    return () => clearTimeout(hintTimer.current);
  }, []);

  // ── Flip logic ─────────────────────────────────────────────
  const flip   = useCallback(() => setIsFlipped(true),  []);
  const unflip = useCallback(() => setIsFlipped(false), []);

  const handleFrontClick = () => {
    if (isTouchRef.current) flip();
  };
  const handleFrontKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
  };
  const handleMouseEnter = () => {
    if (!isTouchRef.current) flip();
  };
  const handleMouseLeave = () => {
    if (!isTouchRef.current) unflip();
  };

  // ── Data helpers ───────────────────────────────────────────
  const getTechnologies = () => {
    try {
      if (!project.technologies) return [];
      if (Array.isArray(project.technologies)) return project.technologies;
      const p = JSON.parse(project.technologies);
      return Array.isArray(p) ? p : [];
    } catch { return []; }
  };

  const technologies = getTechnologies();
  const slug = project.slug ||
    project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-80"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseEnter={handleMouseLeave /* reset */ }
        onMouseLeave={handleMouseLeave}
      >
        {/* Wrapper that does the actual 3D rotation */}
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          onMouseEnter={() => { if (!isTouchRef.current) setIsFlipped(true);  }}
          onMouseLeave={() => { if (!isTouchRef.current) setIsFlipped(false); }}
        >

          {/* ── Front face ── */}
          <div
            className="absolute inset-0 backface-hidden cursor-pointer"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${project.title}`}
            onClick={handleFrontClick}
            onKeyDown={handleFrontKeyDown}
          >
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden relative">
              {project.imageUrl ? (
                <Image
                  src={normalizeImageUrl(project.imageUrl)}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={isNetlifyBlobUrl(project.imageUrl)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                  <FiCode className="text-white/20" style={{ fontSize: '8rem' }} />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Project info */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                <div className="flex gap-4 text-sm text-white/60">
                  <span>{project.category}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Tap hint — touch only, auto-hides */}
              <AnimatePresence>
                {showDetailsHint && hintVisible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm
                               text-white/70 text-xs px-3 py-1.5 rounded-full
                               border border-white/10 pointer-events-none"
                  >
                    Tap for details
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop hint */}
              {showDetailsHint && (
                <div className="hidden md:block absolute top-4 right-4 text-white/30 text-xs">
                  Hover for details
                </div>
              )}
            </div>
          </div>

          {/* ── Back face ── */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full h-full bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col justify-between">

              {/* Close button — touch only */}
              <button
                onClick={e => { e.stopPropagation(); unflip(); }}
                className="absolute right-4 top-4 md:hidden inline-flex items-center
                           justify-center h-8 w-8 rounded-full border border-gray-200
                           text-black/60 hover:bg-gray-100 transition bg-white z-10"
                aria-label="Close details"
              >
                <FiX size={14} />
              </button>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-black mb-2 pr-8">{project.title}</h3>
                <p className="text-black/65 text-sm mb-4 line-clamp-4 leading-relaxed">
                  {project.description}
                </p>

                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs bg-black text-white px-2.5 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                    {technologies.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                        +{technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/projects/${slug}`}
                  className="flex-1 bg-black text-white px-4 py-2.5 rounded-xl
                             text-center text-sm font-medium hover:bg-gray-800
                             transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  View details
                </Link>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl
                               hover:bg-gray-50 transition-colors flex items-center"
                    aria-label="Live demo"
                  >
                    <FiExternalLink size={16} />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl
                               hover:bg-gray-50 transition-colors flex items-center"
                    aria-label="GitHub repo"
                  >
                    <FiGithub size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}