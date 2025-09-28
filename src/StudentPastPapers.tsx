import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StudentNavbar from '@/components/StudentNavbar';
import { 
  ArrowLeft, 
  Download, 
  Search, 
  BookOpen, 
  Calendar,
  FileText,
  Star,
  Eye,
  Filter
} from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  uploadedAt: any;
  fileSize: number;
}

const StudentPastPapers = () => {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography', 'Business Studies', 'Economics', 'Accounting', 'Information Technology'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    // Load student subjects (in a real app, this would come from user profile)
    const mockStudentSubjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences'];
    setStudentSubjects(mockStudentSubjects);
  }, []);

  useEffect(() => {
    if (studentSubjects.length === 0) return;

    setIsLoading(true);
    setError(null);

    // Fetch past papers from Firebase
    const q = query(collection(db, 'pastPapers'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const papers: PastPaper[] = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || '',
                subject: data.subject || '',
                year: data.year || '',
                fileName: data.fileName || '',
                fileUrl: data.fileUrl || '',
                storagePath: data.storagePath || '',
                uploadedAt: data.uploadedAt,
                fileSize: data.fileSize || 0
              };
            })
            .filter(paper => studentSubjects.includes(paper.subject));
          setPastPapers(papers);
          setError(null);
        } catch (err) {
          console.error('Error processing past papers:', err);
          setError('Error loading past papers. Please try again.');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching past papers:', error);
        setError('Failed to load past papers. Please check your connection and try again.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [studentSubjects]);

  const filteredPapers = pastPapers.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
    
    return matchesSearch && matchesSubject && matchesYear;
  });

  const handleDownload = (paper: PastPaper) => {
    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = paper.fileUrl;
      link.download = paper.fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to opening in new tab
      window.open(paper.fileUrl, '_blank');
    }
  };

  const handleViewPdf = (paper: PastPaper) => {
    setSelectedPaper(paper);
    setIsPdfViewerOpen(true);
  };

  const isPdfFile = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Past Papers</h1>
              <p className="text-forest-light mt-1">Browse and download previous exam papers</p>
            </div>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-forest-primary hover:bg-forest-light shadow-lg"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <StudentNavbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by subject or paper name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-primary mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Past Papers...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest papers</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Papers</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-forest-primary hover:bg-forest-secondary"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredPapers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Papers Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {paper.title}
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap mb-2">
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
                  <div className="space-y-3">
                    {/* File Info */}
                    <div className="text-sm text-gray-500">
                      <p><strong>File:</strong> {paper.fileName}</p>
                      <p><strong>Size:</strong> {formatFileSize(paper.fileSize)}</p>
                      <p><strong>Uploaded:</strong> {paper.uploadedAt?.toDate ? paper.uploadedAt.toDate().toLocaleDateString() : 'Unknown'}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewPdf(paper)}
                        className="flex-1 bg-forest-primary hover:bg-forest-secondary"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isPdfFile(paper.fileName) ? 'View PDF' : 'View File'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(paper)}
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-6 border-l-4 border-l-forest-primary">
          <CardHeader>
            <CardTitle className="text-forest-primary">Download Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Past Papers:</strong> Previous examination papers uploaded by administrators</p>
              <p>• <strong>File Types:</strong> PDF, DOC, and DOCX formats supported</p>
              <p>• <strong>View PDF:</strong> Click "View PDF" to read papers directly on the site</p>
              <p>• <strong>Download:</strong> Click the download icon to save files to your device</p>
              <p>• <strong>Full Screen:</strong> Use the PDF viewer controls to zoom, search, and navigate</p>
              <p>• Only papers for your enrolled subjects are shown</p>
            </div>
          </CardContent>
        </Card>

        {/* PDF Viewer Modal */}
        <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-forest-primary" />
                {selectedPaper?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {selectedPaper?.subject}
                </Badge>
                <Badge variant="outline" className="text-xs text-forest-primary border-forest-primary">
                  {selectedPaper?.year}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Uploaded: {selectedPaper ? (selectedPaper.uploadedAt?.toDate ? selectedPaper.uploadedAt.toDate().toLocaleDateString() : 'Unknown') : ''}
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {selectedPaper && (
                <div className="h-full w-full">
                  {isPdfFile(selectedPaper.fileName) ? (
                    <iframe
                      src={`${selectedPaper.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      className="w-full h-full border-0 rounded-lg"
                      title={selectedPaper.title}
                      style={{ minHeight: '600px' }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Preview Not Available</h3>
                        <p className="text-gray-500 mb-4">
                          This file type ({selectedPaper.fileName.split('.').pop()?.toUpperCase()}) cannot be previewed in the browser.
                        </p>
                        <Button
                          onClick={() => selectedPaper && handleDownload(selectedPaper)}
                          className="bg-forest-primary hover:bg-forest-secondary"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download to View
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                File: {selectedPaper?.fileName} • Size: {selectedPaper ? formatFileSize(selectedPaper.fileSize) : ''}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => selectedPaper && handleDownload(selectedPaper)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => setIsPdfViewerOpen(false)}
                  className="bg-forest-primary hover:bg-forest-secondary"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentPastPapers;