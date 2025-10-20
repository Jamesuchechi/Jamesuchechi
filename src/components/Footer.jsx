'use client';
import { FiArrowUp, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

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
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <FiLinkedin /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <FiInstagram /> Instagram
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <FiGithub /> Github
                </a>
              </li>
            </ul>
          </div>

          {/* Local Time */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Local Time</h3>
            <p className="text-white/60 text-sm">{new Date().toLocaleTimeString()}</p>
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
