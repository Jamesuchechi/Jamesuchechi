'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * GitHub activity strip
 * ─────────────────────────────────────────────────────────────
 * Compact section — not full height.
 * Shows: contribution heatmap · stat pills · pinned repos
 * All data comes from /api/github (server-side cached 1hr).
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
  const flat = grid.flat();
  const max  = Math.max(...flat, 1);

  const opacity = (val) => {
    if (!val) return 0.06;
    const ratio = val / max;
    if (ratio < 0.25) return 0.25;
    if (ratio < 0.5)  return 0.45;
    if (ratio < 0.75) return 0.65;
    return 0.9;
  };

  return (
    <div style={{ display: 'flex', gap: '3px', flexWrap: 'nowrap' }}>
      {grid.map((week, wi) => (
        <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {week.map((day, di) => (
            <div
              key={di}
              title={`${day} commit${day !== 1 ? 's' : ''}`}
              style={{
                width: '10px', height: '10px', borderRadius: '2px',
                background: `rgba(0,0,0,${opacity(day)})`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      ))}
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
        minWidth: '0',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
        <span style={{ fontWeight: 500, fontSize: '13px', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="github" className="bg-white text-black py-20 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-2">Open source /</h2>
              <p className="text-xl text-black/50">(GitHub activity)</p>
            </div>
            <a
              href={`https://github.com/jamesuchechi`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px', borderRadius: '20px',
                border: '0.5px solid rgba(0,0,0,0.15)',
                fontSize: '13px', color: 'rgba(0,0,0,0.6)',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              @jamesuchechi ↗
            </a>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
          </div>
        )}

        {error && !loading && (
          <div style={{
            padding: '24px', borderRadius: '12px',
            background: '#fafafa', border: '0.5px solid rgba(0,0,0,0.08)',
            color: 'rgba(0,0,0,0.4)', fontSize: '14px', textAlign: 'center',
          }}>
            GitHub data unavailable. Add a <code>GITHUB_TOKEN</code> env var to raise the rate limit.
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Public repos',    value: data.stats.publicRepos },
                { label: 'Total stars',     value: data.totalStars        },
                { label: 'Followers',       value: data.stats.followers   },
                { label: 'Commits (30d)',   value: data.recentCommits     },
              ].map(stat => (
                <div key={stat.label} style={{
                  padding: '10px 18px', borderRadius: '20px',
                  background: '#f5f5f5', border: '0.5px solid rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#000' }}>
                    {stat.value}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}

              {/* Top languages */}
              {data.topLanguages?.map(lang => (
                <div key={lang} style={{
                  padding: '10px 14px', borderRadius: '20px',
                  background: '#f5f5f5', border: '0.5px solid rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: LANG_COLORS[lang] || LANG_COLORS.default,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.55)' }}>{lang}</span>
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            {data.contributionGrid?.length > 0 && (
              <div style={{
                background: '#fafafa',
                border: '0.5px solid rgba(0,0,0,0.07)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '28px',
                overflowX: 'auto',
              }}>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', letterSpacing: '.06em', marginBottom: '10px' }}>
                  CONTRIBUTION ACTIVITY · LAST 6 MONTHS
                </div>
                <ContribGrid grid={data.contributionGrid} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>less</span>
                  {[0.06, 0.25, 0.45, 0.65, 0.9].map(op => (
                    <div key={op} style={{ width: '10px', height: '10px', borderRadius: '2px', background: `rgba(0,0,0,${op})` }} />
                  ))}
                  <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}>more</span>
                </div>
              </div>
            )}

            {/* Pinned repos */}
            {data.topRepos?.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', letterSpacing: '.06em', marginBottom: '12px' }}>
                  TOP REPOSITORIES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
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
