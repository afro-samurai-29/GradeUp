import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StudentNavbar from '@/components/StudentNavbar';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Plus, Search, BookOpen, Edit, Trash2, FileText } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  subject: string;
  content?: string; // content optional until fetched
  dateCreated?: string;
  lastModified?: string;
  tags?: string[];
}

const subjects = ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography'];

const StudentNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Fetch notes from all subjects' notes subcollections
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // First get all subjects
        const subjectsSnapshot = await getDocs(collection(db, 'resources'));
        const metaNotes: Note[] = [];

        for (const subjectDoc of subjectsSnapshot.docs) {
          const subjectData = subjectDoc.data();
          const subjectName = subjectData.name;

          // Get notes from this subject's notes subcollection
          const notesSnapshot = await getDocs(collection(db, 'resources', subjectDoc.id, 'notes'));

          notesSnapshot.forEach(noteDoc => {
            const noteData = noteDoc.data();
            metaNotes.push({
              id: noteDoc.id,
              title: noteData.title,
              subject: subjectName,
              content: noteData.content,
              dateCreated: noteData.createdAt?.seconds
                ? new Date(noteData.createdAt.seconds * 1000).toISOString().split('T')[0]
                : new Date(noteData.createdAt).toISOString().split('T')[0],
              lastModified: noteData.updatedAt?.seconds
                ? new Date(noteData.updatedAt.seconds * 1000).toISOString().split('T')[0]
                : new Date(noteData.updatedAt).toISOString().split('T')[0],
              tags: noteData.tags || [],
            });
          });
        }

        setNotes(metaNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  // Fetch note content when clicked
  const handleExpandNote = async (noteId: string) => {
    const isExpanded = expandedNote === noteId;
    setExpandedNote(isExpanded ? null : noteId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <Button className="bg-white text-green-600 hover:bg-green-50 shadow-lg">
            <Plus className="h-4 w-4 mr-2" /> New Note
          </Button>
        </div>
      </div>

      <StudentNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        {loading ? (
          <div>Loading...</div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notes Found</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => {
              const isExpanded = expandedNote === note.id;
              return (
                <Card
                  key={note.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleExpandNote(note.id)}
                >
                  <CardHeader className="pb-3 flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" /> {note.subject}
                      </Badge>
                    </div>
                  </CardHeader>

                  {isExpanded && note.content && (
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{note.content}</div>
                      {note.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">#{tag}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Created: {note.dateCreated}
                      </div>
                      <div className="text-xs text-gray-400">
                        Last Modified: {note.lastModified}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotes;
