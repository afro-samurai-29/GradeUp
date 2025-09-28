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
import AIChatbox from "./components/AIChatbox";

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
          <Route path="/centers" element={<RewriteCentersPage />} />
          <Route path="/resources" element={<StudyResourcesPage />} />
          <Route path="/tutors" element={<TutorNetworkPage />} />
          <Route path="/deadlines" element={<DeadlineTrackerPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbox />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;