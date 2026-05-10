'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCpu, FiLayers, FiDatabase } from 'react-icons/fi';
import TeamCard from '@/components/TeamCard';

export default function TeamHubPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        setTeam(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching team:', error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(255,59,0,0.05),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(0,229,255,0.03),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <section className="relative pt-32 pb-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-white/40 hover:text-[#FF3B00] transition-colors font-mono text-[11px] uppercase tracking-[0.3em]"
            >
              <FiArrowLeft />
              Return to Terminal
            </Link>
          </motion.div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/5 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 bg-[#FF3B00] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#FF3B00]">{"System Registry // Active_Nodes"}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 italic">
                COLLABORATORS<span className="text-[#FF3B00]">/</span>
              </h1>
              <p className="text-xl text-white/40 font-light max-w-2xl leading-relaxed italic">
                A decentralized network of visionaries, developers, and designers bridging the gap between imagination and execution.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:flex items-center gap-12 text-white/20 font-mono text-[9px] uppercase tracking-[0.4em]"
            >
              <div className="flex flex-col gap-2">
                <FiCpu size={16} className="text-[#FF3B00]" />
                <span>Compute_01</span>
              </div>
              <div className="flex flex-col gap-2">
                <FiLayers size={16} className="text-[#FF3B00]" />
                <span>Architecture</span>
              </div>
              <div className="flex flex-col gap-2">
                <FiDatabase size={16} className="text-[#FF3B00]" />
                <span>Registry</span>
              </div>
            </motion.div>
          </div>

          {/* Team Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 border-2 border-[#FF3B00]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-[#FF3B00] rounded-full animate-spin" />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20">Decrypting_Personnel_Files...</p>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/20 font-mono text-[11px] uppercase tracking-[0.4em]">No active nodes found in this sector.</p>
              <Link 
                href="/admin" 
                className="inline-block mt-8 text-[#FF3B00] text-[10px] font-mono uppercase tracking-[0.2em] hover:underline"
              >
                Access Admin_Terminal to initialize
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <TeamCard key={member.id} member={member} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section className="px-6 sm:px-12 pb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 gap-8">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
            {"\u00A9"} 2026 Ecosystem {"// Decentralized_Collaboration"}
          </p>
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span className="flex items-center gap-2"><span className="h-1 w-1 bg-green-500 rounded-full" /> All Systems Nominal</span>
            <span className="flex items-center gap-2 text-[#FF3B00]">Encryption: Active</span>
          </div>
        </div>
      </section>
    </main>
  );
}
