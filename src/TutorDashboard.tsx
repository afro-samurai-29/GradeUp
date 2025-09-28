import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Heart,
  Award,
  TrendingUp
} from 'lucide-react';

const TutorDashboard = () => {
  const quickActions = [
    { icon: MessageCircle, label: "Help Requests", href: "/tutor/requests", color: "bg-forest-primary", description: "View and respond to student questions", count: "5 pending" },
    { icon: User, label: "My Profile", href: "/tutor/profile", color: "bg-forest-primary", description: "Manage your tutoring profile and subjects" },
    { icon: BookOpen, label: "Resources", href: "/tutor/resources", color: "bg-forest-primary", description: "Access teaching materials and guides" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
              <p className="text-forest-light">Welcome back, Sarah! Thank you for volunteering your time to help students succeed.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">47</div>
              <div className="text-sm text-forest-light">Students Helped</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-forest-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">35</div>
              <div className="text-sm text-gray-600">Requests Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-forest-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-forest-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">2.5h</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                      {action.count && (
                        <Badge className="mt-2 bg-forest-light text-forest-primary">
                          {action.count}
                        </Badge>
                      )}
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
            <CardTitle>Recent Help Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="bg-forest-light p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 text-forest-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Help with Quadratic Equations</h4>
                    <Badge className="bg-forest-light text-forest-primary">Pending</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Mathematics • Student: John D.</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="bg-forest-light p-2 rounded-full">
                  <User className="h-4 w-4 text-forest-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Physics Motion Problems</h4>
                    <Badge className="bg-forest-light text-forest-primary">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Physical Sciences • Student: Maria S.</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="bg-forest-light p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-forest-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">English Essay Structure</h4>
                    <Badge className="bg-forest-light text-forest-primary">Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">English • Student: David M.</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago • ⭐ 5.0 rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact & Recognition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-forest-secondary" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Students helped this month</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total study hours supported</span>
                  <span className="font-semibold">47h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Positive feedback rate</span>
                  <span className="font-semibold">96%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-forest-light rounded-lg">
                <p className="text-sm text-forest-primary">
                  🎉 You're in the top 10% of active tutors this month!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-forest-primary" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-forest-light rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-semibold">Maria S.</span>
                    <div className="ml-auto text-forest-secondary">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-sm text-gray-600">"Sarah explained physics so clearly! Finally understand momentum."</p>
                </div>
                <div className="p-3 bg-forest-light rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-semibold">John D.</span>
                    <div className="ml-auto text-forest-secondary">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-sm text-gray-600">"Patient and helpful. Made math actually make sense!"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;