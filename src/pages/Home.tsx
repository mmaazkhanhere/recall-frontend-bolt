import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Play, 
  Brain, 
  Zap, 
  Eye
} from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';
import DemoVideo from '../components/home/DemoVideo';

const features = [
  {
    icon: Search,
    title: 'Intelligent Search',
    description: 'Find exact moments in your videos using natural language queries. Our AI understands context and content.'
  },
  {
    icon: MessageSquare,
    title: 'Interactive Q&A',
    description: 'Ask questions about your videos and get precise answers with direct links to relevant timestamps.'
  },
  {
    icon: Play,
    title: 'Smart Navigation',
    description: 'Jump directly to specific topics, concepts, or moments mentioned in your video content.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Extract key insights, summaries, and actionable knowledge from your video content automatically.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Search through hours of content in milliseconds with our optimized indexing technology.'
  },
  {
    icon: Eye,
    title: 'Context Awareness',
    description: 'Our system connects spoken content to on-screen visuals for comprehensive understanding.'
  }
];

const stats = [
  { label: 'Processing Time', value: '8 hours+' },
  { label: 'Search Accuracy', value: '95%' },
  { label: 'Search Queries', value: '10M+' },
  { label: 'Time Saved', value: '100K hrs' }
];

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-24"
          >
            <h2 className="text-3xl font-light text-foreground sm:text-4xl mb-6">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Everything you need to transform your video content into actionable knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {features.map((feature, index) => (
              <div key={feature.title} className="border-r border-b border-border">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <DemoVideo />

      {/* Stats Section */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-light sm:text-4xl mb-6">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-lg text-background/70 font-light leading-relaxed">
              Join thousands of organizations transforming their video content
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-light mb-3">{stat.value}</div>
                <div className="text-background/70 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-light text-foreground sm:text-4xl mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-16 font-light leading-relaxed">
              Transform your video content into searchable knowledge bases in minutes
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center bg-foreground px-8 py-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center border border-border bg-background px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;