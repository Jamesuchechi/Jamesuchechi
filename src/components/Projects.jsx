'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';

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
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
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

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-black/40">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-black/40">No projects yet. Add some from the admin dashboard!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-t border-black/10 pt-8 group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Number */}
                  <div className="text-4xl font-bold text-black/10">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 group-hover:text-black/70 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex gap-4 text-sm text-black/60">
                          <span>{project.category}</span>
                          <span>•</span>
                          <span>Development</span>
                          <span>•</span>
                          <span>{project.year}</span>
                        </div>
                      </div>
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm hover:gap-4 transition-all"
                        >
                          View Project <FiArrowUpRight />
                        </a>
                      )}
                    </div>
                    <p className="text-black/60 mb-4">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(project.technologies).map((tech, i) => (
                          <span key={i} className="text-xs bg-black/5 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
