'use client';
import { motion } from 'framer-motion';

export default function About() {
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
            <div className="absolute inset-0 flex items-center justify-center text-black/10 text-9xl font-bold">
              JU
            </div>
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
              I'm a software engineer driven by a passion for turning ideas into clean, 
              intuitive digital experiences.
            </h2>

            <div className="space-y-6 text-black/70">
              <p>
                I am a passionate Software Engineer with a knack for building full-stack web 
                applications using modern technologies like Next.js and TailwindCSS. My journey 
                into tech began with a curiosity for solving real-world problems through innovative 
                solutions, which evolved into a love for crafting user-centric digital experiences.
              </p>

              <p>
                Beyond coding, I thrive in collaborative environments and enjoy tackling challenging 
                problems with creative solutions. I aim to contribute to impactful projects that make 
                a difference in users' lives.
              </p>

              <p>
                With expertise spanning full-stack development, UI/UX design, and system optimization, 
                I bring both technical depth and design sensibility to every project.
              </p>
            </div>

            {/* Stats or Highlights */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h3 className="text-4xl font-bold mb-2">3+</h3>
                <p className="text-black/60">Years Experience</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold mb-2">20+</h3>
                <p className="text-black/60">Projects Completed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
