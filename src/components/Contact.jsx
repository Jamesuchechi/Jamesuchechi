'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



const INITIAL = { name: '', email: '', message: '' };

function validate(data) {
  const errors = {};
  if (!data.name.trim())                              errors.name    = 'Name is required';
  if (!data.email.trim())                             errors.email   = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                                      errors.email   = 'Enter a valid email';
  if (!data.message.trim())                           errors.message = 'Message is required';
  else if (data.message.trim().length < 10)           errors.message = 'Message is too short';
  return errors;
}

// Animated checkmark SVG
function Checkmark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <motion.circle
        cx="32" cy="32" r="30"
        stroke="white" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M18 32 L28 42 L46 24"
        stroke="white" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.4 }}
      />
    </svg>
  );
}

export default function Contact({ autoFocus = false }) {
  const [formData, setFormData] = useState(INITIAL);
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState('idle'); // idle | sending | success | error
  const [touched,  setTouched]  = useState({});
  const nameRef = useRef(null);

  // Auto-focus name on mount if prop is set
  useEffect(() => { 
    if (autoFocus) {
      nameRef.current?.focus(); 
    }
  }, [autoFocus]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change once field has been touched
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Touch all fields to show errors
    setTouched({ name: true, email: true, message: true });
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFormData(INITIAL);
    setErrors({});
    setTouched({});
    setStatus('idle');
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  const inputBase = `
    w-full bg-white/5 border rounded-lg px-6 py-4 text-white
    placeholder-white/30 focus:outline-none transition-colors
    text-base
  `;
  const inputClass = name => `${inputBase} ${
    errors[name]
      ? 'border-red-500/60 focus:border-red-400'
      : 'border-white/10 focus:border-white/40'
  }`;

  return (
    <section id="contact" className="min-h-screen bg-black text-white py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">Let's Make It Happen</h2>
          <p className="text-xl text-white/40">(Say Hello)</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── Success state ── */}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center py-16 gap-8"
            >
              <Checkmark />

              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Message sent{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}!
                </h3>
                <p className="text-white/50 text-lg max-w-md">
                  Thanks for reaching out. I'll get back to you within 24–48 hours.
                </p>
              </div>

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 px-8 py-3 border border-white/20 rounded-lg text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm"
              >
                Send another message
              </motion.button>
            </motion.div>
          )}

          {/* ── Form state ── */}
          {status !== 'success' && (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
              noValidate
            >
              {/* Name */}
              <div>
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Name"
                  autoComplete="name"
                  className={inputClass('name')}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-sm text-red-400 pl-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your Email"
                  autoComplete="email"
                  className={inputClass('email')}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-sm text-red-400 pl-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Message */}
              <div>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your Message"
                    rows={6}
                    maxLength={2000}
                    className={`${inputClass('message')} resize-none`}
                  />
                  {/* Character counter */}
                  <span
                    className="absolute bottom-3 right-4 text-xs pointer-events-none transition-colors"
                    style={{
                      color: formData.message.length > 1800
                        ? 'rgba(248,113,113,0.8)'
                        : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {formData.message.length}/2000
                  </span>
                </div>
                <AnimatePresence>
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-sm text-red-400 pl-1"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Server error banner */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg px-5 py-3 text-red-400 text-sm"
                  >
                    Something went wrong. Please try again or email me directly at{' '}
                    <a href="mailto:okparajamesuchechi@gmail.com" className="underline underline-offset-2">
                      okparajamesuchechi@gmail.com
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'sending'}
                whileHover={status !== 'sending' ? { scale: 1.01 } : {}}
                whileTap={status !== 'sending' ? { scale: 0.99 } : {}}
                className="w-full bg-white text-black px-12 py-6 rounded-2xl font-black font-mono text-sm uppercase tracking-[0.2em]
                           transition-all disabled:cursor-not-allowed relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]"
                style={{ opacity: status === 'sending' ? 0.8 : 1 }}
              >
                <AnimatePresence mode="wait">
                  {status === 'sending' ? (
                    <motion.span
                      key="sending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <svg
                        className="animate-spin h-4 w-4 text-black"
                        fill="none" viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"
                        />
                        <path
                          className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}