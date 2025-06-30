import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import boltLogoWhite from "../../public/bolt_logo_white.png";

const HeroSection: React.FC = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Black and white gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/20 via-transparent to-gray-700/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-600/20 via-transparent to-transparent"></div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-600/30 to-gray-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Minimalist geometric elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          {/* Minimal accent elements */}
          <div className="absolute top-1/4 right-1/4 w-px h-32 bg-white/20"></div>
          <div className="absolute bottom-1/3 left-1/5 w-24 h-px bg-white/20"></div>
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="mx-auto max-w-5xl">
            {/* Main content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              {/* Badge */}
              <div className="mb-8 flex items-center justify-center gap-8">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/90">
                  <span>AI-Powered Video Intelligence</span>
                </div>
                <a href="https://bolt.new/">
                  <img
                    src={boltLogoWhite}
                    className="ml-2 h-16 md:h-28 w-16 md:w-28"
                    alt="Bolt Logo"
                  />
                </a>
              </div>

              {/* Heading - Split into two lines with proper gradient handling */}
              <h1 className="mb-8 text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                <span className="block leading-tight">
                  Transform Videos Into
                </span>
                <span className="block font-normal leading-tight relative">
                  <span
                    className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent"
                    style={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      paddingBottom: "0.1em",
                      display: "inline-block",
                    }}
                  >
                    Searchable Knowledge
                  </span>
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mb-12 max-w-2xl text-lg text-white/80 sm:text-xl font-light leading-relaxed">
                Upload your videos and instantly create interactive knowledge
                bases. Ask questions, get precise answers, and navigate directly
                to relevant moments.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-6 sm:space-y-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/dashboard"
                    className="group inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-sm font-medium text-black transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="group inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Provide Feedback
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

export default HeroSection;
