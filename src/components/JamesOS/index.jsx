'use client';
import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OSWindow  from './OSWindow';
import Terminal  from './Terminal';
import ProjectsApp from './apps/ProjectsApp';
import SkillsApp   from './apps/SkillsApp';
import AboutApp    from './apps/AboutApp';
import ContactApp  from './apps/ContactApp';

/**
 * JamesOS
 * ─────────────────────────────────────────────────────────────
 * Full-screen OS overlay rendered on top of the normal portfolio.
 *
 * Props:
 *   onExit  fn()  called when the user exits JamesOS
 */

/* ── Boot sequence lines ─────────────────────────────────────── */
const BOOT_LINES = [
  { text: 'Initializing JamesOS kernel...', delay: 0    },
  { text: 'Mounting portfolio filesystem...', delay: 320 },
  { text: 'Loading project index...', delay: 640  },
  { text: 'Starting window manager...', delay: 920  },
  { text: 'Connecting to Firebase...', delay: 1200 },
  { text: 'All systems ready.', delay: 1480, accent: true },
];

/* ── App registry ────────────────────────────────────────────── */
const APP_REGISTRY = {
  terminal: {
    title: 'terminal.sh',
    icon: '❯_',
    defaultW: 480, defaultH: 300,
    offsetX: 140, offsetY: 55,
  },
  projects: {
    title: 'projects/',
    icon: '⊞',
    defaultW: 360, defaultH: 360,
    offsetX: 90,  offsetY: 45,
  },
  skills: {
    title: 'skills.json',
    icon: '◎',
    defaultW: 300, defaultH: 340,
    offsetX: 200, offsetY: 65,
  },
  about: {
    title: 'about.txt',
    icon: '◉',
    defaultW: 320, defaultH: 360,
    offsetX: 170, offsetY: 50,
  },
  contact: {
    title: 'contact.app',
    icon: '✉',
    defaultW: 300, defaultH: 380,
    offsetX: 160, offsetY: 60,
  },
};

/* ── Desktop icons definition ────────────────────────────────── */
const DESKTOP_ICONS = [
  { id: 'projects', label: 'Projects', color: 'rgba(59,130,246,0.3)',   icon: ProjectIcon   },
  { id: 'terminal', label: 'Terminal', color: 'rgba(16,185,129,0.3)',   icon: TerminalIcon  },
  { id: 'skills',   label: 'Skills',   color: 'rgba(139,92,246,0.3)',   icon: SkillsIcon    },
  { id: 'about',    label: 'About',    color: 'rgba(236,72,153,0.25)',  icon: AboutIcon     },
  { id: 'contact',  label: 'Contact',  color: 'rgba(249,115,22,0.3)',   icon: ContactIcon   },
];

let winCounter = 0;

export default function JamesOS({ onExit }) {
  const desktopRef = useRef(null);
  const [phase, setPhase]     = useState('boot'); // boot | desktop
  const [bootStep, setBootStep] = useState(0);
  const [openWins, setOpenWins] = useState({}); // { winId: { appId, zIndex, ...appProps } }
  const [zTop,  setZTop]        = useState(20);
  const [taskbar, setTaskbar]   = useState([]); // [{ winId, title }]

  /* ── Boot sequence ───────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'boot') return;
    BOOT_LINES.forEach(({ delay, text, accent }, i) => {
      setTimeout(() => {
        setBootStep(i + 1);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => setPhase('desktop'), 500);
        }
      }, delay);
    });
  }, [phase]);

  /* ── Open a window ───────────────────────────────────────── */
  const openApp = useCallback((appId, extraProps = {}) => {
    // If already open, bring to front
    const existing = Object.entries(openWins).find(([, v]) => v.appId === appId);
    if (existing) {
      const [winId] = existing;
      bringToFront(winId);
      return;
    }

    const cfg   = APP_REGISTRY[appId];
    if (!cfg) return;

    const winId = `win_${++winCounter}`;
    const newZ  = zTop + 1;
    setZTop(newZ);

    // Cascade offset so multiple windows don't perfectly overlap
    const cascade = Object.keys(openWins).length * 22;

    setOpenWins(prev => ({
      ...prev,
      [winId]: {
        appId,
        zIndex:   newZ,
        initialX: cfg.offsetX + cascade,
        initialY: cfg.offsetY + cascade,
        initialW: cfg.defaultW,
        initialH: cfg.defaultH,
        ...extraProps,
      },
    }));

    setTaskbar(prev => [...prev, { winId, title: cfg.title }]);
  }, [openWins, zTop]);

  const bringToFront = useCallback((winId) => {
    setZTop(prev => {
      const newZ = prev + 1;
      setOpenWins(p => p[winId] ? { ...p, [winId]: { ...p[winId], zIndex: newZ } } : p);
      return newZ;
    });
  }, []);

  const closeApp = useCallback((winId) => {
    setOpenWins(prev => {
      const next = { ...prev };
      delete next[winId];
      return next;
    });
    setTaskbar(prev => prev.filter(t => t.winId !== winId));
  }, []);

  /* ── Render window body by appId ─────────────────────────── */
  const renderAppBody = (appId, props = {}) => {
    switch (appId) {
      case 'terminal':
        return <Terminal onOpenApp={openApp} onExit={onExit} />;
      case 'projects':
        return <ProjectsApp filter={props.filter || ''} />;
      case 'skills':
        return <SkillsApp />;
      case 'about':
        return <AboutApp />;
      case 'contact':
        return <ContactApp />;
      default:
        return <div style={{ padding: '20px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '12px' }}>Unknown app: {appId}</div>;
    }
  };

  /* ── Clock ───────────────────────────────────────────────── */
  const [clock, setClock] = useState('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    };
    setClock(fmt());
    const id = setInterval(() => setClock(fmt()), 10000);
    return () => clearInterval(id);
  }, []);

  /* ── Open terminal on desktop load ──────────────────────── */
  useEffect(() => {
    if (phase === 'desktop') {
      setTimeout(() => openApp('terminal'), 200);
    }
  }, [phase]); // intentionally not including openApp to avoid loop

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      background: '#000',
      fontFamily: 'var(--font-mono, monospace)',
    }}>
      <AnimatePresence mode="wait">

        {/* ── Boot screen ─────────────────────────────────── */}
        {phase === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '32px', background: '#000',
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '52px', fontWeight: 700, color: '#fff', letterSpacing: '-3px', lineHeight: 1 }}>JU</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '.2em', marginTop: '6px' }}>JAMESOS v1.0.0</div>
            </motion.div>

            {/* Progress bar */}
            <div style={{ width: '220px' }}>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#fff', borderRadius: '1px' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(bootStep / BOOT_LINES.length) * 100}%` }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Boot lines */}
            <div style={{ width: '260px', minHeight: '80px' }}>
              {BOOT_LINES.slice(0, bootStep).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontSize: '11px',
                    color: line.accent ? '#00ff88' : 'rgba(255,255,255,0.3)',
                    marginBottom: '4px',
                    lineHeight: 1.5,
                  }}
                >
                  {line.accent ? '✓ ' : '> '}{line.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Desktop ─────────────────────────────────────── */}
        {phase === 'desktop' && (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Desktop area */}
            <div
              ref={desktopRef}
              style={{
                flex: 1, position: 'relative', overflow: 'hidden',
                background: '#0a0c10',
              }}
            >
              {/* Grid wallpaper */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              {/* Glow */}
              <div style={{
                position: 'absolute', pointerEvents: 'none',
                width: '700px', height: '700px',
                background: 'radial-gradient(circle, rgba(120,171,255,0.05) 0%, transparent 65%)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              }} />

              {/* Desktop icons */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1 }}>
                {DESKTOP_ICONS.map(({ id, label, color, icon: Icon }) => (
                  <button
                    key={id}
                    onDoubleClick={() => openApp(id)}
                    onClick={() => openApp(id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '5px', width: '60px', background: 'none', border: 'none',
                      cursor: 'pointer', padding: '6px 4px', borderRadius: '8px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    title={`Open ${label}`}
                    aria-label={`Open ${label}`}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '11px',
                      background: color,
                      border: '0.5px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon />
                    </div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.3 }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Exit OS button */}
              <button
                onClick={onExit}
                style={{
                  position: 'absolute', top: '14px', right: '14px', zIndex: 5,
                  padding: '5px 14px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)', fontSize: '11px',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                aria-label="Exit JamesOS"
              >
                ⏏ Exit OS
              </button>

              {/* Windows */}
              <AnimatePresence>
                {Object.entries(openWins).map(([winId, winState]) => {
                  const cfg = APP_REGISTRY[winState.appId] || {};
                  return (
                    <OSWindow
                      key={winId}
                      id={winId}
                      title={cfg.title || winState.appId}
                      icon={cfg.icon}
                      initialX={winState.initialX}
                      initialY={winState.initialY}
                      initialW={winState.initialW}
                      initialH={winState.initialH}
                      zIndex={winState.zIndex}
                      onFocus={bringToFront}
                      onClose={closeApp}
                      desktopRef={desktopRef}
                    >
                      {renderAppBody(winState.appId, winState)}
                    </OSWindow>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Taskbar */}
            <div style={{
              height: '44px', flexShrink: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(16px)',
              borderTop: '0.5px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center',
              padding: '0 14px', gap: '6px',
            }}>
              {/* Brand */}
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginRight: '8px', flexShrink: 0 }}>
                JamesOS
              </div>

              {/* Open app pills */}
              <div style={{ display: 'flex', gap: '5px', flex: 1, overflowX: 'auto' }}>
                {taskbar.map(({ winId, title }) => (
                  <button
                    key={winId}
                    onClick={() => bringToFront(winId)}
                    style={{
                      padding: '3px 10px', borderRadius: '5px',
                      background: openWins[winId] ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      border: '0.5px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.6)', fontSize: '11px',
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      fontFamily: 'inherit',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = openWins[winId] ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}
                  >
                    {title}
                  </button>
                ))}
              </div>

              {/* Clock + version */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexShrink: 0, marginLeft: 'auto' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>v1.0.0</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{clock}</span>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

/* ── Icon components ─────────────────────────────────────────── */
function ProjectIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(147,197,253,0.85)" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function TerminalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(110,231,183,0.85)" strokeWidth="1.5">
      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  );
}
function SkillsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(196,181,253,0.85)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  );
}
function AboutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(249,168,212,0.85)" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(253,186,116,0.85)" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}