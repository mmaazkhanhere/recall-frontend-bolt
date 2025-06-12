import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MessageSquare, 
  Play, 
  Brain, 
  Zap, 
  Shield,
  Users,
  Globe
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
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Your content is protected with enterprise-grade security and privacy controls.'
  }
];

const stats = [
  { label: 'Active Users', value: '50K+' },
  { label: 'Videos Processed', value: '1M+' },
  { label: 'Search Queries', value: '10M+' },
  { label: 'Time Saved', value: '100K hrs' }
];

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to transform your video content into actionable knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <DemoVideo />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-lg text-white/80">
              Join thousands of organizations transforming their video content
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Transform your video content into searchable knowledge bases in minutes
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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