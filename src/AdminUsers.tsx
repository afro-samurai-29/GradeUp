import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Users, User, Eye, Clock, Loader2 } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'learner' | 'tutor' | 'admin';
  createdAt: any;
  lastActive?: string;
}

const AdminUsers = () => {
  const [userType, setUserType] = useState<'all' | 'students' | 'tutors'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real users from Firebase
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          role: data.role || 'learner',
          createdAt: data.createdAt,
          lastActive: data.lastActive || 'Unknown'
        };
      });
      setUsers(userData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map Firebase roles to our filter types
    let userTypeMatch = false;
    if (userType === 'all') {
      userTypeMatch = true;
    } else if (userType === 'students' && user.role === 'learner') {
      userTypeMatch = true;
    } else if (userType === 'tutors' && user.role === 'tutor') {
      userTypeMatch = true;
    }
    
    return matchesSearch && userTypeMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-forest-light">Monitor and manage all student and tutor accounts</p>
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
                <Input 
                  placeholder="Search users..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={userType === 'all' ? 'default' : 'outline'} 
                  onClick={() => setUserType('all')}
                  className={userType === 'all' ? 'bg-forest-primary text-white' : ''}
                >
                  All ({users.length})
                </Button>
                <Button 
                  variant={userType === 'students' ? 'default' : 'outline'} 
                  onClick={() => setUserType('students')}
                  className={userType === 'students' ? 'bg-forest-primary text-white' : ''}
                >
                  Students ({users.filter(u => u.role === 'learner').length})
                </Button>
                <Button 
                  variant={userType === 'tutors' ? 'default' : 'outline'} 
                  onClick={() => setUserType('tutors')}
                  className={userType === 'tutors' ? 'bg-forest-primary text-white' : ''}
                >
                  Tutors ({users.filter(u => u.role === 'tutor').length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-forest-primary" />
              All Accounts ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-forest-primary" />
                <span className="ml-2 text-forest-primary">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-forest-primary">
                <Users className="h-12 w-12 mx-auto mb-4 text-forest-primary" />
                <p>No users found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${user.role === 'learner' ? 'bg-forest-100' : 'bg-forest-100'}`}>
                        {user.role === 'learner' ? <Users className="h-4 w-4 text-forest-primary" /> : <User className="h-4 w-4 text-forest-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-forest-primary">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-forest-primary" />
                          <span className="text-xs text-forest-primary">
                            Joined: {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === 'learner' ? 'default' : 'secondary'} className={user.role === 'learner' ? 'bg-forest-primary text-white' : 'bg-forest-100 text-forest-primary'}>
                        {user.role === 'learner' ? 'Student' : 'Tutor'}
                      </Badge>
                      <Badge variant="outline" className="text-forest-primary border-forest-primary">
                        Active
                      </Badge>
                      <Link to={`${user.role === 'learner' ? '/student' : '/tutor'}?adminView=true&userId=${user.id}&userName=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}`}>
                        <Button size="sm" className="bg-forest-primary text-white hover:bg-forest-secondary">
                          <Eye className="h-4 w-4 mr-1" />
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;