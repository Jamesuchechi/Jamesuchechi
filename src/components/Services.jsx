'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ACCENTS = ['#FF3B00', '#00E5FF', '#AAFF00', '#FF0099', '#FFD700', '#7B61FF'];
const CATEGORY_LABELS = ['Brand Identity', 'Digital Product', 'Creative Tech', 'Motion & 3D', 'Strategy', 'Deployment'];

/* ── Each service row has its own scroll-driven parallax ── */
function ServiceRow({ service, index, total, accent, category }) {
  const rowRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [everInView, setEverInView] = useState(false);

  let features = [];
  try {
    features = service.features
      ? (Array.isArray(service.features) ? service.features : JSON.parse(service.features))
      : [];
  } catch (_) {}

  const num = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  // Per-row scroll progress
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  // Parallax: title slides up as you scroll through it
  const titleY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const titleYSpring = useSpring(titleY, { stiffness: 80, damping: 20 });

  // Clip reveal: row wipes in from bottom as it enters viewport
  const clipProgress = useTransform(scrollYProgress, [0, 0.22], [100, 0]);
  const clipSpring   = useSpring(clipProgress, { stiffness: 60, damping: 18 });
  const clipPath     = useTransform(clipSpring, v => `inset(${v}% 0% 0% 0%)`);

  // Background flash: accent colour floods in as row enters, fades out
  const bgOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.30], [0, 0.08, 0]);

  // Number scale punch
  const numScale = useTransform(scrollYProgress, [0.08, 0.20], [0.6, 1]);
  const numScaleSpring = useSpring(numScale, { stiffness: 200, damping: 18 });

  // Description blur clears as it enters
  const descBlur   = useTransform(scrollYProgress, [0.12, 0.30], [8, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.10, 0.28], [0, 1]);
  const descY      = useTransform(scrollYProgress, [0.10, 0.30], [30, 0]);

  // Line width draw
  const lineScale  = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const lineSpring = useSpring(lineScale, { stiffness: 60, damping: 16 });

  // Tags stagger opacity
  const tagsOpacity = useTransform(scrollYProgress, [0.20, 0.38], [0, 1]);
  const tagsY       = useTransform(scrollYProgress, [0.20, 0.38], [20, 0]);

  // Intersection for persistent state
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEverInView(true);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={rowRef}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
        clipPath,
      }}
    >
      {/* Accent flood background */}
      <motion.div style={{
        position: 'absolute', inset: 0,
        background: accent,
        opacity: bgOpacity,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}14 0%, transparent 65%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 72px)',
      }}>

        {/* Meta row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div style={{
              scale: numScaleSpring,
              background: accent,
              borderRadius: '2px',
              padding: '3px 11px',
              fontFamily: '"Courier New", monospace',
              fontSize: '12px', fontWeight: 700,
              color: '#000', letterSpacing: '0.08em',
              display: 'inline-block',
              transformOrigin: 'center',
            }}>
              {num}
            </motion.div>
            <span style={{
              fontFamily: '"Courier New", monospace', fontSize: '12px',
              color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
            }}>
              / {totalStr}
            </span>
          </div>
          <span style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(9px, 1vw, 11px)',
            color: accent, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            {category}
          </span>
        </div>

        {/* Giant parallax title */}
        <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
          <motion.h3
            style={{
              y: titleYSpring,
              fontFamily: '"Georgia", "Times New Roman", Times, serif',
              fontSize: 'clamp(44px, 9vw, 130px)',
              fontWeight: 900, color: '#ffffff',
              lineHeight: 0.88, letterSpacing: '-0.03em',
              textTransform: 'uppercase', margin: 0,
              willChange: 'transform',
            }}
          >
            {service.title}
          </motion.h3>
        </div>

        {/* Draw line */}
        <motion.div style={{
          scaleX: lineSpring,
          height: '1px',
          background: `linear-gradient(90deg, ${accent} 0%, rgba(255,255,255,0.06) 100%)`,
          transformOrigin: 'left',
          marginBottom: '28px',
        }} />

        {/* Description + tags */}
        <div style={{
          display: 'flex', gap: 'clamp(24px, 4vw, 60px)',
          flexWrap: 'wrap', alignItems: 'flex-start',
        }}>
          <motion.p style={{
            opacity: descOpacity,
            y: descY,
            filter: useTransform(descBlur, v => `blur(${v}px)`),
            fontFamily: '"Georgia", Times, serif',
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '520px', flex: '1 1 260px',
            margin: 0,
            willChange: 'transform, opacity, filter',
          }}>
            {service.description}
          </motion.p>

          {features.length > 0 && (
            <motion.div style={{
              opacity: tagsOpacity,
              y: tagsY,
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              flex: '1 1 180px', alignContent: 'flex-start',
            }}>
              {features.map((f, fi) => (
                <span
                  key={fi}
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '10px',
                    padding: '5px 14px',
                    border: `1px solid ${accent}50`,
                    color: accent,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: `${accent}0d`, borderRadius: '2px',
                  }}
                >
                  {f}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: '#080808', position: 'relative' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 72px) clamp(32px, 4vw, 48px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}
      >
        <div>
          <p style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(10px, 1vw, 12px)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)', margin: '0 0 12px',
          }}>
            Services
          </p>
          <h2 style={{
            fontFamily: '"Georgia", "Times New Roman", Times, serif',
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 900, color: '#ffffff',
            lineHeight: 1, letterSpacing: '-0.02em',
            textTransform: 'uppercase', margin: 0,
          }}>
            What I Do /
          </h2>
        </div>
        <p style={{
          fontFamily: '"Courier New", monospace', fontSize: '11px',
          color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em',
          alignSelf: 'flex-end',
        }}>
          {services.length > 0 ? `${String(services.length).padStart(2, '0')} offerings` : ''}
        </p>
      </motion.div>

      {/* List */}
      {loading ? (
        <div style={{ height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{
              width: '26px', height: '26px',
              border: '1.5px solid rgba(255,255,255,0.07)',
              borderTopColor: '#fff', borderRadius: '50%',
            }}
          />
        </div>
      ) : services.length === 0 ? (
        <div style={{ height: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '13px' }}>
            No services yet.
          </p>
        </div>
      ) : (
        services.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            index={i}
            total={services.length}
            accent={ACCENTS[i % ACCENTS.length]}
            category={CATEGORY_LABELS[i % CATEGORY_LABELS.length]}
          />
        ))
      )}

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
    </section>
  );
}