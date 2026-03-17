'use client';
import { useState, useEffect } from 'react';

const EMPTY = { name: '', role: '', company: '', quote: '', avatarUrl: '', rating: 5, featured: false, order: 0 };

export default function TestimonialsTab() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(null); // null = new, id = edit
  const [form,    setForm]    = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      const d   = await res.json();
      setItems(Array.isArray(d) ? d : []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ name: item.name, role: item.role, company: item.company || '', quote: item.quote, avatarUrl: item.avatarUrl || '', rating: item.rating, featured: item.featured, order: item.order });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/testimonials/${editing}` : '/api/testimonials';
      const method = editing ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      await fetchAll();
      cancel();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchAll();
    } catch (err) { alert('Error: ' + err.message); }
  };

  const f = (key) => ({
    value: form[key],
    onChange: e => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'number' ? Number(e.target.value) : e.target.value })),
  });

  const inputCls = 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-gray-900 placeholder-gray-500 transition-all';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-gray-600">Manage social proof quotes</p>
        </div>
        <button onClick={openNew} className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Add testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-8">
          <h3 className="text-xl font-bold mb-5">{editing ? 'Edit testimonial' : 'New testimonial'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input {...f('name')} required placeholder="Alex Johnson" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role *</label>
                <input {...f('role')} required placeholder="Senior Engineer" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input {...f('company')} placeholder="Acme Corp" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input {...f('avatarUrl')} placeholder="https://..." type="url" className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quote *</label>
              <textarea {...f('quote')} required rows={4} placeholder="James delivered exactly what we needed, ahead of schedule..." className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1–5)</label>
                <input {...f('rating')} type="number" min="1" max="5" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display order</label>
                <input {...f('order')} type="number" min="0" className={inputCls} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...f('featured')} type="checkbox" checked={form.featured} className="w-4 h-4" />
                  <span className="text-sm font-medium">Featured (shown first)</span>
                </label>
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

      {/* List */}
      {loading ? (
        <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No testimonials yet. Add your first one above.</div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-gray-500 text-sm">{item.role}{item.company ? ` · ${item.company}` : ''}</span>
                    {item.featured && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Featured</span>}
                    <span className="text-xs text-gray-400">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 italic">"{item.quote}"</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
