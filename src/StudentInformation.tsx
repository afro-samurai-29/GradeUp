import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentLayout from '@/components/StudentLayout';
import { 
  ArrowLeft, 
  Info, 
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  Target,
  Heart
} from 'lucide-react';

const StudentInformation = () => {
  return (
    <StudentLayout>
      {/* Header */}
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/student" className="hover:bg-forest-secondary p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Information</h1>
              <p className="text-forest-light">About GradeUP and getting help with matric rewrite</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* About GradeUP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <GraduationCap className="h-6 w-6 mr-3 text-forest-primary" />
              About GradeUp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-foreground leading-relaxed">
              GradeUp is a free AI-powered learning platform designed to help South African adults who want to rewrite their matric exams. 
              We believe everyone deserves a second chance at education, regardless of age or circumstances.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4">
                <BookOpen className="h-12 w-12 text-forest-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Study Resources</h3>
                <p className="text-sm text-muted-foreground">Past papers, notes, and study materials all in one place</p>
              </div>
              <div className="text-center p-4">
                <Users className="h-12 w-12 text-forest-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Volunteer Tutors</h3>
                <p className="text-sm text-muted-foreground">Get help from qualified volunteers who want to see you succeed</p>
              </div>
              <div className="text-center p-4">
                <Target className="h-12 w-12 text-forest-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">24/7 AI chatbot to answer questions and provide guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              How GradeUp Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-forest-light text-forest-primary rounded-full p-2 font-bold min-w-[2rem] h-8 flex items-center justify-center">1</div>
                <div>
                  <h4 className="font-semibold">Create Your Profile</h4>
                  <p className="text-sm text-muted-foreground">Set up your account and select the subjects you want to rewrite</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-forest-secondary text-forest-primary rounded-full p-2 font-bold min-w-[2rem] h-8 flex items-center justify-center">2</div>
                <div>
                  <h4 className="font-semibold">Access Study Materials</h4>
                  <p className="text-sm text-muted-foreground">Browse past papers, create notes, and use our study resources</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-forest-accent text-forest-primary rounded-full p-2 font-bold min-w-[2rem] h-8 flex items-center justify-center">3</div>
                <div>
                  <h4 className="font-semibold">Get Help</h4>
                  <p className="text-sm text-muted-foreground">Ask questions through text, audio, or video to volunteer tutors</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-warning text-warning-foreground rounded-full p-2 font-bold min-w-[2rem] h-8 flex items-center justify-center">4</div>
                <div>
                  <h4 className="font-semibold">Register & Write</h4>
                  <p className="text-sm text-muted-foreground">Find exam centers, get registration info, and achieve your goals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finding Exam Centers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Finding Matric Rewrite Centers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Matric rewrite exams are conducted at various centers across South Africa. Here's how to find one near you:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-forest-accent">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Department of Education</h4>
                  <p className="text-sm text-gray-600 mb-3">Contact your provincial education department for official exam center locations</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find Provincial Office
                  </Button>
                </CardContent>
              </Card>
              
                <Card className="border-l-4 border-l-forest-secondary">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Adult Education Centers</h4>
                  <p className="text-sm text-gray-600 mb-3">Many AET (Adult Education and Training) centers offer matric rewrite programs</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Find AET Centers
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-forest-light p-4 rounded-lg border border-forest-secondary/30">
              <h4 className="font-semibold text-forest-primary mb-2">Important Registration Dates</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Registration usually opens in July/August</li>
                <li>• Main deadline is typically end of October</li>
                <li>• Late registration available until mid-November (with penalty)</li>
                <li>• Exams are held from January to March</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Need Help? We're Here for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">GradeUP Support Team</h4>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-forest-primary" />
                    support@gradeup.co.za
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-forest-primary" />
                    We respond within 24 hours
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Have questions about using the platform? Need technical help? We're here to support your learning journey.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Emergency Study Support</h4>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-forest-secondary" />
                    Ask volunteer tutors for help
                  </p>
                  <p className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-forest-secondary" />
                    Use our AI chatbot anytime
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Stuck on a problem? Our community of tutors and AI assistant are available to help you understand difficult concepts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivation Section */}
        <Card className="gradient-sage border-0">
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-16 w-16 text-forest-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Dreams Are Still Possible</h3>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Whether you're 18 or 48, it's never too late to complete your matric. Thousands of South Africans 
              successfully rewrite their exams every year. You have the strength, we provide the support.
            </p>
            <div className="mt-6 space-x-4">
              <Button asChild className="bg-forest-primary hover:bg-forest-secondary">
                <Link to="/student/notes">Start Studying</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/student/requests">Get Help</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default StudentInformation;