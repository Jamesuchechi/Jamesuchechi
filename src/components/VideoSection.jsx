'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Converts any YouTube or Vimeo share/watch URL into a proper embed URL.
 * Returns null if the URL is not a recognised embeddable source.
 */
function getEmbedUrl(url) {
  if (!url) return null;

  try {
    const u = new URL(url);

    // ── YouTube ──────────────────────────────────────────────────
    // Handles:
    //   https://www.youtube.com/watch?v=VIDEO_ID
    //   https://youtu.be/VIDEO_ID
    //   https://www.youtube.com/shorts/VIDEO_ID
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace('/', '');
      return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (u.hostname.includes('youtube.com')) {
      const id =
        u.searchParams.get('v') ||                        // watch?v=
        u.pathname.split('/').filter(Boolean).pop();      // /embed/ or /shorts/
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }

    // ── Vimeo ────────────────────────────────────────────────────
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    // URL constructor threw — not a valid URL
  }

  return null; // unsupported source
}

export default function VideoSection() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetch('/api/video')
      .then((res) => res.json())
      .then((data) => { if (data.url) setVideo(data); })
      .catch((err) => console.error('Error fetching video:', err));
  }, []);

  // ── No video saved yet ───────────────────────────────────────────────────
  if (!video) {
    return (
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-400 italic">No Featured Video Added Yet</h2>
          <p className="text-slate-400 mt-2">Go to your Admin Dashboard → Portfolio Video to add a URL.</p>
        </div>
      </section>
    );
  }

  const embedUrl = getEmbedUrl(video.url);

  // ── Unsupported URL ──────────────────────────────────────────────────────
  if (!embedUrl) {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[40px] p-12 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-800 italic">Unsupported Video Source</h3>
            <p className="text-amber-600 mt-2 max-w-lg mx-auto">
              The URL you added (<strong>{video.url}</strong>) is not supported.
              Please use a YouTube or Vimeo link.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ── Valid embed ──────────────────────────────────────────────────────────
  return (
    <section
      className="bg-white overflow-hidden flex flex-col"
      style={{ minHeight: '100vh' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col flex-1 py-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 shrink-0"
        >
          <h2
            className="text-5xl md:text-7xl font-black italic uppercase mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Featured <span className="text-[#FF3B00]">Media</span>
          </h2>
          {video.title && (
            <p className="text-xl text-gray-500 italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              {video.title}
            </p>
          )}
        </motion.div>

        {/* Player — grows to fill all remaining height */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative flex-1 w-full rounded-[40px] overflow-hidden shadow-2xl shadow-black/20 bg-black border-8 border-white"
          style={{ minHeight: '400px' }}
        >
          <iframe
            src={embedUrl}
            title={video.title || 'Featured video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </motion.div>

        {/* Platform badges */}
        <div className="mt-8 flex justify-center shrink-0">
          <div className="flex gap-4 flex-wrap justify-center">
            {['Youtube', 'Vimeo'].map((plat) => (
              <span
                key={plat}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-300 border border-gray-100 px-4 py-2 rounded-full"
              >
                {plat} Support
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
