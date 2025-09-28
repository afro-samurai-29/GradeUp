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
import { getStudyResources } from '@/lib/firestore';
import { StudyResource } from '@/types/database';
import Header from '@/components/Header';

const StudyResourcesPage = () => {
    const [resources, setResources] = useState<StudyResource[]>([]);
    const [filteredResources, setFilteredResources] = useState<StudyResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const subjects = [
        'Mathematics', 'Physical Sciences', 'Life Sciences', 'English',
        'Afrikaans', 'History', 'Geography', 'Economics', 'Accounting',
        'Business Studies', 'Computer Applications Technology', 'Engineering Graphics and Design'
    ];

    const resourceTypes = [
        { value: 'past_paper', label: 'Past Papers', icon: FileText },
        { value: 'study_guide', label: 'Study Guides', icon: BookOpen },
        { value: 'video', label: 'Video Lessons', icon: Video },
        { value: 'practice_test', label: 'Practice Tests', icon: FileText },
        { value: 'textbook', label: 'Textbooks', icon: BookOpen },
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
    }, [resources, searchTerm, selectedSubject, selectedType, selectedDifficulty, showFreeOnly]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const data = await getStudyResources(
                selectedSubject !== 'all' ? selectedSubject : undefined,
                selectedType !== 'all' ? selectedType : undefined,
                showFreeOnly ? true : undefined
            );
            setResources(data);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterResources = () => {
        let filtered = resources;

        if (searchTerm) {
            filtered = filtered.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedSubject && selectedSubject !== 'all') {
            filtered = filtered.filter(resource => resource.subject === selectedSubject);
        }

        if (selectedType && selectedType !== 'all') {
            filtered = filtered.filter(resource => resource.type === selectedType);
        }

        if (selectedDifficulty && selectedDifficulty !== 'all') {
            filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
        }

        if (showFreeOnly) {
            filtered = filtered.filter(resource => resource.isFree);
        }

        setFilteredResources(filtered);
    };

    const getResourceIcon = (type: string) => {
        const typeConfig = resourceTypes.find(t => t.value === type);
        return typeConfig ? typeConfig.icon : FileText;
    };

    const getResourceTypeLabel = (type: string) => {
        const typeConfig = resourceTypes.find(t => t.value === type);
        return typeConfig ? typeConfig.label : type;
    };

    const getDifficultyBadge = (difficulty: string) => {
        const diffConfig = difficulties.find(d => d.value === difficulty);
        return diffConfig || { label: difficulty, color: 'bg-gray-100 text-gray-800' };
    };

    const formatDuration = (minutes?: number) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const groupedResources = filteredResources.reduce((acc, resource) => {
        if (!acc[resource.type]) {
            acc[resource.type] = [];
        }
        acc[resource.type].push(resource);
        return acc;
    }, {} as Record<string, StudyResource[]>);

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
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {resourceTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
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
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="all">All ({filteredResources.length})</TabsTrigger>
                            {resourceTypes.map(type => (
                                <TabsTrigger key={type.value} value={type.value}>
                                    {type.label} ({groupedResources[type.value]?.length || 0})
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {resourceTypes.map(type => (
                            <TabsContent key={type.value} value={type.value} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(groupedResources[type.value] || []).map((resource) => {
                                        const IconComponent = getResourceIcon(resource.type);
                                        const difficultyBadge = getDifficultyBadge(resource.difficulty);

                                        return (
                                            <Card key={resource.id} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <IconComponent className="h-5 w-5 text-forest-primary" />
                                                            <Badge variant="secondary" className="text-xs">
                                                                {getResourceTypeLabel(resource.type)}
                                                            </Badge>
                                                        </div>
                                                        <Badge className={`text-xs ${difficultyBadge.color}`}>
                                                            {difficultyBadge.label}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {resource.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    {/* Subject and Grade */}
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-forest-primary" />
                                                        <span className="text-sm font-medium">{resource.subject}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            Grade {resource.grade}
                                                        </Badge>
                                                    </div>

                                                    {/* Duration for videos */}
                                                    {resource.type === 'video' && resource.duration && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-forest-primary" />
                                                            <span className="text-sm">{formatDuration(resource.duration)}</span>
                                                        </div>
                                                    )}

                                                    {/* Year for past papers */}
                                                    {resource.year && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-forest-primary" />
                                                            <span className="text-sm">{resource.year}</span>
                                                        </div>
                                                    )}

                                                    {/* Download count */}
                                                    <div className="flex items-center gap-2">
                                                        <Download className="h-4 w-4 text-forest-primary" />
                                                        <span className="text-sm">{resource.downloadCount} downloads</span>
                                                    </div>

                                                    {/* Tags */}
                                                    <div>
                                                        <p className="text-sm font-medium mb-2">Topics:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {resource.tags.slice(0, 3).map((tag, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {resource.tags.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{resource.tags.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {resource.isFree ? (
                                                                <Badge className="bg-green-100 text-green-800">
                                                                    Free
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-blue-100 text-blue-800">
                                                                    {resource.currency} {resource.price}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 pt-2">
                                                        <Button size="sm" className="flex-1">
                                                            {resource.type === 'video' ? (
                                                                <>
                                                                    <Play className="h-4 w-4 mr-2" />
                                                                    Watch
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Download className="h-4 w-4 mr-2" />
                                                                    Download
                                                                </>
                                                            )}
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
                        ))}

                        <TabsContent value="all" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResources.map((resource) => {
                                    const IconComponent = getResourceIcon(resource.type);
                                    const difficultyBadge = getDifficultyBadge(resource.difficulty);

                                    return (
                                        <Card key={resource.id} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-5 w-5 text-forest-primary" />
                                                        <Badge variant="secondary" className="text-xs">
                                                            {getResourceTypeLabel(resource.type)}
                                                        </Badge>
                                                    </div>
                                                    <Badge className={`text-xs ${difficultyBadge.color}`}>
                                                        {difficultyBadge.label}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {resource.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Subject and Grade */}
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-forest-primary" />
                                                    <span className="text-sm font-medium">{resource.subject}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        Grade {resource.grade}
                                                    </Badge>
                                                </div>

                                                {/* Duration for videos */}
                                                {resource.type === 'video' && resource.duration && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-forest-primary" />
                                                        <span className="text-sm">{formatDuration(resource.duration)}</span>
                                                    </div>
                                                )}

                                                {/* Year for past papers */}
                                                {resource.year && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-forest-primary" />
                                                        <span className="text-sm">{resource.year}</span>
                                                    </div>
                                                )}

                                                {/* Download count */}
                                                <div className="flex items-center gap-2">
                                                    <Download className="h-4 w-4 text-forest-primary" />
                                                    <span className="text-sm">{resource.downloadCount} downloads</span>
                                                </div>

                                                {/* Tags */}
                                                <div>
                                                    <p className="text-sm font-medium mb-2">Topics:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {resource.tags.slice(0, 3).map((tag, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {resource.tags.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{resource.tags.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {resource.isFree ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                Free
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                {resource.currency} {resource.price}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 pt-2">
                                                    <Button size="sm" className="flex-1">
                                                        {resource.type === 'video' ? (
                                                            <>
                                                                <Play className="h-4 w-4 mr-2" />
                                                                Watch
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </>
                                                        )}
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

                {!loading && filteredResources.length === 0 && (
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

