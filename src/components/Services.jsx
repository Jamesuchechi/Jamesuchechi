'use client';
import { motion } from 'framer-motion';

export default function Services() {
  const services = [
    {
      number: '01',
      title: 'Full-Stack Development',
      description: 'From frontend interactions to backend APIs, I build complete web solutions. I work with modern stacks to deliver apps that are scalable, maintainable, and ready for real-world users.',
      skills: ['React, Node.js, Express.js', 'REST APIs, Firebase, Docker', 'Git, GitHub, Postman']
    },
    {
      number: '02',
      title: 'UI/UX & Frontend',
      description: 'Design is more than looks — it\'s about clarity and connection. I design and develop clean, responsive interfaces that feel intuitive across devices.',
      skills: ['NextJs, TailwindCSS, GSAP', 'Figma to Code', 'HTML, CSS, JavaScript']
    },
    {
      number: '03',
      title: 'Optimization',
      description: 'Beyond handling data, I\'m driven by the challenge of turning complex raw inputs into reliable, usable systems. I enjoy designing pipelines that power insights.',
      skills: ['Data Structures & Algorithms', 'DBMS, OOP, OS Fundamentals', 'Data Pipelines, ETL, and Scalability']
    }
  ];

  return (
    <section id="services" className="min-h-screen bg-black text-white py-20 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-4">What I Do /</h2>
          <p className="text-xl text-white/60">(Services)</p>
        </motion.div>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-4xl mb-20"
        >
          I specialize in building full-stack web applications that are fast, reliable, and user-friendly. 
          With a solid foundation in both frontend and backend technologies, I help bring ideas to life 
          whether it's for a business, a startup, or a product team.
        </motion.p>

        {/* Services Grid */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border-t border-white/10 pt-8"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Number */}
                <div className="text-white/20 text-xl font-bold">({service.number})</div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/60 mb-6 max-w-2xl">{service.description}</p>

                  {/* Skills */}
                  <div className="space-y-2">
                    {service.skills.map((skill, i) => (
                      <p key={i} className="text-sm text-white/40">
                        {String(i + 1).padStart(2, '0')} {skill}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
