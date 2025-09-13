import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';

type Model = Database['public']['Tables']['models']['Row'];

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  const uploadModel = async (
    file: File,
    metadata: {
      name: string;
      description?: string;
      framework?: string;
      format?: string;
      tags?: string[];
    },
    userId: string
  ) => {
    try {
      console.log('🚀 Starting model upload...');
      console.log('📁 File:', { name: file.name, size: file.size, type: file.type });
      console.log('👤 User ID:', userId);
      console.log('📋 Metadata:', metadata);
      
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      console.log('📤 Uploading file as:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('models')
        .upload(fileName, file);

      if (uploadError) {
        console.error('❌ Storage upload failed:', uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }
      
      console.log('✅ File uploaded to storage:', uploadData.path);

      // Prepare database record
      const dbRecord = {
        user_id: userId,
        name: metadata.name,
        description: metadata.description || null,
        file_path: uploadData.path,
        size_bytes: file.size,
        framework: metadata.framework || null,
        format: metadata.format || null,
        tags: metadata.tags || null,
      };
      
      console.log('💾 Inserting to database:', dbRecord);

      const { data, error } = await supabase
        .from('models')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert failed:', error);
        
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('models').remove([uploadData.path]);
        
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('✅ Model saved successfully:', data);

      // Refresh models list
      await fetchModels();
      
      return { data, error: null };
      
    } catch (err) {
      console.error('💥 Upload failed:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to upload model'
      };
    }
  };

  const downloadModel = async (model: Model) => {
    try {
      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('models')
        .createSignedUrl(model.file_path, 60); // 1 minute expiry

      if (error) throw error;

      // Increment download count
      await supabase
        .from('models')
        .update({ downloads: model.downloads + 1 })
        .eq('id', model.id);

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = model.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Refresh models to update download count
      fetchModels();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const getUserModels = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch user models:', err);
      return [];
    }
  };

  return {
    models,
    loading,
    error,
    uploadModel,
    downloadModel,
    getUserModels,
    refetch: fetchModels,
  };
}