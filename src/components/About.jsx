"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { normalizeImageUrl } from "@/lib/imageUtils";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-[40px]" />
});

export default function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setAbout(data);
    } catch (error) {
      console.error("Error fetching about:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <section className="min-h-screen bg-white text-black py-20 px-6 sm:px-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/60 font-mono text-xs tracking-widest uppercase">
            Initializing Bio...
          </p>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section className="min-h-screen bg-white text-black py-20 px-6 sm:px-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-black/40 font-mono tracking-widest">
            NO_BIOGRAPHY_DEFINED
          </p>
        </div>
      </section>
    );
  }

  const noiseDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.15'/%3E%3C/svg%3E";

  return (
    <section
      id="about"
      ref={containerRef}
      className="bg-white text-black relative z-10"
    >
      {/* ── Background Folio Mark ── */}
      <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none select-none">
        <h2 className="text-[12rem] font-black uppercase leading-none tracking-tighter">
          BIO
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-screen">
        {/* 1. Image Section (Centered Sticky Pillar) */}
        <div className="relative h-full border-r border-black/5 flex flex-col">
          {/* 1. Sticky Identity Pillar */}
          <div className="sticky top-0 z-20">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative w-full h-[85vh] bg-[#f3f3f3] overflow-hidden group"
            >
              <div
                className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none opacity-40"
                style={{ backgroundImage: `url("${noiseDataUrl}")` }}
              />
              {about.profileImage ? (
                <Image
                  src={normalizeImageUrl(about.profileImage)}
                  alt={about.name}
                  fill
                  className="object-cover object-[center_15%] transition-transform duration-1000 saturate-[0.85] group-hover:saturate-100 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-black/5 text-9xl font-bold uppercase italic">
                  {about.name?.substring(0, 2) || "JU"}
                </div>
              )}
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/60 font-bold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  Profile // Identity
                </p>
              </div>
            </motion.div>
          </div>

          {/* 2. Stretching Map Pillar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative w-full flex-1 border-t border-black/5 min-h-[15vh]"
          >
            <div className="sticky top-[85vh] left-6 z-20 pointer-events-none p-6">
              <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-black/40 font-bold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-black/5 inline-block">
                Base of Operations // {about.location || "Abuja"}
              </p>
            </div>
            <div className="absolute inset-0">
              <MapComponent 
                latitude={about.latitude} 
                longitude={about.longitude} 
                address={about.location}
              />
            </div>
          </motion.div>
        </div>

        {/* 2. Content Section (Large Typography Perspective) */}
        <div className="relative flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto lg:mx-0">
            {/* Meta Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="w-12 h-px bg-black/10" />
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-black/40 font-bold italic">
                (The Biography // Folio 01)
              </span>
            </motion.div>

            {/* Main Statement */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-8xl font-black mb-16 leading-[0.9] tracking-tighter italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {about.title || "I'm a software engineer driven by passion"}
            </motion.h2>

            {/* Biography Text (Mixed Typography) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-12"
            >
              <div
                className="text-xl md:text-2xl text-black/80 leading-relaxed font-medium whitespace-pre-line tracking-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {about.bio}
              </div>

              {/* Technical Metadata Folios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-black/5">
                {[
                  {
                    label: "Direct Inquiries",
                    value: about.email,
                    folio: "01",
                  },
                  {
                    label: "Base of Operations",
                    value: about.location,
                    folio: "02",
                  },
                  { label: "Digital Voice", value: about.phone, folio: "03" },
                ].map(
                  (item, idx) =>
                    item.value && (
                      <div key={idx} className="group">
                        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-black/20 mb-3 transition-colors group-hover:text-black/40">
                          {item.label} // {item.folio}
                        </p>
                        <p className="text-sm font-mono text-black/70 group-hover:text-black transition-colors font-bold break-all">
                          {item.value}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </motion.div>

            {/* Action Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-24 pt-16 border-t border-black/5 flex flex-wrap items-center justify-between gap-8"
            >
              {about.resumeUrl && (
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-6 rounded-full bg-black text-white px-10 py-5 text-[10px] font-mono tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                >
                  Download CV
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </a>
              )}

              <div className="flex items-center gap-4 text-black/20">
                <div className="w-16 h-px bg-black/10" />
                <span className="text-[9px] font-mono tracking-[0.4em] uppercase font-bold">
                  END_OF_RECORD
                </span>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
    </section>
  );
}
