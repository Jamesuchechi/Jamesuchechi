'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiAward, FiStar, FiTriangle } from 'react-icons/fi';

const CATEGORIES = ['All', 'Competition', 'Scholarship', 'Certification', 'Milestone'];

function AchievementCard({ item, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative bg-[#0a0c10] border border-white/5 p-8 rounded-[32px] overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150" />
      
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl text-white/40 group-hover:bg-white/10 group-hover:text-[#AAFF00] transition-all">
            {item.category === 'Certification' ? <FiTriangle /> : item.category === 'Competition' ? <FiAward /> : <FiStar />}
          </div>
          <span className="font-mono text-[9px] tracking-widest text-white/20 uppercase">{item.date}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-[#AAFF00] transition-colors uppercase">
          {item.title}
        </h3>
        <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">@ {item.provider}</p>
        
        <p className="text-sm text-white/50 leading-relaxed font-medium line-clamp-3">
          {item.description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-mono tracking-widest text-[#AAFF00] opacity-40 uppercase">{item.category}</span>
        {item.verificationUrl && (
          <a 
            href={item.verificationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/20 hover:text-white transition-colors"
          >
            <FiExternalLink />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCat === 'All' ? items : items.filter(i => i.category === activeCat);

  return (
    <section className="min-h-screen bg-[#07090c] py-32 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <p className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase mb-4">Milestones & Records // 05</p>
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
            Proof of <br /> Excellence
          </h2>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCat === cat ? 'bg-[#AAFF00] text-black border-[#AAFF00]' : 'text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-10 w-10 border-2 border-white/10 border-t-[#AAFF00] rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 bg-white/5 rounded-[40px] border border-dashed border-white/10">
            <p className="font-mono text-white/20 uppercase tracking-widest">No entries found for this category.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <AchievementCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
