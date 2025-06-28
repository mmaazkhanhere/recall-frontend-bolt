import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Video } from 'lucide-react';
import DemoBookingModal from './DemoBookingModal';

const HeroSection: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-pink-900/40"></div>
          
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
          />
          
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl"
          />
          
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-medium text-white/90 shadow-lg">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span>AI-Powered Video Intelligence</span>
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </motion.div>

              {/* Main heading with gradient text */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-8 text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
              >
                Transform Videos Into
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold"
                >
                  Intelligent Knowledge
                </motion.span>
              </motion.h1>

              {/* Enhanced description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mx-auto mb-12 max-w-3xl text-lg text-white/80 sm:text-xl font-light leading-relaxed"
              >
                Upload your videos and instantly create interactive knowledge bases powered by advanced AI. 
                Ask questions, get precise answers, and navigate directly to relevant moments with unprecedented accuracy.
              </motion.p>

              {/* Enhanced CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link
                    to="/dashboard"
                    className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl transition-all hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Video className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Start Creating</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className="relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all hover:bg-white/20 hover:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Play className="mr-2 h-4 w-4 relative z-10" />
                    <span className="relative z-10">Watch Demo</span>
                  </button>
                </motion.div>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-16 flex flex-col items-center space-y-4"
              >
                <p className="text-sm text-white/60 font-light">Trusted by teams at</p>
                <div className="flex items-center space-x-8 opacity-60">
                  {['Microsoft', 'Google', 'Meta', 'Netflix'].map((company, index) => (
                    <motion.div
                      key={company}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="text-white/80 font-medium text-sm tracking-wide"
                    >
                      {company}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Demo Booking Modal */}
      <DemoBookingModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};

export default HeroSection;