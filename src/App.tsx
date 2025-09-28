import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import RewriteCentersPage from "./pages/RewriteCentersPage";
import StudyResourcesPage from "./pages/StudyResourcesPage";
import TutorNetworkPage from "./pages/TutorNetworkPage";
import DeadlineTrackerPage from "./pages/DeadlineTrackerPage";
import NotFound from "./pages/NotFound";
import AIChatbox from './components/AIChatbox';


// Student Components
import StudentDashboard from "./StudentDashboard";
import StudentNotes from "./StudentNotes";
import StudentPastPapers from "./StudentPastPapers";
import StudentProfile from "./StudentProfile";
import StudentRequests from "./StudentRequests";
import StudentInformation from "./StudentInformation";

// Tutor Components
import TutorDashboard from "./TutorDashboard";
import TutorProfile from "./TutorProfile";
import TutorRequests from "./TutorRequests";

// Admin Components
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminContent from "./AdminContent";
import AdminAnalytics from "./AdminAnalytics";
import AdminSupport from "./AdminSupport";
import AdminProfile from "./AdminProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<StudyResourcesPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/notes" element={<StudentNotes />} />
          <Route path="/student/past-papers" element={<StudentPastPapers />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/requests" element={<StudentRequests />} />
          <Route path="/student/information" element={<StudentInformation />} />

          {/* Tutor Routes */}
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/requests" element={<TutorRequests />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/profile" element={<AdminProfile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbox />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;