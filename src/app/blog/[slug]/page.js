'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiTag, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BlogPostDetail({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  const fetchPost = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch('/api/blog');
      const posts = await res.json();
      const found = posts.find(p => p.slug === slug);
      if (!found) notFound();
      setPost(found);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug, fetchPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090c] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="w-12 h-12 border-2 border-white/10 border-t-[#FF3B00] rounded-full" />
      </div>
    );
  }

  if (!post) return null;

  const tags = JSON.parse(post.tags || '[]');

  return (
    <main className="min-h-screen bg-[#07090c] text-white">
      <Navbar />
      
      {/* Hero Header */}
      <header className="relative pt-44 pb-32 px-6 sm:px-12 border-b border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors font-mono text-[10px] uppercase tracking-widest">
            <FiArrowLeft /> Back to Insights
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap gap-4 mb-8">
              {tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF3B00]/10 text-[#FF3B00] text-[9px] font-mono tracking-widest uppercase">
                  <FiTag /> {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-8 items-center text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#FF3B00]" />
                {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-[#FF3B00]" />
                {Math.ceil(post.content.length / 1000)} min read
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#FF3B00] opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </header>

      {/* Content */}
      <article className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-[#FF3B00]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {/* MDX Content Rendering */}
            <div className="whitespace-pre-line text-xl md:text-2xl text-white/70 leading-[1.7] italic">
               {post.content}
            </div>
          </motion.div>
          
          {/* CTA Corner */}
          <div className="mt-32 pt-16 border-t border-white/5 text-center">
            <h2 className="text-4xl md:text-6xl font-black italic mb-12 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
              Thoughts on this? <br />
              <span className="text-[#FF3B00]">Let&apos;s discuss.</span>
            </h2>
            <Link href="/contact" className="inline-flex items-center gap-4 bg-white text-black px-10 py-4 rounded-full font-mono text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              Get In Touch
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
