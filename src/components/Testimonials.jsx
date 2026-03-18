'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PLACEHOLDER = [
  { id: 'p1', name: 'Alex Johnson', role: 'Senior Engineer', company: 'Google', quote: 'An incredible developer who consistently delivers high-quality, elegant code. The attention to detail in every interaction is world-class.', rating: 5, avatarUrl: null },
  { id: 'p2', name: 'Sarah Mitchell', role: 'Product Manager', company: 'Stripe', quote: 'Collaborating was effortless. The UI/UX sensibility and technical execution came together in a way I rarely see. Delivered ahead of schedule.', rating: 5, avatarUrl: null },
  { id: 'p3', name: 'Michael Chen', role: 'Founder', company: 'TechStart', quote: 'Transformed our vision into a stunning, performant reality. Not just a developer — a true product thinker who cares about outcomes.', rating: 5, avatarUrl: null },
  { id: 'p4', name: 'Priya Nair', role: 'CTO', company: 'Finova', quote: 'The most thorough, communicative engineer we have ever worked with. Code is clean, docs are thorough, and the results speak for themselves.', rating: 5, avatarUrl: null },
];

function Stars({ rating = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i <= rating ? '#FFD700' : 'none'}
          stroke={i <= rating ? '#FFD700' : 'rgba(255,255,255,0.15)'}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

function Avatar({ name, avatarUrl, size = 48 }) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl} alt={name}
        onError={() => setImgError(true)}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
      fontFamily: '"Courier New", monospace', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TestimonialCard({ item, index }) {
  const cardRef = useRef(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [isEven ? -60 : 60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.94, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ x, opacity, scale }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: 'clamp(28px, 4vw, 44px)',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
      >
        {/* Giant quote mark */}
        <div style={{
          position: 'absolute', top: '16px', right: '24px',
          fontSize: '120px', lineHeight: 1,
          color: 'rgba(255,255,255,0.03)',
          fontFamily: 'Georgia, serif', fontWeight: 900,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          "
        </div>

        {/* Subtle corner glow */}
        <div style={{
          position: 'absolute', top: '-40px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Stars rating={item.rating} />

          <blockquote style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: 'clamp(15px, 2vw, 19px)',
            lineHeight: 1.75, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.75)',
            margin: '20px 0 28px',
          }}>
            "{item.quote}"
          </blockquote>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Avatar name={item.name} avatarUrl={item.avatarUrl} size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', fontFamily: '"Courier New", monospace' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', fontFamily: 'monospace' }}>
                {item.role}{item.company ? ` · ${item.company}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Featured / hero testimonial shown large at the top */
function HeroTestimonial({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        padding: 'clamp(40px, 5vw, 64px)',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        position: 'relative', overflow: 'hidden',
        marginBottom: 'clamp(40px, 6vw, 72px)',
      }}
    >
      {/* Decorative huge quote */}
      <div style={{
        position: 'absolute', top: '-20px', left: '32px',
        fontSize: '220px', lineHeight: 1,
        color: 'rgba(255,255,255,0.025)',
        fontFamily: 'Georgia, serif', fontWeight: 900,
        pointerEvents: 'none', userSelect: 'none',
      }}>
        "
      </div>

      {/* Gold glow */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-40px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Stars rating={item.rating} />
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: 'clamp(20px, 3vw, 32px)',
            lineHeight: 1.6, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.85)',
            margin: '24px 0 32px',
            maxWidth: '860px',
          }}
        >
          "{item.quote}"
        </motion.blockquote>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar name={item.name} avatarUrl={item.avatarUrl} size={52} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', fontFamily: '"Courier New", monospace' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', fontFamily: 'monospace' }}>
              {item.role}{item.company ? ` · ${item.company}` : ''}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start start'] });
  const headingY = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => setTestimonials(Array.isArray(d) && d.length > 0 ? d : PLACEHOLDER))
      .catch(() => setTestimonials(PLACEHOLDER))
      .finally(() => setLoading(false));
  }, []);

  const items = testimonials.length > 0 ? testimonials : PLACEHOLDER;
  const hero  = items[0];
  const rest  = items.slice(1);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      style={{
        background: '#080808',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 72px)',
        position: 'relative', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Background noise texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '180px',
      }} />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,59,0,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <motion.div style={{ y: headingY, opacity: headingOpacity, marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '11px',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', marginBottom: '16px',
          }}>
            Testimonials /
          </p>
          <h2 style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: 'clamp(40px, 7vw, 96px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 0.88, letterSpacing: '-0.03em',
            textTransform: 'uppercase', margin: 0,
          }}>
            Kind<br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>Words /</span>
          </h2>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '28px', height: '28px', border: '2px solid rgba(255,255,255,0.07)', borderTopColor: 'rgba(255,215,0,0.6)', borderRadius: '50%' }} />
          </div>
        ) : (
          <>
            {/* Hero testimonial */}
            <HeroTestimonial item={hero} />

            {/* Rest in responsive grid */}
            {rest.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 28px)',
              }}>
                {rest.map((item, i) => (
                  <TestimonialCard key={item.id} item={item} index={i} />
                ))}
              </div>
            )}

            {/* Bottom label if using placeholders */}
            {testimonials === PLACEHOLDER && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  marginTop: '40px',
                  fontFamily: '"Courier New", monospace', fontSize: '10px',
                  letterSpacing: '0.14em', color: 'rgba(255,255,255,0.15)',
                  textTransform: 'uppercase',
                }}
              >
                Placeholder data — add real testimonials in the admin dashboard.
              </motion.p>
            )}
          </>
        )}
      </div>
    </section>
  );
}