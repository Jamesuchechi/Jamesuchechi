'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiZap, FiCpu, FiTerminal, FiCode, FiLayers, FiBookOpen } from 'react-icons/fi';

const PLACEHOLDER_ICONS = [FiZap, FiCpu, FiTerminal, FiCode, FiLayers, FiBookOpen];

function PostCard({ post, index }) {
  const Icon = PLACEHOLDER_ICONS[index % PLACEHOLDER_ICONS.length];
  
  const noiseDataUrl = 
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.15'/%3E%3C/svg%3E";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video rounded-[40px] overflow-hidden bg-white/[0.03] border border-white/5 mb-8 group-hover:border-white/10 transition-all">
          {/* Background Noise & Gradient */}
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("${noiseDataUrl}")` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-50" />
          
          {/* Center Icon Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
             <Icon size={120} strokeWidth={1} className="text-white group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute bottom-10 left-10">
            <div className="flex gap-3">
              {JSON.parse(post.tags || '[]').map((tag, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 text-[9px] font-mono tracking-widest uppercase text-white/60 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase mb-4">
            {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[0.95] tracking-tighter uppercase italic group-hover:text-[#FF3B00] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
            {post.title}
          </h3>
          <p className="text-xl text-white/40 leading-relaxed font-medium italic line-clamp-2 max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
            {post.summary}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-[#07090c] text-white py-32 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-32 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <p className="text-[10px] font-mono tracking-[0.5em] text-[#FF3B00] uppercase mb-4">Authority & Evidence // 06</p>
            <h2 className="text-6xl md:text-[9rem] font-black uppercase leading-[0.8] tracking-tighter italic" style={{ fontFamily: 'Georgia, serif' }}>
              Insights / <br /> Case Notes
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px] text-white/20 uppercase tracking-[0.2em]">{posts.length} Logged Entries</p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-10 w-10 border-2 border-white/5 border-t-[#FF3B00] rounded-full" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-[60px]">
             <p className="font-mono text-white/20 uppercase tracking-widest italic">Knowledge repositories are empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-32">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
