'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/imageUtils';

const ROW = ({ label, value, accent }) => (
  <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'flex-start' }}>
    <span style={{ color: 'rgba(126,232,250,0.7)', fontSize: '11px', fontFamily: 'monospace', minWidth: '80px', flexShrink: 0, paddingTop: '1px' }}>
      {label}
    </span>
    <span style={{ color: accent ? '#00ff88' : 'rgba(255,255,255,0.75)', fontSize: '12px', lineHeight: 1.6 }}>
      {value}
    </span>
  </div>
);

export default function AboutApp() {
  const [about,   setAbout]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch('/api/about')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
      .then(d => setAbout(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d0f' }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>Loading...</span>
    </div>
  );

  if (error || !about) return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#0d0d0f' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'monospace', marginBottom: '12px' }}># about.txt</div>
      <ROW label="NAME"     value="James Uchechi" />
      <ROW label="ROLE"     value="Software Engineer · Data Scientist" />
      <ROW label="LOCATION" value="Earth" />
      <ROW label="STATUS"   value="● Available for work" accent />
      <ROW label="FOCUS"    value="Web Apps · Data Pipelines · APIs" />
      <ROW label="FUN FACT" value="Reads sci-fi. Loves clean code." />
    </div>
  );

  const social = (() => {
    try {
      if (!about.socialLinks) return {};
      if (typeof about.socialLinks === 'object') return about.socialLinks;
      return JSON.parse(about.socialLinks);
    } catch { return {}; }
  })();

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: '#0d0d0f' }}>
      {/* Profile image */}
      {about.profileImage && (
        <div style={{ width: '100%', height: '120px', position: 'relative', flexShrink: 0 }}>
          <Image
            src={normalizeImageUrl(about.profileImage)}
            alt={about.name || 'Profile'}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #0d0d0f 100%)' }} />
        </div>
      )}

      <div style={{ padding: '14px 16px' }}>
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'monospace', marginBottom: '12px', letterSpacing: '.08em' }}>
          # about.txt
        </div>

        {about.name     && <ROW label="NAME"     value={about.name} />}
        {about.title    && <ROW label="ROLE"     value={about.title} />}
        {about.location && <ROW label="LOCATION" value={about.location} />}
        <ROW label="STATUS" value="● Available for work" accent />
        {about.email    && <ROW label="EMAIL"    value={about.email} />}
        {about.phone    && <ROW label="PHONE"    value={about.phone} />}

        {about.bio && (
          <>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'monospace', marginBottom: '8px', letterSpacing: '.08em' }}>
              # bio
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {about.bio}
            </p>
          </>
        )}

        {Object.values(social).some(Boolean) && (
          <>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'monospace', marginBottom: '8px', letterSpacing: '.08em' }}>
              # links
            </div>
            {Object.entries(social).map(([k, v]) => v ? (
              <div key={k} style={{ marginBottom: '5px' }}>
                <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(126,232,250,0.7)', fontSize: '11px', fontFamily: 'monospace', textDecoration: 'none' }}>
                  {k} ↗
                </a>
              </div>
            ) : null)}
          </>
        )}
      </div>
    </div>
  );
}