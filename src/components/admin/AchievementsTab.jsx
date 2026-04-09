'use client';
import { useState, useEffect } from 'react';

export default function AchievementsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    date: '',
    description: '',
    category: 'Certification',
    verificationUrl: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `/api/achievements/${editingItem.id}` : '/api/achievements';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save achievement');
      await fetchItems();
      resetForm();
      alert(`Achievement ${editingItem ? 'updated' : 'created'} successfully!`);
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
      provider: item.provider,
      date: item.date,
      description: item.description,
      category: item.category,
      verificationUrl: item.verificationUrl || '',
      order: item.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete achievement?')) return;
    await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const resetForm = () => {
    setFormData({ title: '', provider: '', date: '', description: '', category: 'Certification', verificationUrl: '', order: 0 });
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Achievement' : 'Add Achievement'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title (e.g. Best Dev 2024)" required className="w-full p-3 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input type="text" placeholder="Provider" required className="w-full p-3 border rounded-lg" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="Date" required className="w-full p-3 border rounded-lg" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
             <select className="w-full p-3 border rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {['Competition', 'Scholarship', 'Certification', 'Milestone'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
          <textarea placeholder="Description" required rows={4} className="w-full p-3 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="url" placeholder="Verification URL" className="w-full p-3 border rounded-lg" value={formData.verificationUrl} onChange={e => setFormData({...formData, verificationUrl: e.target.value})} />
          
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white p-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Achievement'}
            </button>
            {editingItem && <button type="button" onClick={resetForm} className="px-6 bg-gray-100 p-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">Achievement Hall</h3>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.provider} • {item.date}</p>
                <p className="text-[10px] uppercase font-bold text-emerald-600 mt-1">{item.category}</p>
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
