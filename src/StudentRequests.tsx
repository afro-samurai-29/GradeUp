import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StudentLayout from '@/components/StudentLayout';
import { StorageService, FILE_TYPES } from '@/lib/storageService';
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MessageCircle, 
  Video,
  Mic,
  FileText,
  Clock,
  CheckCircle,
  Send,
  Upload,
  X,
  User,
  Camera,
  Image
} from 'lucide-react';

const StudentRequests = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestType, setRequestType] = useState<'text' | 'video' | 'audio' | 'image'>('text');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium',
    title: '',
    description: '',
    fileUrl: '',
    fileName: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography'];

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      
      // Validate file based on request type
      let allowedTypes: string[] = [];
      let maxSize = 10; // MB
      
      switch (requestType) {
        case 'image':
          allowedTypes = FILE_TYPES.IMAGES;
          maxSize = 5;
          break;
        case 'video':
          allowedTypes = FILE_TYPES.VIDEOS;
          maxSize = 50;
          break;
        case 'audio':
          allowedTypes = FILE_TYPES.AUDIO;
          maxSize = 20;
          break;
        default:
          allowedTypes = [...FILE_TYPES.IMAGES, ...FILE_TYPES.DOCUMENTS];
      }
      
      const validation = StorageService.validateFile(file, allowedTypes, maxSize);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file');
        setSelectedFile(null);
        return;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.subject || !formData.title || (!formData.description && !selectedFile)) {
      setUploadError('Please fill in all required fields');
      return;
    }

    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUploadError('You must be logged in to submit a help request');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let fileUrl = '';
      let fileName = '';

      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(25);
        const uploadResult = await StorageService.uploadHelpRequestFile(
          selectedFile,
          currentUser.uid, // Use actual authenticated user ID
          requestType
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'File upload failed');
        }

        fileUrl = uploadResult.downloadURL || '';
        fileName = uploadResult.fileName || '';
        setUploadProgress(75);
      }

      // Save request to Firestore
      await addDoc(collection(db, 'helpRequests'), {
        ...formData,
        fileUrl,
        fileName,
        requestType,
        status: 'pending',
        createdAt: serverTimestamp(),
        studentId: currentUser.uid // Use actual authenticated user ID
      });

      setUploadProgress(100);
      
      // Reset form
      setFormData({
        subject: '',
        priority: 'medium',
        title: '',
        description: '',
        fileUrl: '',
        fileName: ''
      });
      setSelectedFile(null);
      setShowNewRequest(false);
      
      alert('Help request submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting request:', error);
      setUploadError(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      subject: '',
      priority: 'medium',
      title: '',
      description: '',
      fileUrl: '',
      fileName: ''
    });
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <StudentLayout>
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Help Requests</h1>
              <p className="text-forest-light mt-1">Get help from volunteer tutors</p>
            </div>
            <Button
              onClick={() => setShowNewRequest(true)}
              className="bg-white text-forest-primary hover:bg-forest-light shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* New Request Form */}
        {showNewRequest && (
          <Card className="mb-6 border-2 border-orange-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-orange-700">Submit New Help Request</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNewRequest(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Request Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Request Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant={requestType === 'text' ? 'default' : 'outline'}
                    onClick={() => setRequestType('text')}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Text
                  </Button>
                  <Button
                    variant={requestType === 'video' ? 'default' : 'outline'}
                    onClick={() => setRequestType('video')}
                    className="flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Video
                  </Button>
                  <Button
                    variant={requestType === 'audio' ? 'default' : 'outline'}
                    onClick={() => setRequestType('audio')}
                    className="flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Audio
                  </Button>
                  <Button
                    variant={requestType === 'image' ? 'default' : 'outline'}
                    onClick={() => setRequestType('image')}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Image
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject *</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <Input 
                  placeholder="Brief title for your question" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Dynamic Content Based on Request Type */}
              {requestType === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Describe your question *</label>
                  <Textarea 
                    placeholder="Explain what you need help with in detail..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              )}

              {requestType === 'video' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Upload Video File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Upload a video file (MP4, WebM, OGG - max 50MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Choose Video File
                    </Button>
                    {selectedFile && (
                      <div className="mt-3 p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-700">
                          Selected: <strong>{selectedFile.name}</strong> ({StorageService.formatFileSize(selectedFile.size)})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {requestType === 'audio' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Upload Audio File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Upload an audio file (MP3, WAV, OGG - max 20MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Choose Audio File
                    </Button>
                    {selectedFile && (
                      <div className="mt-3 p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-700">
                          Selected: <strong>{selectedFile.name}</strong> ({StorageService.formatFileSize(selectedFile.size)})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {requestType === 'image' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Upload Image *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Upload an image (JPEG, PNG, GIF, WebP - max 5MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      Choose Image
                    </Button>
                    {selectedFile && (
                      <div className="mt-3 p-2 bg-gray-100 rounded">
                        <p className="text-sm text-gray-700">
                          Selected: <strong>{selectedFile.name}</strong> ({StorageService.formatFileSize(selectedFile.size)})
                        </p>
                      </div>
                    )}
                  </div>
                  <Textarea 
                    placeholder="Add context or explanation for your image..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              )}

              {/* Error Display */}
              {uploadError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Progress Bar */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewRequest(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Requests Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Request 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">Help with Quadratic Equations</CardTitle>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <Badge className="bg-blue-100 text-blue-800">Mathematics</Badge>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Answered
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Text
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                I'm struggling to understand how to solve quadratic equations using the quadratic formula...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tutor: Sarah Johnson</span>
                <span>2 days ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Sample Request 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">Newton's Laws Confusion</CardTitle>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <Badge className="bg-purple-100 text-purple-800">Physical Sciences</Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      <User className="h-3 w-3 mr-1" />
                      Assigned
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                I need help understanding the relationship between Newton's three laws of motion...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tutor: Michael Smith</span>
                <span>1 day ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Sample Request 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">Grammar Question</CardTitle>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <Badge className="bg-green-100 text-green-800">English</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      <Camera className="h-3 w-3 mr-1" />
                      Image
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Can someone help me understand when to use "affect" vs "effect"?
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Waiting for tutor</span>
                <span>3 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Information */}
        <Card className="mt-6 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-700">How to Get Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Text Questions:</strong> Type your question for written responses</p>
              <p>• <strong>Video Questions:</strong> Record yourself explaining the problem</p>
              <p>• <strong>Audio Questions:</strong> Record voice questions for audio responses</p>
              <p>• <strong>Image Questions:</strong> Take photos of homework or textbook problems</p>
              <p>• Response time is typically 24-48 hours</p>
              <p>• Be specific and include relevant context for better help</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentRequests;