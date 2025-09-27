import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Calendar, TrendingUp, Award, Clock } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Study Hours This Week',
      value: '24 hours',
      icon: Clock,
      trend: '+2h from last week',
      color: 'text-forest-primary',
    },
    {
      title: 'Subjects in Progress',
      value: '5 subjects',
      icon: BookOpen,
      trend: 'Mathematics, Physics, Chemistry',
      color: 'text-forest-secondary',
    },
    {
      title: 'Tutor Sessions',
      value: '3 upcoming',
      icon: Users,
      trend: 'Next: Math in 2 hours',
      color: 'text-forest-accent',
    },
    {
      title: 'Overall Progress',
      value: '78%',
      icon: TrendingUp,
      trend: '+12% this month',
      color: 'text-success',
    },
  ];

  const subjects = [
    { name: 'Mathematics', progress: 85, grade: 'B+', color: 'bg-forest-primary' },
    { name: 'Physics', progress: 72, grade: 'B', color: 'bg-forest-secondary' },
    { name: 'Chemistry', progress: 68, grade: 'B-', color: 'bg-forest-accent' },
    { name: 'Biology', progress: 91, grade: 'A-', color: 'bg-success' },
    { name: 'English', progress: 76, grade: 'B', color: 'bg-forest-light' },
  ];

  const upcomingSessions = [
    {
      subject: 'Mathematics',
      tutor: 'Dr. Sarah Johnson',
      time: '2:00 PM - 3:00 PM',
      date: 'Today',
      type: 'Calculus Review',
    },
    {
      subject: 'Physics',
      tutor: 'Prof. Michael Chen',
      time: '4:00 PM - 5:00 PM',
      date: 'Tomorrow',
      type: 'Mechanics Practice',
    },
    {
      subject: 'Chemistry',
      tutor: 'Dr. Emma Williams',
      time: '10:00 AM - 11:00 AM',
      date: 'Friday',
      type: 'Organic Chemistry',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your learning progress and upcoming sessions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-elegant">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-forest-light/20`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subject Progress */}
          <div className="lg:col-span-2">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-forest-primary" />
                  Subject Progress
                </CardTitle>
                <CardDescription>
                  Track your performance across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {subject.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {subject.progress}%
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-forest-light text-forest-primary`}>
                            {subject.grade}
                          </span>
                        </div>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-forest-primary" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>
                  Your scheduled tutor sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:border-forest-light transition-colors duration-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">
                            {session.subject}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {session.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          with {session.tutor}
                        </p>
                        <p className="text-sm text-forest-primary font-medium">
                          {session.time}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.type}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elegant mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-forest-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="default" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Practice Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Find a Tutor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;