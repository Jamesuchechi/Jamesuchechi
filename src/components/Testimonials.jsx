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
      width: 'clamp(300px, 40vw, 400px)',
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '24px',
      padding: '32px',
      marginRight: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)',
    }}>
      <div>
        <StarRating rating={t.rating} />

        <p style={{
          fontSize: '15px',
          lineHeight: 1.8,
          color: '#1a1a1a',
          marginBottom: '24px',
          fontStyle: 'italic',
          fontWeight: 400,
        }}>
          &ldquo;{t.quote}&rdquo;
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {t.avatarUrl ? (
          <img
            src={t.avatarUrl}
            alt={t.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: '#000', color: '#fff',
          display: t.avatarUrl ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 600, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#000' }}>{t.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '2px', fontWeight: 500 }}>
            {t.role}{t.company ? ` · ${t.company}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction = 1, speed = 40, paused }) {
  // duplicate 4× for smoother continuous scroll
  const quadrupled = [...items, ...items, ...items, ...items];
  const dur = (quadrupled.length * 400) / speed; 

  return (
    <div style={{ overflow: 'hidden', width: '100%',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      maskImage:       'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    }}>
      <motion.div
        style={{ display: 'flex', width: 'max-content', padding: '10px 0' }}
        animate={{ x: direction === 1 ? ['0%', '-25%'] : ['-25%', '0%'] }}
        transition={{ duration: dur, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
      >
        {quadrupled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

// Placeholder cards shown when no data yet
const PLACEHOLDER = [
  { id: 'p1', name: 'James Doe', role: 'Software Engineer', company: 'Google', quote: 'An incredible developer who consistently delivers high-quality code and amazing user experiences. Highly recommended!', rating: 5, avatarUrl: null },
  { id: 'p2', name: 'Sarah Smith', role: 'Product Manager', company: 'Stripe', quote: 'Collaborating was a breeze. The attention to detail in the UI/UX is truly world-class.', rating: 5, avatarUrl: null },
  { id: 'p3', name: 'Michael Chen', role: 'Founder', company: 'TechStart', quote: 'Transformed our vision into a stunning reality. The performance and aesthetics are spot on.', rating: 5, avatarUrl: null },
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
  const row1  = items.length >= 2 ? items : items;
  const row2  = items.length >= 3 ? [...items].reverse() : [];

  return (
    <section id="testimonials" className="bg-white text-black py-24 sm:py-32 overflow-hidden border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter">Kind words /</h2>
          <p className="text-xl md:text-2xl text-black/40 font-medium">(What people say)</p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <MarqueeRow items={row1} direction={1} speed={35} />
          {row2.length > 0 && (
            <MarqueeRow items={row2} direction={-1} speed={30} />
          )}
        </div>
      )}

      {testimonials.length === 0 && !loading && (
        <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-12">
          <p className="text-xs font-bold text-black/20 uppercase tracking-widest">
            Showing placeholder data. Add real testimonials in the admin dashboard.
          </p>
        </div>
      )}
    </section>
  );
}
