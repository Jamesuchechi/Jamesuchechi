'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getTechnologies = (project) => {
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

  const categories = useMemo(() => {
    const values = projects
      .map((project) => project.category)
      .filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [projects]);

  const years = useMemo(() => {
    const values = projects
      .map((project) => project.year)
      .filter(Boolean);
    return Array.from(new Set(values)).sort((a, b) => b - a);
  }, [projects]);

  const techOptions = useMemo(() => {
    const values = projects.flatMap(getTechnologies).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;
      const matchesYear =
        selectedYear === 'all' || String(project.year) === selectedYear;
      const matchesTech =
        selectedTech === 'all' ||
        getTechnologies(project).includes(selectedTech);
      return matchesCategory && matchesYear && matchesTech;
    });
  }, [projects, selectedCategory, selectedYear, selectedTech]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / itemsPerPage)
  );
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedYear, selectedTech]);

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="relative overflow-hidden px-6 sm:px-12 pt-24 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,200,140,0.35),transparent_70%)] blur-2xl"></div>
          <div className="absolute -bottom-20 left-[-8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(110,170,255,0.35),transparent_70%)] blur-3xl"></div>
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#00000022_1px,transparent_1px)] [background-size:22px_22px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <Link
              href="/#works"
              className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors"
            >
              <FiArrowLeft />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">ALL PROJECTS /</h1>
            <p className="text-lg md:text-xl text-black/60 max-w-3xl">
              A curated archive of shipped work, experiments, and thoughtful build-outs.
              Explore the full range and dig into the details.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-6 sm:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
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
            <>
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-black/50">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                      className="h-11 rounded-full border border-black/10 px-4 text-sm font-medium"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-black/50">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      className="h-11 rounded-full border border-black/10 px-4 text-sm font-medium"
                    >
                      <option value="all">All Years</option>
                      {years.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-black/50">
                      Tech
                    </label>
                    <select
                      value={selectedTech}
                      onChange={(event) => setSelectedTech(event.target.value)}
                      className="h-11 rounded-full border border-black/10 px-4 text-sm font-medium"
                    >
                      <option value="all">All Tech</option>
                      {techOptions.map((tech) => (
                        <option key={tech} value={tech}>
                          {tech}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedYear('all');
                      setSelectedTech('all');
                    }}
                    className="h-10 rounded-full border border-black/10 px-4 text-xs font-semibold uppercase tracking-wider hover:border-black/30 transition"
                  >
                    Clear Filters
                  </button>
                  <div className="text-sm text-black/60">
                    Showing {paginatedProjects.length} of {filteredProjects.length}
                  </div>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-black/40">No projects match those filters.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        className="h-10 rounded-full border border-black/10 px-4 text-sm font-semibold hover:border-black/30 transition disabled:opacity-40"
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
                            page === currentPage
                              ? 'border-black bg-black text-white'
                              : 'border-black/10 hover:border-black/30'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        className="h-10 rounded-full border border-black/10 px-4 text-sm font-semibold hover:border-black/30 transition disabled:opacity-40"
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
