import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Upload, Users, Sparkles, Zap, Globe } from 'lucide-react';

interface HeroProps {
  onShowAuth: () => void;
  onExploreModels: () => void;
}

export function Hero({ onShowAuth, onExploreModels }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/50 to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full blur-sm"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-accent/40 rounded-full blur-sm"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-3 h-3 bg-primary/50 rounded-full blur-sm"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo with Glow Effect */}
          <motion.div 
            className="flex items-center justify-center mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              variants={floatingVariants}
              animate="animate"
            >
              <motion.div 
                className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-3xl shadow-glow"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Brain className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark rounded-3xl blur-xl opacity-30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
          
          {/* Main Title with Gradient Text */}
          <motion.h1 
            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8"
            variants={itemVariants}
          >
            <motion.span 
              className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent bg-300% animate-gradient"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              MLShelf
            </motion.span>
          </motion.h1>
          
          {/* Subtitle with Typewriter Effect */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <motion.p 
              className="text-xl lg:text-2xl text-text-secondary mb-4 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Tiny ML Models for Everyone
            </motion.p>
            <motion.p 
              className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Share, discover, and download lightweight machine learning models 
              under 10MB. Perfect for edge computing, mobile apps, and resource-constrained environments.
            </motion.p>
          </motion.div>

          {/* CTA Buttons with Hover Effects */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            variants={itemVariants}
          >
            <motion.button
              onClick={onShowAuth}
              className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-glow overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div className="relative flex items-center space-x-3">
                <Upload className="w-6 h-6" />
                <span>Sign In & Upload</span>
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={onExploreModels}
              className="group relative bg-background-card/50 backdrop-blur-sm text-text-primary px-10 py-5 rounded-2xl font-bold text-lg border border-border-primary shadow-card overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(51, 65, 85, 0.8)",
                borderColor: "rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div className="relative flex items-center space-x-3">
                <Download className="w-6 h-6" />
                <span>Explore Models</span>
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Stats Cards with Stagger Animation */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {[
              {
                icon: Brain,
                value: "10 MB",
                label: "Max file size",
                color: "from-primary to-primary-dark",
                delay: 0,
              },
              {
                icon: Zap,
                value: "Free",
                label: "Always",
                color: "from-success to-emerald-600",
                delay: 0.1,
              },
              {
                icon: Globe,
                value: "Instant",
                label: "Downloads",
                color: "from-accent to-accent-dark",
                delay: 0.2,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="bg-background-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border-primary shadow-card group-hover:shadow-card-hover transition-all duration-300"
                  whileHover={{
                    borderColor: "rgba(59, 130, 246, 0.5)",
                    backgroundColor: "rgba(51, 65, 85, 0.5)",
                  }}
                >
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mx-auto mb-4 flex items-center justify-center shadow-glow`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-bold text-text-primary mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-text-muted text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}