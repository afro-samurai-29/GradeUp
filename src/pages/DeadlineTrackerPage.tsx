import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    Bell,
    MapPin,
    BookOpen,
    DollarSign,
    FileText,
    TrendingUp
} from 'lucide-react';
import { getDeadlines, getUserDeadlines } from '@/lib/firestore';
import { Deadline, UserDeadline } from '@/types/database';
import Header from '@/components/Header';

const DeadlineTrackerPage = () => {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [userDeadlines, setUserDeadlines] = useState<UserDeadline[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('upcoming');

    useEffect(() => {
        loadDeadlines();
    }, []);

    const loadDeadlines = async () => {
        try {
            setLoading(true);
            const [deadlinesData, userDeadlinesData] = await Promise.all([
                getDeadlines(),
                getUserDeadlines('current-user-id') // Replace with actual user ID
            ]);
            setDeadlines(deadlinesData);
            setUserDeadlines(userDeadlinesData);
        } catch (error) {
            console.error('Error loading deadlines:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysUntilDeadline = (dueDate: Date) => {
        const now = new Date();
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDeadlineStatus = (deadline: Deadline) => {
        const daysUntil = getDaysUntilDeadline(deadline.dueDate);

        if (daysUntil < 0) return 'overdue';
        if (daysUntil === 0) return 'today';
        if (daysUntil <= 7) return 'urgent';
        if (daysUntil <= 30) return 'soon';
        return 'upcoming';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'today': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-yellow-100 text-yellow-800';
            case 'soon': return 'bg-blue-100 text-blue-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'overdue': return <AlertTriangle className="h-4 w-4" />;
            case 'today': return <Clock className="h-4 w-4" />;
            case 'urgent': return <Bell className="h-4 w-4" />;
            case 'soon': return <Calendar className="h-4 w-4" />;
            default: return <CheckCircle className="h-4 w-4" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'registration': return <FileText className="h-4 w-4" />;
            case 'exam': return <BookOpen className="h-4 w-4" />;
            case 'application': return <FileText className="h-4 w-4" />;
            case 'payment': return <DollarSign className="h-4 w-4" />;
            default: return <Calendar className="h-4 w-4" />;
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(date);
    };

    const getProgressPercentage = (deadline: Deadline) => {
        const daysUntil = getDaysUntilDeadline(deadline.dueDate);
        const totalDays = 90; // Assume 90 days notice period
        const elapsed = Math.max(0, totalDays - daysUntil);
        return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
    };

    const categorizedDeadlines = deadlines.reduce((acc, deadline) => {
        const status = getDeadlineStatus(deadline);
        if (!acc[status]) acc[status] = [];
        acc[status].push(deadline);
        return acc;
    }, {} as Record<string, Deadline[]>);

    const upcomingDeadlines = deadlines.filter(d => getDaysUntilDeadline(d.dueDate) > 0);
    const urgentDeadlines = deadlines.filter(d => {
        const daysUntil = getDaysUntilDeadline(d.dueDate);
        return daysUntil <= 7 && daysUntil >= 0;
    });
    const overdueDeadlines = deadlines.filter(d => getDaysUntilDeadline(d.dueDate) < 0);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Deadline Tracker 📅
                    </h1>
                    <p className="text-muted-foreground">
                        Stay on top of important dates for your matric rewrite journey. Never miss a deadline again.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="card-elegant">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Upcoming</p>
                                    <p className="text-2xl font-bold text-forest-primary">{upcomingDeadlines.length}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-forest-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-elegant">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Urgent</p>
                                    <p className="text-2xl font-bold text-yellow-600">{urgentDeadlines.length}</p>
                                </div>
                                <Bell className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-elegant">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Overdue</p>
                                    <p className="text-2xl font-bold text-red-600">{overdueDeadlines.length}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-elegant">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {userDeadlines.filter(ud => ud.isCompleted).length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Deadlines Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="upcoming">Upcoming ({upcomingDeadlines.length})</TabsTrigger>
                        <TabsTrigger value="urgent">Urgent ({urgentDeadlines.length})</TabsTrigger>
                        <TabsTrigger value="overdue">Overdue ({overdueDeadlines.length})</TabsTrigger>
                        <TabsTrigger value="all">All Deadlines</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingDeadlines.map((deadline) => {
                                const status = getDeadlineStatus(deadline);
                                const daysUntil = getDaysUntilDeadline(deadline.dueDate);
                                const progress = getProgressPercentage(deadline);

                                return (
                                    <Card key={deadline.id} className="card-elegant">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(deadline.type)}
                                                    <CardTitle className="text-lg">{deadline.title}</CardTitle>
                                                </div>
                                                <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                                                    {getStatusIcon(status)}
                                                    {daysUntil} days
                                                </Badge>
                                            </div>
                                            <CardDescription>{deadline.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm font-medium">{formatDate(deadline.dueDate)}</span>
                                            </div>

                                            {deadline.subject && (
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-forest-primary" />
                                                    <span className="text-sm">{deadline.subject}</span>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Time remaining</span>
                                                    <span>{daysUntil} days</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1">
                                                    Mark Complete
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Set Reminder
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="urgent" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {urgentDeadlines.map((deadline) => {
                                const status = getDeadlineStatus(deadline);
                                const daysUntil = getDaysUntilDeadline(deadline.dueDate);
                                const progress = getProgressPercentage(deadline);

                                return (
                                    <Card key={deadline.id} className="card-elegant border-yellow-200 bg-yellow-50">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(deadline.type)}
                                                    <CardTitle className="text-lg">{deadline.title}</CardTitle>
                                                </div>
                                                <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                                                    {getStatusIcon(status)}
                                                    {daysUntil} days
                                                </Badge>
                                            </div>
                                            <CardDescription>{deadline.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-yellow-600" />
                                                <span className="text-sm font-medium">{formatDate(deadline.dueDate)}</span>
                                            </div>

                                            {deadline.subject && (
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-yellow-600" />
                                                    <span className="text-sm">{deadline.subject}</span>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Time remaining</span>
                                                    <span className="font-medium text-yellow-600">{daysUntil} days</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                                                    Take Action Now
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Set Reminder
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="overdue" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {overdueDeadlines.map((deadline) => {
                                const status = getDeadlineStatus(deadline);
                                const daysUntil = getDaysUntilDeadline(deadline.dueDate);
                                const progress = getProgressPercentage(deadline);

                                return (
                                    <Card key={deadline.id} className="card-elegant border-red-200 bg-red-50">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(deadline.type)}
                                                    <CardTitle className="text-lg">{deadline.title}</CardTitle>
                                                </div>
                                                <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                                                    {getStatusIcon(status)}
                                                    {Math.abs(daysUntil)} days overdue
                                                </Badge>
                                            </div>
                                            <CardDescription>{deadline.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-medium">{formatDate(deadline.dueDate)}</span>
                                            </div>

                                            {deadline.subject && (
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-red-600" />
                                                    <span className="text-sm">{deadline.subject}</span>
                                                </div>
                                            )}

                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <p className="text-sm text-red-800 font-medium">
                                                    ⚠️ This deadline has passed. Contact the relevant institution immediately.
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                                                    Contact Institution
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Mark Complete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="all" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {deadlines.map((deadline) => {
                                const status = getDeadlineStatus(deadline);
                                const daysUntil = getDaysUntilDeadline(deadline.dueDate);
                                const progress = getProgressPercentage(deadline);

                                return (
                                    <Card key={deadline.id} className="card-elegant">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(deadline.type)}
                                                    <CardTitle className="text-lg">{deadline.title}</CardTitle>
                                                </div>
                                                <Badge className={`${getStatusColor(status)} flex items-center gap-1`}>
                                                    {getStatusIcon(status)}
                                                    {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days`}
                                                </Badge>
                                            </div>
                                            <CardDescription>{deadline.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-forest-primary" />
                                                <span className="text-sm font-medium">{formatDate(deadline.dueDate)}</span>
                                            </div>

                                            {deadline.subject && (
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-forest-primary" />
                                                    <span className="text-sm">{deadline.subject}</span>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Time remaining</span>
                                                    <span>{daysUntil < 0 ? 'Overdue' : `${daysUntil} days`}</span>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1">
                                                    {daysUntil < 0 ? 'Contact Institution' : 'Mark Complete'}
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Set Reminder
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </Tabs>

                {!loading && deadlines.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No deadlines found</h3>
                        <p className="text-muted-foreground">
                            Check back later for important dates and deadlines.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DeadlineTrackerPage;
