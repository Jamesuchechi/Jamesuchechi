'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * GitHub activity strip
 * ─────────────────────────────────────────────────────────────
 * Shows: contribution heatmap (1 year) · stat pills · pinned repos
 * Now uses GraphQL data for accurate contribution counts.
 */

const LANG_COLORS = {
  Python:     '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Java:       '#b07219',
  default:    '#8b8b8b',
};

function ContribGrid({ grid }) {
  if (!grid?.length) return null;

  // Generate month labels
  const monthLabels = [];
  let lastMonth = '';
  grid.forEach((week, i) => {
    const firstDay = week.find(d => d);
    if (!firstDay) return;
    const date = new Date(firstDay.date);
    const month = date.toLocaleString('en-US', { month: 'short' });
    if (month !== lastMonth) {
      monthLabels.push({ label: month, index: i });
      lastMonth = month;
    }
  });

  return (
    <div style={{ position: 'relative', marginTop: '20px' }}>
      {/* Month Labels */}
      <div style={{ display: 'flex', position: 'relative', height: '18px', marginBottom: '4px' }}>
        {monthLabels.map((m, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${m.index * 13}px`,
              fontSize: '10px',
              color: 'rgba(0,0,0,0.4)',
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Grid Container */}
      <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '4px' }}>
        {/* Day labels (opt) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '4px', paddingTop: '1px' }}>
          <div style={{ height: '10px', visibility: 'hidden' }} />
          <div style={{ height: '10px', fontSize: '9px', color: 'rgba(0,0,0,0.3)', lineHeight: '10px' }}>Mon</div>
          <div style={{ height: '10px', visibility: 'hidden' }} />
          <div style={{ height: '10px', fontSize: '9px', color: 'rgba(0,0,0,0.3)', lineHeight: '10px' }}>Wed</div>
          <div style={{ height: '10px', visibility: 'hidden' }} />
          <div style={{ height: '10px', fontSize: '9px', color: 'rgba(0,0,0,0.3)', lineHeight: '10px' }}>Fri</div>
          <div style={{ height: '10px', visibility: 'hidden' }} />
        </div>

        {grid.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.count} contributions on ${day.date}`}
                style={{
                  width: '10px', height: '10px', borderRadius: '2px',
                  background: day.color || '#ebedf0',
                  flexShrink: 0,
                  opacity: day.count === 0 ? 0.3 : 1
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.08)',
        borderRadius: '12px',
        padding: '16px 18px',
        textDecoration: 'none',
        transition: 'border-color 0.15s, transform 0.15s',
        flex: '1 1 200px',
        minWidth: '280px',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {repo.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(0,0,0,0.4)" stroke="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>{repo.stars}</span>
        </div>
      </div>

      {repo.description && (
        <p style={{
          fontSize: '12px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.55,
          marginBottom: '10px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '38px'
        }}>
          {repo.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {repo.language && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: LANG_COLORS[repo.language] || LANG_COLORS.default,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.45)' }}>{repo.language}</span>
          </div>
        )}
        {repo.topics?.map(t => (
          <span key={t} style={{
            fontSize: '10px', padding: '2px 7px', borderRadius: '20px',
            background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.4)',
          }}>
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

export default function GitHub() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch('/api/github')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch data'); return r.json(); })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="github" className="bg-white text-black py-24 px-6 sm:px-12 overflow-hidden border-t border-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 className="text-5xl md:text-8xl font-bold mb-3 tracking-tighter">Open source /</h2>
              <p className="text-xl text-black/40 font-medium">Real-time GitHub pulse</p>
            </div>
            <a
              href={`https://github.com/jamesuchechi`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="font-semibold text-sm">@jamesuchechi ↗</span>
            </a>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
          </div>
        )}

        {error && !loading && (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-center font-medium">
            <p className="mb-2">⚠️ Authentication required for heavy traffic.</p>
            <p className="text-xs opacity-60">Add GITHUB_TOKEN to enable the full contribution experience.</p>
          </div>
        )}

        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats row */}
            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { label: 'Contributions (Year)', value: data.totalContributions },
                { label: 'Public repos',         value: data.stats.publicRepos },
                { label: 'Total stars',          value: data.totalStars        },
                { label: 'Followers',            value: data.stats.followers   },
              ].map(stat => (
                <div key={stat.label} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <span className="text-xl font-bold text-black">{stat.value}</span>
                  <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}

              {/* Languages */}
              {data.topLanguages?.map(lang => (
                <div key={lang} className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ background: LANG_COLORS[lang] || LANG_COLORS.default }}
                  />
                  <span className="text-xs font-bold text-black/60">{lang}</span>
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            {data.contributionGrid?.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 mb-12 overflow-hidden relative group">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-black/30 uppercase tracking-[0.2em]">Activity Calendar</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-black/20 uppercase">Less</span>
                    {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-[1px]" style={{ background: c }} />
                    ))}
                    <span className="text-[10px] font-bold text-black/20 uppercase">More</span>
                  </div>
                </div>
                
                <ContribGrid grid={data.contributionGrid} />
                
                <p className="mt-8 text-xs font-medium text-black/30">
                  Showing one year of open source contributions.
                </p>
              </div>
            )}

            {/* Pinned repos */}
            {data.topRepos?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-black/30 uppercase tracking-[0.2em] mb-6">Top Repositories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topRepos.slice(0, 6).map(repo => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
