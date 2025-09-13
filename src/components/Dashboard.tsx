import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Upload, Database, ArrowLeft, Sparkles, Brain, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useModels } from '../hooks/useModels';
import { UploadForm } from './UploadForm';
import { ModelCard } from './ModelCard';
import { Database as DB } from '../lib/supabase';

type Model = DB['public']['Tables']['models']['Row'];

interface DashboardProps {
  onBack: () => void;
}

export function Dashboard({ onBack }: DashboardProps) {
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  
  const { user } = useAuth();
  const { getUserModels, downloadModel } = useModels();

  useEffect(() => {
    if (user) {
      loadUserModels();
    }
  }, [user]);

  const loadUserModels = async () => {
    if (!user) return;
    setLoading(true);
    const models = await getUserModels(user.id);
    setUserModels(models);
    setLoading(false);
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    loadUserModels();
  };

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
      <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary flex items-center justify-center">
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
            Loading dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-6">
            <motion.button
              onClick={onBack}
              className="group flex items-center space-x-3 text-text-muted hover:text-text-primary transition-colors bg-background-card/30 backdrop-blur-sm px-4 py-3 rounded-xl border border-border-primary hover:border-primary/30"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Models</span>
            </motion.button>
            
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl shadow-glow"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <User className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-muted text-sm">{user?.email}</p>
              </div>
            </motion.div>
          </div>
          
          <motion.button
            onClick={() => setShowUpload(!showUpload)}
            className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-bold shadow-glow overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ transition: 'all 0.3s ease' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="relative flex items-center space-x-3">
              <motion.div
                animate={{ rotate: showUpload ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {showUpload ? <Plus className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </motion.div>
              <span>{showUpload ? 'Cancel' : 'Upload Model'}</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Upload Form */}
        <AnimatePresence>
          {showUpload && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <UploadForm onSuccess={handleUploadSuccess} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Models */}
        <motion.div 
          className="bg-background-card/20 backdrop-blur-sm rounded-3xl shadow-card border border-border-primary p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center space-x-4 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Your Models</h2>
              <p className="text-text-muted">Manage your uploaded models</p>
            </div>
            <motion.span 
              className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm text-text-primary text-sm px-4 py-2 rounded-xl border border-primary/30 font-medium flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{userModels.length}</span>
            </motion.span>
          </motion.div>

          {userModels.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
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
                No models yet
              </motion.h3>
              
              <motion.p 
                className="text-text-muted mb-8 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Upload your first model to get started sharing with the community.
              </motion.p>
              
              <motion.button
                onClick={() => setShowUpload(true)}
                className="group relative bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-bold shadow-glow overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transition: 'all 0.3s ease' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative flex items-center space-x-3">
                  <Upload className="w-6 h-6" />
                  <span>Upload Your First Model</span>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {userModels.map((model, index) => (
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
        </motion.div>
      </div>
    </div>
  );
}