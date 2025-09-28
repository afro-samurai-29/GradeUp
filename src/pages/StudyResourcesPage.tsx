import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BookOpen,
    Download,
    Play,
    FileText,
    Video,
    Clock,
    Star,
    Filter,
    Search,
    Calendar,
    Users
} from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Header from '@/components/Header';

const StudyResourcesPage = () => {
    const [pastPapers, setPastPapers] = useState([]);
    const [studyNotes, setStudyNotes] = useState([]);
    const [filteredPastPapers, setFilteredPastPapers] = useState([]);
    const [filteredStudyNotes, setFilteredStudyNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const subjects = [
        'Mathematics', 'Physical Sciences', 'Life Sciences', 'English',
        'Afrikaans', 'History', 'Geography', 'Economics', 'Accounting',
        'Business Studies', 'Computer Applications Technology', 'Engineering Graphics and Design'
    ];

    const resourceTypes = [
        { value: 'past_papers', label: 'Past Papers', icon: FileText },
        { value: 'study_notes', label: 'Study Guides', icon: BookOpen },
    ];

    const difficulties = [
        { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' },
    ];

    useEffect(() => {
        loadResources();
    }, []);

    useEffect(() => {
        filterResources();
    }, [pastPapers, studyNotes, searchTerm, selectedSubject, selectedDifficulty, showFreeOnly]);

    const loadResources = async () => {
        try {
            setLoading(true);

            // Get subjects first
            const subjectsSnapshot = await getDocs(collection(db, 'resources'));
            const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // Fetch past papers from all subjects
            const allPastPapers = [];
            const allNotes = [];

            for (const subject of subjects) {
                // Get past papers
                const pastPapersSnapshot = await getDocs(query(
                    collection(db, 'resources', subject.id, 'pastPapers'),
                    orderBy('createdAt', 'desc')
                ));
                pastPapersSnapshot.docs.forEach(doc => {
                    allPastPapers.push({ id: doc.id, subjectName: subject.name, ...doc.data() });
                });

                // Get notes
                const notesSnapshot = await getDocs(query(
                    collection(db, 'resources', subject.id, 'notes'),
                    orderBy('createdAt', 'desc')
                ));
                notesSnapshot.docs.forEach(doc => {
                    allNotes.push({ id: doc.id, subjectName: subject.name, ...doc.data() });
                });
            }

            // Sort and set data
            const sortedPastPapers = allPastPapers.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const sortedNotes = allNotes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


            setPastPapers(sortedPastPapers);
            setStudyNotes(sortedNotes);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterResources = () => {
        // Filter past papers
        let filteredPapers = pastPapers;
        if (searchTerm) {
            filteredPapers = filteredPapers.filter(paper =>
                (paper.title || `Past Paper ${paper.year}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
                paper.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedSubject && selectedSubject !== 'all') {
            filteredPapers = filteredPapers.filter(paper => paper.subjectName === selectedSubject);
        }
        if (selectedDifficulty && selectedDifficulty !== 'all') {
            filteredPapers = filteredPapers.filter(paper => paper.difficulty === selectedDifficulty);
        }
        if (showFreeOnly) {
            filteredPapers = filteredPapers.filter(paper => paper.isFree);
        }
        setFilteredPastPapers(filteredPapers);

        // Filter study notes
        let filteredNotes = studyNotes;
        if (searchTerm) {
            filteredNotes = filteredNotes.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedSubject && selectedSubject !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.subjectName === selectedSubject);
        }
        if (selectedDifficulty && selectedDifficulty !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.difficulty === selectedDifficulty);
        }
        if (showFreeOnly) {
            filteredNotes = filteredNotes.filter(note => note.isFree);
        }
        setFilteredStudyNotes(filteredNotes);
    };


    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Study Resources 📚
                    </h1>
                    <p className="text-muted-foreground">
                        Access free and premium study materials, past papers, and video lessons to ace your matric rewrite.
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Find Study Materials
                        </CardTitle>
                        <CardDescription>
                            Search by subject, type, or difficulty level
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Search resources, topics, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    {difficulties.map(diff => (
                                        <SelectItem key={diff.value} value={diff.value}>
                                            {diff.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant={showFreeOnly ? "default" : "outline"}
                                onClick={() => setShowFreeOnly(!showFreeOnly)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Free Only
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Resources by Type */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading resources...</p>
                    </div>
                ) : (
                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All ({filteredPastPapers.length + filteredStudyNotes.length})</TabsTrigger>
                            <TabsTrigger value="past_papers">Past Papers ({filteredPastPapers.length})</TabsTrigger>
                            <TabsTrigger value="study_notes">Notes ({filteredStudyNotes.length})</TabsTrigger>
                        </TabsList>

                        {/* Past Papers Tab */}
                        <TabsContent value="past_papers" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPastPapers.map((paper, index) => (
                                    <Card key={`past-paper-${paper.subjectName}-${paper.id}-${index}`} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                    <Badge variant="secondary" className="text-xs">
                                                        Past Paper
                                                    </Badge>
                                                </div>
                                                <Badge className={`text-xs ${paper.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : paper.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {paper.difficulty || 'General'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg">{paper.title || `Past Paper ${paper.year}`}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {paper.subjectName} • {paper.year}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm font-medium">{paper.subjectName}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {paper.exam || 'NSC'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm">{paper.year}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {paper.isFree ? (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Free
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            {paper.currency} {paper.price}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button size="sm" className="flex-1">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Preview
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Notes Tab */}
                        <TabsContent value="study_notes" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStudyNotes.map((note, index) => (
                                    <Card key={`study-note-${note.subjectName}-${note.id}-${index}`} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-5 w-5 text-green-500" />
                                                    <Badge variant="secondary" className="text-xs">
                                                        Study Guide
                                                    </Badge>
                                                </div>
                                                <Badge className={`text-xs ${note.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : note.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {note.difficulty || 'General'}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg">{note.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {note.subjectName} • {note.topic || 'General'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm font-medium">{note.subjectName}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {note.topic || 'General'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {note.isFree ? (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            Free
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            {note.currency} {note.price}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button size="sm" className="flex-1">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Preview
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="all" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Show all past papers and study notes combined */}
                                {[...filteredPastPapers, ...filteredStudyNotes].map((item, index) => {
                                    const isPastPaper = 'year' in item;
                                    return (
                                        <Card key={`all-${isPastPaper ? 'past-paper' : 'study-note'}-${item.subjectName}-${item.id}-${index}`} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {isPastPaper ? (
                                                            <FileText className="h-5 w-5 text-blue-500" />
                                                        ) : (
                                                            <BookOpen className="h-5 w-5 text-green-500" />
                                                        )}
                                                        <Badge variant="secondary" className="text-xs">
                                                            {isPastPaper ? 'Past Paper' : 'Study Guide'}
                                                        </Badge>
                                                    </div>
                                                    <Badge className={`text-xs ${item.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : item.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                        {item.difficulty || 'General'}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg">
                                                    {isPastPaper ? (item.title || `Past Paper ${item.year}`) : item.title}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {item.subjectName} • {isPastPaper ? item.year : (item.topic || 'General')}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-forest-primary" />
                                                    <span className="text-sm font-medium">{item.subjectName}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {isPastPaper ? (item.exam || 'NSC') : (item.topic || 'General')}
                                                    </Badge>
                                                </div>
                                                {isPastPaper && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-forest-primary" />
                                                        <span className="text-sm">{item.year}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {item.isFree ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                Free
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                {item.currency} {item.price}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button size="sm" className="flex-1">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        Preview
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {!loading && filteredPastPapers.length === 0 && filteredStudyNotes.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search criteria or check back later for new materials.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudyResourcesPage;

