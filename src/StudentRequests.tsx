import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import StudentNavbar from '@/components/StudentNavbar';
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

  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Help Requests</h1>
              <p className="text-green-100 mt-1">Get help from volunteer tutors</p>
            </div>
            <Button 
              onClick={() => setShowNewRequest(true)}
              className="bg-white text-green-600 hover:bg-green-50 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </div>

      <StudentNavbar />

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
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <select className="w-full px-3 py-2 border rounded-md bg-background">
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border rounded-md bg-background">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input placeholder="Brief title for your question" />
              </div>

              {/* Dynamic Content Based on Request Type */}
              {requestType === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Describe your question</label>
                  <Textarea 
                    placeholder="Explain what you need help with in detail..."
                    rows={4}
                  />
                </div>
              )}

              {requestType === 'video' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Record or Upload Video</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Record a video question or upload a video file</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Record Video
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {requestType === 'audio' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Record or Upload Audio</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Record an audio question or upload an audio file</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        Record Audio
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {requestType === 'image' && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Take a photo of your question or upload an image</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                  <Textarea 
                    placeholder="Add context or explanation for your image..."
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewRequest(false)}
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
    </div>
  );
};

export default StudentRequests;