'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const CORE_LINKS = [
  { name: 'Works',        href: '/works'     },
  { name: 'How I Build', href: '/process'   },
  { name: 'Services',     href: '/services'  },
  { name: 'About',        href: '/about'     },
];

const EXTENDED_LINKS = [
  { name: 'Experience',   href: '/experience'   },
  { name: 'Education',    href: '/education'    },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Open Source',  href: '/github'       },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Blog',         href: '/blog'         },
  { name: 'FAQ',          href: '/faq'          },
  { name: 'Contact',      href: '/contact'      },
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

  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
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
          scrolled 
            ? 'bg-[#080808]/95 backdrop-blur-2xl py-5 border-b border-white/10 shadow-2xl' 
            : 'bg-gradient-to-b from-black/80 to-transparent py-8'
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

            {/* Desktop 2-Line Nav */}
            <div className="hidden md:flex flex-col items-center gap-3">
              {/* Line 1: Core Nav */}
              <div className="flex items-center gap-8">
                {CORE_LINKS.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="relative text-[16px] uppercase font-mono tracking-[0.4em] transition-all group font-black"
                      style={{ 
                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                        fontFamily: '"Courier New", monospace' 
                      }}
                    >
                      {link.name}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[2px] bg-[#FF3B00] rounded-full"
                        initial={false}
                        animate={{ width: isActive ? '100%' : '0%', opacity: isActive ? 1 : 0 }}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Line 2: Extended Nav */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                {EXTENDED_LINKS.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="relative text-[12px] uppercase font-mono tracking-[0.2em] transition-all group font-bold"
                      style={{ 
                        color: isActive ? '#FF3B00' : 'rgba(255,255,255,0.5)',
                        fontFamily: '"Courier New", monospace' 
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>


            {/* Right side — JamesOS button + mobile toggle */}
            <div className="flex items-center gap-4">

              {/* JamesOS toggle — desktop only */}
              {onEnterOS && (
                <button
                  onClick={onEnterOS}
                  className="hidden lg:flex items-center gap-3 relative z-[60] px-10 py-4 rounded-full border-2 border-[#FF3B00]/40 bg-[#FF3B00]/10 text-[14px] font-mono font-black tracking-[0.4em] text-[#FF3B00] hover:bg-[#FF3B00] hover:text-black transition-all group uppercase shadow-[0_0_30px_rgba(255,59,0,0.2)]"
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

            <div className="flex flex-col h-full relative z-10 pt-32 px-8">
              <p className="text-[11px] font-mono tracking-[0.4em] text-white/40 uppercase mb-12 border-b border-white/10 pb-4">
                System Registry // Navigation
              </p>
              
              {/* App-Switcher style Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[...CORE_LINKS, ...EXTENDED_LINKS].map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      custom={i}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col items-center justify-center aspect-square rounded-3xl border transition-all duration-300 group"
                        style={{ 
                          background: isActive ? 'rgba(255,59,0,0.1)' : 'rgba(255,255,255,0.03)',
                          borderColor: isActive ? 'rgba(255,59,0,0.3)' : 'rgba(255,255,255,0.08)'
                        }}
                      >
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                          <span className="text-xl" style={{ color: isActive ? '#FF3B00' : 'rgba(255,255,255,0.6)' }}>
                            {link.name[0]}
                          </span>
                        </div>
                        <span className="text-[13px] font-mono tracking-widest uppercase text-white/60">
                          {link.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* JamesOS button — mobile menu */}
              {onEnterOS && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => { setIsOpen(false); onEnterOS(); }}
                  className="mt-12 w-full py-6 rounded-2xl border border-[#FF3B00]/40 bg-[#FF3B00]/10 text-[#FF3B00] text-[12px] font-mono font-bold tracking-[0.3em] uppercase"
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