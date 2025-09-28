import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Upload, FileText, Download, Trash2, Calendar, BookOpen } from 'lucide-react';
import { db, storage } from '@/firebaseConfig';
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: any;
  fileSize: number;
}

const AdminPastPapers: React.FC = () => {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    subject: '',
    year: ''
  });

  const availableSubjects = [
    'Mathematics',
    'English',
    'Physical Sciences',
    'Life Sciences',
    'Geography',
    'History',
    'Business Studies',
    'Economics',
    'Accounting',
    'Information Technology'
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    const q = query(collection(db, 'pastPapers'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const papers: PastPaper[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          subject: data.subject || '',
          year: data.year || '',
          fileName: data.fileName || '',
          fileUrl: data.fileUrl || '',
          uploadedAt: data.uploadedAt,
          fileSize: data.fileSize || 0
        };
      });
      setPastPapers(papers);
    });

    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title from filename if not set
      if (!uploadData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setUploadData(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title || !uploadData.subject || !uploadData.year) {
      alert('Please fill in all fields and select a file');
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to Firebase Storage
      const fileName = `${uploadData.subject}_${uploadData.year}_${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `past-papers/${fileName}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save metadata to Firestore
      await addDoc(collection(db, 'pastPapers'), {
        title: uploadData.title,
        subject: uploadData.subject,
        year: uploadData.year,
        fileName: selectedFile.name,
        fileUrl: downloadURL,
        fileSize: selectedFile.size,
        uploadedAt: serverTimestamp()
      });

      // Reset form
      setUploadData({ title: '', subject: '', year: '' });
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      alert('Past paper uploaded successfully!');
    } catch (error) {
      console.error('Error uploading past paper:', error);
      alert('Error uploading past paper. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (paper: PastPaper) => {
    if (!confirm(`Are you sure you want to delete "${paper.title}"?`)) return;

    try {
      // Delete file from Storage
      const fileRef = ref(storage, paper.fileUrl);
      await deleteObject(fileRef);

      // Delete document from Firestore
      await deleteDoc(doc(db, 'pastPapers', paper.id));
    } catch (error) {
      console.error('Error deleting past paper:', error);
      alert('Error deleting past paper. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Past Papers Management</h1>
          <p className="text-forest-light">Upload and manage past examination papers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-forest-primary" />
              Upload New Past Paper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Paper 1"
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={uploadData.subject} onValueChange={(value) => setUploadData(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={uploadData.year} onValueChange={(value) => setUploadData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file-upload">File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest-primary file:text-white hover:file:bg-forest-secondary"
                />
              </div>
            </div>
            {selectedFile && (
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                </p>
              </div>
            )}
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || !selectedFile}
              className="bg-forest-primary text-white hover:bg-forest-secondary"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Past Paper
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Past Papers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-forest-primary" />
              All Past Papers ({pastPapers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastPapers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No past papers uploaded yet</p>
                <p className="text-sm">Upload your first past paper using the form above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastPapers.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{paper.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {paper.subject}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {paper.year}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-3">
                        <p><strong>File:</strong> {paper.fileName}</p>
                        <p><strong>Size:</strong> {formatFileSize(paper.fileSize)}</p>
                        <p><strong>Uploaded:</strong> {paper.uploadedAt?.toDate ? paper.uploadedAt.toDate().toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(paper.fileUrl, '_blank')}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(paper)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPastPapers;
