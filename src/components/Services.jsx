'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/**
 * Services — Editorial Typographic Poster Scroll
 *
 * Pattern: Each service = a sticky full-viewport poster.
 * Scroll drives panel switching; no stacking, no cards.
 *
 * Transitions:
 *   - Panel enters via clipPath wipe (bottom→top curtain)
 *   - Panel exits via clipPath wipe (top→bottom drop)
 *   - A saturated accent colour SLAMS in as a diagonal flash between panels
 *
 * Per-panel animations:
 *   - Giant serif title: words slam in from alternating L/R
 *   - Number counter: ink-bar floods behind it (scaleY spring)
 *   - Bottom line draws left→right
 *   - Description + tags stagger up
 *
 * Sidebar nav: pill dashes that expand + show first word of each service
 * Track height: 80vh × N  →  zero dead space
 */

const ACCENTS = ['#FF3B00','#00E5FF','#AAFF00','#FF0099','#FFD700','#7B61FF'];
const CATEGORY_LABELS = ['Brand Identity','Digital Product','Creative Tech','Motion & 3D','Strategy','Deployment'];

/* ─── Alternating word slam ─────────────────────────────────────────────── */
function SplitTitle({ title, isActive }) {
  const words = title.split(' ');
  return (
    <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
      {words.map((word, wi) => {
        const fromLeft = wi % 2 === 0;
        return (
          <span key={wi} style={{ display: 'inline-block', marginRight: '0.2em', overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              initial={{ x: fromLeft ? '-120%' : '120%', opacity: 0 }}
              animate={isActive ? { x: 0, opacity: 1 } : { x: fromLeft ? '-120%' : '120%', opacity: 0 }}
              transition={{ duration: 0.68, delay: wi * 0.075, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}

/* ─── One poster panel ──────────────────────────────────────────────────── */
function PosterPanel({ service, index, total, isActive, accent }) {
  let features = [];
  try { features = service.features ? (Array.isArray(service.features) ? service.features : JSON.parse(service.features)) : []; } catch (_) {}
  const num      = String(index + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: 'clamp(24px, 4vw, 56px)',
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px',
      }}>
        {/* Number with ink slab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <motion.div
              initial={{ scaleY: 0 }} animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.48, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: 'absolute', inset: '-3px -8px',
                background: accent, transformOrigin: 'bottom', borderRadius: '2px',
              }}
            />
            <span style={{
              position: 'relative', zIndex: 1,
              fontFamily: '"Courier New", monospace', fontSize: 'clamp(11px, 1vw, 13px)',
              fontWeight: 700, color: '#000', letterSpacing: '0.08em',
            }}>{num}</span>
          </div>
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>
            / {totalStr}
          </span>
        </div>

        {/* Category */}
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            fontFamily: '"Courier New", monospace', fontSize: 'clamp(10px, 1vw, 12px)',
            color: accent, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}
        >
          {CATEGORY_LABELS[index % CATEGORY_LABELS.length]}
        </motion.span>
      </div>

      {/* ── GIANT TITLE ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '16px 0' }}>
        <div style={{
          fontFamily: '"Georgia", "Times New Roman", Times, serif',
          fontSize: 'clamp(54px, 10vw, 148px)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 0.88,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          width: '100%',
        }}>
          <SplitTitle title={service.title} isActive={isActive} />
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div>
        {/* Draw line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.75, delay: 0.38, ease: [0.76, 0, 0.24, 1] }}
          style={{
            height: '1px', background: `linear-gradient(90deg, ${accent} 0%, rgba(255,255,255,0.1) 100%)`,
            transformOrigin: 'left', marginBottom: '22px',
          }}
        />

        <div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 60px)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 22 }} animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.52, delay: 0.48 }}
            style={{
              fontFamily: '"Georgia", Times, serif',
              fontSize: 'clamp(13px, 1.4vw, 17px)', lineHeight: 1.72,
              color: 'rgba(255,255,255,0.46)', maxWidth: '460px', flex: '1 1 260px',
              margin: 0,
            }}
          >
            {service.description}
          </motion.p>

          {/* Tags */}
          {features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', flex: '1 1 180px', alignContent: 'flex-start' }}>
              {features.map((f, fi) => (
                <motion.span
                  key={fi}
                  initial={{ opacity: 0, y: 16, scale: 0.88 }}
                  animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.88 }}
                  transition={{ duration: 0.38, delay: 0.52 + fi * 0.065, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    fontFamily: '"Courier New", monospace', fontSize: '10px',
                    padding: '4px 13px', border: `1px solid ${accent}50`,
                    color: accent, letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: `${accent}0e`, borderRadius: '2px',
                  }}
                >
                  {f}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────── */
export default function Services() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState(0);
  const [flash,    setFlash]    = useState(null); // accent colour for diagonal flash
  const prevActive = useRef(0);
  const trackRef   = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Drive active panel + fire flash
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (!services || services.length === 0) return;
      
      const seg = 1 / services.length;
      const idx = Math.max(0, Math.min(services.length - 1, Math.floor(v / seg)));
      
      if (idx !== prevActive.current) {
        setFlash(ACCENTS[idx % ACCENTS.length]);
        setTimeout(() => setFlash(null), 380);
        prevActive.current = idx;
        setActive(idx);
      }
    });
    return unsub;
  }, [scrollYProgress, services.length]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const trackHeight = services.length > 0 ? `${(services.length + 1) * 100}vh` : '100vh';

  const jumpTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const seg = 1 / services.length;
    const ratio = i * seg + seg * 0.05;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const trackH = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + trackH * ratio, behavior: 'smooth' });
  };

  return (
    <section style={{ background: '#080808', position: 'relative' }}>

      {/* Section header — thin label row */}
      <div style={{
        padding: 'clamp(32px, 4vw, 48px) clamp(28px, 5vw, 72px) 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <motion.p
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{
            fontFamily: '"Courier New", monospace', fontSize: 'clamp(10px, 1vw, 12px)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)', margin: '0 0 18px',
          }}
        >
          Services
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: '"Courier New", monospace', fontSize: '11px',
            color: 'rgba(255,255,255,0.15)', margin: '0 0 18px', letterSpacing: '0.08em',
          }}
        >
          {services.length > 0 ? `${String(services.length).padStart(2,'0')} offerings` : ''}
        </motion.p>
      </div>

      {/* Scroll track */}
      <div ref={trackRef} style={{ height: trackHeight, position: 'relative' }}>
        {loading ? (
          <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '26px', height: '26px', border: '1.5px solid rgba(255,255,255,0.07)', borderTopColor: '#fff', borderRadius: '50%' }}
            />
          </div>
        ) : services.length === 0 ? (
          <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '13px' }}>No services yet.</p>
          </div>
        ) : (
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

            {/* Grain texture */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
              backgroundSize: '160px', opacity: 0.6,
            }}/>

            {/* Ambient glow — changes per panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`glow-${active}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.7 }}
                style={{
                  position: 'absolute', top: '-140px', left: '-100px',
                  width: '500px', height: '500px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${ACCENTS[active % ACCENTS.length]}1a 0%, transparent 68%)`,
                  pointerEvents: 'none', zIndex: 1,
                }}
              />
            </AnimatePresence>

            {/* Panel frames */}
            {services.map((service, i) => (
              <AnimatePresence key={service.id} mode="wait">
                {active === i && (
                  <motion.div
                    key={`poster-${i}`}
                    initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
                    animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                    exit={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    style={{ position: 'absolute', inset: 0, background: '#080808', zIndex: 10 }}
                  >
                    <PosterPanel
                      service={service} index={i} total={services.length}
                      isActive={true} accent={ACCENTS[i % ACCENTS.length]}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* Diagonal flash between panels */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  key={flash + Date.now()}
                  initial={{ clipPath: 'polygon(0 0, 0 0, 15% 100%, 0 100%)', opacity: 1 }}
                  animate={{ clipPath: 'polygon(0 0, 115% 0, 100% 100%, 0 100%)', opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: flash,
                    zIndex: 40, pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>

            {/* ── Right nav ── */}
            <div style={{
              position: 'absolute', right: 'clamp(14px, 2.5vw, 32px)',
              top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', gap: '8px',
              zIndex: 30, alignItems: 'flex-end',
            }}>
              {services.map((s, i) => (
                <button
                  key={i} onClick={() => jumpTo(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '2px 0' }}
                >
                  <motion.span
                    animate={{ opacity: active === i ? 1 : 0, maxWidth: active === i ? '110px' : '0px' }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontFamily: '"Courier New", monospace', fontSize: '9px',
                      color: ACCENTS[i % ACCENTS.length], letterSpacing: '0.14em',
                      textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden',
                    }}
                  >
                    {s.title.split(' ')[0]}
                  </motion.span>
                  <motion.div
                    animate={{
                      width: active === i ? '26px' : '5px',
                      background: active === i ? ACCENTS[i % ACCENTS.length] : 'rgba(255,255,255,0.18)',
                    }}
                    transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ height: '2px', borderRadius: '1px', flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>

            {/* Scroll cue */}
            <motion.div
              style={{
                position: 'absolute', bottom: '28px', left: 'clamp(28px, 5vw, 72px)',
                opacity: scrollIndicatorOpacity,
                display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20,
              }}
            >
              <motion.div
                animate={{ x: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
                style={{ width: '28px', height: '1px', background: 'rgba(255,255,255,0.18)' }}
              />
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '9px',
                letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
              }}>scroll</span>
            </motion.div>

          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
    </section>
  );
}