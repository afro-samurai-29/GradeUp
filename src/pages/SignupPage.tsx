// src/pages/SignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen, ArrowLeft, User, GraduationCap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { auth, db } from '../firebaseConfig'; // Make sure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Account created!",
        description: "Welcome to GradeUp! You can now start your learning journey.",
      });

      // Navigate to appropriate dashboard based on role
      if (formData.role === 'learner') {
        navigate('/student/dashboard');
      } else if (formData.role === 'tutor') {
        navigate('/tutor/dashboard');
      } else if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'learner',
      });

    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sage flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-forest-primary hover:text-forest-secondary transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="flex items-center justify-center w-12 h-12 bg-forest-primary rounded-xl">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">GradeUp</span>
          </Link>
        </div>

        {/* Signup Form */}
        <Card className="card-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join thousands of students improving their grades with GradeUp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <RadioGroup value={formData.role} onValueChange={handleRoleChange}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-forest-light/20 transition-colors">
                    <RadioGroupItem value="learner" id="learner" />
                    <Label htmlFor="learner" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <User className="h-4 w-4 text-forest-primary" />
                      <div>
                        <div className="font-medium">Learner</div>
                        <div className="text-sm text-muted-foreground">I want to learn and get help with my studies</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-forest-light/20 transition-colors">
                    <RadioGroupItem value="tutor" id="tutor" />
                    <Label htmlFor="tutor" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <GraduationCap className="h-4 w-4 text-forest-secondary" />
                      <div>
                        <div className="font-medium">Tutor</div>
                        <div className="text-sm text-muted-foreground">I want to help students with their studies</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-forest-light/20 transition-colors">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Shield className="h-4 w-4 text-forest-accent" />
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-sm text-muted-foreground">I want to manage the platform</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-forest-primary hover:text-forest-secondary transition-colors duration-200 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
