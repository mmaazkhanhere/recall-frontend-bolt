import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/about", label: "About" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <div className="flex h-8 w-8 items-center justify-center bg-foreground rounded-full">
                <Video className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-light text-foreground">
                VideoIndex
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-3 py-2 text-sm font-light transition-colors ${
                  isActive(path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {isActive(path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 bottom-0 h-px bg-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-background hover:bg-muted transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm"
            >
              <nav className="py-4 space-y-2">
                {navigationItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 text-sm font-light transition-colors rounded-lg mx-2 ${
                      isActive(path)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      {label}
                      {isActive(path) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto h-2 w-2 rounded-full bg-foreground"
                        />
                      )}
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;