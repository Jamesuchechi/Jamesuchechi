'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageUpload from './ImageUpload';
import { normalizeImageUrl } from '@/lib/imageUtils';

export default function TeamTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    profilePic: '',
    portfolioUrl: '',
    githubUrl: '',
    order: 0
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeam(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching team:', error);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingMember ? `/api/team/${editingMember.id}` : '/api/team';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save team member');

      await fetchTeam();
      resetForm();
      alert(`Member ${editingMember ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      profilePic: member.profilePic || '',
      portfolioUrl: member.portfolioUrl || '',
      githubUrl: member.githubUrl || '',
      order: member.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete team member');
      
      await fetchTeam();
      alert('Member removed successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      description: '',
      profilePic: '',
      portfolioUrl: '',
      githubUrl: '',
      order: 0
    });
    setEditingMember(null);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading team registry...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <p className="text-gray-600">Manage your collaborators and team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingMember ? 'Edit Member' : 'Add New Member'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role / Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all"
                placeholder="Senior Backend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description / Bio *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all resize-none"
                placeholder="A brief bio or description of their contribution..."
              />
            </div>

            <ImageUpload
              label="Profile Picture"
              value={formData.profilePic}
              onChange={(url) => setFormData({ ...formData, profilePic: url })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all"
                  placeholder="https://johndoe.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all"
                  placeholder="https://github.com/johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none bg-slate-50 transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-bold"
              >
                {saving ? 'Saving...' : editingMember ? 'Update Member' : 'Add to Team'}
              </button>
              {editingMember && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Team List */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">Active Registry</h3>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.id} className="border border-slate-100 rounded-xl p-4 hover:border-indigo-100 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={member.profilePic ? normalizeImageUrl(member.profilePic) : '/next.svg'}
                      alt={member.name}
                      fill
                      className="rounded-xl object-cover grayscale"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                    <p className="text-xs font-mono uppercase tracking-wider text-indigo-600 mb-1">{member.role}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 italic">"{member.description}"</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {team.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
                <p className="text-slate-400 text-sm">No team members registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
