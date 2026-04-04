'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiArrowLeft, FiExternalLink, FiGithub, FiCode, 
  FiChevronLeft, FiChevronRight, FiX, FiMaximize2 
} from 'react-icons/fi';
import { notFound } from 'next/navigation';
import { normalizeImageUrl } from '@/lib/imageUtils';

/* ── Category Color Mapping ── */
const ACCENT_COLORS = {
  'Web Development': '#FF3B00', // Neon Orange
  'Mobile App': '#00E5FF',      // Cyan
  'UI/UX Design': '#AAFF00',    // Lime
  'Branding': '#FF0099',       // Pink
  'E-commerce': '#FFD700',      // Gold
  'AI / Machine Learning': '#7B61FF', // Purple
  'default': '#6366f1'          // Indigo
};

/* ── Content Section Component (Services-style) ── */
function DetailSection({ title, content, index, total, accent }) {
  const sectionRef = useRef(null);
  const num = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const titleYSpring = useSpring(titleY, { stiffness: 80, damping: 20 });
  
  const clipProgress = useTransform(scrollYProgress, [0, 0.25], [100, 0]);
  const clipSpring = useSpring(clipProgress, { stiffness: 60, damping: 18 });
  const clipPath = useTransform(clipSpring, v => `inset(${v}% 0% 0% 0%)`);

  const lineScale = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const lineSpring = useSpring(lineScale, { stiffness: 60, damping: 16 });

  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);

  return (
    <motion.div
      ref={sectionRef}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
        clipPath,
        background: '#080808'
      }}
      className="py-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Meta Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              className="px-3 py-1 text-xs font-bold text-black rounded-[2px]"
              style={{ background: accent, fontFamily: 'monospace' }}
            >
              {num}
            </motion.div>
            <span className="text-xs text-white/20 tracking-widest font-mono">/ {totalStr}</span>
          </div>
          <span 
            className="text-[10px] tracking-[0.3em] uppercase font-mono"
            style={{ color: accent }}
          >
            Insights
          </span>
        </div>

        {/* Title */}
        <div className="overflow-hidden mb-10">
          <motion.h3
            style={{ 
              y: titleYSpring,
              fontFamily: 'Georgia, serif'
            }}
            className="text-4xl md:text-7xl font-black text-white uppercase italic leading-none"
          >
            {title}
          </motion.h3>
        </div>

        {/* Animated Line */}
        <motion.div 
          style={{ 
            scaleX: lineSpring,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            transformOrigin: 'left'
          }}
          className="h-[1px] mb-12"
        />

        {/* Description Text */}
        <motion.div
          style={{ 
            opacity: contentOpacity,
            y: contentY,
            fontFamily: 'Georgia, serif'
          }}
          className="max-w-3xl"
        >
          <p className="text-xl md:text-2xl text-white/50 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Image Carousel Component (Instagram-style) ── */
function GalleryCarousel({ images, projectTitle, onImageClick, accent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const itemWidth = e.target.offsetWidth;
    const index = Math.round(scrollLeft / itemWidth);
    setCurrentIndex(index);
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-black/5 aspect-[4/5] md:aspect-video shadow-2xl">
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, i) => (
          <div 
            key={i} 
            className="min-w-full h-full snap-start relative cursor-pointer"
            onClick={() => onImageClick(i)}
          >
            <Image
              src={normalizeImageUrl(img)}
              alt={`${projectTitle} - ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white">
                <FiMaximize2 className="text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 transition-all ${currentIndex === 0 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={() => scrollTo(currentIndex + 1)}
            disabled={currentIndex === images.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 transition-all ${currentIndex === images.length - 1 ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8' : 'w-1.5'}`}
              style={{ background: i === currentIndex ? accent : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Fullscreen Modal Component ── */
function ImageModal({ images, activeIndex, onClose, onPrev, onNext, projectTitle }) {
  if (activeIndex === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <FiX size={28} />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full h-full"
          >
            <Image
              src={normalizeImageUrl(images[activeIndex])}
              alt={`${projectTitle} fullscreen`}
              fill
              className="object-contain"
            />
          </motion.div>

          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-4 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                <FiChevronLeft size={36} />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                <FiChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProjectDetails({ params }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  const fetchProject = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch('/api/projects');
      const projects = await res.json();
      const foundProject = projects.find(p => {
        if (p.slug === slug) return true;
        const generatedSlug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return generatedSlug === slug;
      });
      if (!foundProject) notFound();
      setProject(foundProject);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
  }, [slug, fetchProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!project) return null;

  const accentColor = ACCENT_COLORS[project.category] || ACCENT_COLORS.default;
  const techUsed = project.technologies ? (Array.isArray(project.technologies) ? project.technologies : JSON.parse(project.technologies)) : [];
  const gallery = project.gallery ? (Array.isArray(project.gallery) ? project.gallery : JSON.parse(project.gallery)) : [];
  
  // Combine hero image with gallery for the slideshow
  const allImages = [project.imageUrl, ...gallery].filter(Boolean);

  const sections = [
    { title: 'The Mission', content: project.description },
    { title: 'The Problem', content: project.problem },
    { title: 'The Process', content: project.process },
    { title: 'The Outcome', content: project.outcome },
  ].filter(s => s.content);

  return (
    <main className="min-h-screen bg-white">
      {/* ── Floating Back Button ── */}
      <nav className="fixed top-8 left-8 z-50">
        <Link 
          href="/#works"
          className="group relative flex items-center gap-3 bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-full overflow-hidden transition-all hover:pr-8 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 hover:bg-black"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform relative z-10" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] relative z-10">All Projects</span>
          <motion.div 
            className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(90deg, ${accentColor}33, transparent)` }}
          />
        </Link>
      </nav>

      {/* ── Cinematic Hero Section (Full Width Background) ── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden pb-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          {project.imageUrl && (
            <Image
              src={normalizeImageUrl(project.imageUrl)}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 rounded-full text-[10px] tracking-[0.3em] uppercase bg-white/10 backdrop-blur-md text-white border border-white/10 font-mono">
                  {project.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-mono">
                  {project.year}
                </span>
              </div>
              
              <h1 
                className="text-7xl md:text-[9rem] font-black uppercase text-white leading-[0.8] tracking-tight mb-4 max-w-5xl"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack & Links BridgeSection ── */}
      <section className="py-12 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 md:max-w-2xl">
            {techUsed.map((tech, i) => (
              <span 
                key={i} 
                className="text-[10px] md:text-[11px] uppercase tracking-widest border border-black/10 px-4 py-2 rounded-full font-mono text-black/60 hover:bg-black hover:text-white transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex gap-4 w-full md:w-auto">
            {project.projectUrl && (
              <a 
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-center justify-between gap-4 px-8 h-14 bg-black text-white rounded-full hover:scale-105 transition-transform"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest">Live Site</span>
                <FiExternalLink className="group-hover:rotate-45 transition-transform" />
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
              >
                <FiGithub size={20} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Instagram-style Gallery Section (Standalone) ── */}
      <section className="py-24 px-6 md:px-12 bg-gray-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-black/30 mb-2">Visual Showcase</p>
              <h2 className="text-4xl font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>The Gallery</h2>
            </div>
            <div className="text-[10px] font-mono text-black/20 uppercase tracking-widest">
              {allImages.length} Images / Project Showcase
            </div>
          </div>
          
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GalleryCarousel 
              images={allImages} 
              projectTitle={project.title} 
              onImageClick={(i) => setModalIndex(i)}
              accent={accentColor}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Case Study Detail Sections (Dark Theme) ── */}
      <section className="bg-[#080808] text-white">
        {sections.map((section, index) => (
          <DetailSection
            key={index}
            index={index}
            total={sections.length}
            title={section.title}
            content={section.content}
            accent={accentColor}
          />
        ))}
      </section>

      {/* ── CTA Corner ── */}
      <section className="bg-[#080808] pt-12 pb-32 px-6">
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-24 text-center">
          <h2 
            className="text-4xl md:text-7xl font-bold italic mb-12 uppercase" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Interested? <br /> <span style={{ color: accentColor }}>Let&apos;s work together.</span>
          </h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform"
          >
            Get In Touch
          </Link>
        </div>
      </section>

      {/* ── Fullscreen Modal ── */}
      <ImageModal
        images={allImages}
        activeIndex={modalIndex}
        onClose={() => setModalIndex(null)}
        onPrev={() => setModalIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1))}
        onNext={() => setModalIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0))}
        projectTitle={project.title}
      />
    </main>
  );
}
