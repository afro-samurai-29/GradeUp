import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle, AlertCircle, CheckCircle, Clock, Send } from 'lucide-react';

const AdminSupport = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Support Center</h1>
              <p className="text-forest-light">Handle user queries and platform issues</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: '1', user: 'John Doe', issue: 'Cannot upload notes', status: 'open', priority: 'high', time: '2h ago' },
                { id: '2', user: 'Sarah M.', issue: 'Login problems', status: 'pending', priority: 'medium', time: '4h ago' },
                { id: '3', user: 'Mike S.', issue: 'Past paper not downloading', status: 'resolved', priority: 'low', time: '1d ago' }
              ].map((ticket) => (
                <div key={ticket.id} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => setSelectedTicket(ticket.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{ticket.issue}</h4>
                    <div className="flex gap-2">
                      <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant={ticket.status === 'open' ? 'destructive' : ticket.status === 'pending' ? 'default' : 'secondary'}>
                        {ticket.status === 'open' ? <AlertCircle className="h-3 w-3 mr-1" /> : 
                         ticket.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> : 
                         <CheckCircle className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">User: {ticket.user} • {ticket.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ticket Details</CardTitle></CardHeader>
            <CardContent>
              {selectedTicket ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Cannot upload notes</h3>
                    <p className="text-sm text-gray-600">User: John Doe • 2 hours ago</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm">"Hi, I'm trying to upload my study notes but the upload button doesn't seem to work. I've tried refreshing the page but the issue persists."</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Response</label>
                    <Textarea placeholder="Type your response here..." rows={4} />
                    <Button className="mt-2 bg-forest-primary hover:bg-forest-secondary">
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">Select a ticket to view details</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;