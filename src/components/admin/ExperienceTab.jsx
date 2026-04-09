'use client';
import { useState, useEffect } from 'react';

export default function ExperienceTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    period: '',
    description: '',
    technologies: [],
    results: '',
    type: 'Formal',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching experience:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingItem ? `/api/experience/${editingItem.id}` : '/api/experience';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save experience');

      await fetchItems();
      resetForm();
      alert(`Experience ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      role: item.role,
      company: item.company,
      location: item.location || '',
      period: item.period,
      description: item.description,
      technologies: typeof item.technologies === 'string' ? JSON.parse(item.technologies) : (item.technologies || []),
      results: item.results || '',
      type: item.type || 'Formal',
      order: item.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience');
      await fetchItems();
      alert('Experience deleted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      role: '',
      company: '',
      location: '',
      period: '',
      description: '',
      technologies: [],
      results: '',
      type: 'Formal',
      order: 0
    });
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit Experience' : 'Add Experience'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Role" required className="w-full p-3 border rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          <input type="text" placeholder="Company" required className="w-full p-3 border rounded-lg" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="Period (e.g. 2021 - Present)" required className="w-full p-3 border rounded-lg" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
             <select className="w-full p-3 border rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Formal">Formal</option>
                <option value="Freelance">Freelance</option>
                <option value="Volunteer">Volunteer</option>
             </select>
          </div>
          <textarea placeholder="Description" required rows={4} className="w-full p-3 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <textarea placeholder="Core Results/Impact" rows={2} className="w-full p-3 border rounded-lg" value={formData.results} onChange={e => setFormData({...formData, results: e.target.value})} />
          
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white p-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50">
              {saving ? 'Saving...' : editingItem ? 'Update Experience' : 'Save Experience'}
            </button>
            {editingItem && (
              <button type="button" onClick={resetForm} className="px-6 bg-gray-100 p-3 rounded-lg">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">Experience History</h3>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <h4 className="font-bold">{item.role}</h4>
                <p className="text-sm text-gray-500">{item.company} • {item.period}</p>
                <p className="text-[10px] uppercase font-bold text-indigo-600 mt-1">{item.type}</p>
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
