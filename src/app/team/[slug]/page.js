'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCpu, FiHash, FiClock } from 'react-icons/fi';
import { notFound } from 'next/navigation';

export default function TeamMemberDetail({ params }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  const fetchMember = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch('/api/team');
      const team = await res.json();
      const foundMember = team.find(m => m.slug === slug);
      if (!foundMember) notFound();
      setMember(foundMember);
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchMember();
    }
  }, [slug, fetchMember]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#FF3B00] animate-pulse">
          Accessing_Data_Stream...
        </div>
      </div>
    );
  }

  if (!member) return null;

  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-[#FF3B00] selection:text-white">
      {/* ── Fixed UI Elements ── */}
      <div className="fixed top-8 left-8 z-50">
        <Link
          href="/team"
          className="group flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Back to Directory</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* ── Left Side: Visual ── */}
        <div className="lg:w-1/2 relative min-h-[50vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden bg-[#0A0A0A]">
          {member.profilePic ? (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ duration: 1.5 }}
              src={member.profilePic}
              alt={member.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
              <span className="text-[20vw] font-black uppercase italic tracking-tighter">
                {member.name[0]}
              </span>
            </div>
          )}
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent lg:bg-gradient-to-r" />

          {/* Metadata Display */}
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="font-mono"
            >
              <div className="text-[9px] uppercase tracking-[0.4em] text-[#FF3B00] mb-2">{"// Node_Info"}</div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                {member.name.split(' ')[0]}<br />
                <span className="text-[#FF3B00]">{member.name.split(' ')[1] || ''}</span>
              </h1>
            </motion.div>
            
            <div className="hidden md:block font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] text-right">
              <div className="mb-1">Sector: Collaboration_04</div>
              <div>ID: {member.id.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Content ── */}
        <div className="lg:w-1/2 p-12 lg:p-24 lg:pt-48 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Role & Tags */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <div className="flex items-center gap-3">
                <FiCpu className="text-[#FF3B00]" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FF3B00]">Function: {member.role}</span>
              </div>
              <div className="h-px w-12 bg-white/10" />
              <div className="flex items-center gap-3">
                <FiClock className="text-white/20" />
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/20">Uptime: Permanent</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-20">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20 mb-8">{"// Core_Data_Log"}</h2>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/60 italic">
                &ldquo;{member.description}&rdquo;
              </p>
            </div>

            {/* Uplinks */}
            <div>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20 mb-8">{"// External_Uplinks"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF3B00] hover:bg-[#FF3B00]/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <FiGithub size={20} className="text-white/40 group-hover:text-[#FF3B00] transition-colors" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Source Code</span>
                    </div>
                    <FiHash className="text-white/10" />
                  </a>
                )}
                {member.portfolioUrl && (
                  <a
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[#FF3B00] hover:bg-[#FF3B00]/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <FiExternalLink size={20} className="text-white/40 group-hover:text-[#FF3B00] transition-colors" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Portfolio Hub</span>
                    </div>
                    <FiHash className="text-white/10" />
                  </a>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="mt-32 pt-12 border-t border-white/5 flex items-center justify-between opacity-20">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em]">
                System_Ref: {member.slug.replace(/-/g, '_')}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-1 w-4 bg-[#FF3B00]" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
