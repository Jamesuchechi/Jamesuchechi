'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Lab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lab')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
        <div className="max-w-2xl">
          <p className="text-[10px] font-mono tracking-[0.4em] text-[#00E5FF] uppercase mb-8">Active Learning & R&D</p>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
            The Lab /
          </h2>
          <p className="text-white/60 mt-6 text-lg italic" style={{ fontFamily: 'Georgia, serif' }}>
            A transparent window into my current sprints, research, and experiments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#00E5FF]/10 transition-colors" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase px-3 py-1 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5">
                  {item.status}
                </span>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  #{String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00E5FF] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                {item.title}
              </h3>

              <p className="text-white/70 text-sm italic mb-8 flex-1" style={{ fontFamily: 'Georgia, serif' }}>
                {item.description}
              </p>

              <div className="space-y-3">
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-white"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                  <span>Knowledge Depth</span>
                  <span className="text-white/70">{item.progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
