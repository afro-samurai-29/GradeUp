import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Star, Clock, DollarSign } from 'lucide-react';
import { getRewriteCenters } from '@/lib/firestore';
import { RewriteCenter } from '@/types/database';
import Header from '@/components/Header';

const RewriteCentersPage = () => {
    const [centers, setCenters] = useState<RewriteCenter[]>([]);
    const [filteredCenters, setFilteredCenters] = useState<RewriteCenter[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const provinces = [
        'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
        'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ];

    const cities = {
        'Eastern Cape': ['Port Elizabeth', 'East London', 'Grahamstown'],
        'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem'],
        'Gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton'],
        'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Newcastle'],
        'Limpopo': ['Polokwane', 'Tzaneen', 'Musina'],
        'Mpumalanga': ['Nelspruit', 'Witbank', 'Secunda'],
        'Northern Cape': ['Kimberley', 'Upington', 'Springbok'],
        'North West': ['Mafikeng', 'Rustenburg', 'Potchefstroom'],
        'Western Cape': ['Cape Town', 'Stellenbosch', 'Paarl']
    };

    useEffect(() => {
        loadCenters();
    }, []);

    useEffect(() => {
        filterCenters();
    }, [centers, searchTerm, selectedProvince, selectedCity]);

    const loadCenters = async () => {
        try {
            setLoading(true);
            const data = await getRewriteCenters(selectedProvince, selectedCity);
            setCenters(data);
        } catch (error) {
            console.error('Error loading centers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterCenters = () => {
        let filtered = centers;

        if (searchTerm) {
            filtered = filtered.filter(center =>
                center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                center.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedProvince) {
            filtered = filtered.filter(center => center.address.province === selectedProvince);
        }

        if (selectedCity) {
            filtered = filtered.filter(center => center.address.city === selectedCity);
        }

        setFilteredCenters(filtered);
    };

    const formatOperatingHours = (hours: any) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.map(day => {
            const dayHours = hours[day.toLowerCase()];
            if (!dayHours || !dayHours.isOpen) return `${day}: Closed`;
            return `${day}: ${dayHours.open} - ${dayHours.close}`;
        }).join('\n');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Matric Rewrite Centers 🎓
                    </h1>
                    <p className="text-muted-foreground">
                        Find accredited centers near you for matric rewrite registration and support.
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Find Centers Near You</CardTitle>
                        <CardDescription>
                            Search by name, location, or services offered
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Search centers, services, or subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Provinces</SelectItem>
                                    {provinces.map(province => (
                                        <SelectItem key={province} value={province}>
                                            {province}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Cities</SelectItem>
                                    {selectedProvince && cities[selectedProvince as keyof typeof cities]?.map(city => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading centers...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCenters.map((center) => (
                            <Card key={center.id} className="card-elegant hover:shadow-lg transition-shadow duration-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{center.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {center.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-medium">{center.rating.toFixed(1)}</span>
                                            <span className="text-xs text-muted-foreground">({center.reviewCount})</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Location */}
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-forest-primary mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium">{center.address.street}</p>
                                            <p className="text-muted-foreground">
                                                {center.address.city}, {center.address.province} {center.address.postalCode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-forest-primary" />
                                            <span className="text-sm">{center.contactInfo.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-forest-primary" />
                                            <span className="text-sm">{center.contactInfo.email}</span>
                                        </div>
                                        {center.contactInfo.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-forest-primary" />
                                                <a
                                                    href={center.contactInfo.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-forest-primary hover:underline"
                                                >
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fees */}
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-forest-primary" />
                                        <div className="text-sm">
                                            <p>Registration: {center.fees.currency} {center.fees.registrationFee}</p>
                                            <p>Per Subject: {center.fees.currency} {center.fees.subjectFee}</p>
                                        </div>
                                    </div>

                                    {/* Services */}
                                    <div>
                                        <p className="text-sm font-medium mb-2">Services Offered:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {center.services.slice(0, 3).map((service, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                            {center.services.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{center.services.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Operating Hours */}
                                    <div className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-forest-primary mt-0.5" />
                                        <div className="text-sm">
                                            <p className="font-medium">Operating Hours:</p>
                                            <p className="text-muted-foreground text-xs">
                                                {formatOperatingHours(center.operatingHours).split('\n')[0]}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" className="flex-1">
                                            View Details
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            Contact
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && filteredCenters.length === 0 && (
                    <div className="text-center py-12">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No centers found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search criteria or check back later for new centers.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RewriteCentersPage;
