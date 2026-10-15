'use client';
import { Fragment, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiStar, FiGitBranch, FiArrowUpRight, FiActivity, FiMapPin, FiCode, FiLayers } from 'react-icons/fi';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import CountUp from '@/components/reactbits/CountUp';
import DecryptedText from '@/components/reactbits/DecryptedText';
import ShinyText from '@/components/reactbits/ShinyText';

const LANG_COLORS = {
  Python:     '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Java:       '#b07219',
  default:    '#00E5FF',
};

function ContribGrid({ grid }) {
  if (!grid?.length) return null;

  const monthLabels = [];
  let lastMonth = '';
  grid.forEach((week, i) => {
    const firstDay = week.find((d) => d);
    if (!firstDay) return;
    const date = new Date(firstDay.date);
    const month = date.toLocaleString('en-US', { month: 'short' });
    if (month !== lastMonth) {
      monthLabels.push({ label: month, index: i });
      lastMonth = month;
    }
  });

  return (
    <div className="relative mt-4">
      {/* Month Labels */}
      <div className="relative h-5 mb-2 overflow-hidden">
        {monthLabels.map((m, i) => (
          <span
            key={i}
            style={{ left: `${m.index * 14}px` }}
            className="absolute text-[10px] font-mono tracking-wider text-white/30 uppercase select-none"
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid container with custom horizontal scroll */}
      <div className="flex gap-[3px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Day of Week Labels */}
        <div className="flex flex-col gap-[3px] mr-2 shrink-0">
          <div className="h-[10px]" />
          {['Mon', 'Wed', 'Fri'].map((d) => (
            <Fragment key={d}>
              <div className="h-[10px]" />
              <div className="h-[10px] text-[9px] font-mono leading-[10px] text-white/20 select-none">
                {d}
              </div>
            </Fragment>
          ))}
        </div>

        {/* Days Matrix */}
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] shrink-0">
            {week.map((day, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: (wi * 0.002) + (di * 0.003) }}
                title={`${day.count} contributions on ${day.date}`}
                style={{
                  backgroundColor: day.count === 0 ? 'rgba(255, 255, 255, 0.04)' : (day.color || '#26a641'),
                }}
                className={`w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-150 hover:z-20 cursor-pointer ${
                  day.count > 0 ? 'shadow-[0_0_8px_rgba(38,166,65,0.4)]' : ''
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModernRepoCard({ repo, index }) {
  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="h-full"
    >
      <SpotlightCard
        spotlightColor={`${langColor}22`}
        borderColor={`${langColor}55`}
        className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all duration-300 h-full backdrop-blur-md"
      >
        {/* Top color highlight line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: langColor }}
        />

        <div>
          {/* Header: Name + External Link */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold font-mono text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2 break-all"
            >
              <span>{repo.name}</span>
            </a>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${repo.name} on GitHub`}
              className="p-1.5 rounded-full bg-white/5 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 text-white/50 transition-all shrink-0"
            >
              <FiArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Description */}
          <p
            className="text-xs text-white/60 leading-relaxed font-serif italic mb-4 line-clamp-2 min-h-[34px]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {repo.description || 'Public software repository open for collaboration and development.'}
          </p>

          {/* Topics */}
          {repo.topics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50 font-mono">
          {repo.language ? (
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: langColor }}
              />
              <span className="text-[11px] text-white/70">{repo.language}</span>
            </div>
          ) : (
            <span className="text-[11px] text-white/30">Markdown</span>
          )}

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors">
              <FiStar size={12} className="text-amber-400" />
              <span>{repo.stars}</span>
            </span>
            <span className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors">
              <FiGitBranch size={12} />
              <span>{repo.forks}</span>
            </span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function StatBentoCard({ label, value, icon: Icon, accent = 'cyan', index, sublabel }) {
  const accentColors = {
    cyan: { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
    green: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
    purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  }[accent] || { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <SpotlightCard
        spotlightColor="rgba(255, 255, 255, 0.08)"
        borderColor="rgba(255, 255, 255, 0.15)"
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all duration-300 flex flex-col justify-between h-full backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40">
            {label}
          </span>
          <div className={`p-2 rounded-xl ${accentColors.bg} ${accentColors.border} border`}>
            <Icon size={16} className={accentColors.text} />
          </div>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight leading-none mb-1">
            <CountUp to={value} duration={1.8} />
          </div>
          {sublabel && (
            <p className="text-[10px] font-mono text-white/30 tracking-wider uppercase">
              {sublabel}
            </p>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

export default function GitHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [30, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => {
    fetch('/api/github')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load GitHub data');
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="github"
      className="relative bg-[#07090e] text-white py-24 sm:py-32 px-6 sm:px-12 border-t border-b border-white/[0.06] overflow-hidden"
    >
      {/* ── Background Atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/[0.08]">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-6 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <DecryptedText
                  text="OPEN SOURCE ECOSYSTEM // LIVE TELEMETRY"
                  speed={30}
                  animateOn="view"
                  className="text-[10px] font-mono tracking-[0.2em] text-cyan-300 uppercase font-semibold"
                />
              </div>

              <h2
                className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Code & <span className="text-white/40 italic">Open Source</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/60 font-serif italic max-w-xl">
                Continuous integration, transparent version control, and active contributions across full-stack architectures.
              </p>
            </div>

            {/* Profile Pill Card */}
            {data?.username && (
              <a
                href={`https://github.com/${data.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 p-3 pr-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.06] transition-all backdrop-blur-md shrink-0 shadow-lg"
              >
                {data.stats?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.stats.avatarUrl}
                    alt={data.username}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <FiGithub size={22} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                      @{data.username}
                    </span>
                    <FiArrowUpRight size={14} className="text-white/40 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  {data.stats?.location && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 mt-0.5">
                      <FiMapPin size={10} className="text-cyan-400" />
                      <span>{data.stats.location}</span>
                    </div>
                  )}
                </div>
              </a>
            )}
          </div>
        </motion.div>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
              ))}
            </div>
            <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl bg-white/[0.03] border border-white/[0.06]" />
              ))}
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        {data && !loading && (
          <div className="space-y-12">
            {/* Bento Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <StatBentoCard
                index={0}
                label="Contributions"
                value={data.totalContributions || 0}
                icon={FiActivity}
                accent="green"
                sublabel="Past 365 Days"
              />
              <StatBentoCard
                index={1}
                label="Repositories"
                value={data.stats?.publicRepos || 0}
                icon={FiLayers}
                accent="cyan"
                sublabel="Public Projects"
              />
              <StatBentoCard
                index={2}
                label="Total Stars"
                value={data.totalStars || 0}
                icon={FiStar}
                accent="amber"
                sublabel="Community Stars"
              />
              <StatBentoCard
                index={3}
                label="Followers"
                value={data.stats?.followers || 0}
                icon={FiGithub}
                accent="purple"
                sublabel="Developer Network"
              />
            </div>

            {/* Top Languages Tags */}
            {data.topLanguages?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 flex-wrap"
              >
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 mr-2 flex items-center gap-1.5">
                  <FiCode size={12} className="text-cyan-400" /> Primary Tech:
                </span>
                {data.topLanguages.map((lang) => {
                  const color = LANG_COLORS[lang] || LANG_COLORS.default;
                  return (
                    <div
                      key={lang}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.07] backdrop-blur-sm hover:border-white/20 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[11px] font-mono font-medium text-white/70">{lang}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Contribution Calendar Heatmap */}
            {data.contributionGrid?.length > 0 && (
              <SpotlightCard
                spotlightColor="rgba(0, 229, 255, 0.08)"
                borderColor="rgba(0, 229, 255, 0.25)"
                className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-400 block mb-1">
                      Commit Velocity
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2">
                      <CountUp to={data.totalContributions} />
                      <span className="text-sm font-normal text-white/50 font-serif italic">
                        contributions in the last year
                      </span>
                    </h3>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                    <span>Less</span>
                    {['rgba(255,255,255,0.04)', '#0e4429', '#006d32', '#26a641', '#39d353'].map((c, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-[2px]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>

                <ContribGrid grid={data.contributionGrid} />
              </SpotlightCard>
            )}

            {/* Repositories Section */}
            {data.topRepos?.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40">
                    Featured Open-Source Repositories
                  </span>
                  <span className="text-xs font-mono text-cyan-400/80">
                    Showing top {Math.min(data.topRepos.length, 6)} sorted by stars
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.topRepos.slice(0, 6).map((repo, i) => (
                    <ModernRepoCard key={repo.id} repo={repo} index={i} />
                  ))}
                </div>

                {/* Explore All Repositories CTA */}
                <div className="pt-8 text-center">
                  <a
                    href={`https://github.com/${data.username}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-cyan-400/50 hover:bg-white/[0.08] text-white font-mono text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-md shadow-lg"
                  >
                    <ShinyText text="Explore All Repositories" speed={3} />
                    <FiArrowUpRight size={16} className="text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}