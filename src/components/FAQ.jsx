'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-black/5 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-8 text-left group transition-all"
      >
        <h3 className={`text-2xl md:text-3xl font-bold uppercase italic tracking-tight transition-all ${isOpen ? 'text-[#FF3B00]' : 'text-black/80 group-hover:text-black'}`} style={{ fontFamily: 'Georgia, serif' }}>
          {item.question}
        </h3>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#FF3B00] text-white rotate-180' : 'bg-black/5 text-black/40 group-hover:bg-black group-hover:text-white'}`}>
          {isOpen ? <FiMinus /> : <FiPlus />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 text-lg md:text-xl text-black/50 leading-relaxed max-w-3xl font-medium" style={{ fontFamily: 'Georgia, serif' }}>
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    fetch('/api/faqs')
      .then(r => r.json())
      .then(d => setFaqs(Array.isArray(d) ? d : []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-white text-black py-32 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24">
          <p className="text-[10px] font-mono tracking-[0.4em] text-black/30 uppercase mb-4">Conversion // Support</p>
          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]" style={{ fontFamily: 'Georgia, serif' }}>
            Frequently Asked <br /> Questions
          </h2>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="h-10 w-10 border-2 border-black/5 border-t-[#FF3B00] rounded-full" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed border-black/5 rounded-[60px]">
            <p className="font-mono text-black/20 uppercase tracking-widest">Initialization of Knowledge Base required.</p>
          </div>
        ) : (
          <div className="border-t border-black/5">
            {faqs.map((faq, i) => (
              <FAQItem 
                key={faq.id} 
                item={faq} 
                isOpen={openIndex === i} 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
