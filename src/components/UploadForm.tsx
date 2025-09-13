import React, { useState } from 'react';
import { Upload, FileText, Tag, Database, Brain, X } from 'lucide-react';
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
    setError(''); // Clear error when user starts typing
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is 10 MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Auto-fill name if empty
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
      // Prepare tags array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Prepare metadata
      const metadata = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        framework: formData.framework || undefined,
        format: formData.format.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      console.log('Starting upload with:', {
        file: file!.name,
        size: file!.size,
        user: user!.id,
        metadata
      });

      const result = await uploadModel(file!, metadata, user!.id);

      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Upload successful!');
      resetForm();
      onSuccess?.();
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" />
            Upload New Model
          </h2>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Model File <span className="text-red-500">*</span>
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : file 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".h5,.pb,.pth,.onnx,.tflite,.mlmodel,.pkl,.bin,.safetensors"
              />
              
              {file ? (
                <div className="space-y-3">
                  <FileText className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-green-700">{file.name}</p>
                    <p className="text-xs text-green-600">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-green-600 hover:text-green-700 underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Drop your model file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: 10 MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter a descriptive name for your model"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Describe what your model does, its capabilities, and use cases..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Framework and Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework
              </label>
              <select
                value={formData.framework}
                onChange={(e) => handleInputChange('framework', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select framework (optional)</option>
                {FRAMEWORKS.map(fw => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <input
                type="text"
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g., SavedModel, .pth, .onnx"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="computer-vision, nlp, classification (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading || !file || !formData.name.trim()}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3 font-medium text-lg"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  <span>Upload Model</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}