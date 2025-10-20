'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiCode } from 'react-icons/fi';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      // Ensure data is an array
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const ProjectCard = ({ project, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Safely parse technologies
    const getTechnologies = () => {
      try {
        if (!project.technologies) return [];
        const parsed = JSON.parse(project.technologies);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing technologies:', error);
        return [];
      }
    };

    const technologies = getTechnologies();

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
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
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
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                    <div className="flex gap-4 text-sm text-white/60">
                      <span>{project.category}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <div className="text-white/40 text-sm">
                    Hover for details
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="w-full h-full bg-white border-2 border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-black mb-3">{project.title}</h3>
                <p className="text-black/70 text-sm mb-4 line-clamp-4">{project.description}</p>
                
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
                  href={`/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
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
  };

  return (
    <section id="works" className="min-h-screen bg-white text-black py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">SELECTED WORKS /</h2>
          <p className="text-xl text-black/60">(PROJECTS)</p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-black/60 max-w-4xl mb-20"
        >
          Thoughtfully crafted digital experiences that blend utility and aesthetics 
          into something functional, memorable, and refined.
        </motion.p>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-xl text-black/40">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-black/40">No projects yet. Add some from the admin dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
