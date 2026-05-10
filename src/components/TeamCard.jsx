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
      className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF3B00]/40 transition-all duration-500 shadow-2xl"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF3B00]/20 blur-[60px] rounded-full" />
      </div>

      <div className="aspect-[4/5] relative overflow-hidden">
        {member.profilePic ? (
          <img
            src={member.profilePic}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        ) : (
          <div className="w-full h-full bg-[#111] flex items-center justify-center">
            <span className="text-4xl font-black text-white/10 uppercase tracking-tighter rotate-12">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <Link
            href={`/team/${member.slug}`}
            className="px-8 py-3 bg-white text-black text-xs font-mono font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-3 hover:bg-[#FF3B00] hover:text-white transition-colors"
          >
            Access Profile <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className="p-8 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-[#FF3B00] transition-colors">
              {member.name}
            </h3>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#FF3B00]/80">
              {"// "} {member.role}
            </p>
          </div>
        </div>

        <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-8 font-light italic">
          &ldquo;{member.description}&rdquo;
        </p>

        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-[#FF3B00] transition-colors"
              title="GitHub"
            >
              <FiGithub size={18} />
            </a>
          )}
          {member.portfolioUrl && (
            <a
              href={member.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-[#FF3B00] transition-colors"
              title="Portfolio"
            >
              <FiExternalLink size={18} />
            </a>
          )}
          <div className="ml-auto">
            <span className="text-[9px] font-mono text-white/10 tracking-[0.4em] uppercase">
              Registry_ID_{member.id.slice(-4)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
