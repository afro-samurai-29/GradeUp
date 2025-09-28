import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { auth } from './firebase';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  BookOpen,
  Edit,
  Save,
  X,
  Plus,
  Award
} from 'lucide-react';

const TutorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    bio: '',
    subjects: [] as string[],
    qualifications: [] as string[],
    hourlyRate: 0,
    experience: 0,
    languages: [] as string[],
    teachingMethods: [] as string[]
  });
  const [editForm, setEditForm] = useState(profile);

  const allSubjects = [
    'Mathematics', 'English', 'Afrikaans', 'Physical Sciences', 'Life Sciences',
    'History', 'Geography', 'Business Studies', 'Economics', 'Accounting', 'Information Technology'
  ];

  const allLanguages = ['English', 'Afrikaans', 'IsiZulu', 'IsiXhosa', 'Sesotho', 'Setswana'];
  const allTeachingMethods = ['Online', 'In-person', 'Group sessions', 'One-on-one'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        // Get user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData: any = userDoc.exists() ? userDoc.data() : {};

        // Get tutor data
        const tutorSnapshot = await getDocs(query(collection(db, 'tutors'), where('userId', '==', user.uid)));
        let tutorData: any = {};

        if (!tutorSnapshot.empty) {
          tutorData = tutorSnapshot.docs[0].data();
        }

        const loadedProfile = {
          fullName: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '',
          email: userData.email || user.email || '',
          bio: tutorData.bio || '',
          subjects: tutorData.subjects || [],
          qualifications: tutorData.qualifications || [],
          hourlyRate: tutorData.hourlyRate || 0,
          experience: tutorData.experience || 0,
          languages: tutorData.languages || [],
          teachingMethods: tutorData.teachingMethods || []
        };

        setProfile(loadedProfile);
        setEditForm(loadedProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: editForm.fullName.split(' ')[0] || '',
        lastName: editForm.fullName.split(' ').slice(1).join(' ') || '',
        email: editForm.email,
        updatedAt: new Date()
      });

      // Update or create tutor document
      const tutorSnapshot = await getDocs(query(collection(db, 'tutors'), where('userId', '==', user.uid)));

      const tutorData = {
        userId: user.uid,
        bio: editForm.bio,
        subjects: editForm.subjects,
        qualifications: editForm.qualifications,
        hourlyRate: editForm.hourlyRate,
        experience: editForm.experience,
        languages: editForm.languages,
        teachingMethods: editForm.teachingMethods,
        updatedAt: new Date()
      };

      if (!tutorSnapshot.empty) {
        await updateDoc(tutorSnapshot.docs[0].ref, tutorData);
      } else {
        await setDoc(doc(db, 'tutors', user.uid), {
          ...tutorData,
          rating: 0,
          reviewCount: 0,
          isVerified: false,
          isActive: true,
          createdAt: new Date()
        });
      }

      setProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addSubject = (subject: string) => {
    if (!editForm.subjects.includes(subject)) {
      setEditForm({
        ...editForm,
        subjects: [...editForm.subjects, subject]
      });
    }
  };

  const removeSubject = (subject: string) => {
    setEditForm({
      ...editForm,
      subjects: editForm.subjects.filter(s => s !== subject)
    });
  };

  const addQualification = () => {
    const qualification = prompt('Enter qualification:');
    if (qualification && !editForm.qualifications.includes(qualification)) {
      setEditForm({
        ...editForm,
        qualifications: [...editForm.qualifications, qualification]
      });
    }
  };

  const removeQualification = (qualification: string) => {
    setEditForm({
      ...editForm,
      qualifications: editForm.qualifications.filter(q => q !== qualification)
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/tutor" className="hover:bg-purple-700 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Tutor Profile</h1>
              <p className="text-purple-100">Manage your qualifications and availability</p>
            </div>
          </div>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.fullName || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? (
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded">{profile.email || 'Not set'}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              {isEditing ? (
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.bio || 'No bio provided'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Subjects I Can Help With
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {editForm.subjects.map((subject) => (
                    <Badge key={subject} variant="default" className="flex items-center gap-1">
                      {subject}
                      <button
                        onClick={() => removeSubject(subject)}
                        className="ml-1 hover:bg-red-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Add subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {allSubjects
                      .filter(subject => !editForm.subjects.includes(subject))
                      .map((subject) => (
                        <Badge
                          key={subject}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50"
                          onClick={() => addSubject(subject)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {subject}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.subjects.length > 0 ? (
                  profile.subjects.map((subject) => (
                    <Badge key={subject} variant="default">{subject}</Badge>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects selected</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                {editForm.qualifications.map((qualification, index) => (
                  <div key={index} className="p-3 border rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{qualification}</h4>
                    </div>
                    <button
                      onClick={() => removeQualification(qualification)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button onClick={addQualification} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Qualification
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.qualifications.length > 0 ? (
                  profile.qualifications.map((qualification, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-semibold">{qualification}</h4>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No qualifications added</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="p-3 border rounded-lg text-center">
                  <div className="font-semibold">{day}</div>
                  <div className="text-sm text-gray-600">6PM - 9PM</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorProfile;