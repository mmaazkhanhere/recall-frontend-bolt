import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VideoIndex
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your video content into searchable, interactive knowledge bases powered by AI.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/mmaazkhanhere/recall-frontend-bolt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <div className="space-y-3">
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 VideoIndex. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;