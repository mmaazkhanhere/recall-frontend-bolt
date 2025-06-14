import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-background">
      {/* Minimalist geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Minimal accent elements */}
        <div className="absolute top-1/4 right-1/4 w-px h-32 bg-foreground opacity-10"></div>
        <div className="absolute bottom-1/3 left-1/5 w-24 h-px bg-foreground opacity-10"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
                AI-Powered Video Intelligence
              </div>
            </div>

            {/* Heading */}
            <h1 className="mb-8 text-5xl font-light tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Transform Videos Into
              <span className="block font-normal">
                Searchable Knowledge
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed">
              Upload your videos and instantly create interactive knowledge bases. 
              Ask questions, get precise answers, and navigate directly to relevant moments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center rounded-none bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center rounded-none border border-border bg-background px-8 py-4 text-sm font-medium text-foreground transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-24 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { label: 'Videos Processed', value: '10,000+' },
              { label: 'Search Accuracy', value: '99.5%' },
              { label: 'Time Saved', value: '80%' },
              { label: 'Active Users', value: '5,000+' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="text-2xl font-light text-foreground mb-1 group-hover:text-foreground/80 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;