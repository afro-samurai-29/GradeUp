import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  X,
  FileImage,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  Paperclip
} from 'lucide-react';
import { geminiImageService } from '../services/geminiImageService';

interface ImageUploadProps {
  onImageProcessed: (extractedContent: string, imageFile: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

interface UploadState {
  file: File | null;
  preview: string | null;
  isProcessing: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  error: string | null;
  extractedContent: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageProcessed,
  onError,
  disabled = false,
  className = ''
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    isProcessing: false,
    progress: 0,
    status: 'idle',
    error: null,
    extractedContent: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset upload state
  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      preview: null,
      isProcessing: false,
      progress: 0,
      status: 'idle',
      error: null,
      extractedContent: null
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    console.log('📁 File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!geminiImageService.isValidImageFile(file)) {
      const error = 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
      setUploadState(prev => ({ ...prev, status: 'error', error }));
      onError(error);
      return;
    }

    // Validate file size
    if (file.size > geminiImageService.getMaxFileSize()) {
      const error = 'Image file size must be less than 4MB';
      setUploadState(prev => ({ ...prev, status: 'error', error }));
      onError(error);
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    
    setUploadState(prev => ({
      ...prev,
      file,
      preview,
      status: 'uploading',
      error: null,
      progress: 25
    }));

    // Simulate upload progress
    setTimeout(() => {
      setUploadState(prev => ({ ...prev, progress: 50, status: 'processing' }));
    }, 300);

    try {
      console.log('🔍 Starting image content extraction...');
      
      // Extract content using Gemini
      const result = await geminiImageService.extractImageContent(file);
      
      setUploadState(prev => ({ ...prev, progress: 90 }));

      if (result.success && result.content) {
        console.log('✅ Image content extracted successfully');
        
        setUploadState(prev => ({
          ...prev,
          status: 'success',
          progress: 100,
          extractedContent: result.content
        }));

        // Call the callback with extracted content
        onImageProcessed(result.content, file);

        // Auto-hide success state after 2 seconds
        setTimeout(() => {
          resetUpload();
        }, 2000);

      } else {
        throw new Error(result.error || 'Failed to extract content from image');
      }

    } catch (error: any) {
      console.error('❌ Image processing error:', error);
      const errorMessage = error.message || 'Failed to process image';
      
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
        progress: 0
      }));
      
      onError(errorMessage);
    }
  }, [onImageProcessed, onError, resetUpload]);

  // Handle file input change
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Drag and drop removed as requested

  // Trigger file input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Render upload button with camera option
  const renderUploadButton = () => {
    if (uploadState.status === 'idle') {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            disabled={disabled}
            className="gap-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
          >
            <Paperclip className="w-4 h-4" />
            Upload/Camera
          </Button>
        </div>
      );
    }

    return null;
  };

  // Render processing state
  const renderProcessingState = () => {
    if (uploadState.status === 'idle') return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Preview and Status */}
        <div className="flex items-start gap-3">
          {/* Image Preview */}
          {uploadState.preview && (
            <div className="relative flex-shrink-0">
              <img
                src={uploadState.preview}
                alt="Upload preview"
                className="w-16 h-16 object-cover rounded-md border border-gray-200"
              />
              {uploadState.status === 'success' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
              {uploadState.status === 'error' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          )}

          {/* Status and Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {uploadState.file?.name || 'Processing...'}
                </span>
              </div>
              
              {uploadState.status !== 'success' && uploadState.status !== 'error' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUpload}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-xs text-gray-600">
                    {uploadState.status === 'uploading' ? 'Uploading...' : 'Extracting content...'}
                  </span>
                </div>
                <Progress value={uploadState.progress} className="h-1" />
              </div>
            )}

            {/* Success Message */}
            {uploadState.status === 'success' && (
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Content extracted successfully!
              </div>
            )}

            {/* Error Message */}
            {uploadState.status === 'error' && uploadState.error && (
              <div className="mt-2">
                <Alert className="py-2">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {uploadState.error}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // No drag and drop zone needed - removed as requested

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input with camera support */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Button */}
      {renderUploadButton()}

      {/* Processing State */}
      {renderProcessingState()}
    </div>
  );
};

export default ImageUpload;
