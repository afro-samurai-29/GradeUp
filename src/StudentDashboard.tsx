import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StudentNavbar from "@/components/StudentNavbar";
import { BookOpen, FileText, MessageCircle, Clock } from "lucide-react";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    notes: 0,
    pastPapers: 0,
    requests: 0,
    studyTime: "0h",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-green-100 mt-1">Welcome back! Ready to continue your learning journey?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">4.2</div>
            <div className="text-sm text-green-100">Average Grade</div>
          </div>
        </div>
      </div>

      <StudentNavbar />

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
    </div>
  );
};

export default StudentDashboard;
