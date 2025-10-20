'use client';
import { useState, useEffect } from 'react';
import { FiArrowUp, FiGithub, FiLinkedin, FiInstagram, FiMessageCircle, FiFacebook, FiMusic } from 'react-icons/fi';

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
        const parsed = JSON.parse(data.socialLinks);
        setSocialLinks(parsed);
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
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Menu */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Menu</h3>
            <ul className="space-y-2">
              {['Home', 'Services', 'Works', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Socials</h3>
            <ul className="space-y-2">
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
                      className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2"
                    >
                      <IconComponent /> {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Local Time */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Local Time</h3>
            <p className="text-white/60 text-sm">
              {mounted ? currentTime : '--:--:--'}
            </p>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToTop}
            className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all"
          >
            <FiArrowUp className="text-2xl" />
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>&copy; {currentYear} James Uchechi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}