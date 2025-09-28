import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Trophy } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Hero = () => {
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
                <Button size="lg" variant="outline" asChild>
                  <Link to="/centers">
                    Find Centers
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-forest-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Expert Tutors</div>
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
    </div>
  );
};

export default Hero;