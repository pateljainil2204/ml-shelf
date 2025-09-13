import React from 'react';
import { motion } from 'framer-motion';
import { Brain, User, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
  currentView?: 'home' | 'dashboard';
}

export function Header({ onShowAuth, onShowDashboard, currentView }: HeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.header 
      className="relative bg-background-card/20 backdrop-blur-md border-b border-border-primary/50 shadow-card"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="relative"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl shadow-glow"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 30px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
            
            <div>
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                MLShelf
              </motion.h1>
              <motion.span 
                className="text-sm text-text-muted flex items-center space-x-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Sparkles className="w-3 h-3" />
                <span>Tiny ML Models for Everyone</span>
              </motion.span>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {user ? (
              <>
                {currentView !== 'dashboard' && (
                  <motion.button
                    onClick={onShowDashboard}
                    className="group flex items-center space-x-2 px-6 py-3 text-primary hover:text-primary-light bg-primary/10 hover:bg-primary/20 rounded-xl transition-all duration-300 border border-primary/20 hover:border-primary/40"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                    <motion.div
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.button>
                )}
                
                {currentView !== 'home' && (
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 text-text-secondary hover:text-text-primary bg-background-card/50 hover:bg-background-card/80 rounded-xl transition-all duration-300 border border-border-primary hover:border-border-secondary backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="font-medium">Explore Models</span>
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleSignOut}
                  className="group flex items-center space-x-2 px-6 py-3 text-error hover:text-red-400 bg-error/10 hover:bg-error/20 rounded-xl transition-all duration-300 border border-error/20 hover:border-error/40"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={onShowAuth}
                className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-glow overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative font-medium">Sign In</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}