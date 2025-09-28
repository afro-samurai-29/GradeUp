import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, MapPin, Calendar } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [centersCount, setCentersCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch centers count
        const centersQuery = query(
          collection(db, 'rewriteCenters'),
          orderBy('rating', 'desc')
        );
        const centersSnapshot = await getDocs(centersQuery);
        setCentersCount(centersSnapshot.size);

        // Fetch upcoming deadlines (next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const deadlinesQuery = query(
          collection(db, 'deadlines'),
          orderBy('dueDate', 'asc'),
          limit(10)
        );
        const deadlinesSnapshot = await getDocs(deadlinesQuery);

        const upcoming = deadlinesSnapshot.docs.filter(doc => {
          const deadline = doc.data();
          const dueDate = deadline.dueDate?.toDate();
          return dueDate && dueDate <= thirtyDaysFromNow;
        });

        setUpcomingDeadlines(upcoming.length);
      } catch (error) {
        console.error('Error fetching header data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigation = [
    {
      name: 'Centers',
      href: '/centers',
      count: centersCount,
      icon: MapPin
    },
    {
      name: 'Deadlines',
      href: '/deadlines',
      count: upcomingDeadlines,
      icon: Calendar
    },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-forest-primary rounded-lg group-hover:bg-forest-secondary transition-colors duration-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">GradeUp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-forest-primary transition-colors duration-200 font-medium group"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                  {!loading && item.count > 0 && (
                    <span className="bg-forest-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:text-forest-primary transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {!loading && item.count > 0 && (
                      <span className="bg-forest-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;