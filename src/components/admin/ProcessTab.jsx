'use client';
import { useState, useEffect } from 'react';

const ICONS = ['search', 'pen', 'code', 'rocket', 'chart', 'data', 'api', 'deploy', 'review', 'support'];
const EMPTY = { stepNumber: 1, title: '', description: '', icon: 'code', durationHint: '', order: 0 };

export default function ProcessTab() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/process');
      const d   = await res.json();
      setItems(Array.isArray(d) ? d : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew  = () => { setEditing(null); setForm({ ...EMPTY, stepNumber: items.length + 1, order: items.length }); setShowForm(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ stepNumber: item.stepNumber, title: item.title, description: item.description, icon: item.icon || 'code', durationHint: item.durationHint || '', order: item.order });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/process/${editing}` : '/api/process';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      await fetchAll();
      cancel();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this step?')) return;
    try {
      const res = await fetch(`/api/process/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchAll();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const f = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })),
  });

  const inputCls = 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Process steps</h2>
          <p className="text-gray-600">Manage your "How I work" section</p>
        </div>
        <button onClick={openNew} className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Add step
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h3 className="text-xl font-bold mb-5">{editing ? 'Edit step' : 'New step'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Step number</label>
                <input {...f('stepNumber')} type="number" min="1" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display order</label>
                <input {...f('order')} type="number" min="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration hint</label>
                <input {...f('durationHint')} placeholder="e.g. 1–2 days" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input {...f('title')} required placeholder="Discover" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <select {...f('icon')} className={inputCls}>
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea {...f('description')} required rows={4} placeholder="What happens in this step..." className={`${inputCls} resize-none`} />
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

      {/* Steps list */}
      {loading ? (
        <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No steps yet. The section will use default steps until you add your own.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-xl border p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold">{item.title}</span>
                  {item.durationHint && <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">{item.durationHint}</span>}
                  <span className="text-xs text-gray-400">order: {item.order}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
