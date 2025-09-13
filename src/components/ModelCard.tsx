import React from 'react';
import { motion } from 'framer-motion';
import { Download, Tag, Calendar, Database, Sparkles } from 'lucide-react';
import { Database as DB } from '../lib/supabase';

type Model = DB['public']['Tables']['models']['Row'];

interface ModelCardProps {
  model: Model;
  onDownload: (model: Model) => void;
}

export function ModelCard({ model, onDownload }: ModelCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="group relative bg-background-card/30 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-card-hover border border-border-primary hover:border-primary/30 transition-all duration-300 overflow-hidden"
      variants={cardVariants}
      whileHover={{ 
        y: -8,
        scale: 1.02,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.h3 
            className="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {model.name}
          </motion.h3>
          <div className="text-right flex-shrink-0 ml-4">
            <motion.div 
              className="text-sm font-medium text-text-secondary bg-background-tertiary/50 px-3 py-1 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              {formatSize(model.size_bytes)}
            </motion.div>
            {model.framework && (
              <motion.div 
                className="text-xs text-primary font-medium mt-2 bg-primary/10 px-2 py-1 rounded-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                {model.framework}
              </motion.div>
            )}
          </div>
        </div>

        {/* Description */}
        {model.description && (
          <motion.p 
            className="text-text-muted text-sm mb-4 line-clamp-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {model.description}
          </motion.p>
        )}

        {/* Metadata */}
        <div className="space-y-3 mb-4">
          {model.format && (
            <motion.div 
              className="flex items-center text-sm text-text-muted"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="w-4 h-4 mr-3 text-primary" />
              <span>{model.format}</span>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center text-sm text-text-muted"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Calendar className="w-4 h-4 mr-3 text-accent" />
            <span>{formatDate(model.created_at)}</span>
          </motion.div>
        </div>

        {/* Tags */}
        {model.tags && model.tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {model.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-background-tertiary/50 text-text-secondary text-xs rounded-full border border-border-primary group-hover:border-primary/30 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#60a5fa"
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </motion.span>
            ))}
            {model.tags.length > 3 && (
              <motion.span
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                +{model.tags.length - 3} more
              </motion.span>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border-primary/50">
          <motion.div 
            className="flex items-center text-sm text-text-muted"
            whileHover={{ scale: 1.05 }}
          >
            <Download className="w-4 h-4 mr-2 text-success" />
            <span className="font-medium">{model.downloads} downloads</span>
          </motion.div>
          
          <motion.button
            onClick={() => onDownload(model)}
            className="group/btn relative bg-gradient-to-r from-success to-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-glow overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
            />
            <div className="relative flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}