'use client';
import { useState, useEffect } from 'react';

export default function EducationTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    location: '',
    period: '',
    description: '',
    honors: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/education');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching education:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingItem ? `/api/education/${editingItem.id}` : '/api/education';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save education record');

      await fetchItems();
      resetForm();
      alert(`Education record ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      school: item.school,
      degree: item.degree,
      field: item.field,
      location: item.location || '',
      period: item.period,
      description: item.description || '',
      honors: item.honors || '',
      order: item.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    try {
      const res = await fetch(`/api/education/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete education record');
      await fetchItems();
      alert('Education record deleted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      school: '',
      degree: '',
      field: '',
      location: '',
      period: '',
      description: '',
      honors: '',
      order: 0
    });
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading academic pedigree...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
           </div>
           <h3 className="text-xl font-bold text-slate-900">{editingItem ? 'Edit Education' : 'Add Academic Record'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Institution / School *</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
              placeholder="e.g. Stanford University"
              value={formData.school} 
              onChange={e => setFormData({...formData, school: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Degree *</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
                placeholder="e.g. B.Sc. Computer Science"
                value={formData.degree} 
                onChange={e => setFormData({...formData, degree: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Field of Study</label>
              <input 
                type="text" 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
                placeholder="e.g. Software Engineering"
                value={formData.field} 
                onChange={e => setFormData({...formData, field: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Period *</label>
              <input 
                type="text" 
                required 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
                placeholder="e.g. 2018 - 2022"
                value={formData.period} 
                onChange={e => setFormData({...formData, period: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Location</label>
              <input 
                type="text" 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
                placeholder="e.g. California, USA"
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Honors & Awards</label>
            <input 
              type="text" 
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none" 
              placeholder="e.g. Dean's List, First Class Honors"
              value={formData.honors} 
              onChange={e => setFormData({...formData, honors: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Description / Highlights</label>
            <textarea 
              rows={4} 
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all outline-none resize-none" 
              placeholder="Major coursework, relevant projects..."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              disabled={saving} 
              className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingItem ? 'Update Record' : 'Save Academic Record'}
            </button>
            {editingItem && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-8 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Academic History</h3>
        
        <div className="space-y-6">
          {items.map(item => (
            <div key={item.id} className="group p-6 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{item.degree}</h4>
                <p className="text-indigo-600 font-semibold mb-1">{item.school}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>{item.period}</span>
                  {item.location && <span>• {item.location}</span>}
                </div>
                {item.honors && (
                   <p className="mt-3 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full inline-block">
                     ⭐ {item.honors}
                   </p>
                )}
              </div>
              
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(item)} 
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-medium italic">No academic history added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
