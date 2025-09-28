import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  BarChart3, 
  MessageCircle, 
  User,
  TrendingUp,
  Download,
  AlertCircle,
  BookOpen,
  Clock,
  CheckCircle,
  Heart,
  Star,
  Eye,
  Play,
  Trash2,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react';
import { db, storage } from '@/firebaseConfig';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [pastPapers, setPastPapers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    subject: '',
    topic: '',
    content: '',
    tags: ''
  });
  const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);

  const handleLogout = () => {
    navigate('/');
  };

  const quickActions = [
    { icon: Users, label: "Manage Users", href: "/admin/users", color: "bg-forest-primary", description: "Handle student and tutor accounts" },
    { icon: FileText, label: "Content Management", href: "/admin/content", color: "bg-forest-primary", description: "Upload and manage study materials" },
    { icon: Download, label: "Past Papers", href: "/admin/past-papers", color: "bg-forest-primary", description: "Upload and manage past examination papers" },
    { icon: Play, label: "YouTube Videos", href: "/admin/youtube-videos", color: "bg-forest-primary", description: "Add and manage educational YouTube videos" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics", color: "bg-forest-primary", description: "Track platform usage and success rates" },
    { icon: MessageCircle, label: "Support", href: "/admin/support", color: "bg-forest-primary", description: "Handle user queries and issues" },
    { icon: User, label: "Admin Profile", href: "/admin/profile", color: "bg-forest-primary", description: "Admin account settings" },
  ];

  useEffect(() => {
    // Load all notes for admin view
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || '',
          subject: data.subject || '',
          topic: data.topic || '',
          content: data.content || '',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      });
      setNotes(loaded);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Load all past papers for admin view
    const q = query(collection(db, 'pastPapers'), orderBy('uploadedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || '',
          subject: data.subject || '',
          year: data.year || '',
          fileName: data.fileName || '',
          fileUrl: data.fileUrl || '',
          storagePath: data.storagePath || '',
          fileSize: data.fileSize || 0,
          uploadedAt: data.uploadedAt?.toDate ? data.uploadedAt.toDate() : new Date(),
        };
      });
      setPastPapers(loaded);
    });
    return () => unsub();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${noteTitle}"?`)) return;

    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  const handleDeletePastPaper = async (paperId: string, paperTitle: string, storagePath: string) => {
    if (!confirm(`Are you sure you want to delete "${paperTitle}"?`)) return;

    try {
      // Delete file from Storage
      if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, 'pastPapers', paperId));
    } catch (error) {
      console.error('Error deleting past paper:', error);
      alert('Error deleting past paper. Please try again.');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditForm({
      title: note.title,
      subject: note.subject,
      topic: note.topic || '',
      content: note.content,
      tags: note.tags.join(', ')
    });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditForm({
      title: '',
      subject: '',
      topic: '',
      content: '',
      tags: ''
    });
  };

  const handleSaveNote = async (noteId, isAutoSave = false) => {
    try {
      const tagsArray = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await updateDoc(doc(db, 'notes', noteId), {
        title: editForm.title,
        subject: editForm.subject,
        topic: editForm.topic,
        content: editForm.content,
        tags: tagsArray,
        updatedAt: serverTimestamp()
      });

      if (!isAutoSave) {
        setEditingNote(null);
        setEditForm({
          title: '',
          subject: '',
          topic: '',
          content: '',
          tags: ''
        });
      }
    } catch (error) {
      console.error('Error updating note:', error);
      if (!isAutoSave) {
        alert('Error updating note. Please try again.');
      }
    }
  };

  const handleFormChange = (field, value) => {
    setEditForm({...editForm, [field]: value});
    
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    // Set new timeout for auto-save (3 seconds after user stops typing)
    const newTimeout = setTimeout(() => {
      if (editingNote) {
        handleSaveNote(editingNote, true);
      }
    }, 3000);
    
    setAutoSaveTimeout(newTimeout);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-forest-light">Manage platform content, users, and analytics</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/20 border border-white/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card><CardContent className="p-6 text-center"><Users className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">1,247</div><div className="text-sm text-gray-600">Total Students</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><User className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">89</div><div className="text-sm text-gray-600">Active Tutors</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><MessageCircle className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">156</div><div className="text-sm text-gray-600">Help Requests</div></CardContent></Card>
          <Card><CardContent className="p-6 text-center"><TrendingUp className="h-8 w-8 text-forest-primary mx-auto mb-2" /><div className="text-2xl font-bold">73%</div><div className="text-sm text-gray-600">Success Rate</div></CardContent></Card>
        </div>

        {/* Content Management Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Content Management</h2>
          <Link to="/admin/new-note">
            <Button className="bg-forest-primary text-white hover:bg-forest-secondary">
              + Create New Note
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href} className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">{action.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Study Notes - Admin View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              All Study Notes ({notes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Notes Created</h3>
                <p className="text-muted-foreground mb-4">Create your first study note to get started</p>
                <Link to="/admin/new-note">
                  <Button className="bg-forest-primary hover:bg-forest-secondary">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create First Note
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card key={note.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingNote === note.id ? (
                            <div className="space-y-3">
                              <Input
                                value={editForm.title}
                                onChange={(e) => handleFormChange('title', e.target.value)}
                                placeholder="Note title"
                                className="font-semibold text-lg"
                              />
                              <div className="flex gap-2">
                                <Input
                                  value={editForm.subject}
                                  onChange={(e) => handleFormChange('subject', e.target.value)}
                                  placeholder="Subject"
                                  className="text-xs"
                                />
                                <Input
                                  value={editForm.topic}
                                  onChange={(e) => handleFormChange('topic', e.target.value)}
                                  placeholder="Topic"
                                  className="text-xs"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
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
                            </>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {editingNote === note.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveNote(note.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditNote(note)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id, note.title)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingNote === note.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editForm.content}
                            onChange={(e) => handleFormChange('content', e.target.value)}
                            placeholder="Note content"
                            rows={6}
                            className="text-sm"
                          />
                          <Input
                            value={editForm.tags}
                            onChange={(e) => handleFormChange('tags', e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="text-xs"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {note.content.substring(0, 100)}...
                          </div>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {note.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Created: {note.createdAt.toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Past Papers - Admin View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              All Past Papers ({pastPapers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastPapers.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Past Papers Uploaded</h3>
                <p className="text-muted-foreground mb-4">Upload your first past paper to get started</p>
                <Link to="/admin/past-papers">
                  <Button className="bg-forest-primary hover:bg-forest-secondary">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload First Paper
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastPapers.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{paper.title}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              {paper.subject}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-forest-primary border-forest-primary">
                              {paper.year}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePastPaper(paper.id, paper.title, paper.storagePath)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <strong>File:</strong> {paper.fileName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Size:</strong> {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded: {paper.uploadedAt.toLocaleDateString()}
                        </div>
                        <div className="pt-2">
                          <a 
                            href={paper.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-forest-primary hover:text-forest-secondary text-sm underline"
                          >
                            View/Download
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm">New user registration spike detected</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm">Monthly active users increased by 23%</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;