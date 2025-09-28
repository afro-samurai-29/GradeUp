import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Users,
    Star,
    Clock,
    MapPin,
    MessageCircle,
    Calendar,
    DollarSign,
    Award,
    BookOpen,
    Languages,
    Filter,
    Search
} from 'lucide-react';
import { getTutors } from '@/lib/firestore';
import { Tutor } from '@/types/database';
import Header from '@/components/Header';

const TutorNetworkPage = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [minRating, setMinRating] = useState('');
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    const subjects = [
        'Mathematics', 'Physical Sciences', 'Life Sciences', 'English',
        'Afrikaans', 'History', 'Geography', 'Economics', 'Accounting',
        'Business Studies', 'Computer Applications Technology', 'Engineering Graphics and Design'
    ];

    const provinces = [
        'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
        'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ];

    const ratingOptions = [
        { value: '4', label: '4+ Stars' },
        { value: '4.5', label: '4.5+ Stars' },
        { value: '5', label: '5 Stars Only' },
    ];

    useEffect(() => {
        loadTutors();
    }, []);

    useEffect(() => {
        filterTutors();
    }, [tutors, searchTerm, selectedSubject, selectedProvince, minRating]);

    const loadTutors = async () => {
        try {
            setLoading(true);
            const data = await getTutors(selectedSubject, selectedProvince, minRating ? parseFloat(minRating) : undefined);
            setTutors(data);
        } catch (error) {
            console.error('Error loading tutors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTutors = () => {
        let filtered = tutors;

        if (searchTerm) {
            filtered = filtered.filter(tutor =>
                tutor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.qualifications.some(qual => qual.toLowerCase().includes(searchTerm.toLowerCase())) ||
                tutor.teachingMethods.some(method => method.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedSubject) {
            filtered = filtered.filter(tutor => tutor.subjects.includes(selectedSubject));
        }

        if (selectedProvince) {
            // Note: This would require adding province to tutor data structure
            // For now, we'll skip this filter
        }

        if (minRating) {
            filtered = filtered.filter(tutor => tutor.rating >= parseFloat(minRating));
        }

        setFilteredTutors(filtered);
    };

    const formatAvailability = (availability: any) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const availableDays = days.filter(day => {
            const dayAvailability = availability[day.toLowerCase()];
            return dayAvailability && dayAvailability.isAvailable;
        });
        return availableDays.length > 0 ? availableDays.join(', ') : 'Not available';
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Expert Tutors Network 👨‍🏫
                    </h1>
                    <p className="text-muted-foreground">
                        Connect with qualified tutors who specialize in matric rewrite subjects and understand your learning needs.
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Find Your Perfect Tutor
                        </CardTitle>
                        <CardDescription>
                            Search by subject, qualifications, or teaching methods
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Search tutors, qualifications, or teaching methods..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Subjects</SelectItem>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject} value={subject}>
                                            {subject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Locations</SelectItem>
                                    {provinces.map(province => (
                                        <SelectItem key={province} value={province}>
                                            {province}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={minRating} onValueChange={setMinRating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Min Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Any Rating</SelectItem>
                                    {ratingOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tutors Grid */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading tutors...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTutors.map((tutor) => (
                            <Card key={tutor.id} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={`/api/placeholder/64/64`} />
                                            <AvatarFallback className="text-lg">
                                                {getInitials('Tutor Name')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-lg">Tutor Name</CardTitle>
                                                {tutor.isVerified && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        <Award className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm font-medium">{tutor.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">({tutor.reviewCount} reviews)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm font-medium">
                                                    {tutor.currency} {tutor.hourlyRate}/hour
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Bio */}
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {tutor.bio}
                                    </p>

                                    {/* Subjects */}
                                    <div>
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            Subjects:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {tutor.subjects.slice(0, 3).map((subject, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {subject}
                                                </Badge>
                                            ))}
                                            {tutor.subjects.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{tutor.subjects.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Qualifications */}
                                    <div>
                                        <p className="text-sm font-medium mb-2">Qualifications:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {tutor.qualifications.slice(0, 2).map((qual, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {qual}
                                                </Badge>
                                            ))}
                                            {tutor.qualifications.length > 2 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{tutor.qualifications.length - 2} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-forest-primary" />
                                        <span className="text-sm">{tutor.experience} years experience</span>
                                    </div>

                                    {/* Languages */}
                                    <div className="flex items-center gap-2">
                                        <Languages className="h-4 w-4 text-forest-primary" />
                                        <span className="text-sm">{tutor.languages.join(', ')}</span>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <p className="text-sm font-medium mb-1">Available:</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatAvailability(tutor.availability)}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="flex-1">
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    Contact
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Contact Tutor</DialogTitle>
                                                    <DialogDescription>
                                                        Send a message to this tutor to discuss your learning needs.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={`/api/placeholder/48/48`} />
                                                            <AvatarFallback>TN</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-medium">Tutor Name</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {tutor.subjects.join(', ')} • {tutor.currency} {tutor.hourlyRate}/hour
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Message</label>
                                                        <textarea
                                                            className="w-full p-3 border rounded-lg resize-none"
                                                            rows={4}
                                                            placeholder="Hi! I'm interested in tutoring for [subject]. I'm preparing for my matric rewrite and would like to discuss your availability and teaching approach..."
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button className="flex-1">Send Message</Button>
                                                        <Button variant="outline">
                                                            <Calendar className="h-4 w-4 mr-2" />
                                                            Book Session
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button size="sm" variant="outline">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Book
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && filteredTutors.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No tutors found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search criteria or check back later for new tutors.
                        </p>
                    </div>
                )}

                {/* Become a Tutor CTA */}
                <Card className="mt-12 bg-gradient-to-r from-forest-primary to-forest-secondary text-white">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Are you a qualified tutor?</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Join our network and help students achieve their matric rewrite goals.
                        </p>
                        <Button size="lg" variant="secondary">
                            Become a Tutor
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default TutorNetworkPage;
