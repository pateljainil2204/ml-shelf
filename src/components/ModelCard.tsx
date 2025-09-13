import React from 'react';
import { Download, Tag, Calendar, User, Database } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {model.name}
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-500">{formatSize(model.size_bytes)}</div>
            {model.framework && (
              <div className="text-xs text-blue-600 font-medium mt-1">
                {model.framework}
              </div>
            )}
          </div>
        </div>

        {model.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {model.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {model.format && (
            <div className="flex items-center text-sm text-gray-500">
              <Database className="w-4 h-4 mr-2" />
              <span>{model.format}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(model.created_at)}</span>
          </div>
        </div>

        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {model.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Download className="w-4 h-4 mr-1" />
            <span>{model.downloads} downloads</span>
          </div>
          
          <button
            onClick={() => onDownload(model)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}