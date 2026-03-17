'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/imageUtils';

export default function ProjectsApp({ filter = '' }) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState(filter);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getTech = (p) => {
    try {
      if (!p.technologies) return [];
      if (Array.isArray(p.technologies)) return p.technologies;
      const parsed = JSON.parse(p.technologies);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

  const filtered = projects.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      getTech(p).some(t => t.toLowerCase().includes(q))
    );
  });

  if (loading) return <CenteredMsg text="Loading projects..." color="#00ff88" spinner />;
  if (error)   return <CenteredMsg text={`Error: ${error}`} color="#ff6b6b" />;

  if (selected) {
    const tech = getTech(selected);
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#0d0d0f' }}>
        <button
          onClick={() => setSelected(null)}
          style={backBtn}
        >
          ← back
        </button>
        {selected.imageUrl && (
          <div style={{ width: '100%', height: '160px', position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
            <Image
              src={normalizeImageUrl(selected.imageUrl)}
              alt={selected.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>{selected.title}</h3>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '10px' }}>
          {selected.category} · {selected.year}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', lineHeight: 1.7, marginBottom: '12px' }}>
          {selected.description}
        </p>
        {tech.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
            {tech.map((t, i) => <Tag key={i} text={t} />)}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          {selected.projectUrl && (
            <a href={selected.projectUrl} target="_blank" rel="noopener noreferrer" style={linkBtn('#7ee8fa')}>
              Live demo ↗
            </a>
          )}
          {selected.githubUrl && (
            <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" style={linkBtn('rgba(255,255,255,0.5)')}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d0d0f', overflow: 'hidden' }}>
      {/* Search bar */}
      <div style={{ padding: '10px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search projects, tech, category..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '6px', padding: '6px 10px',
            color: '#fff', fontSize: '12px',
            fontFamily: 'var(--font-mono, monospace)',
            outline: 'none',
          }}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {filtered.length === 0 ? (
          <CenteredMsg text={search ? `No projects matching "${search}"` : 'No projects yet.'} color="rgba(255,255,255,0.3)" />
        ) : (
          filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.07)',
                borderRadius: '8px', padding: '10px 12px',
                marginBottom: '7px', cursor: 'pointer',
                transition: 'background 0.15s',
                display: 'block',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{p.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginBottom: '6px' }}>
                {p.category} · {p.year}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {getTech(p).slice(0, 3).map((t, i) => <Tag key={i} text={t} small />)}
              </div>
            </button>
          ))
        )}
      </div>

      <div style={{ padding: '6px 14px', borderTop: '0.5px solid rgba(255,255,255,0.06)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
        {filtered.length} / {projects.length} projects
      </div>
    </div>
  );
}

function Tag({ text, small }) {
  return (
    <span style={{
      fontSize: small ? '10px' : '11px',
      padding: small ? '1px 6px' : '2px 8px',
      borderRadius: '4px',
      background: 'rgba(126,232,250,0.1)',
      color: 'rgba(126,232,250,0.7)',
      border: '0.5px solid rgba(126,232,250,0.15)',
    }}>
      {text}
    </span>
  );
}

function CenteredMsg({ text, color, spinner }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', flexDirection: 'column', gap: '10px' }}>
      {spinner && (
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: color,
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      <span style={{ color, fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>{text}</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const backBtn = {
  background: 'none', border: 'none',
  color: 'rgba(255,255,255,0.4)', fontSize: '11px',
  fontFamily: 'monospace', cursor: 'pointer',
  marginBottom: '14px', padding: 0,
};

const linkBtn = (color) => ({
  fontSize: '11px', padding: '5px 12px',
  borderRadius: '5px',
  border: `0.5px solid ${color}30`,
  color, background: `${color}10`,
  textDecoration: 'none', fontFamily: 'monospace',
});