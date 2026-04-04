'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const DEFAULT_STEPS = [
  {
    id: 'd1', stepNumber: 1, order: 0,
    title: 'Discovery & Strategy',
    description: 'We start by defining the "why." I dive deep into your business goals, user needs, and technical constraints to build a bulletproof roadmap.',
    durationHint: 'Phase 01',
  },
  {
    id: 'd2', stepNumber: 2, order: 1,
    title: 'Architecture & Design',
    description: 'Blueprints before bricks. I craft the information architecture and high-fidelity interface designs that prioritize both form and function.',
    durationHint: 'Phase 02',
  },
  {
    id: 'd3', stepNumber: 3, order: 2,
    title: 'Development & Iteration',
    description: 'Translating designs into clean, scalable code. I build in iterative sprints, ensuring you have a working product at every milestone.',
    durationHint: 'Phase 03',
  },
  {
    id: 'd4', stepNumber: 4, order: 3,
    title: 'Deployment & Growth',
    description: 'Launching into the wild with full CI/CD pipelines and performance monitoring. I ensure your product is ready to scale from day one.',
    durationHint: 'Phase 04',
  },
];

export default function Process() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/api/process')
      .then(r => r.json())
      .then(d => setSteps(Array.isArray(d) && d.length > 0 ? d : DEFAULT_STEPS))
      .catch(() => setSteps(DEFAULT_STEPS))
      .finally(() => setLoading(false));
  }, []);

  const displayed = steps.length > 0 ? steps : DEFAULT_STEPS;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section 
      id="process" 
      ref={containerRef}
      className="bg-white text-black relative z-10"
      style={{ height: `${displayed.length * 150}vh` }}
    >
      {/* Sticky Perspective Wrapper */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden [perspective:1500px]">
        {/* Section Title (Stationary Header) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-baseline gap-4 z-50 pointer-events-none opacity-20">
          <h2 className="text-[10px] font-mono tracking-[0.4em] uppercase">How I Build // Process</h2>
          <div className="w-12 h-px bg-black/10" />
        </div>

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 border-2 border-black/5 border-t-black rounded-full z-10"
          />
        ) : (
          <div className="relative w-full max-w-7xl mx-auto h-full px-6 flex items-center justify-center">
            {displayed.map((step, index) => {
              const start = index / displayed.length;
              const end = (index + 1) / displayed.length;
              return (
                <ProcessPage 
                  key={step.id} 
                  step={step} 
                  index={index} 
                  total={displayed.length}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ProcessPage({ step, index, total, progress, range }) {
  // Mapping rotateX from 0 to -110 as we scroll through the step's range
  const rotateX = useTransform(progress, range, [0, -110]);
  const translateY = useTransform(progress, range, [0, -100]);
  const translateZ = useTransform(progress, range, [0, -100]);
  const opacity = useTransform(progress, [range[0], range[1] - 0.05, range[1]], [1, 1, 0]);

  // Back of page shadow
  const shadow = useTransform(progress, range, [0, 0.4]);

  return (
    <motion.div 
      style={{
        zIndex: total - index,
        rotateX,
        translateY,
        translateZ,
        opacity,
        transformOrigin: "top",
        position: index === 0 ? 'relative' : 'absolute',
      }}
      className="w-full max-w-5xl bg-white border border-black/[0.03] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] rounded-2xl p-12 md:p-24 overflow-hidden [backface-visibility:hidden]"
    >
      {/* ── Page Front Side ── */}
      <div className="relative h-full flex flex-col justify-between">
        
        {/* Phase Header */}
        <div className="flex justify-between items-start mb-20 border-b border-black/5 pb-10">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-mono tracking-[0.3em] font-bold">
              FOLDER {String(step.stepNumber || index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-black/30 uppercase italic">
              (Editorial // Process)
            </span>
          </div>
          <div className="text-[11px] font-mono tracking-widest text-black/40">
            PHASE {step.durationHint || '01'}
          </div>
        </div>

        {/* Main Content (Editorial) */}
        <div className="flex-1">
          <h3 
            className="text-6xl md:text-9xl font-black italic mb-12 leading-[0.9] tracking-tighter"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {step.title}
          </h3>
          
          <div className="flex flex-col md:flex-row gap-16 items-end">
            <p className="text-2xl md:text-3xl text-black/80 leading-relaxed max-w-3xl font-medium tracking-tight">
              {step.description}
            </p>
            
            <div className="hidden md:flex flex-1 flex-col items-end gap-6 mb-2">
              <div className="w-px h-32 bg-black/10" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-black/20 uppercase vertical-lr py-4 font-bold">
                {index + 1 === total ? 'FINAL_STATION' : 'NEXT_CHAPTER'}
              </span>
            </div>
          </div>
        </div>

        {/* Folio Bottom (Book Style) */}
        <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-center font-mono text-[10px] tracking-[0.4em] text-black/20 uppercase">
          <span>{step.title}</span>
          <span className="font-bold text-black/40">Folio {index + 1} // {total}</span>
        </div>
      </div>

      {/* ── Page Back Side (Simulated Paper) ── */}
      <motion.div 
        style={{ opacity: shadow }}
        className="absolute inset-0 bg-[#f9f9f9] pointer-events-none mix-blend-multiply"
      />
      <div 
        className="absolute inset-0 bg-white ring-1 ring-black/5 rounded-2xl -z-10 [transform:rotateX(180deg)]"
        style={{ backfaceVisibility: 'visible' }}
      >
        {/* Subtle Paper Texture/Color for the "back" of the page */}
        <div className="absolute inset-0 bg-[#f3f3f3] opacity-60" />
      </div>
    </motion.div>
  );
}
