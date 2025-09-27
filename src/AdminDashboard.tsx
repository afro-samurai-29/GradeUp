import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  BarChart3, 
  MessageCircle, 
  User,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const quickActions = [
    { icon: Users, label: "Manage Users", href: "/admin/users", color: "bg-blue-500", description: "Handle student and tutor accounts" },
    { icon: FileText, label: "Content", href: "/admin/content", color: "bg-green-500", description: "Upload and manage study materials" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics", color: "bg-purple-500", description: "Track platform usage and success rates" },
    { icon: MessageCircle, label: "Support", href: "/admin/support", color: "bg-orange-500", description: "Handle user queries and issues" },
    { icon: User, label: "Profile", href: "/admin/profile", color: "bg-pink-500", description: "Admin account settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Platform overview and management tools</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-6 text-center"><Users className="h-8 w-8 text-blue-600 mx-auto mb-2" /><div className="text-2xl font-bold">1,247</div><div className="text-sm text-gray-600">Total Students</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><User className="h-8 w-8 text-green-600 mx-auto mb-2" /><div className="text-2xl font-bold">89</div><div className="text-sm text-gray-600">Active Tutors</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><MessageCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" /><div className="text-2xl font-bold">156</div><div className="text-sm text-gray-600">Help Requests</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" /><div className="text-2xl font-bold">73%</div><div className="text-sm text-gray-600">Success Rate</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href} className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-gray-800 transition-colors">{action.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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