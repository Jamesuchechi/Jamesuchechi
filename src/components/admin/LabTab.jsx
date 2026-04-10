'use client';
import { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', status: 'Learning', progress: 0, link: '', tags: [] };

export default function LabTab() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lab');
      const d   = await res.json();
      setItems(Array.isArray(d) ? d : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    let tags = [];
    try {
      tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []);
    } catch { tags = []; }
    
    setForm({ title: item.title, description: item.description, status: item.status, progress: item.progress, link: item.link || '', tags });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/lab/${editing}` : '/api/lab';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to save');
      await fetchAll();
      cancel();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const res = await fetch(`/api/lab/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchAll();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const f = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })),
  });

  const updateTag = (idx, val) => {
    const t = [...form.tags];
    t[idx] = val;
    setForm(p => ({ ...p, tags: t }));
  };
  const addTag = () => setForm(p => ({ ...p, tags: [...p.tags, ''] }));
  const removeTag = (idx) => setForm(p => ({ ...p, tags: p.tags.filter((_, i) => i !== idx) }));

  const inputCls = 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">The Lab</h2>
          <p className="text-gray-600">Active Sprints & Experiments</p>
        </div>
        <button onClick={openNew} className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Add Entry
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h3 className="text-xl font-bold mb-5">{editing ? 'Edit Lab Entry' : 'New Lab Entry'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input {...f('title')} required placeholder="e.g. Distributed Systems Study" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select {...f('status')} className={inputCls}>
                  <option>Learning</option>
                  <option>Building</option>
                  <option>Researching</option>
                  <option>Complete</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea {...f('description')} required rows={3} placeholder="What are you doing specifically?" className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Progress (%)</label>
                <div className="flex items-center gap-4">
                  <input {...f('progress')} type="range" min="0" max="100" className="flex-1" />
                  <span className="font-mono w-12">{form.progress}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                <input {...f('link')} type="url" placeholder="https://..." className={inputCls} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Stack / Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((t, i) => (
                  <div key={i} className="flex gap-1">
                    <input value={t} onChange={e => updateTag(i, e.target.value)} className="px-3 py-1 border rounded" />
                    <button type="button" onClick={() => removeTag(i)} className="text-red-500">×</button>
                  </div>
                ))}
                <button type="button" onClick={addTag} className="px-3 py-1 bg-gray-100 rounded">+ Add</button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={cancel} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">The Lab is quiet. Add something you're working on!</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                    {item.status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </div>
                </div>
                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all" style={{ width: `${item.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-gray-400">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
