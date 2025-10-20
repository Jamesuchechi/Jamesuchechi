'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      setAbout(data);
    } catch (error) {
      console.error('Error fetching about:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="min-h-screen bg-white text-black py-20 px-6 sm:px-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section id="about" className="min-h-screen bg-white text-black py-20 px-6 sm:px-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-black/40">No about information yet. Add it from the admin dashboard!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="min-h-screen bg-white text-black py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] bg-gradient-to-br from-black/5 to-black/10 rounded-2xl overflow-hidden"
          >
            {about.profileImage ? (
              <Image
                src={about.profileImage}
                alt={about.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-black/10 text-9xl font-bold">
                {about.name ? about.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JU'}
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-black/60 mb-4">(About Me)</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              {about.title || "I'm a software engineer driven by passion"}
            </h2>

            <div className="space-y-6 text-black/70">
              <p className="whitespace-pre-line">{about.bio}</p>
            </div>

            {/* Contact Info */}
            {(about.email || about.phone || about.location) && (
              <div className="mt-8 space-y-2 text-sm">
                {about.email && (
                  <p className="text-black/60">
                    <span className="font-medium">Email:</span> {about.email}
                  </p>
                )}
                {about.phone && (
                  <p className="text-black/60">
                    <span className="font-medium">Phone:</span> {about.phone}
                  </p>
                )}
                {about.location && (
                  <p className="text-black/60">
                    <span className="font-medium">Location:</span> {about.location}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
