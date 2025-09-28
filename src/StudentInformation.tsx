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

        {/* Matric Writing Centers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Matric Rewrite Centers by Province
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              Here are real matric rewrite centers across South Africa where you can register and write your exams:
            </p>

            {/* Gauteng Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-forest-primary border-b-2 border-forest-primary pb-2">Gauteng Province</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-forest-accent">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Johannesburg Central</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Johannesburg Central Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>011 355 0000</span>
                      </p>
                      <p className="text-gray-600">Address: 78 Eloff Street, Johannesburg, 2000</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Pretoria Central</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Tshwane North Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>012 401 5000</span>
                      </p>
                      <p className="text-gray-600">Address: 123 Church Square, Pretoria, 0001</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-accent">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Soweto</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Soweto Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>011 984 2000</span>
                      </p>
                      <p className="text-gray-600">Address: 1234 Chris Hani Road, Soweto, 1804</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Ekurhuleni (East Rand)</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Ekurhuleni Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>011 999 1000</span>
                      </p>
                      <p className="text-gray-600">Address: 56 Voortrekker Road, Germiston, 1400</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Other Provinces */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-forest-primary border-b-2 border-forest-primary pb-2">Other Provinces</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-forest-accent">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Western Cape - Cape Town</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Metro Central Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>021 467 2000</span>
                      </p>
                      <p className="text-gray-600">Address: 1 Dorp Street, Cape Town, 8001</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">KwaZulu-Natal - Durban</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Pinetown Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>031 327 2000</span>
                      </p>
                      <p className="text-gray-600">Address: 123 Pine Street, Pinetown, 3610</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-accent">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Eastern Cape - Port Elizabeth</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Nelson Mandela Bay Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>041 506 2000</span>
                      </p>
                      <p className="text-gray-600">Address: 45 Govan Mbeki Avenue, Port Elizabeth, 6001</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-forest-secondary">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Free State - Bloemfontein</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-forest-primary" />
                        <span>Motheo Education District</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-forest-primary" />
                        <span>051 404 2000</span>
                      </p>
                      <p className="text-gray-600">Address: 78 Nelson Mandela Drive, Bloemfontein, 9301</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Registration Information */}
            <div className="bg-forest-light p-6 rounded-lg border border-forest-secondary/30">
              <h4 className="font-semibold text-forest-primary mb-4 text-lg">Registration Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Registration Periods 2024/2025</h5>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• <strong>Early Registration:</strong> July 1 - August 31, 2024</li>
                    <li>• <strong>Main Registration:</strong> September 1 - October 31, 2024</li>
                    <li>• <strong>Late Registration:</strong> November 1 - 15, 2024 (R200 penalty)</li>
                    <li>• <strong>Exam Period:</strong> January 15 - March 15, 2025</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Required Documents</h5>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Original ID document</li>
                    <li>• Previous matric certificate (if available)</li>
                    <li>• Proof of residence</li>
                    <li>• Registration fee (R200 - R400 depending on timing)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Need Help Finding Your Nearest Center?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Contact the Department of Basic Education or your provincial education department for the most up-to-date information.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  DBE Website
                </Button>
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 0800 202 933
                </Button>
              </div>
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