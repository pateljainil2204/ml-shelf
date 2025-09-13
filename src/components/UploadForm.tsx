import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Tag, Database, Brain, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useModels } from '../hooks/useModels';

interface UploadFormProps {
  onSuccess?: () => void;
}

const FRAMEWORKS = [
  'TensorFlow',
  'PyTorch',
  'ONNX',
  'TensorFlow Lite',
  'Core ML',
  'Other'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: '',
    format: '',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const { user } = useAuth();
  const { uploadModel } = useModels();

  const resetForm = () => {
    setFile(null);
    setFormData({
      name: '',
      description: '',
      framework: '',
      format: '',
      tags: ''
    });
    setError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is 10 MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    if (!formData.name.trim()) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, name: fileName }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const validateForm = () => {
    if (!file) {
      setError('Please select a file to upload');
      return false;
    }

    if (!user) {
      setError('You must be signed in to upload models');
      return false;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Model name is required');
      return false;
    }

    if (trimmedName.length > 100) {
      setError('Model name must be 100 characters or less');
      return false;
    }

    if (formData.description.length > 500) {
      setError('Description must be 500 characters or less');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const metadata = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        framework: formData.framework || undefined,
        format: formData.format.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      const result = await uploadModel(file!, metadata, user!.id);

      if (result.error) {
        throw new Error(result.error);
      }

      resetForm();
      onSuccess?.();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div 
      className="bg-background-card/30 backdrop-blur-sm rounded-3xl shadow-card border border-border-primary overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 p-8 border-b border-border-primary">
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="bg-gradient-to-br from-primary to-primary-dark p-3 rounded-2xl shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Upload className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Upload New Model</h2>
              <p className="text-text-muted">Share your ML model with the community</p>
            </div>
          </div>
          <motion.button
            onClick={resetForm}
            className="text-text-muted hover:text-text-primary transition-colors p-2 rounded-xl hover:bg-background-tertiary/50"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            title="Clear form"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <AnimatePresence>
          {error && (
            <motion.div 
              className="p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm backdrop-blur-sm flex items-center space-x-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Upload Area */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-text-secondary mb-4">
            Select Model File <span className="text-error">*</span>
          </label>
          <motion.div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : file 
                ? 'border-success bg-success/5' 
                : 'border-border-primary hover:border-primary/50 hover:bg-primary/5'
            }`}
            whileHover={{ scale: file ? 1 : 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".h5,.pb,.pth,.onnx,.tflite,.mlmodel,.pkl,.bin,.safetensors"
            />
            
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    className="bg-success/20 p-4 rounded-2xl mx-auto w-fit"
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle className="w-12 h-12 text-success" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-medium text-success">{file.name}</p>
                    <p className="text-sm text-text-muted">{formatFileSize(file.size)}</p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-sm text-success hover:text-success/80 underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Remove file
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    className="bg-primary/20 p-4 rounded-2xl mx-auto w-fit"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Upload className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-medium text-text-primary mb-2">
                      Drop your model file here or click to browse
                    </p>
                    <p className="text-sm text-text-muted">
                      Maximum file size: 10 MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Model Name <span className="text-error">*</span>
            </label>
            <motion.input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-4 bg-background-tertiary/50 backdrop-blur-sm border border-border-primary rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all text-text-primary placeholder-text-muted"
              placeholder="Enter a descriptive name for your model"
              maxLength={100}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <p className="text-xs text-text-muted mt-2">
              {formData.name.length}/100 characters
            </p>
          </motion.div>

          {/* Framework */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Framework
            </label>
            <motion.select
              value={formData.framework}
              onChange={(e) => handleInputChange('framework', e.target.value)}
              className="w-full px-4 py-4 bg-background-tertiary/50 backdrop-blur-sm border border-border-primary rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all text-text-primary"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <option value="">Select framework (optional)</option>
              {FRAMEWORKS.map(fw => (
                <option key={fw} value={fw}>{fw}</option>
              ))}
            </motion.select>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Description
          </label>
          <motion.textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-4 bg-background-tertiary/50 backdrop-blur-sm border border-border-primary rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all resize-none text-text-primary placeholder-text-muted"
            placeholder="Describe what your model does, its capabilities, and use cases..."
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <p className="text-xs text-text-muted mt-2">
            {formData.description.length}/500 characters
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Format */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Format
            </label>
            <motion.input
              type="text"
              value={formData.format}
              onChange={(e) => handleInputChange('format', e.target.value)}
              className="w-full px-4 py-4 bg-background-tertiary/50 backdrop-blur-sm border border-border-primary rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all text-text-primary placeholder-text-muted"
              placeholder="e.g., SavedModel, .pth, .onnx"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Tags
            </label>
            <motion.input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-4 py-4 bg-background-tertiary/50 backdrop-blur-sm border border-border-primary rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all text-text-primary placeholder-text-muted"
              placeholder="computer-vision, nlp, classification (comma-separated)"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <p className="text-xs text-text-muted mt-2">
              Separate multiple tags with commas
            </p>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div 
          className="pt-4"
          variants={itemVariants}
        >
          <motion.button
            type="submit"
            disabled={uploading || !file || !formData.name.trim()}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-5 rounded-2xl font-bold text-lg shadow-glow disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group relative"
            whileHover={{ 
              scale: uploading || !file || !formData.name.trim() ? 1 : 1.02,
              boxShadow: uploading || !file || !formData.name.trim() ? undefined : "0 0 30px rgba(59, 130, 246, 0.6)",
            }}
            whileTap={{ scale: uploading || !file || !formData.name.trim() ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="relative flex items-center justify-center space-x-4">
              {uploading ? (
                <>
                  <motion.div 
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Brain className="w-7 h-7" />
                  <span>Upload Model</span>
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}