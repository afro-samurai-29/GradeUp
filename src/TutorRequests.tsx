import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { auth } from './firebase';
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Video,
  Mic,
  Clock,
  User,
  Send,
  Eye
} from 'lucide-react';

const TutorRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // For now, we'll use mock data since we don't have a requests collection yet
        // In a real app, you'd fetch from a 'requests' collection
        const mockRequests = [
          {
            id: '1',
            title: 'Quadratic Equations Help',
            subject: 'Mathematics',
            studentName: 'John D.',
            studentId: 'student1',
            status: 'pending',
            priority: 'high',
            timeAgo: '2h ago',
            description: 'I\'m struggling to understand how to solve quadratic equations using the quadratic formula. Could someone explain the steps and maybe provide a simple example?',
            type: 'text',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          },
          {
            id: '2',
            title: 'Physics Motion Problems',
            subject: 'Physical Sciences',
            studentName: 'Sarah M.',
            studentId: 'student2',
            status: 'pending',
            priority: 'medium',
            timeAgo: '4h ago',
            description: 'Need help with projectile motion calculations. I understand the theory but struggle with the math.',
            type: 'video',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
          },
          {
            id: '3',
            title: 'English Essay Structure',
            subject: 'English',
            studentName: 'David M.',
            studentId: 'student3',
            status: 'completed',
            priority: 'low',
            timeAgo: '1 day ago',
            description: 'Help with structuring argumentative essays for matric exams.',
            type: 'text',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            id: '4',
            title: 'Chemistry Balancing Equations',
            subject: 'Physical Sciences',
            studentName: 'Lisa K.',
            studentId: 'student4',
            status: 'pending',
            priority: 'high',
            timeAgo: '6h ago',
            description: 'Struggling with balancing chemical equations, especially with complex molecules.',
            type: 'text',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
          }
        ];

        setRequests(mockRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSendResponse = async () => {
    if (!selectedRequest || !response.trim()) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Create a response document (you might want to create a responses collection)
      const responseData = {
        requestId: selectedRequest,
        tutorId: user.uid,
        response: response.trim(),
        createdAt: new Date(),
        status: 'sent'
      };

      // For now, just show success message
      alert('Response sent successfully!');
      setResponse('');
      setSelectedRequest(null);

      // In a real app, you'd save this to Firestore:
      // await addDoc(collection(db, 'responses'), responseData);
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response');
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const selectedRequestData = requests.find(req => req.id === selectedRequest);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/tutor" className="hover:bg-blue-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Help Requests</h1>
              <p className="text-blue-100">Review and respond to student questions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests ({pendingRequests.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading requests...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No pending requests</div>
              ) : (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedRequest === request.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{request.title}</h4>
                      <Badge className={`${request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.studentName}
                      </span>
                      <span className="flex items-center gap-1">
                        {request.type === 'video' ? <Video className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                        {request.type === 'video' ? 'Video' : 'Text'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {request.timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{request.subject} • {request.description.substring(0, 100)}...</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRequestData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRequestData.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge>{selectedRequestData.subject}</Badge>
                      <Badge variant="outline">
                        {selectedRequestData.priority.charAt(0).toUpperCase() + selectedRequestData.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700">{selectedRequestData.description}</p>
                  </div>
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Your Response</label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your helpful response here..."
                      rows={6}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleSendResponse}
                        className="flex-1"
                        disabled={!response.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a request to view details and respond
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorRequests;