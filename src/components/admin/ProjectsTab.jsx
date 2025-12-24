'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';
import { isNetlifyBlobUrl, normalizeImageUrl } from '@/lib/imageUtils';

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
    technologies: []
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
      technologies: technologies
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
      technologies: []
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
                    unoptimized={isNetlifyBlobUrl(project.imageUrl)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{project.title}</h4>
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
