import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

const DemoVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
          >
            See VideoIndex in Action
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-12 text-lg text-muted-foreground"
          >
            Watch how easy it is to create searchable knowledge bases from your video content
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {!isPlaying ? (
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Demo video thumbnail"
                  className="h-64 w-full object-cover sm:h-96"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all group-hover:bg-black/50">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                  >
                    <Play className="ml-1 h-8 w-8" />
                  </motion.button>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  3:42 Demo
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <video
                    className="h-64 w-full rounded-2xl object-cover sm:h-96"
                    controls
                    autoPlay
                    poster="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                  >
                    <source src="#" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;