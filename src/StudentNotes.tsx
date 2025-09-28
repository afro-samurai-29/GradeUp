import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StudentNavbar from '@/components/StudentNavbar';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  BookOpen, 
  Edit, 
  Trash2, 
  Save,
  X,
  Calculator,
  FileText,
  Eye,
  Clock,
  Tag,
  Play
} from 'lucide-react';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

interface Note {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  content: string;
  dateCreated: string;
  lastModified: string;
  tags: string[];
}

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


const StudentNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const [newNote, setNewNote] = useState({
    title: '',
    subject: '',
    content: '',
    tags: ''
  });

  const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography'];

  useEffect(() => {
    // Get student's enrolled subjects (in a real app, this would come from user profile)
    // For now, using mock data - in production, fetch from user profile
    const mockStudentSubjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences'];
    setStudentSubjects(mockStudentSubjects);
  }, []);

  useEffect(() => {
    if (studentSubjects.length === 0) return; // Don't run until subjects are loaded

    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
          const loaded: Note[] = snap.docs
            .map((d) => {
              const data = d.data() as any;
              return {
                id: d.id,
                title: data.title || '',
                subject: data.subject || '',
                topic: data.topic || '',
                content: data.content || '',
                dateCreated: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : '',
                lastModified: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString().split('T')[0] : '',
                tags: Array.isArray(data.tags) ? data.tags : [],
              };
            })
        .filter(note => studentSubjects.includes(note.subject)); // Filter by student's subjects
      setNotes(loaded);
    });
    return () => unsub();
  }, [studentSubjects]);

  // Fetch YouTube videos
  useEffect(() => {
    if (studentSubjects.length === 0) return;

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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = () => {
    // Creation moved to Admin; keep function no-op or remove modal usage
    setIsCreating(false);
  };

  const openBook = (note: Note) => {
    setSelectedNote(note);
    setIsBookOpen(true);
  };

  const closeBook = () => {
    setSelectedNote(null);
    setIsBookOpen(false);
  };

  const openVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsVideoOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Notes</h1>
              <p className="text-forest-light mt-1">Interactive note-taking with math support</p>
            </div>
          </div>
        </div>
      </div>

      <StudentNavbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search notes by title, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Student cannot create notes; creation is via Admin */}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Notes Found</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first note</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => openBook(note)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-forest-primary transition-colors">{note.title}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {note.subject}
                        </Badge>
                        {note.topic && (
                          <Badge variant="outline" className="text-xs text-forest-primary border-forest-primary">
                            {note.topic}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openBook(note);
                        }}
                        className="text-forest-primary hover:text-forest-secondary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {note.content.substring(0, 150)}...
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{note.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Created: {new Date(note.dateCreated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Videos Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Play className="h-6 w-6 text-forest-primary" />
            <h2 className="text-2xl font-bold text-forest-primary">Educational Videos</h2>
            <Badge variant="secondary" className="ml-2">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {filteredVideos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Videos Available</h3>
                <p className="text-gray-500">No educational videos found for your enrolled subjects</p>
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
                      <Clock className="h-3 w-3 mr-1" />
                      Added: {video.uploadedAt?.toDate ? video.uploadedAt.toDate().toLocaleDateString() : 'Unknown'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Book Reading Dialog */}
        <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-forest-primary" />
                {selectedNote?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {selectedNote?.subject}
                </Badge>
                {selectedNote?.topic && (
                  <Badge variant="outline" className="text-xs text-forest-primary border-forest-primary">
                    {selectedNote.topic}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created: {selectedNote ? new Date(selectedNote.dateCreated).toLocaleDateString() : ''}
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto">
              <div className="book-content p-6">
                <div className="max-w-3xl mx-auto">
                  <div className="prose prose-lg max-w-none">
                    <MarkdownContent content={selectedNote?.content || ''} />
                  </div>
                  
                  {selectedNote?.tags && selectedNote.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-forest-primary" />
                        <span className="font-medium text-forest-primary">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Video Player Dialog */}
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-forest-primary" />
                {selectedVideo?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {selectedVideo?.subject}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Added: {selectedVideo ? (selectedVideo.uploadedAt?.toDate ? selectedVideo.uploadedAt.toDate().toLocaleDateString() : 'Unknown') : ''}
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="aspect-video w-full mb-6">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo?.videoId}?autoplay=1`}
                    title={selectedVideo?.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-lg"
                  ></iframe>
                </div>
                {selectedVideo?.description && (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{selectedVideo.description}</p>
                  </div>
                )}
                <div className="mt-6 flex gap-2">
                  <Button
                    onClick={() => window.open(selectedVideo?.youtubeUrl, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Open in YouTube
                  </Button>
                  <Button onClick={closeVideo} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Markdown Content Component with KaTeX support
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const formatMarkdown = (text: string) => {
    // Simple markdown formatting without KaTeX for now
    let processedText = text
      // Handle video embeds first
      .replace(/\[VIDEO:([^:]+):([^\]]+)\]/g, (match, videoId, title) => {
        return `
          <div class="my-6 p-4 border rounded-lg bg-gray-50">
            <div class="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5 text-forest-primary" />
              <span class="font-medium text-forest-primary text-lg">${title}</span>
            </div>
            <div class="aspect-video w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                title="${title}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="rounded-lg shadow-md"
              ></iframe>
            </div>
          </div>
        `;
      })
      // Handle regular markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-forest-primary underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');

    return processedText;
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
  );
};

export default StudentNotes;