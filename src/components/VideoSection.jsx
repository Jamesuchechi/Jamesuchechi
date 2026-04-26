'use client';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';

export default function VideoSection() {
  const [video, setVideo] = useState(null);
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
    fetch('/api/video')
      .then(res => res.json())
      .then(data => {
        if (data.url) setVideo(data);
      })
      .catch(err => console.error('Error fetching video:', err));
  }, []);

  if (!video) {
    return (
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-400 italic">No Featured Video Added Yet</h2>
          <p className="text-slate-400 mt-2">Go to your Admin Dashboard → Portfolio Video to add a URL.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black italic uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Featured <span className="text-[#FF3B00]">Media</span>
          </h2>
          {video.title && (
            <p className="text-xl text-gray-500 italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              {video.title}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl shadow-black/20 bg-black border-8 border-white group"
        >
          {hasWindow && (
            <ReactPlayer
              url={video.url}
              width="100%"
              height="100%"
              controls
              light={true} // Shows thumbnail until play
              playIcon={
                <div className="w-24 h-24 bg-[#FF3B00] rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.018 14L14.41 8 4.018 2z" />
                  </svg>
                </div>
              }
            />
          )}
          
          <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[40px]" />
        </motion.div>
        
        <div className="mt-12 flex justify-center">
          <div className="flex gap-4">
             {['Youtube', 'Facebook', 'Vimeo', 'X', 'Zoom'].map((plat) => (
               <span key={plat} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 border border-gray-100 px-4 py-2 rounded-full">
                 {plat} Support
               </span>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}
