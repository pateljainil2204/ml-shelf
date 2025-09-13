import React, { useState, useEffect } from 'react';
import { User, Upload, Database, ArrowLeft } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Models</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">{user?.email}</span>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{showUpload ? 'Cancel' : 'Upload Model'}</span>
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <div className="mb-8">
            <UploadForm onSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* User Models */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Models</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {userModels.length}
            </span>
          </div>

          {userModels.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No models yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first model to get started sharing with the community.
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your First Model</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onDownload={downloadModel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}