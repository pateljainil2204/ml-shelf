import React from 'react';
import { Database, Search } from 'lucide-react';
import { ModelCard } from './ModelCard';
import { useModels } from '../hooks/useModels';

export function ModelGrid() {
  const { models, loading, downloadModel } = useModels();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Available Models</h2>
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {models.length} models
          </span>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-16">
          <Database className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No models available yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Be the first to contribute! Sign in and upload your tiny ML models to share with the community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onDownload={downloadModel}
            />
          ))}
        </div>
      )}
    </div>
  );
}