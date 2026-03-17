'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const PROMPT_USER  = 'james@portfolio';
const PROMPT_DELIM = ':~$';

const HELP_TEXT = `
available commands:
  whoami              about James
  ls                  list apps
  open [app]          open an app window
  skills              open skills viewer
  projects            list all projects
  cat contact.txt     contact information
  cat about.txt       bio & details
  clear               clear terminal
  exit                exit JamesOS
  help                show this message

apps: projects, skills, about, contact
`.trim();

export default function Terminal({ onOpenApp, onExit }) {
  const [lines,  setLines]  = useState([
    { type: 'system', text: 'JamesOS Terminal v1.0.0' },
    { type: 'muted',  text: 'Type \'help\' for available commands.' },
    { type: 'gap' },
  ]);
  const [input,    setInput]    = useState('');
  const [history,  setHistory]  = useState([]);
  const [histIdx,  setHistIdx]  = useState(-1);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const pushLines = useCallback((newLines) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const runCommand = useCallback((raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Add to history
    setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)].slice(0, 50));
    setHistIdx(-1);

    // Echo command
    const cmdLine = { type: 'cmd', text: trimmed };

    const parts   = trimmed.split(/\s+/);
    const cmd     = parts[0].toLowerCase();
    const args    = parts.slice(1);

    let output = [];

    switch (cmd) {
      case 'help':
        output = HELP_TEXT.split('\n').map((l, i) =>
          i === 0 ? { type: 'accent', text: l } : { type: 'output', text: l }
        );
        break;

      case 'whoami':
        output = [
          { type: 'accent', text: 'James Uchechi' },
          { type: 'output', text: 'Software Engineer · Data Scientist/Engineer' },
          { type: 'output', text: 'Location: Earth · Status: Available for work' },
        ];
        break;

      case 'ls':
        output = [
          { type: 'output', text: 'projects/   skills.json   about.txt   contact.app' },
        ];
        break;

      case 'open': {
        const target = args[0]?.toLowerCase();
        const appMap = {
          projects: 'projects', skills: 'skills',
          about: 'about', contact: 'contact',
          'contact.app': 'contact', 'about.txt': 'about',
          'skills.json': 'skills',
        };
        if (!target) {
          output = [{ type: 'error', text: 'usage: open [app]' }];
        } else if (appMap[target]) {
          onOpenApp?.(appMap[target]);
          output = [{ type: 'success', text: `Opening ${args[0]}...` }];
        } else {
          // Try to open as a project by name
          onOpenApp?.('projects', { filter: target });
          output = [{ type: 'success', text: `Searching projects for "${args[0]}"...` }];
        }
        break;
      }

      case 'skills':
        onOpenApp?.('skills');
        output = [{ type: 'success', text: 'Opening skills.json...' }];
        break;

      case 'projects':
        onOpenApp?.('projects');
        output = [{ type: 'success', text: 'Opening projects/...' }];
        break;

      case 'cat': {
        const file = args[0]?.toLowerCase();
        if (file === 'contact.txt') {
          onOpenApp?.('contact');
          output = [
            { type: 'output', text: 'email:     okparajamesuchechi@gmail.com' },
            { type: 'output', text: 'x:         @Jamesuchechi6' },
            { type: 'output', text: 'portfolio: jamesuchechi.netlify.app' },
            { type: 'gap' },
            { type: 'success', text: 'contact.app opened.' },
          ];
        } else if (file === 'about.txt') {
          onOpenApp?.('about');
          output = [
            { type: 'output', text: 'NAME     James Uchechi' },
            { type: 'output', text: 'ROLE     Software Engineer · Data Scientist' },
            { type: 'output', text: 'FOCUS    Web Apps · Data Pipelines · APIs' },
            { type: 'gap' },
            { type: 'success', text: 'about.app opened.' },
          ];
        } else {
          output = [{ type: 'error', text: `cat: ${args[0] || '(no file)'}: no such file` }];
        }
        break;
      }

      case 'clear':
        setLines([]);
        return;

      case 'exit':
        onExit?.();
        return;

      case 'pwd':
        output = [{ type: 'output', text: '/home/james/portfolio' }];
        break;

      case 'date':
        output = [{ type: 'output', text: new Date().toString() }];
        break;

      case 'echo':
        output = [{ type: 'output', text: args.join(' ') }];
        break;

      default:
        output = [{ type: 'error', text: `command not found: ${cmd}. Try 'help'` }];
    }

    pushLines([cmdLine, ...output, { type: 'gap' }]);
  }, [onOpenApp, onExit, pushLines]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistIdx(prev => {
        const next = Math.min(prev + 1, history.length - 1);
        if (next >= 0) setInput(history[next]);
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistIdx(prev => {
        const next = Math.max(prev - 1, -1);
        setInput(next === -1 ? '' : history[next]);
        return next;
      });
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      pushLines([{ type: 'cmd', text: input + '^C' }, { type: 'gap' }]);
      setInput('');
    }
  };

  const lineColor = (type) => {
    switch (type) {
      case 'cmd':     return '#ffffff';
      case 'output':  return 'rgba(255,255,255,0.7)';
      case 'muted':   return 'rgba(255,255,255,0.35)';
      case 'system':  return 'rgba(255,255,255,0.9)';
      case 'accent':  return '#7ee8fa';
      case 'success': return '#00ff88';
      case 'error':   return '#ff6b6b';
      default:        return 'transparent';
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#0d0d0d', padding: '14px 16px',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '12px', lineHeight: '1.6',
        overflowY: 'auto', cursor: 'text',
      }}
    >
      {/* Output lines */}
      {lines.map((line, i) => (
        <div key={i} style={{ marginBottom: line.type === 'gap' ? '6px' : '1px' }}>
          {line.type === 'cmd' ? (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ color: '#00ff88' }}>{PROMPT_USER}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>{PROMPT_DELIM}</span>
              <span style={{ color: '#ffffff' }}>{line.text}</span>
            </div>
          ) : line.type !== 'gap' ? (
            <div style={{ color: lineColor(line.type), whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {line.text}
            </div>
          ) : null}
        </div>
      ))}

      {/* Active input row */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#00ff88', flexShrink: 0 }}>{PROMPT_USER}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{PROMPT_DELIM}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            flex: 1, minWidth: '60px',
            background: 'transparent', border: 'none', outline: 'none',
            color: '#ffffff', fontFamily: 'inherit', fontSize: 'inherit',
            caretColor: '#00ff88',
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}