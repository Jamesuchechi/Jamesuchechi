'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const PRIMARY_LINKS = [
  { name: 'Works',    href: '/works'    },
  { name: 'Services', href: '/services' },
  { name: 'About',    href: '/about'    },
  { name: 'Contact',  href: '/contact'  },
];

const MORE_GROUPS = [
  {
    label: 'Work',
    links: [
      { name: 'How I Build', href: '/process' },
      { name: 'Open Source', href: '/github'  },
      { name: 'Team',        href: '/team'    },
    ],
  },
  {
    label: 'Background',
    links: [
      { name: 'Experience',   href: '/experience'   },
      { name: 'Education',    href: '/education'    },
      { name: 'Achievements', href: '/achievements' },
    ],
  },
  {
    label: 'Extras',
    links: [
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Blog',         href: '/blog'         },
      { name: 'FAQ',          href: '/faq'          },
    ],
  },
];

const ACCENT = '#FF3B00';
const EASE = [0.22, 1, 0.36, 1];
const MONO = { fontFamily: '"JetBrains Mono", ui-monospace, "Courier New", monospace' };

const isActivePath = (pathname, href) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar({ onEnterOS }) {
  const pathname = usePathname() ?? '/';
  const [scrolled,   setScrolled]   = useState(false);
  const [moreOpen,   setMoreOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef(null);
  const triggerRef = useRef(null);

  const moreIsActive = MORE_GROUPS.some(g => g.links.some(l => isActivePath(pathname, l.href)));

  // Scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Click-outside + Escape for dropdown
  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [moreOpen]);

  // Lock body scroll for mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const linkClass = (active) =>
    `relative px-3.5 py-2.5 rounded-full text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
      active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
    }`;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none"
      >
        <nav
          aria-label="Primary"
          style={MONO}
          className={`pointer-events-auto flex items-center gap-2 rounded-full border pl-2 pr-2 py-2 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${
            scrolled
              ? 'bg-[#0b0c10]/80 border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]'
              : 'bg-[#0b0c10]/50 border-white/[0.08]'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="James Uchechi — Home"
            className="grid place-items-center h-9 w-9 rounded-full bg-white/10 border border-white/10 hover:bg-white group transition-colors"
          >
            {/* Swap in your real logo; repo currently points at /next.svg */}
            <img src="/next.svg" alt="" className="h-4 w-4 invert group-hover:invert-0 transition-all" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5 ml-2">
            {PRIMARY_LINKS.map(link => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={linkClass(active)}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ background: ACCENT }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMoreOpen(v => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                aria-controls="nav-more-menu"
                className={`${linkClass(moreIsActive || moreOpen)} inline-flex items-center gap-1.5 ${moreOpen ? 'bg-white/[0.06]' : ''}`}
              >
                More
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                />
                {moreIsActive && !moreOpen && (
                  <span
                    className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: ACCENT }}
                  />
                )}
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    id="nav-more-menu"
                    role="menu"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 top-[calc(100%+14px)] w-56 rounded-2xl border border-white/10 bg-[#0b0c10]/90 p-2 backdrop-blur-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]"
                  >
                    {MORE_GROUPS.map((group, gi) => (
                      <div
                        key={group.label}
                        className={`py-1.5 ${gi > 0 ? 'border-t border-white/[0.06]' : ''}`}
                      >
                        <span className="block px-3 pt-1.5 pb-1 text-[9px] uppercase tracking-[0.18em] text-white/30">
                          {group.label}
                        </span>
                        {group.links.map(link => {
                          const active = isActivePath(pathname, link.href);
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center justify-between rounded-xl px-3 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                                active ? 'text-white bg-white/[0.06]' : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              {link.name}
                              {active && (
                                <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Ecosystem — demoted to a quiet ghost pill (home only, when handler is passed) */}
          {onEnterOS && (
            <button
              type="button"
              onClick={onEnterOS}
              className="hidden lg:inline-flex items-center gap-2 ml-1 rounded-full border px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors hover:bg-[#FF3B00] hover:text-black"
              style={{ color: ACCENT, borderColor: 'rgba(255,59,0,0.35)' }}
            >
              <span aria-hidden="true">⊞</span>
              Ecosystem
            </button>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden ml-6 grid h-9 w-9 place-items-center rounded-full text-lg text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={MONO}
            className="fixed inset-0 z-[90] md:hidden overflow-y-auto bg-[#080808]/95 backdrop-blur-2xl"
          >
            <div className="px-8 pt-28 pb-16">
              <ul className="space-y-1">
                {PRIMARY_LINKS.map((link, i) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        className={`block py-3 text-2xl font-semibold uppercase tracking-[0.08em] ${
                          active ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {link.name}
                        {active && (
                          <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: ACCENT }} />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-10 space-y-8">
                {MORE_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="mb-3 border-b border-white/10 pb-2 text-[10px] uppercase tracking-[0.2em] text-white/30">
                      {group.label}
                    </p>
                    <ul className="grid grid-cols-2 gap-x-4">
                      {group.links.map(link => {
                        const active = isActivePath(pathname, link.href);
                        return (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={`block py-2 text-[12px] uppercase tracking-[0.1em] ${
                                active ? 'text-white' : 'text-white/55'
                              }`}
                            >
                              {link.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {onEnterOS && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); onEnterOS(); }}
                  className="mt-10 w-full rounded-full border py-4 text-[12px] font-medium uppercase tracking-[0.15em]"
                  style={{ color: ACCENT, borderColor: 'rgba(255,59,0,0.35)' }}
                >
                  ⊞ Ecosystem
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}