'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
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

        {/* 2. How I Build → flip fold */}
        <SectionTransition id="process-section" transition="flipFold" bgHex="#ffffff" className="bg-white">
          <Process />
        </SectionTransition>

        {/* 3. Open Source → split open */}
        <SectionTransition id="github-section" transition="splitOpen" bgHex="#0a0a0f">
          <GitHub />
        </SectionTransition>

        {/* 4. Works Preview → split open */}
        <SectionTransition id="works-preview" transition="splitOpen" bgHex="#ffffff" className="min-h-screen py-24">
          <div className="max-w-7xl mx-auto px-6">
            <Projects limit={3} />
            <div className="mt-12 text-center">
              <Link href="/works" className="inline-flex items-center gap-6 bg-black text-white px-14 py-6 rounded-full font-mono text-sm uppercase tracking-[0.2em] font-black hover:scale-105 transition-transform shadow-xl shadow-black/10">
                View All Case Studies
              </Link>
            </div>
          </div>
        </SectionTransition>

        {/* 5. Insights Preview → page peel */}
        <SectionTransition id="blog-preview" transition="pagePeel" bgHex="#080808" className="min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full py-24">
             <div className="flex flex-col md:flex-row justify-between items-end gap-12">
               <div className="max-w-2xl">
                 <p className="text-[10px] font-mono tracking-[0.4em] text-[#FF3B00] uppercase mb-8">Case Notes & Insights</p>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                   Latest <br /> Insights /
                 </h2>
                 <Link href="/blog" className="group inline-flex items-center gap-6 text-white/40 hover:text-white transition-all">
                    <span className="text-xl md:text-3xl font-medium italic" style={{ fontFamily: 'Georgia, serif' }}>Dive into the knowledge base</span>
                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      ❯
                    </div>
                  </Link>
               </div>
               <div className="hidden lg:block w-1/3 aspect-square bg-white/5 rounded-[60px] border border-white/10 animate-pulse" />
             </div>
          </div>
        </SectionTransition>

        {/* 6. Quick Links Hub → pixel dissolve */}
        <SectionTransition id="hub" transition="pixelDissolve" bgHex="#000000" className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Services', href: '/services', desc: 'How I can help your project thrive' },
                { title: 'Achievements', href: '/achievements', desc: 'Proof of professional excellence' },
                { title: 'FAQs', href: '/faq', desc: 'Common questions & friction removal' },
              ].map((item, i) => (
                <Link key={i} href={item.href} className="p-12 rounded-[40px] bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                  <h3 className="text-3xl font-black italic uppercase mb-4 group-hover:text-[#FF3B00] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                  <p className="text-white/40 italic font-medium" style={{ fontFamily: 'Georgia, serif' }}>{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </SectionTransition>

        {/* 7. Contact + Footer */}
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