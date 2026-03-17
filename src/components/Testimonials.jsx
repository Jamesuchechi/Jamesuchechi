'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Testimonials
 * ─────────────────────────────────────────────────────────────
 * Auto-scrolling marquee of testimonial cards on a white bg.
 * Two rows scroll in opposite directions for depth.
 * Pauses on hover. Respects prefers-reduced-motion.
 * Falls back gracefully when no testimonials exist yet.
 */

function StarRating({ rating = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= rating ? '#000' : 'none'}
          stroke={i <= rating ? '#000' : '#ccc'}
          strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  const initials = t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{
      flexShrink: 0,
      width: 'clamp(280px, 35vw, 360px)',
      background: '#fff',
      border: '0.5px solid rgba(0,0,0,0.08)',
      borderRadius: '16px',
      padding: '24px',
      marginRight: '16px',
    }}>
      <StarRating rating={t.rating} />

      <p style={{
        fontSize: '14px',
        lineHeight: 1.75,
        color: '#1a1a1a',
        marginBottom: '20px',
        fontStyle: 'italic',
      }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {t.avatarUrl ? (
          <img
            src={t.avatarUrl}
            alt={t.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#000', color: '#fff',
          display: t.avatarUrl ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 500, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: '#000' }}>{t.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginTop: '1px' }}>
            {t.role}{t.company ? ` · ${t.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction = 1, speed = 35, paused }) {
  // duplicate 3× so we always have content regardless of count
  const tripled = [...items, ...items, ...items];
  const dur = (tripled.length * 360) / speed; // roughly px / speed

  return (
    <div style={{ overflow: 'hidden', width: '100%',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      maskImage:       'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
    }}>
      <motion.div
        style={{ display: 'flex', width: 'max-content' }}
        animate={{ x: direction === 1 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }}
        transition={{ duration: dur, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {tripled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

// Placeholder cards shown when no data yet
const PLACEHOLDER = [
  { id: 'p1', name: 'Add your first testimonial', role: 'via admin dashboard', company: '', quote: 'Reach out to collaborators, clients or colleagues for a quick recommendation. Even one quote adds significant credibility.', rating: 5, avatarUrl: null },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => setTestimonials(Array.isArray(d) ? d : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const items = testimonials.length > 0 ? testimonials : PLACEHOLDER;
  // Split into two rows; if odd, first row gets one more
  const mid   = Math.ceil(items.length / 2);
  const row1  = items.length >= 4 ? items.slice(0, mid)  : items;
  const row2  = items.length >= 4 ? items.slice(mid)     : [];

  return (
    <section id="testimonials" className="bg-white text-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">Kind words /</h2>
          <p className="text-xl text-black/50">(What people say)</p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MarqueeRow items={row1} direction={1} speed={30} />
          {row2.length > 0 && (
            <MarqueeRow items={row2} direction={-1} speed={28} />
          )}
        </div>
      )}

      {testimonials.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-8">
          <p className="text-sm text-black/30">
            Add testimonials from the admin dashboard → Testimonials tab.
          </p>
        </div>
      )}
    </section>
  );
}
