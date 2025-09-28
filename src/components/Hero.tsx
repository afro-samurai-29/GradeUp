import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Trophy, Info, MapPin, GraduationCap, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useState } from 'react';

const Hero = () => {
  const [showInfo, setShowInfo] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: 'Personalized Learning',
      description: 'AI-powered study plans tailored to your learning style and goals.',
    },
    {
      icon: Users,
      title: 'Expert Tutors',
      description: 'Connect with qualified tutors who understand matric requirements.',
    },
    {
      icon: Trophy,
      title: 'Proven Results',
      description: 'Join thousands of students who improved their grades with GradeUp.',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-sage opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Ace Your{' '}
                  <span className="bg-gradient-to-r from-forest-primary to-forest-secondary bg-clip-text text-transparent">
                    Matric Rewrite
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Transform your academic journey with personalized tutoring, AI-powered study plans,
                  and a supportive community. Get the grades you deserve.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="group">
                  <Link to="/signup">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowInfo(true)}>
                  <Info className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">Free</div>
                  <div className="text-sm text-muted-foreground">Always Free</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">All</div>
                  <div className="text-sm text-muted-foreground">Subjects Covered</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Student studying with GradeUp"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              <div className="absolute -inset-4 gradient-forest opacity-20 rounded-3xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose GradeUp?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with human expertise
              to help you achieve your academic goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl border border-border hover:border-forest-light transition-colors duration-200 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-light rounded-xl mb-6 group-hover:bg-forest-secondary/20 transition-colors duration-200">
                  <feature.icon className="h-8 w-8 text-forest-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-forest-primary flex items-center">
                  <Info className="h-6 w-6 mr-2" />
                  About GradeUp
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* App Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-forest-primary" />
                    What is GradeUp?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    GradeUp is a free AI-powered learning platform designed specifically for South African adults 
                    who want to rewrite their matric exams. We believe everyone deserves a second chance at education, 
                    regardless of age or circumstances.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-5 w-5 text-forest-primary mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Study Resources</h4>
                        <p className="text-sm text-gray-600">Past papers, notes, and study materials</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-forest-primary mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Volunteer Tutors</h4>
                        <p className="text-sm text-gray-600">Get help from qualified volunteers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Trophy className="h-5 w-5 text-forest-primary mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">AI Assistant</h4>
                        <p className="text-sm text-gray-600">24/7 AI chatbot for guidance</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-forest-primary mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-800">Exam Centers</h4>
                        <p className="text-sm text-gray-600">Find matric writing centers near you</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam Centers Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-forest-primary" />
                    Matric Writing Centers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We provide comprehensive information about matric rewrite centers across all South African provinces, 
                    including Gauteng, Western Cape, KwaZulu-Natal, and more. Find registration details, contact information, 
                    and exam schedules for centers near you.
                  </p>
                  <div className="bg-forest-light p-4 rounded-lg">
                    <h4 className="font-medium text-forest-primary mb-2">Registration Information</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      South African students can rewrite matric exams twice a year during the May/June and October/November National Senior Certificate (NSC) exam sessions.
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>May/June exams:</strong> Registration closes around February</li>
                      <li>• <strong>October/November exams:</strong> Registration closes around August</li>
                      <li>• <strong>Registration methods:</strong> Online, at district office, or by phone</li>
                      <li>• <strong>DBE Contact:</strong> 0800 39 0027 or 065 656 9818</li>
                    </ul>
                  </div>
                </div>

                {/* Encouragement Message */}
                <div className="bg-gradient-to-r from-forest-primary to-forest-secondary p-6 rounded-lg text-white">
                  <div className="flex items-center mb-3">
                    <Heart className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-semibold">Your Journey Matters</h3>
                  </div>
                  <p className="text-forest-light leading-relaxed">
                    Don't let setbacks define your future. Every successful person has faced challenges, 
                    but what matters is your determination to keep moving forward. Your education is your 
                    pathway to a brighter tomorrow - and it's never too late to start.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild className="bg-forest-primary hover:bg-forest-secondary">
                    <Link to="/signup" onClick={() => setShowInfo(false)}>
                      Start Your Journey
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => setShowInfo(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;