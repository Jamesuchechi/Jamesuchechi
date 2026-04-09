'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';
import { normalizeImageUrl } from '@/lib/imageUtils';

export default function ProjectsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    year: new Date().getFullYear(),
    description: '',
    imageUrl: '',
    gallery: [],
    projectUrl: '',
    githubUrl: '',
    technologies: [],
    problem: '',
    process: '',
    outcome: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies,
          gallery: formData.gallery
        })
      });

      if (!res.ok) throw new Error('Failed to save project');

      await fetchProjects();
      resetForm();
      alert(`Project ${editingProject ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    
    // Safely parse technologies
    let technologies = [];
    try {
      if (project.technologies) {
        if (Array.isArray(project.technologies)) {
          technologies = project.technologies;
        } else {
          const parsed = JSON.parse(project.technologies);
          technologies = Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (error) {
      console.error('Error parsing technologies:', error);
    }
    
    // Safely parse gallery
    let gallery = [];
    try {
      if (project.gallery) {
        if (Array.isArray(project.gallery)) {
          gallery = project.gallery;
        } else {
          const parsed = JSON.parse(project.gallery);
          gallery = Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (error) {
      console.error('Error parsing gallery:', error);
    }
    
    setFormData({
      title: project.title,
      category: project.category,
      year: project.year,
      description: project.description,
      imageUrl: project.imageUrl,
      gallery: gallery,
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: technologies,
      problem: project.problem || '',
      process: project.process || '',
      outcome: project.outcome || ''
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      
      await fetchProjects();
      alert('Project deleted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
      gallery: [],
      projectUrl: '',
      githubUrl: '',
      technologies: [],
      problem: '',
      process: '',
      outcome: ''
    });
    setEditingProject(null);
  };

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...formData.technologies, '']
    });
  };

  const updateTechnology = (index, value) => {
    const newTech = [...formData.technologies];
    newTech[index] = value;
    setFormData({ ...formData, technologies: newTech });
  };

  const removeTechnology = (index) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <p className="text-gray-600">Manage your portfolio projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                placeholder="My Awesome Project"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                  placeholder="Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year *</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 resize-none transition-all"
                placeholder="Describe your project..."
              />
            </div>

            <ImageUpload
              label="Cover Image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />

            <ImageUpload
              label="Gallery Images"
              value={formData.gallery}
              onChange={(gallery) => setFormData({ ...formData, gallery })}
              multiple={true}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project URL</label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            {/* ── Cinematic Case Study Section ── */}
            <div className="mt-12 pt-10 border-t-2 border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800">Project Detail / Case Study Content</h4>
              </div>
              <p className="text-sm text-slate-500 mb-8 max-w-md italic">
                This data powers the high-impact "Deep Dive" section on the project detail page. 
                Complete these to add that rich context you mentioned.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">The Problem</label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 text-slate-900 placeholder-slate-400 resize-none transition-all"
                    placeholder="Identify the pain points or challenges..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">The Process</label>
                  <textarea
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 text-slate-900 placeholder-slate-400 resize-none transition-all"
                    placeholder="Describe your creative and technical journey..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">The Outcome</label>
                  <textarea
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 text-slate-900 placeholder-slate-400 resize-none transition-all"
                    placeholder="What was the measurable impact or final result?"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technologies</label>
              <div className="space-y-2">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateTechnology(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all"
                      placeholder="React, Node.js, etc."
                    />
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Add Technology
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">Existing Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={normalizeImageUrl(project.imageUrl)}
                    alt={project.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{project.title}</h4>
                      {(project.problem || project.process || project.outcome) && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                          ✓ Case Study Ready
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{project.category} • {project.year}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-500 text-center py-8">No projects yet. Create your first project!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
