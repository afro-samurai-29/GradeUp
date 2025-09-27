import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Users, User, Eye, Ban, CheckCircle } from 'lucide-react';

const AdminUsers = () => {
  const [userType, setUserType] = useState<'all' | 'students' | 'tutors'>('all');

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Manage Users</h1>
              <p className="text-gray-300">Handle student and tutor accounts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search users..." className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant={userType === 'all' ? 'default' : 'outline'} onClick={() => setUserType('all')}>All</Button>
                <Button variant={userType === 'students' ? 'default' : 'outline'} onClick={() => setUserType('students')}>Students</Button>
                <Button variant={userType === 'tutors' ? 'default' : 'outline'} onClick={() => setUserType('tutors')}>Tutors</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User List</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Doe', email: 'john@email.com', type: 'Student', status: 'Active', joined: '2024-01-15' },
                { name: 'Sarah Johnson', email: 'sarah@email.com', type: 'Tutor', status: 'Active', joined: '2024-01-10' },
                { name: 'Mike Smith', email: 'mike@email.com', type: 'Student', status: 'Inactive', joined: '2024-01-05' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {user.type === 'Student' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={user.type === 'Student' ? 'default' : 'secondary'}>{user.type}</Badge>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>{user.status}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline"><Ban className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;