import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { auth } from './firebase';
import {
  Users,
  MessageCircle,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Heart,
  Award,
  TrendingUp,
  LogOut,
  ArrowLeft
} from 'lucide-react';

const TutorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const [stats, setStats] = useState({
    activeRequests: 0,
    completedRequests: 0,
    averageRating: 0,
    avgResponseTime: '0h',
    studentsHelped: 0,
    totalHours: 0,
    positiveFeedbackRate: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [pastPapers, setPastPapers] = useState([]);
  const [studyNotes, setStudyNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // Get tutor profile
        const tutorSnapshot = await getDocs(query(collection(db, 'tutors'), where('userId', '==', user.uid)));
        if (!tutorSnapshot.empty) {
          const tutorData = tutorSnapshot.docs[0].data();
          setTutorProfile(tutorData);
        }

        // Get subjects first
        const subjectsSnapshot = await getDocs(collection(db, 'resources'));
        const subjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        // Fetch past papers from all subjects
        const allPastPapers = [];
        const allNotes = [];
        const allVideos = [];

        for (const subject of subjects) {
          // Get past papers
          const pastPapersSnapshot = await getDocs(query(
            collection(db, 'resources', subject.id, 'pastPapers'),
            orderBy('createdAt', 'desc'),
            limit(3)
          ));
          pastPapersSnapshot.docs.forEach(doc => {
            allPastPapers.push({ id: doc.id, subjectName: subject.name, ...doc.data() });
          });

          // Get notes
          const notesSnapshot = await getDocs(query(
            collection(db, 'resources', subject.id, 'notes'),
            orderBy('createdAt', 'desc'),
            limit(3)
          ));
          notesSnapshot.docs.forEach(doc => {
            allNotes.push({ id: doc.id, subjectName: subject.name, ...doc.data() });
          });

          // Get videos
          const videosSnapshot = await getDocs(query(
            collection(db, 'resources', subject.id, 'videos'),
            orderBy('createdAt', 'desc'),
            limit(3)
          ));
          videosSnapshot.docs.forEach(doc => {
            allVideos.push({ id: doc.id, subjectName: subject.name, ...doc.data() });
          });
        }

        // Sort and limit to most recent
        const sortedPastPapers = allPastPapers.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
        const sortedNotes = allNotes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
        const sortedVideos = allVideos.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

        console.log('Debug - Past Papers:', sortedPastPapers);
        console.log('Debug - Notes:', sortedNotes);
        console.log('Debug - Videos:', sortedVideos);

        setPastPapers(sortedPastPapers);
        setStudyNotes(sortedNotes);
        setVideos(sortedVideos);

        // Get tutoring sessions for this tutor
        const sessionsSnapshot = await getDocs(query(collection(db, 'tutoringSessions'), where('tutorId', '==', user.uid)));

        let activeCount = 0;
        let completedCount = 0;
        let totalRating = 0;
        let ratingCount = 0;
        let totalResponseTime = 0;
        let responseCount = 0;
        const uniqueStudents = new Set();
        let totalHours = 0;

        sessionsSnapshot.forEach(doc => {
          const session = doc.data();

          if (session.status === 'pending' || session.status === 'confirmed') {
            activeCount++;
          } else if (session.status === 'completed') {
            completedCount++;
            if (session.rating) {
              totalRating += session.rating;
              ratingCount++;
            }
            if (session.duration) {
              totalHours += session.duration / 60; // Convert minutes to hours
            }
          }

          uniqueStudents.add(session.studentId);
        });

        // Get recent requests (mock for now - you might want to create a requests collection)
        const mockRequests = [
          {
            id: '1',
            title: 'Quadratic Equations Help',
            subject: 'Mathematics',
            studentName: 'John D.',
            status: 'pending',
            priority: 'high',
            timeAgo: '2h ago',
            description: 'I\'m struggling with the quadratic formula...'
          },
          {
            id: '2',
            title: 'Physics Motion Problems',
            subject: 'Physical Sciences',
            studentName: 'Maria S.',
            status: 'in-progress',
            priority: 'medium',
            timeAgo: '1 day ago',
            description: 'Need help with projectile motion...'
          },
          {
            id: '3',
            title: 'English Essay Structure',
            subject: 'English',
            studentName: 'David M.',
            status: 'completed',
            priority: 'low',
            timeAgo: '3 days ago',
            description: 'Help with essay writing...',
            rating: 5.0
          }
        ];

        setStats({
          activeRequests: activeCount,
          completedRequests: completedCount,
          averageRating: ratingCount > 0 ? parseFloat((totalRating / ratingCount).toFixed(1)) : 0,
          avgResponseTime: '2.5h', // Mock data
          studentsHelped: uniqueStudents.size,
          totalHours: Math.round(totalHours),
          positiveFeedbackRate: ratingCount > 0 ? Math.round((ratingCount / completedCount) * 100) : 0
        });

        setRecentRequests(mockRequests);
      } catch (error) {
        console.error('Error fetching tutor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, []);

  const quickActions = [
    { icon: MessageCircle, label: "Help Requests", href: "/tutor/requests", color: "bg-blue-500", description: "View and respond to student questions", count: `${stats.activeRequests} pending` },
    { icon: User, label: "My Profile", href: "/tutor/profile", color: "bg-purple-500", description: "Manage your tutoring profile and subjects" },
    { icon: BookOpen, label: "Study Resources", href: "/resources", color: "bg-green-500", description: "Access teaching materials and guides", count: `${pastPapers.length + studyNotes.length + videos.length} available` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
                <p className="text-blue-100">
                  Welcome back{tutorProfile ? `, ${tutorProfile.bio?.split(' ')[0] || 'Tutor'}` : ''}!
                  Thank you for volunteering your time to help students succeed.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.studentsHelped}</div>
              <div className="text-sm text-blue-100">Students Helped</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-black border-white bg-white hover:bg-gray-100 hover:text-black"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.activeRequests}</div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.completedRequests}</div>
              <div className="text-sm text-gray-600">Requests Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.averageRating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.avgResponseTime}</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                      {action.count && (
                        <Badge className="mt-2 bg-forest-light text-forest-primary">
                          {action.count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Help Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Loading requests...</div>
              ) : recentRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No recent requests</div>
              ) : (
                recentRequests.map((request) => (
                  <div key={request.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${request.status === 'pending' ? 'bg-orange-100' :
                      request.status === 'in-progress' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                      {request.status === 'pending' ? <AlertCircle className="h-4 w-4 text-orange-600" /> :
                        request.status === 'in-progress' ? <User className="h-4 w-4 text-blue-600" /> :
                          <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{request.title}</h4>
                        <Badge className={`${request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {request.status === 'in-progress' ? 'In Progress' :
                            request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.subject} • Student: {request.studentName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {request.timeAgo}
                        {request.rating && ` • ⭐ ${request.rating} rating`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Resources */}
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Past Papers: {pastPapers.length} items</p>
          <p>Notes: {studyNotes.length} items</p>
          <p>Videos: {videos.length} items</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Past Papers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Past Papers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : pastPapers.length > 0 ? (
                  pastPapers.map((paper, index) => (
                    <div key={`past-paper-${paper.subjectName}-${paper.id}-${index}`} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{paper.title || `Past Paper ${paper.year}`}</h4>
                          <p className="text-xs text-muted-foreground">
                            {paper.subjectName} • {paper.year}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {paper.exam}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No past papers available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-500" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : studyNotes.length > 0 ? (
                  studyNotes.map((note, index) => (
                    <div key={`study-note-${note.subjectName}-${note.id}-${index}`} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{note.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {note.subjectName} • {note.difficulty}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {note.topic || 'General'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No study notes available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                Video Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : videos.length > 0 ? (
                  videos.map((video, index) => (
                    <div key={`video-${video.subjectName}-${video.id}-${index}`} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {video.subjectName} • {video.duration ? `${video.duration}m` : 'N/A'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {video.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No videos available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact & Recognition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-forest-secondary" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Students helped this month</span>
                  <span className="font-semibold">{stats.studentsHelped}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total study hours supported</span>
                  <span className="font-semibold">{stats.totalHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Positive feedback rate</span>
                  <span className="font-semibold">{stats.positiveFeedbackRate}%</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-forest-light rounded-lg">
                <p className="text-sm text-forest-primary">
                  🎉 You're in the top 10% of active tutors this month!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-forest-primary" />
                Recent Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-forest-light rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-semibold">Maria S.</span>
                    <div className="ml-auto text-forest-secondary">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-sm text-gray-600">"Sarah explained physics so clearly! Finally understand momentum."</p>
                </div>
                <div className="p-3 bg-forest-light rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-semibold">John D.</span>
                    <div className="ml-auto text-forest-secondary">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-sm text-gray-600">"Patient and helpful. Made math actually make sense!"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;