'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-white/40">No services yet. Add some from the admin dashboard!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {services.map((service, index) => {
              // Parse features if they exist
              let features = [];
              try {
                if (service.features) {
                  if (Array.isArray(service.features)) {
                    features = service.features;
                  } else {
                    const parsed = JSON.parse(service.features);
                    features = Array.isArray(parsed) ? parsed : [];
                  }
                }
              } catch (error) {
                console.error('Error parsing features:', error);
              }

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border-t border-white/10 pt-8"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Number */}
                    <div className="text-white/20 text-xl font-bold">({String(index + 1).padStart(2, '0')})</div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h3>
                      <p className="text-white/60 mb-6 max-w-2xl">{service.description}</p>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="space-y-2">
                          {features.map((feature, i) => (
                            <p key={i} className="text-sm text-white/40">
                              {String(i + 1).padStart(2, '0')} {feature}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
