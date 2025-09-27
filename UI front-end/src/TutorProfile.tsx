import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  BookOpen,
  Edit,
  Save,
  X,
  Plus,
  Award
} from 'lucide-react';

const TutorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/tutor" className="hover:bg-purple-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Tutor Profile</h1>
              <p className="text-purple-100">Manage your qualifications and availability</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-purple-600 hover:bg-purple-50"
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
                {isEditing ? <Input defaultValue="Sarah Johnson" /> : <p className="p-2 bg-gray-50 rounded">Sarah Johnson</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? <Input defaultValue="sarah.j@email.com" /> : <p className="p-2 bg-gray-50 rounded">sarah.j@email.com</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              {isEditing ? (
                <Textarea defaultValue="Mathematics teacher with 10+ years experience..." rows={3} />
              ) : (
                <p className="p-2 bg-gray-50 rounded">Mathematics teacher with 10+ years experience helping students succeed.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Subjects I Can Help With
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800">Mathematics</Badge>
              <Badge className="bg-green-100 text-green-800">Physical Sciences</Badge>
              <Badge className="bg-purple-100 text-purple-800">Life Sciences</Badge>
              {isEditing && <Badge variant="outline" className="cursor-pointer"><Plus className="h-3 w-3 mr-1" />Add Subject</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold">Bachelor of Education</h4>
                <p className="text-sm text-gray-600">University of Cape Town • 2012</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold">Mathematics Teaching Diploma</h4>
                <p className="text-sm text-gray-600">Stellenbosch University • 2010</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="p-3 border rounded-lg text-center">
                  <div className="font-semibold">{day}</div>
                  <div className="text-sm text-gray-600">6PM - 9PM</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorProfile;