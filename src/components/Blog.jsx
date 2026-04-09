'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function PostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-video rounded-[40px] overflow-hidden bg-white/5 border border-white/5 mb-8 group-hover:border-white/15 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-10 left-10">
            <div className="flex gap-3">
              {JSON.parse(post.tags || '[]').map((tag, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 text-[9px] font-mono tracking-widest uppercase text-white/60">
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
