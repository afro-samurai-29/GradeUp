import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

interface PastPaper {
  id: string;
  subject: string;
  year: number;
  paper: string;
  type: 'exam' | 'memo' | 'supplementary';
  term?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  downloadCount: number;
  rating: number;
  fileSize: string;
  addedDate: string;
}

const StudentPastPapers = () => {
  const [pastPapers] = useState<PastPaper[]>([
    {
      id: '1',
      subject: 'Mathematics',
      year: 2023,
      paper: 'Paper 1',
      type: 'exam',
      term: 'November',
      difficulty: 'hard',
      downloadCount: 1247,
      rating: 4.5,
      fileSize: '2.3 MB',
      addedDate: '2024-01-15'
    },
    {
      id: '2',
      subject: 'Mathematics',
      year: 2023,
      paper: 'Paper 1 Memo',
      type: 'memo',
      term: 'November',
      difficulty: 'medium',
      downloadCount: 1156,
      rating: 4.7,
      fileSize: '1.8 MB',
      addedDate: '2024-01-15'
    },
    {
      id: '3',
      subject: 'English',
      year: 2023,
      paper: 'Paper 1',
      type: 'exam',
      term: 'November',
      difficulty: 'medium',
      downloadCount: 892,
      rating: 4.2,
      fileSize: '1.5 MB',
      addedDate: '2024-01-12'
    },
    {
      id: '4',
      subject: 'Physical Sciences',
      year: 2023,
      paper: 'Paper 1',
      type: 'exam',
      term: 'November',
      difficulty: 'hard',
      downloadCount: 734,
      rating: 4.4,
      fileSize: '2.7 MB',
      addedDate: '2024-01-10'
    },
    {
      id: '5',
      subject: 'Life Sciences',
      year: 2023,
      paper: 'Paper 1',
      type: 'exam',
      term: 'November',
      difficulty: 'medium',
      downloadCount: 623,
      rating: 4.3,
      fileSize: '2.1 MB',
      addedDate: '2024-01-08'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography'];
  const years = [2023, 2022, 2021, 2020, 2019];
  const types = [
    { value: 'exam', label: 'Exam Papers' },
    { value: 'memo', label: 'Memorandums' },
    { value: 'supplementary', label: 'Supplementary' }
  ];

  const filteredPapers = pastPapers.filter(paper => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.paper.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
    const matchesType = selectedType === 'all' || paper.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesYear && matchesType;
  });

  const handleDownload = (paperId: string) => {
    const paper = pastPapers.find(p => p.id === paperId);
    if (paper) {
      alert(`Downloading: ${paper.subject} ${paper.year} ${paper.paper}`);
      // In real app, this would trigger actual download
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-blue-100 text-blue-800';
      case 'memo': return 'bg-purple-100 text-purple-800';
      case 'supplementary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Past Papers</h1>
              <p className="text-green-100 mt-1">Browse and download previous exam papers</p>
            </div>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white text-green-600 hover:bg-green-50 shadow-lg"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
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
                        <option key={year} value={year.toString()}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="all">All Types</option>
                      {types.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
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
        {filteredPapers.length === 0 ? (
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
                        {paper.subject} {paper.year}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{paper.paper}</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getTypeColor(paper.type)}>
                          {paper.type === 'exam' ? 'Exam' : paper.type === 'memo' ? 'Memo' : 'Supplementary'}
                        </Badge>
                        <Badge className={getDifficultyColor(paper.difficulty)}>
                          {paper.difficulty}
                        </Badge>
                        {paper.term && (
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {paper.term}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {paper.downloadCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {paper.rating}
                        </span>
                      </div>
                      <span className="text-xs">{paper.fileSize}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDownload(paper.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Added: {new Date(paper.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-6 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-700">Download Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Exam Papers:</strong> Original question papers from previous years</p>
              <p>• <strong>Memos:</strong> Official marking guidelines and solutions</p>
              <p>• <strong>Supplementary:</strong> Additional exam papers from supplementary exams</p>
              <p>• All papers are in PDF format and require a PDF reader to view</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPastPapers;