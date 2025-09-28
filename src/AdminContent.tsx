import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, FileText, Trash2, Eye, Plus } from 'lucide-react';

const AdminContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Content Management</h1>
              <p className="text-forest-light">Upload and manage study materials</p>
            </div>
          </div>
          <Button className="bg-white text-forest-primary hover:bg-gray-100">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Upload className="h-12 w-12 text-forest-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Upload Past Papers</h3>
              <p className="text-sm text-gray-600 mb-4">Add exam papers by subject and year</p>
              <Button className="w-full bg-forest-primary hover:bg-forest-secondary">Upload Papers</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-forest-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Study Materials</h3>
              <p className="text-sm text-gray-600 mb-4">Add notes and study guides</p>
              <Button className="w-full bg-forest-primary hover:bg-forest-secondary">Add Materials</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Upload className="h-12 w-12 text-forest-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Bulk Upload</h3>
              <p className="text-sm text-gray-600 mb-4">Upload multiple files at once</p>
              <Button className="w-full bg-forest-primary hover:bg-forest-secondary">Bulk Upload</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Uploads</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Mathematics Paper 1 - 2023', type: 'Past Paper', size: '2.3 MB', date: '2024-01-15' },
                { name: 'Physical Sciences Notes', type: 'Study Material', size: '1.8 MB', date: '2024-01-14' },
                { name: 'English Paper 2 - 2022', type: 'Past Paper', size: '1.9 MB', date: '2024-01-13' }
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{file.name}</h3>
                      <p className="text-sm text-gray-600">{file.type} • {file.size} • {file.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /></Button>
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

export default AdminContent;