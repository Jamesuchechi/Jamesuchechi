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

  useEffect(() => {
    fetch('/api/process')
      .then(r => r.json())
      .then(d => setSteps(Array.isArray(d) && d.length > 0 ? d : DEFAULT_STEPS))
      .catch(() => setSteps(DEFAULT_STEPS))
      .finally(() => setLoading(false));
  }, []);

  const displayed = steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section id="process" className="bg-white text-black relative z-10">
      {/* Introduction Header (Not Sticky) */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 border-b border-black/5">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col md:flex-row justify-between items-baseline gap-6"
        >
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter">
            How I Build /
          </h2>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-black/30">
            (The Technical Workflow)
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-40 bg-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 border-2 border-black/5 border-t-black rounded-full"
          />
        </div>
      ) : (
        /* Iterative Sticky Pages */
        <div className="relative">
          {displayed.map((step, index) => (
            <ProcessPage 
              key={step.id} 
              step={step} 
              index={index} 
              total={displayed.length}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ProcessPage({ step, index, total }) {
  const pageRef = useRef(null);
  
  // Each page handles its own scroll progress relative to its self
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });

  // rotateX from 0 to -110 as we scroll through the page's 150vh height
  const rotateX = useTransform(scrollYProgress, [0, 0.8], [0, -110]);
  const translateY = useTransform(scrollYProgress, [0, 0.8], [0, -100]);
  const translateZ = useTransform(scrollYProgress, [0, 0.8], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);
  const shadow = useTransform(scrollYProgress, [0, 0.8], [0, 0.4]);

  return (
    <div 
      ref={pageRef}
      className="relative h-[150vh] w-full"
      style={{ zIndex: total - index }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden [perspective:2000px] px-6">
        <motion.div 
          style={{
            rotateX,
            translateY,
            translateZ,
            opacity,
            transformOrigin: "top",
          }}
          className="w-full max-w-6xl bg-white border border-black/[0.03] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-3xl p-10 md:p-20 overflow-hidden [backface-visibility:hidden]"
        >
          {/* ── Page Front Side ── */}
          <div className="relative h-full flex flex-col justify-between">
            
            {/* Phase Header */}
            <div className="flex justify-between items-start mb-16 border-b border-black/5 pb-8">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-mono tracking-[0.3em] font-bold">
                  STEP {String(step.stepNumber || index + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-black/30 uppercase italic">
                  (Editorial // Process)
                </span>
              </div>
              <div className="text-[11px] font-mono tracking-widest text-black/40">
                {step.durationHint || `Phase 0${index + 1}`}
              </div>
            </div>

            {/* Main Content (Editorial) */}
            <div className="flex-1">
              <h3 
                className="text-5xl md:text-8xl font-black italic mb-10 leading-[0.9] tracking-tighter"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {step.title}
              </h3>
              
              <div className="flex flex-col md:flex-row gap-12 items-end">
                <p className="text-xl md:text-3xl text-black/80 leading-relaxed max-w-4xl font-medium tracking-tight">
                  {step.description}
                </p>
                
                <div className="hidden md:flex flex-1 flex-col items-end gap-6 mb-2">
                  <div className="w-px h-24 bg-black/10" />
                  <span className="text-[10px] font-mono tracking-[0.3em] text-black/20 uppercase vertical-lr py-4 font-bold">
                    {index + 1 === total ? 'END_OF_PATH' : 'NEXT_CHAPTER'}
                  </span>
                </div>
              </div>
            </div>

            {/* Folio Bottom (Book Style) */}
            <div className="mt-16 pt-8 border-t border-black/5 flex justify-between items-center font-mono text-[10px] tracking-[0.4em] text-black/20 uppercase">
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
            className="absolute inset-0 bg-white ring-1 ring-black/5 rounded-3xl -z-10 [transform:rotateX(180deg)]"
            style={{ backfaceVisibility: 'visible' }}
          >
            <div className="absolute inset-0 bg-[#e5e5e5] opacity-40" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
