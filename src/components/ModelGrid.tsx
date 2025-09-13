import React from 'react';
import { motion } from 'framer-motion';
import { Database, Sparkles, Brain, Zap } from 'lucide-react';
import { ModelCard } from './ModelCard';
import { useModels } from '../hooks/useModels';

export function ModelGrid() {
  const { models, loading, downloadModel } = useModels();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-text-secondary text-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading models...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <motion.div 
        className="flex items-center justify-between mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl shadow-glow"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Database className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              Available Models
            </motion.h2>
            <motion.p 
              className="text-text-muted mt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover and download community models
            </motion.p>
          </div>
        </div>
        
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm text-text-primary text-sm px-4 py-2 rounded-xl border border-primary/30 font-medium flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>{models.length} models</span>
          </motion.span>
        </motion.div>
      </motion.div>

      {models.length === 0 ? (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative mb-8"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-3xl mx-auto w-32 h-32 flex items-center justify-center backdrop-blur-sm border border-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Brain className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          
          <motion.h3 
            className="text-2xl font-bold text-text-primary mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            No models available yet
          </motion.h3>
          
          <motion.p 
            className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Be the first to contribute! Sign in and upload your tiny ML models to share with the community.
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center space-x-2 text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Zap className="w-5 h-5" />
            <span className="font-medium">Ready to get started?</span>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {models.map((model, index) => (
            <motion.div
              key={model.id}
              variants={itemVariants}
              custom={index}
            >
              <ModelCard
                model={model}
                onDownload={downloadModel}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}