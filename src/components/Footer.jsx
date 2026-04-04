'use client';
import { useState, useEffect } from 'react';
import { FiArrowUp, FiGithub, FiLinkedin, FiInstagram, FiMessageCircle, FiFacebook, FiMusic } from 'react-icons/fi';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    whatsapp: '',
    facebook: '',
    tiktok: ''
  });

  useEffect(() => {
    setMounted(true);
    // Update time initially
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Fetch social links
    fetchSocialLinks();

    return () => clearInterval(interval);
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      
      if (data.socialLinks) {
        if (typeof data.socialLinks === 'string') {
          try {
            const parsed = JSON.parse(data.socialLinks);
            setSocialLinks(parsed);
          } catch (error) {
            console.error('Error parsing social links:', error);
          }
        } else if (typeof data.socialLinks === 'object') {
          setSocialLinks(data.socialLinks);
        }
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  // Social media icons mapping
  const socialIcons = {
    github: FiGithub,
    linkedin: FiLinkedin,
    twitter: FiInstagram, // Using Instagram icon for Twitter/X
    website: FiArrowUp, // Using arrow up for website
    whatsapp: FiMessageCircle,
    facebook: FiFacebook,
    tiktok: FiMusic // Using music icon for TikTok
  };

  const socialLabels = {
    github: 'Github',
    linkedin: 'LinkedIn',
    twitter: 'X (Twitter)',
    website: 'Website',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    tiktok: 'TikTok'
  };

  return (
    <footer className="bg-[#080808] text-white py-32 relative overflow-hidden">
      {/* ── Background Signature (Restored & Fixed) ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-end justify-center pb-8 opacity-[0.03]">
        <h2 className="text-[22vw] font-black leading-none whitespace-nowrap tracking-tighter uppercase translate-y-1/4">
          JAMES UCHECHI
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand/Slogan */}
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-5xl font-black italic mb-10 leading-[0.9]" style={{ fontFamily: 'Georgia, serif' }}>
              Building <br /> <span className="text-white/40">the future</span> <br /> of digital.
            </h3>
            <div className="flex gap-4">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <FiArrowUp className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Back to Top</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/20 mb-10">Navigation</h4>
            <ul className="space-y-5">
              {['Home', 'Services', 'Works', 'Process', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-sm text-white/50 hover:text-white transition-colors relative group font-mono tracking-widest uppercase text-[11px]"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/20 mb-10">Connect</h4>
            <ul className="space-y-5">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const IconComponent = socialIcons[platform];
                const label = socialLabels[platform];
                return (
                  <li key={platform}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-4 group font-mono tracking-widest uppercase text-[11px]"
                    >
                      <IconComponent className="text-lg group-hover:scale-110 transition-transform" />
                      <span>{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System Data */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/20 mb-10">System Data</h4>
            <div className="space-y-10">
              <div className="group cursor-default">
                <p className="text-[9px] font-mono tracking-[0.3em] text-white/20 uppercase mb-3 transition-colors group-hover:text-white/40">Local Time</p>
                <p className="text-2xl font-mono tabular-nums text-white/80 group-hover:text-white transition-colors">
                  {mounted ? currentTime : '--:--:--'}
                </p>
              </div>
              <div className="group cursor-default">
                <p className="text-[9px] font-mono tracking-[0.3em] text-white/20 uppercase mb-3 transition-colors group-hover:text-white/40">Visitor Count</p>
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-xl group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                  <VisitorCounter />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Bottom */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap justify-center gap-10 order-2 md:order-1">
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
              &copy; {currentYear} James Uchechi
            </p>
            <p className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
              Crafted with Excellence
            </p>
            <p className="hidden lg:block text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
              Designed for the Bold
            </p>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">System Status: Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
