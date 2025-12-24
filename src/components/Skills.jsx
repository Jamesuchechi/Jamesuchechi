'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillCategories, setSkillCategories] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      const skillsArray = Array.isArray(data) ? data : [];
      setSkills(skillsArray);
      
      // Group skills by category
      const grouped = skillsArray.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill.name);
        return acc;
      }, {});

      // Convert to array format
      const categories = Object.keys(grouped).map(title => ({
        title,
        skills: grouped[title]
      }));

      setSkillCategories(categories);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
      setSkillCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white py-20 px-6 sm:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-3 text-white/80">
            DEVELOPER
          </h2>
          <motion.h2
            animate={{
              textShadow: [
                '0 0 10px rgba(255,255,255,0.15)',
                '0 0 28px rgba(255,255,255,0.35)',
                '0 0 12px rgba(255,255,255,0.2)',
              ],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            className="text-6xl md:text-8xl font-extrabold mb-3 text-white"
          >
            DESIGNER
          </motion.h2>
          <h2 className="text-5xl md:text-7xl font-bold text-white/80">
            CREATOR /
          </h2>
        </motion.div>

        {/* Skills */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">Loading skills...</p>
          </div>
        ) : skillCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-white/40">No skills yet. Add some from the admin dashboard!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {skillCategories.map((category, catIndex) => (
              <div key={category.title}>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl font-bold mb-8 text-white/90 tracking-wide"
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
                            className="text-4xl md:text-5xl font-semibold text-white/40 hover:text-white/70 transition-colors"
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
        )}
      </div>
    </section>
  );
}
