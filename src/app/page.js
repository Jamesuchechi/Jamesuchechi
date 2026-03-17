import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SectionTransition from '@/components/SectionTransition';

/**
 * Section transition map
 * ─────────────────────────────────────────────────────────────
 * Hero      → About/Services   window shade   (outgoing: dark #07090c)
 * Services  → Projects         flip fold      (outgoing: black #000000)
 * Projects  → Skills           split open     (outgoing: white #ffffff)
 * Skills    → About            page peel      (outgoing: black #000000)
 * About     → Contact          pixel dissolve (outgoing: white #ffffff)
 * ─────────────────────────────────────────────────────────────
 *
 * bgHex must match the *background colour of that section* so the
 * canvas fill looks like the section is actually being removed.
 */

export default function Home() {
  return (
    <main className="relative">
      <Navbar />

      {/* 1. Hero → Services  |  window shade */}
      <SectionTransition
        id="home"
        transition="windowShade"
        bgHex="#07090c"
        className="min-h-screen"
      >
        <Hero />
      </SectionTransition>

      {/* 2. Services → Projects  |  flip fold */}
      <SectionTransition
        id="services"
        transition="flipFold"
        bgHex="#000000"
        className="min-h-screen"
      >
        <Services />
      </SectionTransition>

      {/* 3. Projects → Skills  |  split open */}
      <SectionTransition
        id="works"
        transition="splitOpen"
        bgHex="#ffffff"
        className="min-h-screen"
      >
        <Projects />
      </SectionTransition>

      {/* 4. Skills → About  |  page peel */}
      <SectionTransition
        id="skills-section"
        transition="pagePeel"
        bgHex="#000000"
        className="overflow-hidden"
      >
        <Skills />
      </SectionTransition>

      {/* 5. About → Contact  |  pixel dissolve */}
      <SectionTransition
        id="about"
        transition="pixelDissolve"
        bgHex="#ffffff"
        className="min-h-screen"
      >
        <About />
      </SectionTransition>

      {/* Contact + Footer — no outgoing transition needed (end of page) */}
      <section id="contact">
        <Contact />
        <Footer />
      </section>
    </main>
  );
}