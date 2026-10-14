'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi';

export default function TeamCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF3B00]/40 transition-all duration-500 shadow-2xl flex flex-col justify-between"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF3B00]/20 blur-[60px] rounded-full" />
      </div>

      <div>
        {/* Clickable Image Container */}
        <Link
          href={`/team/${member.slug}`}
          className="aspect-[4/5] relative block overflow-hidden cursor-pointer group/img"
          aria-label={`Access ${member.name}'s profile`}
        >
          {member.profilePic ? (
            <img
              src={member.profilePic}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover/img:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#111] flex items-center justify-center">
              <span className="text-4xl font-black text-white/10 uppercase tracking-tighter rotate-12">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B00] animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">Active Node</span>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Desktop Hover Floating Badge */}
          <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 pointer-events-none z-20">
            <span className="px-6 py-2.5 bg-white text-black text-xs font-mono font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2 shadow-2xl group-hover:scale-105 transition-transform">
              Access Profile <FiArrowRight />
            </span>
          </div>
        </Link>

        {/* Content Body */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex justify-between items-start mb-3">
            <div>
              <Link href={`/team/${member.slug}`} className="block group/title">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-1 group-hover/title:text-[#FF3B00] transition-colors">
                  {member.name}
                </h3>
              </Link>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FF3B00]/80">
                {"// "} {member.role}
              </p>
            </div>
          </div>

          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-6 font-light italic">
            &ldquo;{member.description}&rdquo;
          </p>

          {/* Explicit, Tap-Friendly CTA Button (Mobile & Desktop) */}
          <Link
            href={`/team/${member.slug}`}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#FF3B00] active:scale-[0.98] border border-white/10 hover:border-[#FF3B00] text-white transition-all flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] group/btn"
          >
            <span className="font-semibold text-white/90 group-hover/btn:text-white">View Details</span>
            <div className="flex items-center gap-1.5 text-[#FF3B00] group-hover/btn:text-white transition-colors">
              <span className="text-[9px] tracking-widest opacity-70">PROFILE</span>
              <FiArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Card Footer / Links */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
        <div className="flex items-center gap-4 border-t border-white/5 pt-5">
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#FF3B00] transition-colors p-1"
              title="GitHub"
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
          )}
          {member.portfolioUrl && (
            <a
              href={member.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-[#FF3B00] transition-colors p-1"
              title="Portfolio"
              aria-label="Portfolio"
            >
              <FiExternalLink size={18} />
            </a>
          )}
          <div className="ml-auto">
            <span className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">
              NODE_{member.id.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
