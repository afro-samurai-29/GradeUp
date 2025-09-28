import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Trash2, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, addDoc, onSnapshot, orderBy, query, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

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

const AdminYouTubeVideos: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    subject: '',
    youtubeUrl: '',
    description: ''
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

  useEffect(() => {
    const q = query(collection(db, 'youtubeVideos'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoList: YouTubeVideo[] = snapshot.docs.map((doc) => {
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
      });
      setVideos(videoList);
    });

    return () => unsubscribe();
  }, []);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.subject || !newVideo.youtubeUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const videoId = extractVideoId(newVideo.youtubeUrl);
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    try {
      await addDoc(collection(db, 'youtubeVideos'), {
        title: newVideo.title,
        subject: newVideo.subject,
        youtubeUrl: newVideo.youtubeUrl,
        videoId: videoId,
        description: newVideo.description,
        thumbnail: getThumbnailUrl(videoId),
        uploadedAt: serverTimestamp()
      });

      // Reset form
      setNewVideo({ title: '', subject: '', youtubeUrl: '', description: '' });
      setIsAdding(false);
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    }
  };

  const handleDeleteVideo = async (video: YouTubeVideo) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'youtubeVideos', video.id));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    }
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
          <h1 className="text-3xl font-bold mb-2">YouTube Videos Management</h1>
          <p className="text-forest-light">Add and manage educational YouTube videos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Add Video Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-forest-primary" />
              Add New Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Algebra"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={newVideo.subject} onValueChange={(value) => setNewVideo(prev => ({ ...prev, subject: value }))}>
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
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={newVideo.youtubeUrl}
                onChange={(e) => setNewVideo(prev => ({ ...prev, youtubeUrl: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of the video content..."
                value={newVideo.description}
                onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleAddVideo}
              className="bg-forest-primary text-white hover:bg-forest-secondary"
            >
              <Play className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </CardContent>
        </Card>

        {/* Videos List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-forest-primary" />
              All Videos ({videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {videos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No videos added yet</p>
                <p className="text-sm">Add your first video using the form above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mb-2">
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
                      <div className="mb-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/320x180?text=Video+Thumbnail';
                          }}
                        />
                      </div>
                      
                      {video.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                      )}
                      
                      <div className="text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Added: {video.uploadedAt?.toDate ? video.uploadedAt.toDate().toLocaleDateString() : 'Unknown'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(video.youtubeUrl, '_blank')}
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View on YouTube
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteVideo(video)}
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

export default AdminYouTubeVideos;
<<<<<<< HEAD

=======
>>>>>>> 4af57b127e7f204a746a64a584592ee365e8f33a
