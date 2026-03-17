'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const NAV_LINKS = [
  { name: 'Home',     href: '#home'     },
  { name: 'Services', href: '#services' },
  { name: 'Works',    href: '#works'    },
  { name: 'About',    href: '#about'    },
  { name: 'Contact',  href: '#contact'  },
];


export default function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [activeId,  setActiveId]  = useState('home');

  // Map of sectionId → current intersectionRatio
  const ratioMap = useRef({});

  // ── scroll shadow ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── body lock when mobile menu open ───────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── active section tracking ────────────────────────────────
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));

    function pickActive() {
      // Find section with highest ratio; tiebreak by closest top edge
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
          // tiebreak — pick whichever top edge is closer to viewport top
          const elTop  = el.getBoundingClientRect().top;
          const bstTop = document.getElementById(best)?.getBoundingClientRect().top ?? 0;
          if (Math.abs(elTop) < Math.abs(bstTop)) best = id;
        }
      });

      if (best) setActiveId(best);
    }

    // Observer 1 — general overlap
    const obs1 = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          ratioMap.current[e.target.id] = e.intersectionRatio;
        });
        pickActive();
      },
      { threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
    );

    // Observer 2 — top-edge trigger for tall sections
    const obs2 = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            // boost ratio so it wins over partially-visible sections
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

  // ── smooth scroll helper ───────────────────────────────────
  const scrollTo = (href) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── mobile menu animation variants ────────────────────────
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
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center text-white relative z-[60]">
              <span className="sr-only">James Uchechi</span>
              <img src="/next.svg" alt="JU logo" className="h-9 w-9" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                    className="relative text-sm uppercase tracking-wider transition-colors group"
                    style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.name}

                    {/* Active underline — animates in/out */}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-px bg-white rounded-full"
                      initial={false}
                      animate={{ width: isActive ? '100%' : '0%', opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                    />

                    {/* Hover underline (only when not active) */}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/40 transition-all group-hover:w-full rounded-full" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(v => !v)}
              className="md:hidden text-white text-2xl relative z-[60] p-2"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
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
            className="fixed inset-0 bg-black z-40 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full px-6">
              <nav className="flex flex-col items-center gap-8">
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
                      className="text-4xl md:text-5xl font-bold transition-colors relative group"
                      style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
                    >
                      <span className="relative">
                        {link.name}
                        <span
                          className="absolute -bottom-2 left-0 h-1 rounded-full bg-white transition-all"
                          style={{ width: isActive ? '100%' : '0%' }}
                        />
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="absolute bottom-12 left-0 right-0 px-6 text-center"
              >
                <p className="text-white/30 text-sm">
                  Available for opportunities worldwide
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}