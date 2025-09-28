import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import StudentNavbar from '@/components/StudentNavbar';
import { 
  ArrowLeft, 
  Play, 
  Search, 
  BookOpen, 
  Calendar,
  ExternalLink,
  Filter
} from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

interface YouTubeVideo {
  id: string;
  title: string;
  subject: string;
  youtubeUrl: string;
  videoId: string;
  description: string;
  uploadedAt: any;
  duration?: string;
  thumbnail?: string;
}

const StudentYouTubeVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography', 'Business Studies', 'Economics', 'Accounting', 'Information Technology'];

  useEffect(() => {
    // Load student subjects (in a real app, this would come from user profile)
    const mockStudentSubjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences'];
    setStudentSubjects(mockStudentSubjects);
  }, []);

  useEffect(() => {
    if (studentSubjects.length === 0) return;

    // Fetch YouTube videos from Firebase
    const q = query(collection(db, 'youtubeVideos'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoList: YouTubeVideo[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            subject: data.subject || '',
            youtubeUrl: data.youtubeUrl || '',
            videoId: data.videoId || '',
            description: data.description || '',
            uploadedAt: data.uploadedAt,
            duration: data.duration || '',
            thumbnail: data.thumbnail || ''
          };
        })
        .filter(video => studentSubjects.includes(video.subject));
      setVideos(videoList);
    });

    return () => unsubscribe();
  }, [studentSubjects]);

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const openVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Educational Videos</h1>
              <p className="text-forest-light mt-1">Watch educational content from YouTube</p>
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
                  placeholder="Search videos by title or description..."
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Videos Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => openVideo(video)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-forest-primary transition-colors line-clamp-2">
                        {video.title}
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {video.subject}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Video Thumbnail */}
                  <div className="mb-3 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=Video+Thumbnail';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Added: {video.uploadedAt?.toDate ? video.uploadedAt.toDate().toLocaleDateString() : 'Unknown'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                <Button variant="ghost" onClick={closeVideo}>
                  ×
                </Button>
              </div>
              <div className="p-4">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {selectedVideo.subject}
                    </Badge>
                  </div>
                  {selectedVideo.description && (
                    <p className="text-sm text-gray-600">{selectedVideo.description}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => window.open(selectedVideo.youtubeUrl, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in YouTube
                    </Button>
                    <Button onClick={closeVideo} className="flex-1">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-6 border-l-4 border-l-forest-primary">
          <CardHeader>
            <CardTitle className="text-forest-primary">Video Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Click any video</strong> to watch it in an embedded player</p>
              <p>• <strong>Full screen:</strong> Click the fullscreen button in the video player</p>
              <p>• <strong>YouTube:</strong> Click "Open in YouTube" to watch on YouTube directly</p>
              <p>• <strong>Subjects:</strong> Only videos for your enrolled subjects are shown</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentYouTubeVideos;
