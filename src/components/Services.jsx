'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Services — scroll-stacked cards
 *
 * Each service becomes a full card that peels off the stack as you scroll.
 * Built on Framer Motion's useScroll + useTransform — no extra deps since
 * framer-motion is already in package.json.
 *
 * Architecture:
 *  - A tall scroll track (N × 100vh) wraps a sticky viewport
 *  - Inside the sticky area, all cards are absolutely stacked
 *  - scrollYProgress 0→1 is divided into N equal segments
 *  - Per-card transforms are derived from the global progress value
 */

const CARD_COLORS = [
  { bg: '#0a0a0a', accent: '#ffffff', sub: 'rgba(255,255,255,0.45)' },
  { bg: '#0f1923', accent: '#7eb8f7', sub: 'rgba(126,184,247,0.5)'  },
  { bg: '#111827', accent: '#86efac', sub: 'rgba(134,239,172,0.5)'  },
  { bg: '#1a0f23', accent: '#c4b5fd', sub: 'rgba(196,181,253,0.5)'  },
  { bg: '#1a1200', accent: '#fcd34d', sub: 'rgba(252,211,77,0.5)'   },
  { bg: '#0f1a0f', accent: '#6ee7b7', sub: 'rgba(110,231,183,0.5)'  },
];

// Stagger offset so cards behind are visibly smaller/higher (depth stack illusion)
const STACK_SCALE_STEP  = 0.042;   // each card behind shrinks by this
const STACK_Y_STEP      = 14;       // px each card behind rises
const STACK_OPACITY_STEP = 0.18;   // each card behind fades slightly

function ServiceCard({ service, index, total, progress }) {
  const segSize  = 1 / total;
  const segStart = index * segSize;
  const segEnd   = segStart + segSize;

  // How far into this card's segment are we (0→1)
  const cardProgress = useTransform(progress,
    [segStart, segEnd],
    [0, 1],
    { clamp: true }
  );

  // Active card slides up and fades out as we leave it
  const exitY       = useTransform(cardProgress, [0.6, 1], [0,  -60]);
  const exitScale   = useTransform(cardProgress, [0.6, 1], [1, 0.88]);
  const exitOpacity = useTransform(cardProgress, [0.6, 1], [1,  0  ]);

  // Spring-smooth the exit
  const y       = useSpring(exitY,       { stiffness: 120, damping: 22 });
  const scale   = useSpring(exitScale,   { stiffness: 120, damping: 22 });
  const opacity = useSpring(exitOpacity, { stiffness: 120, damping: 22 });

  // Stack offset for cards that haven't been reached yet
  const stackDepth = total - 1 - index; // 0 for last card, N-1 for first
  const initialScale   = 1 - stackDepth * STACK_SCALE_STEP;
  const initialY       = -stackDepth * STACK_Y_STEP;
  const initialOpacity = 1 - stackDepth * STACK_OPACITY_STEP;

  // Before this card is active, it sits in the stack at its depth position
  // Once active it becomes scale(1) y(0) opacity(1)
  const entryProgress = useTransform(progress,
    [Math.max(0, segStart - segSize), segStart],
    [0, 1],
    { clamp: true }
  );
  const entryScale   = useTransform(entryProgress, [0,1], [initialScale, 1]);
  const entryY       = useTransform(entryProgress, [0,1], [initialY,     0]);
  const entryOpacity = useTransform(entryProgress, [0,1], [initialOpacity, 1]);

  const springEntryScale   = useSpring(entryScale,   { stiffness: 100, damping: 20 });
  const springEntryY       = useSpring(entryY,       { stiffness: 100, damping: 20 });
  const springEntryOpacity = useSpring(entryOpacity, { stiffness: 100, damping: 20 });

  // Moved hook from render to top-level
  const progressBarWidth = useTransform(cardProgress, [0, 1], ['0%', '100%']);

  const color = CARD_COLORS[index % CARD_COLORS.length];

  // Parse features safely
  let features = [];
  try {
    if (service.features) {
      features = Array.isArray(service.features)
        ? service.features
        : JSON.parse(service.features);
    }
  } catch (_) {}

  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: index + 1,
        scale: springEntryScale,
        y: springEntryY,
        opacity: springEntryOpacity,
      }}
    >
      {/* Exit wrapper — only applies when this card is being scrolled past */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          scale,
          y,
          opacity,
          originY: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: color.bg,
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(32px, 5vw, 56px)',
            border: '0.5px solid rgba(255,255,255,0.07)',
            position: 'relative',
          }}
        >
          {/* Subtle grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            borderRadius: '20px',
          }}/>

          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
            <span style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
              color: color.sub, textTransform: 'uppercase',
            }}>
              ({num})
            </span>
            <span style={{
              fontSize: '11px', letterSpacing: '0.08em',
              color: color.sub, textTransform: 'uppercase',
            }}>
              {num} / {String(total).padStart(2,'0')}
            </span>
          </div>

          {/* Main content */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
            <h3 style={{
              fontSize: 'clamp(28px, 4.5vw, 52px)',
              fontWeight: 500,
              color: color.accent,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}>
              {service.title}
            </h3>
            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '540px',
            }}>
              {service.description}
            </p>
          </div>

          {/* Features row */}
          {features.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              position: 'relative',
            }}>
              {features.slice(0, 4).map((f, i) => (
                <span key={i} style={{
                  fontSize: '12px',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  border: `0.5px solid ${color.accent}30`,
                  color: color.sub,
                  letterSpacing: '0.03em',
                }}>
                  {f}
                </span>
              ))}
              {features.length > 4 && (
                <span style={{
                  fontSize: '12px', padding: '5px 14px',
                  borderRadius: '20px',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  +{features.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div style={{
            marginTop: '24px', height: '2px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '1px', position: 'relative',
          }}>
            <motion.div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              borderRadius: '1px',
              background: color.accent,
              width: progressBarWidth,
            }}/>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgressDot({ i, total, progress }) {
  const segSize  = 1 / total;
  const segStart = i * segSize;
  const segEnd   = segStart + segSize;
  
  const bg = useTransform(
    progress,
    [segStart, segStart + 0.01, segEnd - 0.01, segEnd],
    ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.2)']
  );

  return (
    <motion.div
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: bg,
      }}
    />
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Moved scroll indicator opacity from render to top-level
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  // How tall the scroll track is — each card gets 100vh
  // +1 so the last card lingers a beat before exiting
  const trackHeight = services.length > 0
    ? `${(services.length + 0.8) * 100}vh`
    : '100vh';

  return (
    <section
      id="services"
      style={{ background: '#000000', position: 'relative' }}
    >
      {/* Section header — scrolls normally above the stack */}
      <div style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 0',
        maxWidth: '1200px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 style={{
            fontSize: 'clamp(40px, 7vw, 88px)',
            fontWeight: 500, color: '#ffffff',
            letterSpacing: '-0.03em', lineHeight: 1,
            marginBottom: '12px',
          }}>
            What I Do /
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', marginBottom: '0' }}>
            (Services)
          </p>
        </motion.div>
      </div>

      {/* Stacked cards scroll track */}
      <div
        ref={trackRef}
        style={{
          height: trackHeight,
          position: 'relative',
          marginTop: '40px',
        }}
      >
        {loading ? (
          <div style={{
            minHeight: '80vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: '#ffffff',
              animation: 'spin 0.8s linear infinite',
            }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : services.length === 0 ? (
          <div style={{
            minHeight: '50vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px' }}>
              No services yet. Add some from the admin dashboard!
            </p>
          </div>
        ) : (
          /* Sticky viewport that holds all stacked cards */
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 3vw, 40px)',
          }}>
            {/* Card stack container */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '860px',
              height: 'clamp(420px, 65vh, 580px)',
            }}>
              {services.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={i}
                  total={services.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* Scroll indicator — fades out once scrolled */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '50%',
                x: '-50%',
                opacity: scrollIndicatorOpacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.2)' }}
              />
            </motion.div>

            {/* Progress dots — right edge */}
            <div style={{
              position: 'absolute',
              right: 'clamp(16px, 3vw, 32px)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {services.map((_, i) => (
                <ProgressDot
                  key={i}
                  i={i}
                  total={services.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding so the next section doesn't immediately collide */}
      <div style={{ height: '60px', background: '#000000' }} />
    </section>
  );
}