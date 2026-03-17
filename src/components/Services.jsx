'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';


const CARD_COLORS = [
  { bg: '#0a0a0a',  accent: '#ffffff',  sub: 'rgba(255,255,255,0.4)',  tag: 'rgba(255,255,255,0.07)' },
  { bg: '#0d1f35',  accent: '#7eb8f7',  sub: 'rgba(126,184,247,0.45)', tag: 'rgba(126,184,247,0.08)' },
  { bg: '#0e2318',  accent: '#6ee7b7',  sub: 'rgba(110,231,183,0.45)', tag: 'rgba(110,231,183,0.08)' },
  { bg: '#1e0f2e',  accent: '#c4b5fd',  sub: 'rgba(196,181,253,0.45)', tag: 'rgba(196,181,253,0.08)' },
  { bg: '#201500',  accent: '#fcd34d',  sub: 'rgba(252,211,77,0.45)',  tag: 'rgba(252,211,77,0.08)'  },
  { bg: '#1a0010',  accent: '#f9a8d4',  sub: 'rgba(249,168,212,0.45)', tag: 'rgba(249,168,212,0.08)' },
];

const STACK_SCALE_STEP   = 0.038;
const STACK_Y_STEP       = 16;
const STACK_OPACITY_STEP = 0.15;

/* ─── Single stacked card ─────────────────────────────────────────────────── */
function StackCard({ service, index, total, progress, railMode }) {
  const seg      = 1 / total;
  const segStart = index * seg;
  const segEnd   = segStart + seg;

  const cardProgress = useTransform(progress, [segStart, segEnd], [0, 1], { clamp: true });

  const exitY       = useTransform(cardProgress, [0.55, 1], [0,  -80]);
  const exitScale   = useTransform(cardProgress, [0.55, 1], [1, 0.86]);
  const exitOpacity = useTransform(cardProgress, [0.55, 1], [1,  0  ]);

  const y       = useSpring(exitY,       { stiffness: 130, damping: 24 });
  const scale   = useSpring(exitScale,   { stiffness: 130, damping: 24 });
  const opacity = useSpring(exitOpacity, { stiffness: 130, damping: 24 });

  const stackDepth      = total - 1 - index;
  const initialScale    = 1 - stackDepth * STACK_SCALE_STEP;
  const initialY        = -stackDepth * STACK_Y_STEP;
  const initialOpacity  = 1 - stackDepth * STACK_OPACITY_STEP;

  const entryProgress = useTransform(
    progress,
    [Math.max(0, segStart - seg), segStart],
    [0, 1],
    { clamp: true }
  );
  const entryScale   = useTransform(entryProgress, [0,1], [initialScale, 1]);
  const entryY       = useTransform(entryProgress, [0,1], [initialY,     0]);
  const entryOpacity = useTransform(entryProgress, [0,1], [initialOpacity, 1]);

  const sEntryScale   = useSpring(entryScale,   { stiffness: 110, damping: 22 });
  const sEntryY       = useSpring(entryY,       { stiffness: 110, damping: 22 });
  const sEntryOpacity = useSpring(entryOpacity, { stiffness: 110, damping: 22 });

  const progressBarWidth = useTransform(cardProgress, [0, 1], ['0%', '100%']);

  const color = CARD_COLORS[index % CARD_COLORS.length];

  let features = [];
  try { features = service.features ? (Array.isArray(service.features) ? service.features : JSON.parse(service.features)) : []; } catch (_) {}

  const num = String(index + 1).padStart(2, '0');

  if (railMode) return null; // rail renders its own cards

  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        zIndex: index + 1,
        scale: sEntryScale,
        y: sEntryY,
        opacity: sEntryOpacity,
        originY: '50%',
      }}
    >
      <motion.div style={{ width: '100%', height: '100%', scale, y, opacity, originY: '10%' }}>
        <CardFace color={color} service={service} num={num} total={total} features={features} progressBarWidth={progressBarWidth} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Shared card face (used in both phases) ─────────────────────────────── */
function CardFace({ color, service, num, total, features, progressBarWidth, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%', height: '100%',
        background: color.bg,
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(28px, 4vw, 52px)',
        border: isActive
          ? `1px solid ${color.accent}55`
          : '0.5px solid rgba(255,255,255,0.06)',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box',
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        borderRadius: '18px',
      }}/>

      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        top: '-60px', right: '-60px',
        width: '280px', height: '280px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', color: color.sub, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          ({num})
        </span>
        {total && (
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: color.sub, textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {num} / {String(total).padStart(2,'0')}
          </span>
        )}
      </div>

      {/* Title + description */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 0 16px' }}>
        <h3 style={{
          fontSize: 'clamp(26px, 3.8vw, 56px)',
          fontWeight: 600,
          color: color.accent,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          marginBottom: '18px',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        }}>
          {service.title}
        </h3>
        <p style={{
          fontSize: 'clamp(13px, 1.5vw, 16px)',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.5)',
          maxWidth: '520px',
        }}>
          {service.description}
        </p>
      </div>

      {/* Feature tags */}
      {features.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', position: 'relative', marginBottom: '20px' }}>
          {features.slice(0, 5).map((f, i) => (
            <span key={i} style={{
              fontSize: '11px',
              padding: '4px 13px',
              borderRadius: '20px',
              border: `0.5px solid ${color.accent}35`,
              color: color.sub,
              letterSpacing: '0.04em',
              background: color.tag,
            }}>
              {f}
            </span>
          ))}
          {features.length > 5 && (
            <span style={{
              fontSize: '11px', padding: '4px 13px', borderRadius: '20px',
              border: '0.5px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.25)',
            }}>+{features.length - 5}</span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: '1.5px', background: 'rgba(255,255,255,0.07)', borderRadius: '1px', position: 'relative' }}>
        {progressBarWidth ? (
          <motion.div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            borderRadius: '1px', background: color.accent,
            width: progressBarWidth,
          }}/>
        ) : (
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', borderRadius: '1px', background: color.accent }}/>
        )}
      </div>
    </div>
  );
}

/* ─── Horizontal Rail ────────────────────────────────────────────────────── */
function HorizontalRail({ services, onBack }) {
  const railRef  = useRef(null);
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scrollTo = (i) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[i];
    if (!card) return;
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    setActive(i);
  };

  // Wheel → horizontal
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal
      e.preventDefault();
      rail.scrollLeft += e.deltaY * 1.2;
    };
    rail.addEventListener('wheel', onWheel, { passive: false });
    return () => rail.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.pageX - railRef.current.offsetLeft;
    scrollLeft.current = railRef.current.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - railRef.current.offsetLeft;
    railRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.4;
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}
    >
      {/* Back pill */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: '24px', left: 'clamp(20px,4vw,60px)',
          background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.14)',
          color: 'rgba(255,255,255,0.6)', fontSize: '12px', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer',
          backdropFilter: 'blur(10px)',
        }}
      >
        ← Stack view
      </button>

      {/* Label */}
      <div style={{ padding: '0 clamp(20px,4vw,60px)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          Drag or scroll →
        </span>
        <span style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
          {String(active + 1).padStart(2,'0')} / {String(services.length).padStart(2,'0')}
        </span>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          padding: '0 clamp(20px,4vw,60px)',
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
        }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {services.map((service, i) => {
          const color = CARD_COLORS[i % CARD_COLORS.length];
          let features = [];
          try { features = service.features ? (Array.isArray(service.features) ? service.features : JSON.parse(service.features)) : []; } catch(_) {}
          const num = String(i + 1).padStart(2, '0');
          return (
            <motion.div
              key={service.id}
              onClick={() => scrollTo(i)}
              whileHover={{ scale: active === i ? 1 : 1.01 }}
              style={{
                flexShrink: 0,
                width: 'clamp(320px, 46vw, 620px)',
                height: 'clamp(380px, 55vh, 540px)',
                scrollSnapAlign: 'center',
                opacity: active === i ? 1 : 0.55,
                transition: 'opacity 0.4s',
              }}
            >
              <CardFace
                color={color}
                service={service}
                num={num}
                total={null}
                features={features}
                progressBarWidth={null}
                isActive={active === i}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Dot nav */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '28px' }}>
        {services.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: active === i ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: active === i ? '#ffffff' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Progress dot for stack phase ──────────────────────────────────────── */
function ProgressDot({ i, total, progress }) {
  const seg = 1 / total;
  const bg  = useTransform(
    progress,
    [i * seg, i * seg + 0.01, (i+1) * seg - 0.01, (i+1) * seg],
    ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.95)', 'rgba(255,255,255,0.18)']
  );
  return <motion.div style={{ width: '5px', height: '5px', borderRadius: '50%', background: bg }} />;
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function Services() {
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [railMode,  setRailMode]  = useState(false);

  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Switch to rail when stack phase is fully scrolled
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v >= 0.98 && !railMode) setRailMode(true);
    });
    return unsub;
  }, [scrollYProgress, railMode]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // Stack phase: 60vh per card (tighter than before), + 0.5 linger
  const trackHeight = services.length > 0
    ? `${(services.length * 60 + 50)}vh`
    : '100vh';

  const handleBack = () => {
    setRailMode(false);
    // Scroll back to top of this section
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" style={{ background: '#000000', position: 'relative' }}>

      {/* Section header */}
      <div style={{
        padding: 'clamp(60px, 7vw, 100px) clamp(24px, 5vw, 72px) 0',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
        >
          <h2 style={{
            fontSize: 'clamp(44px, 7.5vw, 96px)',
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '-0.035em',
            lineHeight: 0.95,
            marginBottom: '14px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          }}>
            What I Do /
          </h2>
          <p style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            (Services)
          </p>
        </motion.div>
      </div>

      {/* ── Rail mode overlay ── */}
      <AnimatePresence>
        {railMode && (
          <motion.div
            key="rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <HorizontalRail services={services} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stack scroll track ── */}
      <div
        ref={trackRef}
        style={{ height: trackHeight, position: 'relative', marginTop: '36px' }}
      >
        {loading ? (
          <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.08)',
              borderTopColor: '#fff',
              animation: 'spin 0.8s linear infinite',
            }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : services.length === 0 ? (
          <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px' }}>No services yet.</p>
          </div>
        ) : (
          <div style={{
            position: 'sticky', top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(14px, 2.5vw, 36px)',
          }}>
            {/* Card stack */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '920px',
              /* Taller cards */
              height: 'clamp(460px, 70vh, 640px)',
            }}>
              {services.map((service, i) => (
                <StackCard
                  key={service.id}
                  service={service}
                  index={i}
                  total={services.length}
                  progress={scrollYProgress}
                  railMode={railMode}
                />
              ))}
            </div>

            {/* "Browse all" hint that appears near the end */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '36px',
                left: '50%',
                x: '-50%',
                opacity: useTransform(scrollYProgress, [0.8, 0.95], [0, 1]),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                Keep scrolling → browse all
              </span>
            </motion.div>

            {/* Scroll arrow — early */}
            <motion.div
              style={{
                position: 'absolute', bottom: '28px', left: '50%',
                x: '-50%', opacity: scrollIndicatorOpacity,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>scroll</span>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                style={{ width: '1px', height: '26px', background: 'rgba(255,255,255,0.18)' }}
              />
            </motion.div>

            {/* Progress dots — right edge */}
            <div style={{
              position: 'absolute', right: 'clamp(14px, 2.5vw, 28px)', top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {services.map((_, i) => (
                <ProgressDot key={i} i={i} total={services.length} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tight bottom buffer — no more giant empty space */}
      <div style={{ height: '32px', background: '#000000' }} />
    </section>
  );
}