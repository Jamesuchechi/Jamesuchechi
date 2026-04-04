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

  return (
    <section 
      id="process" 
      ref={containerRef}
      className="bg-white text-black py-32 px-6 sm:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-32 flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-black/5 pb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter"
          >
            How I Build /
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono tracking-[0.2em] uppercase text-black/30"
          >
            (The Technical Workflow)
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 border-2 border-black/5 border-t-black rounded-full"
            />
          </div>
        ) : (
          <div className="relative">
            {/* Steps Vertical List */}
            <div className="space-y-40 md:space-y-64 relative z-10">
              {displayed.map((step, index) => (
                <ProcessStep 
                  key={step.id} 
                  step={step} 
                  index={index} 
                  total={displayed.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProcessStep({ step, index, total }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 1]));
  const y = useSpring(useTransform(scrollYProgress, [0, 0.5], [50, 0]));

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, y }}
      className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start"
    >
      {/* Step Metadata (Monospace) */}
      <div className="lg:col-span-3 pt-4">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-mono tracking-[0.3em] font-bold">
            STEP {String(step.stepNumber || index + 1).padStart(2, '0')}
          </span>
          {step.durationHint && (
            <span className="text-[10px] font-mono tracking-[0.2em] text-black/30 uppercase italic">
              — {step.durationHint}
            </span>
          )}
        </div>
      </div>

      {/* Step Content (Editorial) */}
      <div className="lg:col-span-9">
        <h3 
          className="text-5xl md:text-8xl font-black italic mb-10 leading-[0.9] tracking-tighter"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {step.title}
        </h3>
        
        <div className="flex flex-col md:flex-row gap-12 items-end">
          <p className="text-xl md:text-2xl text-black/70 leading-relaxed max-w-2xl font-medium">
            {step.description}
          </p>
          
          <div className="hidden md:flex flex-1 flex-col items-end gap-4">
            <div className="w-px h-24 bg-black/10 transition-all group-hover:h-32" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-black/20 uppercase vertical-lr">
              {index + 1 === total ? 'END_OF_PATH' : 'NEXT_STATION'}
            </span>
          </div>
        </div>

        {/* Dynamic Underline / Divider */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-px bg-black/5 mt-20"
        />
      </div>
    </motion.div>
  );
}
