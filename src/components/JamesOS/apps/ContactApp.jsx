'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function validate(d) {
  const e = {};
  if (!d.name.trim())    e.name    = 'required';
  if (!d.email.trim())   e.email   = 'required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'invalid email';
  if (!d.message.trim()) e.message = 'required';
  return e;
}

const INITIAL = { name: '', email: '', message: '' };

export default function ContactApp() {
  const [form,    setForm]    = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [status,  setStatus]  = useState('idle'); // idle | sending | success | error

  const field = (name) => ({
    value: form[name],
    onChange: e => {
      const val = e.target.value;
      setForm(p => ({ ...p, [name]: val }));
      if (touched[name]) {
        const errs = validate({ ...form, [name]: val });
        setErrors(p => ({ ...p, [name]: errs[name] }));
      }
    },
    onBlur: () => {
      setTouched(p => ({ ...p, [name]: true }));
      setErrors(p => ({ ...p, [name]: validate(form)[name] }));
    },
  });

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, message: true });
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => { setForm(INITIAL); setErrors({}); setTouched({}); setStatus('idle'); };

  const inputStyle = (name) => ({
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `0.5px solid ${errors[name] ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '6px', padding: '7px 10px',
    color: '#fff', fontSize: '12px',
    fontFamily: 'var(--font-mono, monospace)',
    outline: 'none', resize: 'none',
    transition: 'border-color 0.15s',
  });

  if (status === 'success') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px', background: '#0d0d0f' }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <motion.circle cx="24" cy="24" r="22" stroke="#00ff88" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          <motion.path d="M14 24 L21 31 L34 18" stroke="#00ff88" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.4 }} />
        </svg>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#00ff88', fontSize: '13px', fontFamily: 'monospace', marginBottom: '5px' }}>
            message sent{form.name ? `, ${form.name.split(' ')[0]}` : ''}!
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: 'monospace' }}>
            I'll get back to you within 24-48h
          </div>
        </div>
        <button onClick={reset} style={{ background: 'none', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '5px 14px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer' }}>
          send another
        </button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', background: '#0d0d0f', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '.08em', marginBottom: '2px' }}>
        # contact.app
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
        {[
          { label: 'email', href: 'mailto:okparajamesuchechi@gmail.com' },
          { label: '@Jamesuchechi6', href: 'https://x.com/Jamesuchechi6' },
          { label: 'portfolio', href: 'https://jamesuchechi.netlify.app' },
        ].map(l => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '10px', color: 'rgba(126,232,250,0.7)', fontFamily: 'monospace', textDecoration: 'none' }}>
            {l.label} ↗
          </a>
        ))}
      </div>

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Form fields */}
      <div>
        <label style={labelStyle}>name</label>
        <input {...field('name')} placeholder="Your name" style={inputStyle('name')} />
        {errors.name && touched.name && <FieldErr msg={errors.name} />}
      </div>

      <div>
        <label style={labelStyle}>email</label>
        <input {...field('email')} type="email" placeholder="your@email.com" style={inputStyle('email')} />
        {errors.email && touched.email && <FieldErr msg={errors.email} />}
      </div>

      <div>
        <label style={labelStyle}>message</label>
        <textarea {...field('message')} rows={4} placeholder="Say something..." style={inputStyle('message')} />
        {errors.message && touched.message && <FieldErr msg={errors.message} />}
      </div>

      {status === 'error' && (
        <div style={{ color: '#f87171', fontSize: '11px', fontFamily: 'monospace', background: 'rgba(248,113,113,0.08)', border: '0.5px solid rgba(248,113,113,0.2)', borderRadius: '5px', padding: '7px 10px' }}>
          Failed to send. Try emailing directly: okparajamesuchechi@gmail.com
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={status === 'sending'}
        style={{
          width: '100%', padding: '8px', borderRadius: '6px',
          background: status === 'sending' ? 'rgba(255,255,255,0.06)' : 'rgba(0,255,136,0.12)',
          border: `0.5px solid ${status === 'sending' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,136,0.3)'}`,
          color: status === 'sending' ? 'rgba(255,255,255,0.35)' : '#00ff88',
          fontSize: '12px', fontFamily: 'monospace',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {status === 'sending' ? (
          <>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} />
            sending...
          </>
        ) : 'send message'}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    </div>
  );
}

const labelStyle = { display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '.06em', marginBottom: '4px' };

function FieldErr({ msg }) {
  return <div style={{ color: '#f87171', fontSize: '10px', fontFamily: 'monospace', marginTop: '3px' }}>{msg}</div>;
}