import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Shield, Edit, Save } from 'lucide-react';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Admin Profile</h1>
              <p className="text-gray-300">Manage your administrator account</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-gray-800 hover:bg-gray-100"
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                {isEditing ? <Input defaultValue="Admin User" /> : <p className="p-2 bg-gray-50 rounded">Admin User</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? <Input defaultValue="admin@gradeup.co.za" /> : <p className="p-2 bg-gray-50 rounded">admin@gradeup.co.za</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Permissions & Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800">Super Administrator</h3>
                <p className="text-sm text-green-700">Full access to all platform features and settings</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['User Management', 'Content Management', 'Analytics', 'Support Center', 'System Settings', 'Backup & Recovery'].map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
              <Button variant="outline" className="w-full md:w-auto">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;