"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/imageUtils";

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
        {/* 1. Image Section (Sticky Full-Bleed Pillar) */}
        <div className="relative h-[60vh] lg:h-auto overflow-hidden">
          <div className="lg:sticky lg:top-0 lg:h-screen w-full">
            <motion.div className="relative w-full h-full bg-[#f3f3f3] overflow-hidden">
              <div
                className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none opacity-40"
                style={{ backgroundImage: `url("${noiseDataUrl}")` }}
              />
              {about.profileImage ? (
                <Image
                  src={normalizeImageUrl(about.profileImage)}
                  alt={about.name}
                  fill
                  className="object-cover object-top transition-transform duration-1000 saturate-[0.85] hover:saturate-100"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-black/5 text-9xl font-bold">
                  {about.name
                    ? about.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "JU"}
                </div>
              )}

              {/* Decorative Folio Card (Now Floating inside the image area) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="hidden lg:block absolute bottom-12 right-12 bg-white/90 backdrop-blur-md p-8 border border-black/5 shadow-2xl rounded-2xl z-20 max-w-[260px]"
              >
                <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-black/40 mb-3 font-bold border-b border-black/5 pb-2">
                  Technical Status
                </p>
                <p className="text-[11px] font-mono leading-relaxed text-black/70 italic">
                  Currently refining the boundaries between{" "}
                  <span className="text-black font-bold">
                    Digital Excellence
                  </span>{" "}
                  and{" "}
                  <span className="text-black font-bold">Human Intuition</span>.
                </p>
              </motion.div>
            </motion.div>
          </div>
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
