'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Process — How I Work
 * ─────────────────────────────────────────────────────────────
 * Desktop: horizontal stepper with connecting line
 * Mobile:  vertical accordion, one step open at a time
 *
 * Seeded with sensible defaults if DB is empty so the section
 * never looks broken on first deploy.
 */

const DEFAULT_STEPS = [
  {
    id: 'd1', stepNumber: 1, order: 0,
    title: 'Discover',
    description: 'Deep dive into your goals, constraints, and users. I ask the uncomfortable questions early so surprises don\'t surface later.',
    icon: 'search',
    durationHint: '1–2 days',
  },
  {
    id: 'd2', stepNumber: 2, order: 1,
    title: 'Design',
    description: 'Architecture decisions, data models, and interface sketches before any code. Cheap to change at this stage, expensive after.',
    icon: 'pen',
    durationHint: '2–3 days',
  },
  {
    id: 'd3', stepNumber: 3, order: 2,
    title: 'Build',
    description: 'Iterative delivery with working software at every checkpoint. Full-stack — API, database, UI — shipped as one coherent product.',
    icon: 'code',
    durationHint: '1–4 weeks',
  },
  {
    id: 'd4', stepNumber: 4, order: 3,
    title: 'Deploy',
    description: 'CI/CD pipelines, monitoring, and documentation handed off cleanly. I stick around for the first week post-launch.',
    icon: 'rocket',
    durationHint: '1–2 days',
  },
];

function StepIcon({ name }) {
  const icons = {
    search: <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" strokeWidth="1.5" strokeLinecap="round"/>,
    pen:    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    code:   <><polyline points="16 18 22 12 16 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    default:<circle cx="12" cy="12" r="10" strokeWidth="1.5"/>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {icons[name] || icons.default}
    </svg>
  );
}

export default function Process() {
  const [steps,       setSteps]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeStep,  setActiveStep]  = useState(0);

  useEffect(() => {
    fetch('/api/process')
      .then(r => r.json())
      .then(d => setSteps(Array.isArray(d) && d.length > 0 ? d : DEFAULT_STEPS))
      .catch(() => setSteps(DEFAULT_STEPS))
      .finally(() => setLoading(false));
  }, []);

  const displayed = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section id="process" className="bg-white text-black py-20 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">How I work /</h2>
          <p className="text-xl text-black/50">(Process)</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
          </div>
        ) : (
          <>
            {/* ── Desktop: horizontal stepper ── */}
            <div className="hidden md:block">
              {/* Connector line */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  left: `${(0.5 / displayed.length) * 100}%`,
                  right: `${(0.5 / displayed.length) * 100}%`,
                  height: '1px',
                  background: 'rgba(0,0,0,0.1)',
                }} />
                {/* Active fill */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: `${(0.5 / displayed.length) * 100}%`,
                    height: '1px',
                    background: '#000',
                    transformOrigin: 'left',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(activeStep / Math.max(displayed.length - 1, 1)) * (100 - (1 / displayed.length) * 200)}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* Step nodes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${displayed.length}, 1fr)`,
                  position: 'relative',
                }}>
                  {displayed.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(i)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: '12px', background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0 8px',
                      }}
                    >
                      <motion.div
                        animate={{
                          background: i <= activeStep ? '#000' : '#fff',
                          borderColor: i <= activeStep ? '#000' : 'rgba(0,0,0,0.15)',
                        }}
                        transition={{ duration: 0.25 }}
                        style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          border: '1.5px solid',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          color: i <= activeStep ? '#fff' : 'rgba(0,0,0,0.4)',
                        }}
                      >
                        <StepIcon name={step.icon || 'default'} />
                      </motion.div>

                      <span style={{
                        fontSize: '11px', fontWeight: 500,
                        letterSpacing: '.08em', textTransform: 'uppercase',
                        color: i <= activeStep ? '#000' : 'rgba(0,0,0,0.35)',
                        transition: 'color 0.25s',
                      }}>
                        {step.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active step detail */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '60px',
                  paddingTop: '24px',
                  borderTop: '0.5px solid rgba(0,0,0,0.08)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', letterSpacing: '.1em', color: 'rgba(0,0,0,0.3)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Step {displayed[activeStep]?.stepNumber ?? activeStep + 1}
                  </div>
                  <h3 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 500, lineHeight: 1.1, marginBottom: '16px' }}>
                    {displayed[activeStep]?.title}
                  </h3>
                  {displayed[activeStep]?.durationHint && (
                    <span style={{
                      display: 'inline-block',
                      fontSize: '12px', padding: '4px 12px',
                      borderRadius: '20px', border: '0.5px solid rgba(0,0,0,0.12)',
                      color: 'rgba(0,0,0,0.5)',
                    }}>
                      {displayed[activeStep].durationHint}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <p style={{ fontSize: '16px', lineHeight: 1.75, color: 'rgba(0,0,0,0.65)' }}>
                    {displayed[activeStep]?.description}
                  </p>
                </div>
              </motion.div>

              {/* Step navigation dots */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
                {displayed.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      width: i === activeStep ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === activeStep ? '#000' : 'rgba(0,0,0,0.15)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ── Mobile: vertical accordion ── */}
            <div className="md:hidden space-y-3">
              {displayed.map((step, i) => {
                const isOpen = activeStep === i;
                return (
                  <div
                    key={step.id}
                    style={{
                      border: `0.5px solid ${isOpen ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <button
                      onClick={() => setActiveStep(isOpen ? -1 : i)}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '16px 20px',
                        background: isOpen ? '#000' : '#fff',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '14px',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: isOpen ? '#fff' : 'rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        color: isOpen ? '#000' : 'rgba(0,0,0,0.5)',
                      }}>
                        <StepIcon name={step.icon || 'default'} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: isOpen ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)', letterSpacing: '.08em', marginBottom: '2px' }}>
                          Step {step.stepNumber ?? i + 1}
                          {step.durationHint && ` · ${step.durationHint}`}
                        </div>
                        <div style={{ fontWeight: 500, fontSize: '16px', color: isOpen ? '#fff' : '#000' }}>
                          {step.title}
                        </div>
                      </div>
                      <div style={{ color: isOpen ? '#fff' : 'rgba(0,0,0,0.3)', fontSize: '18px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        ↓
                      </div>
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ padding: '16px 20px 20px', background: '#fafafa' }}
                      >
                        <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(0,0,0,0.65)' }}>
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
