'use client';
import { Fragment, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
      <div style={{ display: 'flex', position: 'relative', height: '18px', marginBottom: '6px' }}>
        {monthLabels.map((m, i) => (
          <span key={i} style={{
            position: 'absolute', left: `${m.index * 13}px`,
            fontSize: '10px', color: 'rgba(255,255,255,0.25)',
            fontFamily: '"Courier New", monospace',
            fontWeight: 500, whiteSpace: 'nowrap',
          }}>
            {m.label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '4px', paddingTop: '1px' }}>
          <div style={{ height: '10px', visibility: 'hidden' }} />
          {['Mon', 'Wed', 'Fri'].map((d, i) => (
            <Fragment key={d}>
              <div style={{ height: '10px', visibility: 'hidden' }} />
              <div style={{ height: '10px', fontSize: '9px', color: 'rgba(255,255,255,0.2)', lineHeight: '10px', fontFamily: 'monospace' }}>{d}</div>
            </Fragment>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>
            {week.map((day, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (wi * 0.003) + (di * 0.005) }}
                title={`${day.count} contributions on ${day.date}`}
                style={{
                  width: '10px', height: '10px', borderRadius: '2px',
                  background: day.count === 0 ? '#161b22' : (day.color || '#161b22'),
                  flexShrink: 0,
                  opacity: 1,
                  cursor: 'default',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepoCard({ repo, index }) {
  const [hovered, setHovered] = useState(false);
  const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', textDecoration: 'none',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '12px', padding: '20px 22px',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${langColor}30` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Language color top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: langColor,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.25s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
        <span style={{
          fontFamily: '"Courier New", monospace', fontSize: '13px',
          fontWeight: 700, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {repo.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,220,80,0.8)" stroke="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontFamily: 'monospace' }}>{repo.stars}</span>
        </div>
      </div>

      {repo.description && (
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
          marginBottom: '14px', fontFamily: 'Georgia, serif',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '38px',
        }}>
          {repo.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {repo.language && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: langColor, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{repo.language}</span>
          </div>
        )}
        {repo.topics?.map(t => (
          <span key={t} style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

function StatPill({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}
    >
      <span style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#fff', fontFamily: '"Courier New", monospace', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
        {label}
      </span>
    </motion.div>
  );
}

export default function GitHub() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => {
    fetch('/api/github')
      .then(r => { if (!r.ok) throw new Error('failed'); return r.json(); })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="github"
      style={{
        background: '#0a0a0f',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 72px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-100px', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,116,137,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,114,165,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div style={{ y: headerY, opacity: headerOpacity, marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{
                fontFamily: '"Courier New", monospace', fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', marginBottom: '12px',
              }}>
                Open Source /
              </p>
              <h2 style={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: 'clamp(40px, 7vw, 96px)',
                fontWeight: 900, color: '#fff',
                lineHeight: 0.9, letterSpacing: '-0.03em',
                textTransform: 'uppercase', margin: 0,
              }}>
                Code &<br />
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Commits</span>
              </h2>
            </div>
            <a
              href="https://github.com/jamesuchechi"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '10px 22px', borderRadius: '40px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                fontFamily: '"Courier New", monospace', fontSize: '12px',
                letterSpacing: '0.06em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              @jamesuchechi ↗
            </a>
          </div>
        </motion.div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '28px', height: '28px', border: '2px solid rgba(255,255,255,0.07)', borderTopColor: '#2b7489', borderRadius: '50%' }} />
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: '13px' }}>
              Add GITHUB_TOKEN to enable live data.
            </p>
          </div>
        )}

        {data && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                { label: 'Contributions', value: data.totalContributions },
                { label: 'Repositories',  value: data.stats.publicRepos  },
                { label: 'Total Stars',   value: data.totalStars          },
                { label: 'Followers',     value: data.stats.followers     },
              ].map((s, i) => <StatPill key={s.label} {...s} index={i} />)}

              {data.topLanguages?.map((lang, i) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 4) * 0.08 }}
                  style={{
                    padding: '14px 18px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: LANG_COLORS[lang] || LANG_COLORS.default, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{lang}</span>
                </motion.div>
              ))}
            </div>

            {/* Heatmap */}
            {data.contributionGrid?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  padding: '32px 36px 28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px',
                  overflow: 'hidden', position: 'relative',
                }}
              >
                {/* Scanline effect */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                  borderRadius: '20px',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontFamily: '"Courier New", monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                      Activity Calendar
                    </span>
                    <div style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#fff', fontFamily: 'monospace', marginTop: '4px' }}>
                      {data.totalContributions.toLocaleString()} contributions this year
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>Less</span>
                    {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map(c => (
                      <div key={c} style={{ width: '11px', height: '11px', borderRadius: '2px', background: c }} />
                    ))}
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>More</span>
                  </div>
                </div>
                <ContribGrid grid={data.contributionGrid} />
              </motion.div>
            )}

            {/* Repos */}
            {data.topRepos?.length > 0 && (
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  style={{ fontFamily: '"Courier New", monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '20px' }}
                >
                  Top Repositories
                </motion.p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {data.topRepos.slice(0, isMobile ? 5 : 10).map((repo, i) => (
                    <RepoCard key={repo.id} repo={repo} index={i} />
                  ))}
                </div>

                {/* View More Button */}
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  <motion.a
                    href="https://github.com/jamesuchechi"
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '12px 28px', borderRadius: '40px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                      fontFamily: '"Courier New", monospace', fontSize: '13px',
                      fontWeight: 600, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  >
                    Explore All Repositories
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </motion.a>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}