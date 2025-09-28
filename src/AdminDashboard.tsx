import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  BarChart3, 
  MessageCircle, 
  User,
  TrendingUp,
  Download,
  AlertCircle,
  BookOpen,
  Clock,
  CheckCircle,
  Heart,
  Star,
  Eye,
  LogOut
} from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const handleLogout = () => {
    navigate('/');
  };

  const quickActions = [
    { icon: Users, label: "Manage Users", href: "/admin/users", color: "bg-forest-primary", description: "Handle student and tutor accounts" },
    { icon: FileText, label: "Content Management", href: "/admin/content", color: "bg-forest-primary", description: "Upload and manage study materials" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics", color: "bg-forest-primary", description: "Track platform usage and success rates" },
    { icon: MessageCircle, label: "Support", href: "/admin/support", color: "bg-forest-primary", description: "Handle user queries and issues" },
    { icon: User, label: "Admin Profile", href: "/admin/profile", color: "bg-forest-primary", description: "Admin account settings" },
  ];

  useEffect(() => {
    // Load all notes for admin view
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || '',
          subject: data.subject || '',
          content: data.content || '',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      });
      setNotes(loaded);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-forest-light">Manage platform content, users, and analytics</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white border-white hover:bg-white hover:text-forest-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-6 text-center"><Users className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">1,247</div><div className="text-sm text-gray-600">Total Students</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><User className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">89</div><div className="text-sm text-gray-600">Active Tutors</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><MessageCircle className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">156</div><div className="text-sm text-gray-600">Help Requests</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><TrendingUp className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">73%</div><div className="text-sm text-gray-600">Success Rate</div></CardContent></Card>
        </div>

        {/* Content Management Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Content Management</h2>
          <Link to="/admin/new-note">
            <Button className="bg-forest-primary text-white hover:bg-forest-secondary">
              + Create New Note
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href} className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">{action.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Study Notes - Admin View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              All Study Notes ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Notes Created</h3>
                <p className="text-muted-foreground mb-4">Create your first study note to get started</p>
                <Link to="/admin/new-note">
                  <Button className="bg-forest-primary hover:bg-forest-secondary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create First Note
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card key={note.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {note.subject}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {note.content.substring(0, 100)}...
                      </div>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Created: {note.createdAt.toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm">New user registration spike detected</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">Monthly active users increased by 23%</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;