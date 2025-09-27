import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Users, Download, MessageCircle } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-gray-300">Track platform usage and success rates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-6 text-center"><Users className="h-8 w-8 text-blue-600 mx-auto mb-2" /><div className="text-2xl font-bold">1,247</div><div className="text-sm text-gray-600">Total Users</div><div className="text-xs text-green-600">+23% this month</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><Download className="h-8 w-8 text-green-600 mx-auto mb-2" /><div className="text-2xl font-bold">5,689</div><div className="text-sm text-gray-600">Downloads</div><div className="text-xs text-green-600">+18% this month</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><MessageCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" /><div className="text-2xl font-bold">892</div><div className="text-sm text-gray-600">Help Requests</div><div className="text-xs text-green-600">+12% this month</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" /><div className="text-2xl font-bold">73%</div><div className="text-sm text-gray-600">Success Rate</div><div className="text-xs text-green-600">+5% this month</div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Popular Subjects</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics', users: 456, percentage: 85 },
                  { subject: 'English', users: 398, percentage: 72 },
                  { subject: 'Physical Sciences', users: 289, percentage: 58 },
                  { subject: 'Life Sciences', users: 234, percentage: 45 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{item.subject}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{item.users} users</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>User Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Daily Active Users</span>
                  <span className="font-bold">324</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Weekly Active Users</span>
                  <span className="font-bold">1,156</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Monthly Active Users</span>
                  <span className="font-bold">2,847</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Avg Session Duration</span>
                  <span className="font-bold">24 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;