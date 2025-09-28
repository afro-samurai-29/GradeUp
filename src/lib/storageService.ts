// storageService.ts
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from 'firebase/storage';

export interface UploadOptions {
  path: string;
  fileName?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  success: boolean;
  downloadURL?: string;
  storagePath?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
}

export class StorageService {
  /**
   * Upload a file to Firebase Storage
   */
  static async uploadFile(
    file: File, 
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Generate unique filename if not provided
      const fileName = options.fileName || `${Date.now()}_${file.name}`;
      const fullPath = `${options.path}/${fileName}`;
      
      // Create storage reference
      const storageRef = ref(storage, fullPath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        downloadURL,
        fileName: file.name,
        fileSize: file.size
      };
    } catch (error: any) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed'
      };
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  static async deleteFile(downloadURL: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Extract path from download URL
      const url = new URL(downloadURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('Invalid download URL format');
      }
      
      const filePath = decodeURIComponent(pathMatch[1]);
      const fileRef = ref(storage, filePath);
      
      await deleteObject(fileRef);
      
      return { success: true };
    } catch (error: any) {
      console.error('Storage delete error:', error);
      return {
        success: false,
        error: error.message || 'Delete failed'
      };
    }
  }

  /**
   * Upload past paper (admin use)
   */
  static async uploadPastPaper(
    file: File,
    subject: string,
    year: string,
    title: string
  ): Promise<UploadResult> {
    const fileName = `${subject}_${year}_${Date.now()}_${file.name}`;
    return this.uploadFile(file, {
      path: 'past-papers',
      fileName
    });
  }

  /**
   * Upload student help request file
   */
  static async uploadHelpRequestFile(
    file: File,
    studentId: string,
    requestType: 'image' | 'video' | 'audio' | 'document'
  ): Promise<UploadResult> {
    const timestamp = Date.now();
    const fileName = `${studentId}_${requestType}_${timestamp}_${file.name}`;
    
    return this.uploadFile(file, {
      path: `help-requests/${studentId}`,
      fileName,
      metadata: {
        requestType,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Upload AI tutor image
   */
  static async uploadAITutorImage(
    file: File,
    userId: string
  ): Promise<UploadResult> {
    const fileName = `ai-tutor_${userId}_${Date.now()}_${file.name}`;
    
    return this.uploadFile(file, {
      path: 'ai-tutor-images',
      fileName,
      metadata: {
        userId,
        uploadedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Validate file type and size
   */
  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 10): { valid: boolean; error?: string } {
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    const isValidType = allowedTypes.some(type => 
      mimeType.includes(type) || fileExtension === type
    );
    
    if (!isValidType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`
      };
    }
    
    return { valid: true };
  }

  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// File type constants
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'jpg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'pdf', 'doc', 'docx'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg', 'mp4', 'webm', 'ogg'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'mp3', 'wav', 'ogg']
};

export default StorageService;
