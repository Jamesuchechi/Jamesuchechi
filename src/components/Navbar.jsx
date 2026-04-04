'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const NAV_LINKS = [
  { name: 'Home',         href: '#home'         },
  { name: 'Services',     href: '#services'     },
  { name: 'Works',        href: '#works'        },
  { name: 'Process',      href: '#process'      },
  { name: 'About',        href: '#about'        },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'GitHub',       href: '#github'       },
  { name: 'Contact',      href: '#contact'      },
];

export default function Navbar({ onEnterOS }) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeId,  setActiveId]  = useState('home');

  const ratioMap = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));

    function pickActive() {
      let best = null;
      let bestRatio = -1;

      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const ratio = ratioMap.current[id] ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        } else if (ratio === bestRatio && best) {
          const elTop  = el.getBoundingClientRect().top;
          const bstTop = document.getElementById(best)?.getBoundingClientRect().top ?? 0;
          if (Math.abs(elTop) < Math.abs(bstTop)) best = id;
        }
      });

      if (best) setActiveId(best);
    }

    const obs1 = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          ratioMap.current[e.target.id] = e.intersectionRatio;
        });
        pickActive();
      },
      { threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
    );

    const obs2 = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            ratioMap.current[e.target.id] = Math.max(
              ratioMap.current[e.target.id] ?? 0,
              0.5
            );
          }
        });
        pickActive();
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { obs1.observe(el); obs2.observe(el); }
    });

    return () => { obs1.disconnect(); obs2.disconnect(); };
  }, []);

  const scrollTo = (href) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const menuVariants = {
    closed: { opacity: 0, x: '100%', transition: { duration: 0.45, ease: [0.76,0,0.24,1] } },
    open:   { opacity: 1, x: 0,      transition: { duration: 0.45, ease: [0.76,0,0.24,1] } },
  };
  const linkVariants = {
    closed: { opacity: 0, x: 24 },
    open: i => ({
      opacity: 1, x: 0,
      transition: { delay: 0.08 + i * 0.08, duration: 0.45, ease: [0.76,0,0.24,1] },
    }),
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full z-[100] transition-all duration-500 ${
          scrolled ? 'bg-black/40 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center text-white relative z-[60] group">
              <span className="sr-only">James Uchechi</span>
              <div className="relative h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl overflow-hidden border border-white/10 group-hover:bg-white group-hover:border-white transition-all">
                <img src="/next.svg" alt="JU logo" className="h-6 w-6 invert group-hover:invert-0 transition-all" />
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map(link => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                    className="relative text-[10px] uppercase font-mono tracking-[0.3em] transition-colors group font-bold"
                    style={{ 
                      color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                      fontFamily: '"Courier New", monospace' 
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}

                    <motion.span
                      className="absolute -bottom-2 left-0 h-[2px] bg-[#FF3B00] rounded-full"
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0%', opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />

                    {!isActive && (
                      <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white/20 transition-all group-hover:w-full rounded-full" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right side — JamesOS button + mobile toggle */}
            <div className="flex items-center gap-4">

              {/* JamesOS toggle — desktop only */}
              {onEnterOS && (
                <button
                  onClick={onEnterOS}
                  className="hidden lg:flex items-center gap-3 relative z-[60] px-6 py-2.5 rounded-full border border-[#FF3B00]/20 bg-[#FF3B00]/5 text-[10px] font-mono font-bold tracking-[0.3em] text-[#FF3B00] hover:bg-[#FF3B00] hover:text-black transition-all group uppercase"
                  style={{ fontFamily: '"Courier New", monospace' }}
                >
                  <span className="text-[14px] group-hover:rotate-[360deg] transition-transform duration-700">⊞</span>
                  Ecosystem
                </button>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setIsOpen(v => !v)}
                className="md:hidden text-white text-3xl relative z-[60] p-2 hover:scale-110 transition-transform"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <FiX /> : <FiMenu />}
              </button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-[#080808] z-40 md:hidden overflow-hidden"
          >
            {/* Background Text Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
              <h2 className="text-[40vw] font-black uppercase tracking-tighter -rotate-12">INDEX</h2>
            </div>

            <div className="flex flex-col items-start justify-center h-full px-12 relative z-10">
              <nav className="flex flex-col items-start gap-6">
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeId === link.href.slice(1);
                  return (
                    <motion.a
                      key={link.name}
                      custom={i}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      href={link.href}
                      onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                      className="text-5xl sm:text-7xl font-black uppercase tracking-tighter transition-all duration-500 relative group"
                      style={{ 
                        color: isActive ? '#FF3B00' : '#FFFFFF',
                        fontFamily: 'Georgia, serif',
                        fontStyle: 'italic'
                      }}
                    >
                      <span className="relative">
                        {link.name}
                        {isActive && (
                          <motion.span 
                            layoutId="mobileNavActive"
                            className="absolute -left-8 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF3B00]"
                          />
                        )}
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              {/* JamesOS button — mobile menu */}
              {onEnterOS && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => { setIsOpen(false); onEnterOS(); }}
                  className="mt-16 px-8 py-4 rounded-full border border-[#FF3B00]/30 bg-[#FF3B00]/10 text-[#FF3B00] text-[10px] font-mono font-bold tracking-[0.3em] uppercase italic"
                  style={{ fontFamily: '"Courier New", monospace' }}
                >
                  ⊞ Access Ecosystem
                </motion.button>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 left-12 right-12 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-white/20" />
                  <p className="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase">James Uchechi // Record_2026</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}