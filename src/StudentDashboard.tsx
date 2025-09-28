import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StudentNavbar from '@/components/StudentNavbar';
import { 
  BookOpen, 
  FileText, 
  User, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Users,
  Star
} from 'lucide-react';

const StudentDashboard = () => {
  const quickActions = [
    { icon: BookOpen, label: "Study Notes", href: "/student/notes", color: "bg-blue-500", description: "Access your study materials and notes" },
    { icon: FileText, label: "Past Papers", href: "/student/past-papers", color: "bg-green-500", description: "Download previous exam papers and memos" },
    { icon: MessageCircle, label: "Help Requests", href: "/student/requests", color: "bg-purple-500", description: "Ask questions and get help from tutors" },
    { icon: User, label: "My Profile", href: "/student/profile", color: "bg-orange-500", description: "Manage your profile and preferences" },
  ];

  const recentActivity = [
    { type: "note", subject: "Mathematics", title: "Calculus Integration", time: "2 hours ago" },
    { type: "paper", subject: "Physics", title: "Downloaded 2023 Paper 1", time: "1 day ago" },
    { type: "request", subject: "Chemistry", title: "Asked about Organic Reactions", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-forest-light mt-1">Welcome back! Ready to continue your learning journey?</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">4.2</div>
              <div className="text-sm text-forest-light">Average Grade</div>
            </div>
          </div>
        </div>
      </div>

      <StudentNavbar />

      <div className="lg:ml-0 max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">Study Notes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">8</div>
              <div className="text-sm text-gray-600">Past Papers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">3</div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">24h</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* Quick Actions (removed '+ New Note' button) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`bg-forest-primary p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {activity.type === 'note' && <BookOpen className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'paper' && <FileText className="h-4 w-4 text-green-600" />}
                    {activity.type === 'request' && <MessageCircle className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <Badge variant="outline">{activity.subject}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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

export default StudentDashboard;