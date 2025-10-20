'use client';
import { motion } from 'framer-motion';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Languages & Tools',
      skills: ['Python', 'SQL', 'C++', 'Java', 'TypeScript', 'JavaScript', 'Git', 'Postman', 'Docker', 'Firebase']
    },
    {
      title: 'Frameworks & Libraries',
      skills: ['React', 'Node.js', 'Express.js', 'Flask', 'Bootstrap', 'jQuery', 'TailwindCSS', 'Framer Motion', 'GSAP']
    },
    {
      title: 'Core CS Concepts',
      skills: ['DSA', 'DBMS', 'OOP', 'Operating Systems', 'System Design']
    }
  ];

  return (
    <section className="bg-black text-white py-20 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">DEVELOPER</h2>
          <h2 className="text-5xl md:text-7xl font-bold mb-4">DESIGNER</h2>
          <h2 className="text-5xl md:text-7xl font-bold">CREATOR /</h2>
        </motion.div>

        {/* Skills */}
        <div className="space-y-16">
          {skillCategories.map((category, catIndex) => (
            <div key={category.title}>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold mb-8"
              >
                {category.title}
              </motion.h3>

              {/* Scrolling Skills */}
              <div className="relative overflow-hidden">
                <motion.div
                  animate={{
                    x: [0, -1000]
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 20,
                      ease: "linear"
                    }
                  }}
                  className="flex gap-6 whitespace-nowrap"
                >
                  {[...Array(3)].map((_, repeatIndex) => (
                    <div key={repeatIndex} className="flex gap-6">
                      {category.skills.map((skill, skillIndex) => (
                        <div
                          key={`${repeatIndex}-${skillIndex}`}
                          className="text-4xl md:text-5xl font-bold text-white/10 hover:text-white/30 transition-colors"
                        >
                          # {skill}
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
