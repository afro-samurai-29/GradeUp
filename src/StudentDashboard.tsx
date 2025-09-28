<<<<<<< HEAD
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StudentNavbar from '@/components/StudentNavbar';
import { 
  BookOpen, 
  FileText, 
  User, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Users,
  Star,
  ArrowLeft
} from 'lucide-react';

const StudentDashboard = () => {
  const [searchParams] = useSearchParams();
  const isAdminView = searchParams.get('adminView') === 'true';
  const userId = searchParams.get('userId');
  const userName = searchParams.get('userName');

  const quickActions = [
    { icon: BookOpen, label: "Study Notes", href: isAdminView ? `/student/notes?adminView=true&userId=${userId}&userName=${encodeURIComponent(userName || '')}` : "/student/notes", color: "bg-blue-500", description: "Access your study materials and notes" },
    { icon: FileText, label: "Past Papers", href: isAdminView ? `/student/past-papers?adminView=true&userId=${userId}&userName=${encodeURIComponent(userName || '')}` : "/student/past-papers", color: "bg-green-500", description: "Download previous exam papers and memos" },
    { icon: MessageCircle, label: "Help Requests", href: isAdminView ? `/student/requests?adminView=true&userId=${userId}&userName=${encodeURIComponent(userName || '')}` : "/student/requests", color: "bg-purple-500", description: "Ask questions and get help from tutors" },
    { icon: User, label: "My Profile", href: isAdminView ? `/student/profile?adminView=true&userId=${userId}&userName=${encodeURIComponent(userName || '')}` : "/student/profile", color: "bg-orange-500", description: "Manage your profile and preferences" },
=======
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/StudentLayout";
import { BookOpen, FileText, MessageCircle, Clock, Users, Calendar, Target, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    notes: 0,
    pastPapers: 0,
    requests: 0,
    studyTime: "0h",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick actions data
  const quickActions = [
    {
      icon: BookOpen,
      label: "Study Notes",
      description: "Access your study materials",
      href: "/student/notes"
    },
    {
      icon: FileText,
      label: "Past Papers",
      description: "Download exam papers",
      href: "/student/past-papers"
    },
    {
      icon: Users,
      label: "Find Tutors",
      description: "Connect with tutors",
      href: "/student/tutors"
    },
    {
      icon: Calendar,
      label: "Deadlines",
      description: "Track important dates",
      href: "/student/deadlines"
    },
    {
      icon: Target,
      label: "Study Goals",
      description: "Set and track goals",
      href: "/student/goals"
    },
    {
      icon: HelpCircle,
      label: "Get Help",
      description: "Ask questions",
      href: "/student/support"
    }
>>>>>>> 4af57b127e7f204a746a64a584592ee365e8f33a
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1️⃣ Fetch number of study notes and past papers from subcollections
        const subjectsSnapshot = await getDocs(collection(db, "resources"));
        let noteCount = 0;
        let paperCount = 0;
        const activities: any[] = [];

        for (const subjectDoc of subjectsSnapshot.docs) {
          const subjectData = subjectDoc.data();
          const subjectName = subjectData.name;

          // Count notes
          const notesSnapshot = await getDocs(collection(db, "resources", subjectDoc.id, "notes"));
          noteCount += notesSnapshot.size;

          // Count past papers
          const papersSnapshot = await getDocs(collection(db, "resources", subjectDoc.id, "pastPapers"));
          paperCount += papersSnapshot.size;

          // Collect recent activities from notes
          notesSnapshot.forEach(noteDoc => {
            const noteData = noteDoc.data();
            activities.push({
              id: noteDoc.id,
              title: noteData.title,
              subject: subjectName,
              type: "note",
              time: noteData.createdAt?.seconds
                ? new Date(noteData.createdAt.seconds * 1000).toLocaleString()
                : new Date(noteData.createdAt).toLocaleString(),
            });
          });

          // Collect recent activities from past papers
          papersSnapshot.forEach(paperDoc => {
            const paperData = paperDoc.data();
            activities.push({
              id: paperDoc.id,
              title: paperData.title || `${paperData.year} ${paperData.exam}`,
              subject: subjectName,
              type: "paper",
              time: paperData.createdAt?.seconds
                ? new Date(paperData.createdAt.seconds * 1000).toLocaleString()
                : new Date(paperData.createdAt).toLocaleString(),
            });
          });
        }

        // 2️⃣ Fetch active requests (could be a collection called "requests")
        const requestsSnap = await getDocs(collection(db, "requests"));
        const requestCount = requestsSnap.size;

        // 3️⃣ Calculate study time from progress
        const progressSnap = await getDocs(collection(db, "progress"));
        let totalMinutes = 0;
        progressSnap.forEach(doc => {
          const p = doc.data();
          totalMinutes += p.duration || 0; // or estimate from completedAt
        });
        const studyTime = `${Math.floor(totalMinutes / 60)}h`;

        setStats({
          notes: noteCount,
          pastPapers: paperCount,
          requests: requestCount,
          studyTime: studyTime,
        });

        // Sort activities by latest uploaded
        activities.sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        setRecentActivity(activities.slice(0, 5));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <StudentLayout>
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              {isAdminView ? (
                <div className="flex items-center gap-4">
                  <Link to="/admin/users">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Users
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold">Student Dashboard</h1>
                    <p className="text-forest-light mt-1">Viewing as: {userName || 'Student'}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold">Student Dashboard</h1>
                  <p className="text-forest-light mt-1">Welcome back! Ready to continue your learning journey?</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">4.2</div>
              <div className="text-sm text-forest-light">Average Grade</div>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {!isAdminView && <StudentNavbar />}
=======
>>>>>>> 4af57b127e7f204a746a64a584592ee365e8f33a

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.notes}</div>
              <div className="text-sm text-gray-600">Study Notes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.pastPapers}</div>
              <div className="text-sm text-gray-600">Past Papers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.requests}</div>
              <div className="text-sm text-gray-600">Active Requests</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.studyTime}</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* Quick Actions (removed '+ New Note' button) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="block p-6 rounded-lg border hover:shadow-md transition-all group hover:border-forest-light"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`bg-forest-primary p-3 rounded-full text-white group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-forest-primary transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {activity.type === "note" && <BookOpen className="h-4 w-4 text-blue-600" />}
                    {activity.type === "paper" && <FileText className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <Badge variant="outline">{activity.subject}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
