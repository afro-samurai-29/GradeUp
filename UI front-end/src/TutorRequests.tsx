import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
              <Input placeholder="Search requests..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests (5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setSelectedRequest('1')}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Quadratic Equations Help</h4>
                  <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    John D.
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Text
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    2h ago
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Mathematics • I'm struggling with the quadratic formula...</p>
              </div>

              <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Physics Motion Problems</h4>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Sarah M.
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    Video
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    4h ago
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Physical Sciences • Need help with projectile motion...</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRequest ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Quadratic Equations Help</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge>Mathematics</Badge>
                      <Badge variant="outline">High Priority</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      I'm struggling to understand how to solve quadratic equations using the quadratic formula. 
                      Could someone explain the steps and maybe provide a simple example?
                    </p>
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
                      <Button className="flex-1">
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