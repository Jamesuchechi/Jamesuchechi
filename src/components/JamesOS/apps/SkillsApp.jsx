'use client';
import { useState, useEffect } from 'react';

export default function SkillsApp() {
  const [skills,    setSkills]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activecat, setActivecat] = useState('All');

  useEffect(() => {
    fetch('/api/skills')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(d => setSkills(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <Err msg={error} />;
  if (!skills.length) return <Err msg="No skills yet. Add via admin dashboard." />;

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean)))];
  const filtered   = activecat === 'All' ? skills : skills.filter(s => s.category === activecat);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0d0d0f', overflow: 'hidden' }}>
      {/* Category tabs */}
      <div style={{
        display: 'flex', gap: '4px', padding: '10px 12px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        overflowX: 'auto', flexShrink: 0,
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActivecat(cat)}
            style={{
              padding: '3px 10px', borderRadius: '5px',
              fontSize: '11px', fontFamily: 'monospace',
              border: '0.5px solid',
              borderColor: activecat === cat ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.1)',
              background:  activecat === cat ? 'rgba(139,92,246,0.15)' : 'transparent',
              color:       activecat === cat ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {filtered.map(skill => (
          <div key={skill.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}>{skill.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'monospace' }}>
                {skill.proficiency ?? 80}%
              </span>
            </div>
            {/* Bar */}
            <div style={{
              height: '3px', borderRadius: '2px',
              background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
            }}>
              <div
                style={{
                  height: '100%', borderRadius: '2px',
                  width: `${skill.proficiency ?? 80}%`,
                  background: categoryColor(skill.category),
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 14px', borderTop: '0.5px solid rgba(255,255,255,0.06)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
        {filtered.length} skills · {activecat}
      </div>
    </div>
  );
}

function categoryColor(cat) {
  const map = {
    Frontend: '#7ee8fa',  Backend: '#00ff88',
    Database: '#fcd34d',  DevOps:  '#f87171',
    Design:   '#c4b5fd',  Mobile:  '#fb923c',
    Data:     '#34d399',  Other:   'rgba(255,255,255,0.4)',
  };
  return map[cat] ?? 'rgba(255,255,255,0.4)';
}

function Spinner() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#c4b5fd', animation: 'spin 0.7s linear infinite' }} />
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>Loading skills...</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
function Err({ msg }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <span style={{ color: '#ff6b6b', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>{msg}</span>
    </div>
  );
}