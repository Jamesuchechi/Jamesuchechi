'use client';
import { useState, useEffect } from 'react';

export default function BlogTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: [],
    published: false,
    publishedAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `/api/blog/${editingItem.id}` : '/api/blog';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save blog post');
      await fetchItems();
      resetForm();
      alert(`Post ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      summary: item.summary || '',
      content: item.content,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : (item.tags || []),
      published: item.published,
      publishedAt: new Date(item.publishedAt).toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete blog post?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const resetForm = () => {
    setFormData({ title: '', summary: '', content: '', tags: [], published: false, publishedAt: new Date().toISOString().split('T')[0] });
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Blog Post' : 'Write New Post'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Post Title" required className="w-full p-3 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Summary (for cards)" required rows={2} className="w-full p-3 border rounded-lg" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
          <textarea placeholder="Content (MDX Supported)" required rows={10} className="w-full p-3 border rounded-lg font-mono text-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
              <span className="text-sm font-medium">Published</span>
            </label>
            <input type="date" className="p-2 border rounded-lg text-sm" value={formData.publishedAt} onChange={e => setFormData({...formData, publishedAt: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white p-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Publish Post'}
            </button>
            {editingItem && <button type="button" onClick={resetForm} className="px-6 bg-gray-100 p-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">Archive</h3>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-gray-500">{new Date(item.publishedAt).toLocaleDateString()}</p>
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} mt-1 inline-block`}>
                  {item.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
