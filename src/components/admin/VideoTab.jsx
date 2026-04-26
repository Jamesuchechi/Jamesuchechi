'use client';
import { useState, useEffect } from 'react';
import { FiVideo, FiLink, FiSave } from 'react-icons/fi';

export default function VideoTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [video, setVideo] = useState(null);
  const [formData, setFormData] = useState({
    url: '',
    title: ''
  });

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await fetch('/api/video');
      const data = await res.json();
      if (data.id) {
        setVideo(data);
        setFormData({
          url: data.url,
          title: data.title || ''
        });
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save video');

      const data = await res.json();
      setVideo(data);
      alert('Video updated successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Loading video settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Portfolio Video</h2>
        <p className="text-slate-500 mt-1">Manage the video featured on your main portfolio page.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <FiVideo size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Video Settings</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiLink size={18} />
                </div>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 text-slate-900 placeholder-slate-400 transition-all"
                  placeholder="Youtube, Vimeo, Facebook, X, etc. URL"
                />
              </div>
              <p className="mt-2 text-xs text-slate-400 italic">
                Supported platforms: YouTube, Facebook, SoundCloud, Streamable, Vimeo, Wistia, Twitch, DailyMotion, and more.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Video Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 text-slate-900 placeholder-slate-400 transition-all"
                placeholder="e.g. My Portfolio Introduction"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={20} />
                  Save Video Settings
                </>
              )}
            </button>
          </form>
        </div>

        {video && video.url && (
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Current Preview</h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={video.url.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <p className="text-slate-400 text-sm mt-4 italic">
              Note: Preview above is a simple embed test. On the main page, we'll use a more robust player.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
