'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCode } from 'react-icons/fi';
import { notFound } from 'next/navigation';

export default function ProjectDetails({ params }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    // Await params to get the slug
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  useEffect(() => {
    if (slug) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchProject = async () => {
    if (!slug) return;
    
    try {
      const res = await fetch('/api/projects');
      const projects = await res.json();
      
      // Find project by slug (or fallback to title-based slug for old projects)
      const foundProject = projects.find(p => {
        if (p.slug === slug) return true;
        // Fallback: check if generated slug from title matches
        const generatedSlug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return generatedSlug === slug;
      });
      
      if (!foundProject) {
        notFound();
      }
      
      setProject(foundProject);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  // Safely parse technologies and gallery
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

  const getGallery = () => {
    try {
      if (!project.gallery) return [];
      if (Array.isArray(project.gallery)) return project.gallery;
      const parsed = JSON.parse(project.gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing gallery:', error);
      return [];
    }
  };

  const technologies = getTechnologies();
  const gallery = getGallery();

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <FiCode className="text-white/20" style={{ fontSize: '15rem' }} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-12 pb-12 pt-32">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link 
                href="/#works" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              >
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Projects
              </Link>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex gap-4 text-sm text-white/60 mb-4">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4">About the Project</h2>
                <p className="text-lg text-black/70 leading-relaxed">
                  {project.description}
                </p>
              </motion.div>

              {/* Technologies */}
              {technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h3 className="text-2xl font-bold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="bg-black text-white px-4 py-2 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Photo Gallery */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="col-span-2"
                >
                  <h3 className="text-2xl font-bold mb-6">Project Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gallery.map((imageUrl, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                      >
                        <Image
                          src={imageUrl}
                          alt={`${project.title} screenshot ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-8 space-y-6"
              >
                {/* Project Links */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-lg mb-4">Project Links</h3>
                  
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <FiExternalLink className="text-xl group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <div className="font-medium">Live Demo</div>
                        <div className="text-sm text-black/50">View the project</div>
                      </div>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow group"
                    >
                      <FiGithub className="text-xl group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <div className="font-medium">Source Code</div>
                        <div className="text-sm text-black/50">View on GitHub</div>
                      </div>
                    </a>
                  )}

                  {!project.projectUrl && !project.githubUrl && (
                    <p className="text-black/50 text-sm">No external links available</p>
                  )}
                </div>

                {/* Project Info */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-lg mb-4">Project Info</h3>
                  
                  <div>
                    <div className="text-sm text-black/50 mb-1">Category</div>
                    <div className="font-medium">{project.category}</div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50 mb-1">Year</div>
                    <div className="font-medium">{project.year}</div>
                  </div>

                  <div>
                    <div className="text-sm text-black/50 mb-1">Status</div>
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12 bg-black text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Interested in working together?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Let&apos;s create something amazing together
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
