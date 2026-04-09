'use client';
import { useState, useEffect } from 'react';

export default function FaqTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `/api/faqs/${editingItem.id}` : '/api/faqs';
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save FAQ');
      await fetchItems();
      resetForm();
      alert(`FAQ ${editingItem ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ question: item.question, answer: item.answer, order: item.order || 0 });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete FAQ?')) return;
    await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    await fetchItems();
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', order: 0 });
    setEditingItem(null);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">{editingItem ? 'Edit FAQ' : 'Add New Question'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Question" required className="w-full p-3 border rounded-lg" value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
          <textarea placeholder="Answer" required rows={6} className="w-full p-3 border rounded-lg" value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} />
          <input type="number" placeholder="Order" className="w-full p-3 border rounded-lg" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
          
          <div className="flex gap-4">
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white p-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save FAQ'}
            </button>
            {editingItem && <button type="button" onClick={resetForm} className="px-6 bg-gray-100 p-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-bold mb-6">FAQ Management</h3>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div className="max-w-[80%]">
                <h4 className="font-bold">{item.question}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.answer}</p>
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
