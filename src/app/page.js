'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar          from '@/components/Navbar';
import Hero            from '@/components/Hero';
import Services        from '@/components/Services';
import Projects        from '@/components/Projects';
import Process         from '@/components/Process';
import Skills          from '@/components/Skills';
import About           from '@/components/About';
import Testimonials    from '@/components/Testimonials';
import GitHub          from '@/components/GitHub';
import Contact         from '@/components/Contact';
import Footer          from '@/components/Footer';
import SectionTransition from '@/components/SectionTransition';
import JamesOS         from '@/components/JamesOS';

export default function Home() {
  const [osMode,        setOsMode]        = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const triggerTransition = useCallback((entering) => {
    if (transitioning) return;
    setTransitioning(true);

    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', zIndex: '8999', pointerEvents: 'none', display: 'block',
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const cols = 36, rows = 24;
    const cw = Math.ceil(canvas.width / cols);
    const ch = Math.ceil(canvas.height / rows);
    const cells = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells.push({ x: c * cw, y: r * ch, delay: Math.random() });

    const DURATION = 750;
    const bg = entering ? '#000000' : '#07090c';
    let start = null, flipped = false;

    function frame(now) {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cells.forEach(cell => {
        const ct = Math.max(0, Math.min(1, (t - cell.delay * 0.55) / 0.45));
        if (ct < 1) {
          ctx.globalAlpha = entering ? ct : 1 - ct;
          ctx.fillStyle   = bg;
          ctx.fillRect(cell.x, cell.y, cw + 1, ch + 1);
        }
      });
      ctx.globalAlpha = 1;
      if (!flipped && t >= 0.5) { flipped = true; setOsMode(entering); }
      if (t < 1) requestAnimationFrame(frame);
      else { canvas.remove(); setTransitioning(false); }
    }
    requestAnimationFrame(frame);
  }, [transitioning]);

  const enterOS = useCallback(() => triggerTransition(true),  [triggerTransition]);
  const exitOS  = useCallback(() => triggerTransition(false), [triggerTransition]);

  return (
    <>
      <main className="relative">
        <Navbar onEnterOS={enterOS} />

        {/* 1. Hero → window shade */}
        <SectionTransition id="home" transition="windowShade" bgHex="#07090c" className="min-h-screen">
          <Hero />
        </SectionTransition>

        {/* 2. Services → flip fold
            ⚠️  NO min-h-screen here — Services controls its own height via the
            internal scroll track ((services.length + 1) * 100vh).
            Adding min-h-screen was clamping the wrapper to 100vh and breaking
            the scroll-driven panel switching. */}
        <SectionTransition id="services" transition="flipFold" bgHex="#000000">
          <Services />
        </SectionTransition>

        {/* 3. Projects → split open */}
        <SectionTransition id="works" transition="splitOpen" bgHex="#ffffff" className="min-h-screen">
          <Projects />
        </SectionTransition>

        {/* 4. Process → page peel */}
        <SectionTransition id="process" transition="pagePeel" bgHex="#ffffff" className="min-h-screen">
          <Process />
        </SectionTransition>

        {/* 5. Skills → pixel dissolve */}
        <SectionTransition id="skills-section" transition="pixelDissolve" bgHex="#000000" className="overflow-hidden">
          <Skills />
        </SectionTransition>

        {/* 6. About → window shade */}
        <SectionTransition id="about" transition="windowShade" bgHex="#ffffff" className="min-h-screen">
          <About />
        </SectionTransition>

        {/* 7. Testimonials → flip fold */}
        <SectionTransition id="testimonials" transition="flipFold" bgHex="#ffffff" className="overflow-hidden">
          <Testimonials />
        </SectionTransition>

        {/* 8. GitHub — no transition needed */}
        <section id="github">
          <GitHub />
        </section>

        {/* 9. Contact + Footer */}
        <section id="contact">
          <Contact />
          <Footer />
        </section>
      </main>

      <AnimatePresence>
        {osMode && <JamesOS key="jamesOS" onExit={exitOS} />}
      </AnimatePresence>
    </>
  );
}