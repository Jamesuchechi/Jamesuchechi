'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCode, FiEye, FiX } from 'react-icons/fi';

export default function ProjectCard({ project, index, showDetailsHint = true }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setIsTouch(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const handleHover = (value) => {
    if (isTouch) return;
    setIsFlipped(value);
  };

  const getTechnologies = () => {
    try {
      if (!project.technologies) return [];
      if (Array.isArray(project.technologies)) return project.technologies;
      const parsed = JSON.parse(project.technologies);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing technologies:', error);
      return [];
    }
  };

  const technologies = getTechnologies();
  const slug =
    project.slug ||
    project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="perspective-1000"
    >
      <div
        className={`relative w-full h-80 transform-style-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onMouseEnter={() => handleHover(true)}
        onMouseLeave={() => handleHover(false)}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden relative group">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <FiCode className="text-white/20" style={{ fontSize: '8rem' }} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Project info overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {project.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-white/60">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>
                {showDetailsHint && (
                  <div className="hidden md:block text-white/40 text-sm">
                    Hover for details
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="View details"
                >
                  <FiEye />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col justify-between relative">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="absolute right-4 top-4 md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 text-black/70 hover:bg-gray-100 transition"
              aria-label="Close details"
            >
              <FiX />
            </button>
            <div>
              <h3 className="text-2xl font-bold text-black mb-3">{project.title}</h3>
              <p className="text-black/70 text-sm mb-4 line-clamp-4">
                {project.description}
              </p>

              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs bg-black text-white px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {technologies.length > 3 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      +{technologies.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href={`/projects/${slug}`}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-center text-sm hover:bg-gray-800 transition-colors"
              >
                View Details
              </Link>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FiArrowUpRight />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
